"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../styles/globals.css"; 
import Footer from "@/component/footer";
import Title from "@/component/Title"; 

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const MAX_RECORDS = 3; // 🔹 최대 녹음 횟수 설정
  const [messages, setMessages] = useState([
    { role: "system", content: `안녕하세요! "${category}" 카테고리의 "${difficulty}" 난이도로 대화해요.` },
  ]);
  const [recordCount, setRecordCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isConversationEnded, setIsConversationEnded] = useState(false); // 🔹 종료 상태 추가
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // 🔹 AI 음성이 재생 중인지 여부

  useEffect(() => {
    console.log("🔍 현재 messages 상태:", messages);
  }, [messages]);
  
  // 🎙️ 녹음 시작 (5초 후 자동 중지)
  const startRecording = async () => {
    if (isRecording || isPlaying || recordCount >= MAX_RECORDS) return; // 🔹 최대 횟수 초과 시 실행 안 함

    console.log(`🎤 녹음 시작! 현재 녹음 횟수: ${recordCount}/${MAX_RECORDS}`);
    audioChunksRef.current = [];
    setAudioSrc(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("⏹️ 자동 녹음 중지됨! 데이터 크기:", audioChunksRef.current.length);
        setRecordCount(prev => prev + 1);
        await handleTranscribeAndAskGPT(audioChunksRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 5초 후 자동으로 중지
      setTimeout(() => {
        stopRecording();
      }, 5000);
      
    } catch (error) {
      alert("마이크 권한을 허용해주세요.");
    }
  };

  // ⏹️ 녹음 중지
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    console.log("⏹️ 녹음 중지 요청됨");
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // 🎤 STT + GPT + TTS API 호출
  const handleTranscribeAndAskGPT = async (chunks) => {
    if (chunks.length === 0) return;

    const blob = new Blob(chunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audioFile", blob, "recording.webm");
    formData.append("messages", JSON.stringify(messages));
    formData.append("category", category); 
    formData.append("difficulty", difficulty); 

    try {
      const res = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const { userText, gptReply, audio, messages: updatedMessages } = data;
      console.log("🎤 유저 입력:", userText);
    console.log("🤖 GPT 응답:", gptReply);
    console.log("🔄 업데이트된 메시지 리스트:", updatedMessages);
      setMessages(updatedMessages);

      if (audio) {
        const audioData = `data:audio/mp3;base64,${audio}`;
        setAudioSrc(audioData);

        // 🔹 AI 음성 재생 시작
        setIsPlaying(true);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            console.log("🔊 AI 음성 재생 시작");
          }
        }, 500);
      }

      // 🔹 횟수 초과 후 종료 버튼 표시
      if (recordCount + 1 >= MAX_RECORDS) {
        setIsConversationEnded(true);
      }
      
    } catch (err) {
      alert("오류 발생: " + err.message);
    }
  };

  // 🔁 **AI 음성이 끝난 후, 1초 후 다시 녹음 시작 (단, 최대 횟수 초과 시 종료 버튼 표시)**
  useEffect(() => {
    if (!isPlaying && audioSrc) {
      if (recordCount < MAX_RECORDS) {
        console.log("🔁 AI 음성이 끝났으므로 1초 후 다시 녹음 시작!");
        setTimeout(() => {
          startRecording();
        }, 1000); // 🔹 1초 딜레이 후 녹음 시작
      }
    }
  }, [isPlaying]);

  // 📌 **"종료" 버튼 클릭 시 경험치 페이지로 이동**
  const handleEndConversation = () => {
    router.push(`/experience?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
      style={{ backgroundImage: "url('/images/background2.jpg')" }}>
      
      <Title>포비야</Title>

{/* 채팅 메시지 박스 */}
<div className="w-full max-w-md h-64 overflow-y-auto border border-gray-300 mb-4 p-4 bg-white rounded-lg shadow-lg flex flex-col gap-2">
  {Array.isArray(messages) ? (
    messages.map((msg, index) => {
      console.log(`🔍 메시지 ${index}:`, msg); // 디버깅용

      // 역할 분류
      const isSystemMessage = msg.role === "system" && index === 0; // 첫 시스템 메시지
      const isGPTResponse = msg.role === "system" && index !== 0; // 이후 GPT 응답
      const isUserMessage = msg.role === "user";

      console.log("u",isUserMessage);
      return (
        <div key={index} className={`flex ${isUserMessage ? "justify-start" : "justify-end"}`}>
          <div
            className={`p-3 max-w-[75%] rounded-lg text-sm ${
              isSystemMessage
                ? "bg-yellow-400 text-black text-center w-full" // 초기 시스템 메시지는 노란색 중앙 정렬
                : isUserMessage
                ? "bg-blue-500 text-black self-start" // 유저 메시지는 왼쪽 (파란색)
                : "bg-gray-600 text-blue self-end" // GPT 응답은 오른쪽 (회색)
            }`}
          >
            {msg.content}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-center text-red-500">
      ⚠️ 오류: messages가 배열이 아닙니다. 현재 값: {JSON.stringify(messages)}
    </p>
  )}
</div>


      {/* 🔹 녹음 버튼 또는 종료 버튼 (대화 횟수 초과 시 "종료" 버튼 표시) */}
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="w-[400px] h-[400px] bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
          {!isConversationEnded ? (
            <button 
              onClick={startRecording} 
              className={`px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300
                ${isRecording ? "bg-red-600 animate-pulse" : "bg-gray-400 text-gray-800 hover:bg-gray-500"}`}
              disabled={isRecording || isPlaying} // 녹음 중이거나 음성이 재생 중이면 비활성화
            >
              {isRecording ? "⏹️ 녹음 중 (5초)" : isPlaying ? "🔊 AI 응답 중" : "🎙️ 시작"}
            </button>
          ) : (
            <button 
              onClick={handleEndConversation} 
              className="px-6 py-3 text-lg font-bold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              종료
            </button>
          )}
        </div>
      </div>

      {/* 음성 자동 재생 */}
      {audioSrc && (
        <audio 
          ref={audioRef} 
          autoPlay 
          controls 
          className="mt-4"
          onEnded={() => setIsPlaying(false)} // 🔹 음성이 끝나면 다시 녹음 시작 or 종료 체크
        >
          <source src={audioSrc} type="audio/mp3" />
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
      )}

      <Footer />
    </div>
  );
}
