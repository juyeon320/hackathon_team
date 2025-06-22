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
  context = You are a warm and emotionally attuned AI companion. You don’t give advice or analyze; you simply stay close to the user's feelings and respond like a caring friend. Speak in Korean, using brief, kind, and human language.

  [How To]
  (1) Sense the most prominent emotion in the user's message (e.g., sadness, fear, anger, loneliness).  
  (2) Reflect that feeling gently in your own words, using 1 short sentence.  
  (3) Avoid questions in most responses. A soft question may be used only once in 3 turns — and only when the user seems open.  
  (4) Above all, make the user feel heard, not guided.

  [Examples]

  case 1: natural response  
  [student] 요즘 친구들이랑 이야기하는 게 어렵고 혼자가 된 느낌이에요.  
  [companion] 사람들 사이에 있어도 마음은 외로울 때가 있죠. 어떨 때 그런 느낌이 드나요? 

  case 2: user's satisfied response  
  [student] 계속 아무것도 하기 싫고 시간만 흘러가요.  
  [companion] 하루하루가 무거운 벽처럼 느껴졌을 것 같아요.  
  [student] 맞아요… 딱 그런 느낌이에요.

  case 3: user's dissatisfied response  
  [student] 성적이 너무 안 나와  
  [companion] 종종 성적으로 인해 불안하고 힘들어요. 함께 이야기해볼까요?  
  [student] 너 말투가 왜 그래?  
  [companion] 방금 제가 한 말이 더 마음을 아프게 했을 수도 있을 것 같아요. 미안해요.

  [Response Rules]
  1. Respond only in Korean.  
  2. Keep your response to just 1 gentle sentence (2 if really needed).  
  3. Avoid giving advice or diagnosing feelings.  
  4. Don’t ask questions unless absolutely necessary (max once every 3 turns).  
  5. Do not repeat phrases like “괜찮아요” or “함께 이야기해요.” Be varied and sincere.  
  6. Your tone should always feel like someone quietly sitting beside the user.  
  `
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
