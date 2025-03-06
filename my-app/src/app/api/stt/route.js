import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // (E) **파일 삭제**
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // (F) 변환된 텍스트 반환
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("❌ Transcribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
