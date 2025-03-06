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
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  // 🎙️ 녹음 시작
  const startRecording = async () => {
    setAudioChunks([]);

    // 브라우저 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MediaRecorder로 녹음 시작
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // ⏹️ 녹음 종료
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // 🎤 STT + GPT API 호출
  const handleTranscribeAndAskGPT = async () => {
    if (audioChunks.length === 0) {
      alert("녹음 데이터가 없습니다.");
      return;
    }

    // 🔹 Blob 생성
    const blob = new Blob(audioChunks, { type: "audio/webm" });

    // 🔹 FormData에 담아서 전송
    const formData = new FormData();
    formData.append("audioFile", blob, "recording.webm");

    try {
      // 📌 STT + GPT API 요청
      const res = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json();
      const userText = data.userText || "음성 변환 실패";
      const gptReply = data.gptReply || "GPT 응답 오류!";

      // 📌 UI에 메시지 추가
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userText },
        { sender: "bot", text: gptReply },
      ]);

    } catch (err) {
      console.error("오류 발생:", err);
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

      {/* 음성 → 텍스트 변환 후 GPT 질문 버튼 */}
      <button 
        onClick={handleTranscribeAndAskGPT} 
        className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        disabled={isRecording}
      >
        변환 후 질문하기
      </button>

      <Footer />
    </div>
  );
}
