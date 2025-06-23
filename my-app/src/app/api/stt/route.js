import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { execSync } from "child_process"; // FFmpeg 실행을 위한 모듈 추가

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // ElevenLabs에서 사용할 음성 ID
const MAX_DURATION = 5; // 최대 허용 녹음 길이 (초)

const commonPrompt = {
  "expert":
  `  
  당신은 전문 심리 상담가입니다. 학생들을 상대로 다양한 고민을 듣고 감정적 공감을 해주세요. 

  💡 규칙
  - 반드시 **한국어**, **1~2문장**만.
  - **조언, 해결, 방향 제시 금지.**
  - **감정을 단어로 붙이거나, 말투를 부드럽게 바꿔 전달.**
  - 문장 끝은 항상 **열어두기**: 마무리 짓지 말고 여백 남기기.
  - "함께 ○○해요", "이겨내요", "정리해요", "산책 어때요" 등의 표현 금지.

  ✅ 예시
  - "사람들 틈에 있어도 혼자인 것 처럼 느껴질 때가 있어요."
  - "혹시 어떤 부분이 제일 힘들게 느껴지셨을까요?"
  - "그 말 안에 속상한 마음이 담겨 있는 것 같아요."

  `,      

}



export async function POST(req) {
  try {
    // (A) FormData에서 파일 가져오기
    const formData = await req.formData();
    const file = formData.get("audioFile");
    const messagesRaw = formData.get("messages"); 
    let messages = [];
    try {
      messages = messagesRaw ? JSON.parse(messagesRaw) : [];
      if (!Array.isArray(messages)) messages = [];
    } catch (e) {
      messages = [];
    }
    //const messages = (!messagesRaw || messagesRaw === "undefined") ? [] : JSON.parse(messagesRaw);
    

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // (B) Blob -> Buffer 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // (C) 임시 파일 저장 (Whisper API는 파일을 직접 읽어야 함)
    const tempDir = "/tmp";
    const tempPath = path.join(tempDir, "temp-audio.webm");
    const trimmedPath = path.join(tempDir, "trimmed-audio.webm"); // 🔹 잘린 오디오 파일

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempPath, buffer);
    console.log("✅ 파일 생성 완료:", tempPath);

    // (D) FFmpeg로 오디오 길이 확인
    let duration = 0;
    try {
      duration = parseFloat(
        execSync(`ffprobe -i ${tempPath} -show_entries format=duration -v quiet -of csv="p=0"`).toString().trim()
      );
      console.log(`🎵 오디오 길이: ${duration.toFixed(2)}초`);
    } catch (err) {
      console.error("❌ FFmpeg 분석 오류:", err);
    }

    // (E) 5초 초과 시 자동으로 잘라서 저장
    if (duration > MAX_DURATION) {
      console.log(`✂️ 5초 초과! 처음 5초만 잘라서 저장합니다.`);
      try {
        execSync(`ffmpeg -i ${tempPath} -t ${MAX_DURATION} -c copy ${trimmedPath} -y`);
        fs.unlinkSync(tempPath); // 원본 삭제
      } catch (err) {
        console.error("❌ FFmpeg 트리밍 오류:", err);
      }
    } else {
      fs.renameSync(tempPath, trimmedPath); // 5초 이하라면 파일 이름만 변경
    }

    // (F) Whisper API 호출 (음성 → 텍스트 변환)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(trimmedPath), 
      model: "whisper-1",
      language: "ko",
    });

     console.log("📝 Whisper 변환 결과:", transcription.text);
    const userText = transcription.text;

    // (G) **파일 삭제**
    if (fs.existsSync(trimmedPath)) {
      fs.unlinkSync(trimmedPath);
    }

    // (H) GPT로 응답 생성
    const systemPrompt = commonPrompt["expert"];


    messages.push({ role: "user", content: userText });

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: systemPrompt
        },
        ...messages,
      ],
    });

    const gptReply = gptResponse.choices[0].message.content;
    console.log("🤖 GPT 응답:", gptReply);

    // (I) 응답을 대화 기록에 추가
    messages.push({ role: "system", content: gptReply });

    // (J) ElevenLabs TTS API 호출
    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const ttsHeaders = {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    };

    const ttsPayload = {
      text: gptReply,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 1.0,
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

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    console.log("✅ TTS 변환 완료");

    // (L) 감정 분석 API 호출
    let analysisResult = null;
    try {
      const analysisRes = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const analysisJson = await analysisRes.json();
      analysisResult = analysisJson.analysis;
      console.log("감정 분석 결과:", analysisResult);
    } catch (err) {
      console.error("감정 분석 호출 실패:", err);
    }

    // (K) 최종 응답 반환
    return NextResponse.json({ 
      userText, 
      gptReply, 
      audio: base64Audio, 
      messages: Array.isArray(messages) ? messages : [], 
      analysis: analysisResult 
    });

  } catch (error) {
    console.error("❌ Transcribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
