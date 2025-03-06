"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "../styles/globals.css"; 
import Footer from "@/component/footer";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const [messages, setMessages] = useState([
    { sender: "system", text: `안녕하세요! "${category}" 카테고리의 "${difficulty}" 난이도로 대화해요.` },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]); // 🎯 최신 녹음 데이터를 저장하기 위한 useRef 추가
  const audioRef = useRef(null); // 🎯 자동 재생을 위한 useRef 추가

  // 🎙️ 녹음 시작
  const startRecording = async () => {
    console.log("🎤 녹음 시작!");
    audioChunksRef.current = []; // 이전 데이터 초기화
    setAudioSrc(null); // 기존 음성 삭제

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ 마이크 접근 성공!");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        console.log("🔹 데이터 수신됨:", event.data.size, "bytes");
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("⏹️ 녹음 중지됨! 데이터 크기:", audioChunksRef.current.length);
        await handleTranscribeAndAskGPT(audioChunksRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("❌ 마이크 접근 실패:", error);
      alert("마이크 권한을 허용해주세요.");
    }
  };

  // ⏹️ 녹음 종료 후 자동 변환 실행
  const stopRecording = () => {
    console.log("⏹️ 녹음 중지 요청됨");
    if (!mediaRecorderRef.current) {
      console.error("❌ MediaRecorder가 존재하지 않음.");
      return;
    }
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // 🎤 STT + GPT + TTS API 호출
  const handleTranscribeAndAskGPT = async (chunks) => {
    if (!chunks || chunks.length === 0) {
      console.error("❌ 녹음된 데이터가 없음!");
      alert("녹음 데이터가 없습니다.");
      return;
    }

    console.log("📤 서버로 전송할 오디오 크기:", chunks.length, "조각");

    // 🔹 Blob 생성
    const blob = new Blob(chunks, { type: "audio/webm" });

    // 🔹 FormData에 담아서 전송
    const formData = new FormData();
    formData.append("audioFile", blob, "recording.webm");

    try {
      console.log("📡 API 요청 시작...");
      const res = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ 서버 응답 수신:", data);

      const userText = data.userText || "음성 변환 실패";
      const gptReply = data.gptReply || "GPT 응답 오류!";
      const base64Audio = data.audio;

      // 📌 UI에 메시지 추가
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userText },
        { sender: "bot", text: gptReply },
      ]);

      // 📌 음성 파일 자동 재생
      if (base64Audio) {
        console.log("🎵 변환된 오디오 적용!");
        const audioData = `data:audio/mp3;base64,${base64Audio}`;
        setAudioSrc(audioData);

        // 🎯 음성 자동 재생
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(err => console.error("❌ 오디오 자동 재생 오류:", err));
          }
        }, 500);
      }
      
    } catch (err) {
      console.error("❌ API 요청 실패:", err);
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}>
      
      <h1 className="text-3xl font-bold mb-4 text-white">대화 페이지</h1>

      {/* 채팅 메시지 박스 */}
      <div className="w-full max-w-md h-64 overflow-y-auto border-b-2 border-gray-300 mb-4 p-2 backdrop-blur-md bg-white/10 rounded-lg">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === "user" ? "text-right text-blue-300" : "text-left text-white"}>
            {msg.text}
          </p>
        ))}
      </div>

      {/* 중앙 원형 버튼 */}
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="w-[400px] h-[400px] bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
          {/* 버튼 */}
          <button 
            onClick={isRecording ? stopRecording : startRecording} 
            className={`px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300
              ${isRecording ? "bg-red-600 text-white animate-pulse" : "bg-gray-400 text-gray-800 hover:bg-gray-500"}`}
          >
            {isRecording ? "⏹️ 중지" : "🎙️ 시작"}
          </button>
        </div>
      </div>

      {/* 음성 자동 재생 */}
      {audioSrc && (
        <audio ref={audioRef} autoPlay controls className="mt-4">
          <source src={audioSrc} type="audio/mp3" />
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
      )}

      <Footer />
    </div>
  );
}
