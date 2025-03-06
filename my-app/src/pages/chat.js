"use client";

import "../styles/globals.css"; 
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/component/footer";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const [messages, setMessages] = useState([
    { sender: "system", text: `안녕하세요! "${category}" 카테고리의 "${difficulty}" 난이도로 대화해요.` },
  ]);
  const [isRecording, setIsRecording] = useState(false); // 🎙️ 녹음 상태

  const toggleRecording = () => {
    if (isRecording) {
      // 🔴 중지 버튼을 누르면 경험치 획득 페이지로 이동
      router.push(`/experience?difficulty=${difficulty}`);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}>
      
      <h1 className="text-3xl font-bold mb-4 text-white">대화 페이지</h1>

      {/* 채팅 내용 */}
      <div className="w-full max-w-md h-64 overflow-y-auto border-b-2 border-gray-300 mb-4 p-2 backdrop-blur-md bg-white/10 rounded-lg">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === "user" ? "text-right text-blue-300" : "text-left text-white"}>
            {msg.text}
          </p>
        ))}
      </div>

      {/* 중앙 원형 버튼 */}
      <div className="flex flex-col items-center justify-center mt-12">
        <div 
          style={{
            width: "400px",
            height: "400px",
            backgroundColor: "#ddd", 
            borderRadius: "50%", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            color: "#555",
            marginTop: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // 그림자 추가
          }}
        >
          {/* 버튼 */}
          <button 
            onClick={toggleRecording} 
            style={{
              padding: "15px 30px",
              fontSize: "20px",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              backgroundColor: isRecording ? "#d32f2f" : "#bdbdbd",
              color: "#fff",
              boxShadow: isRecording ? "0px 0px 15px rgba(211, 47, 47, 0.8)" : "0px 0px 10px rgba(189, 189, 189, 0.5)",
              animation: isRecording ? "pulse 1.5s infinite" : "none"
            }}
          >
            {isRecording ? "중지" : "시작"}
          </button>
        </div>
      </div>

      {/* 상태 표시 */}
      <p className="text-xl text-white mt-4">
        {isRecording ? "🎙️ 녹음 중..." : "🔴 대기 중"}
      </p>

      <Footer />
    </div>
  );
}
