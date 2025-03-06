"use client";

import "../styles/globals.css"; 
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const [messages, setMessages] = useState([
    { sender: "system", text: `안녕하세요! "${category}" 카테고리의 "${difficulty}" 난이도로 대화해요.` },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  const handleEndChat = () => {
    router.push(`/experience?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
    style={{ backgroundImage: "url('/images/background1.jpg')" }}>
      <h1 className="text-3xl font-bold mb-4">대화 페이지</h1>

      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
        <div className="h-64 overflow-y-auto border-b-2 border-gray-300 mb-4 p-2">
          {messages.map((msg, index) => (
            <p key={index} className={msg.sender === "user" ? "text-right text-blue-600" : "text-left text-gray-700"}>
              {msg.text}
            </p>
          ))}
        </div>

        <div className="flex justify-center items-center">
            {/* 작은 동그라미 배경 */}
            <div className="w-16 h-16 bg-gray-300 rounded-full flex justify-center items-center shadow-md">
                <img src="/images/mic.jpg" alt="이미지" className="w-8 h-8 object-cover rounded-full" />
            </div>
            </div>




    
                {/* 대화 종료 버튼 */}
            <div className="flex justify-center">
            <button
                className="mt-4 bg-purple-600 px-6 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition duration-200"
                onClick={handleEndChat}
            >
                대화 종료
            </button>
</div>

      </div>
    </div>
  );
}
