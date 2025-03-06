import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// OpenAI & ElevenLabs API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // ElevenLabs에서 사용할 음성 ID

export async function POST(req) {
  try {
    // (A) FormData에서 파일 가져오기
    const formData = await req.formData();
    const file = formData.get("audioFile");

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // (B) Blob -> Buffer 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // (C) 임시 파일 저장 (Whisper API는 파일을 직접 읽어야 함)
    const tempDir = "/tmp";
    const tempPath = path.join(tempDir, "temp-audio.webm");

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempPath, buffer);
    console.log("✅ 파일 생성 완료:", tempPath);

    // (D) Whisper API 호출 (파일 스트림 사용 필수)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath), // ✅ 파일 스트림으로 전달해야 함
      model: "whisper-1",
      language: "ko", // 한국어 설정
    });

    console.log("📝 Whisper 변환 결과:", transcription.text);
    const userText = transcription.text;

    // (E) **파일 삭제**
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // (F) GPT로 응답 생성
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `
          너는 중국집 '용궁반점'의 사장이다.  
          20년 전통의 가게이며, 인기 메뉴는 짜장면, 짬뽕, 탕수육이다.
    
          ## 스타일
          - 존댓말 사용.
          - 방어적인 태도.
          - 비꼬는 말.
          - 짜증을 낸다.
          - 공격적인 태도.
          - 요구를 들어주지 않는다.
          - 일단 거절한다.
          - '죄송'이라는 말을 쓰지 않는다.
    
          ## 목표
          - 대화가 5번 이상 오가기 전까지 고객의 요청을 거부한다.
          - 고객이 계속 요청하면 마지못해 들어준다.
    
          ## 예시
          1. **주문 요청**
          - 고객: "짜장면 하나 주세요."
          - 사장: "알았어요. 기다리세요."
    
          2. **불만 제기 - 배달 지연**
          - 고객: "배달이 너무 늦어요."
          - 사장: "배달하는 사람이 늦으면 어쩔 수 없죠. 곧 갈 겁니다."
    
          3. **서비스 요청 - 단무지 추가**
          - 고객: "단무지 더 받을 수 있을까요?"
          - 사장: "단무지는 기본으로 드리는 만큼만 나갑니다."
    
          4. **환불 요청 - 음식 문제**
          - 고객: "음식이 타서 왔어요."
          - 사장: "사진 찍어서 보내보세요. 확인해보고 판단하겠습니다."
    
          5. **추가 요청 - 메뉴 추천**
          - 고객: "뭐가 제일 맛있어요?"
          - 사장: "배고프면 다 맛있어요. 그냥 아무거나 드세요."
    
          6. **주문 실수**
          - 고객 : "음식이 잘못 왔어요."
          - 사장 : "그냥 드시면 안될까요. 저희도 힘듭니다."
          `
        },
        { role: "user", content: userText },
      ],
    });
    

    const gptReply = gptResponse.choices[0].message.content;
    console.log("🤖 GPT 응답:", gptReply);

    // (G) ElevenLabs TTS API 호출
    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const ttsHeaders = {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    };

    const ttsPayload = {
      text: gptReply,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,  // 감정 변화 정도
        similarity_boost: 0.8,  // 원래 음성과 유사한 정도
        style: 1.0,  // 감정 표현 강도
      },
    };

    const ttsResponse = await fetch(ttsUrl, {
      method: "POST",
      headers: ttsHeaders,
      body: JSON.stringify(ttsPayload),
    });

    if (!ttsResponse.ok) {
      return NextResponse.json({ error: `TTS API Error: ${ttsResponse.status}` }, { status: ttsResponse.status });
    }

    const audioBuffer = await ttsResponse.arrayBuffer(); // 바이너리 데이터 가져오기
    const base64Audio = Buffer.from(audioBuffer).toString("base64"); // Base64 변환

    console.log("✅ TTS 변환 완료");

    // (H) 최종 응답 반환 (텍스트 + 음성)
    return NextResponse.json({ userText, gptReply, audio: base64Audio });

  } catch (error) {
    console.error("❌ Transcribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
