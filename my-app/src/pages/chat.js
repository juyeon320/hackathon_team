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
      }, 4000);
      
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
    <div 
  style={{
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/images/background2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>

  {/* 🔹 타이틀 (위쪽 고정) */}
  <Title 
    style={{
      position: "absolute",
      top: "5vh",  // 타이틀이 채팅 박스와 겹치지 않게
      fontSize: "2rem",
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
    }}
  >
    포비야
  </Title>

  {/* 🔹 채팅 박스 (가운데 배치, 크기 조정) */}
  <div 
    style={{
      position: "absolute",
      top: "12vh",  // 타이틀과 간격 확보
      left: "50%",
      transform: "translateX(-50%)",
      width: "70vw", // 📌 너비 줄임
      maxWidth: "500px",
      height: "50vh", // 📌 높이 줄임
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      padding: "16px",
      overflowY: "auto",
      border: "1px solid #ccc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    }}
  >
    {Array.isArray(messages) ? (
      messages.map((msg, index) => {
        console.log(`🔍 메시지 ${index}:`, msg);

        // 역할 분류
        const isSystemMessage = msg.role === "system" && index === 0;
        const isGPTResponse = msg.role === "system" && index !== 0;
        const isUserMessage = msg.role === "user";

        return (
          <div key={index} style={{ display: "flex", justifyContent: isUserMessage ? "flex-start" : "flex-end" }}>
            <div
              style={{
                padding: "12px",
                maxWidth: "75%",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: isSystemMessage ? "#FFD700" : isUserMessage ? "#3B82F6" : "#6B7280",
                color: isSystemMessage ? "black" : "white",
                textAlign: isSystemMessage ? "center" : "left",
                alignSelf: isUserMessage ? "flex-start" : "flex-end",
              }}
            >
              {msg.content}
            </div>
          </div>
        );
      })
    ) : (
      <p style={{ textAlign: "center", color: "red" }}>
        ⚠️ 오류: messages가 배열이 아닙니다. 현재 값: {JSON.stringify(messages)}
      </p>
    )}
  </div>

  {/* 🔹 녹음 버튼 (하단 고정, 이미지 버튼 적용) */}
  <div 
    style={{
      position: "absolute",
      bottom: "20vh", // 📌 화면 하단에서 여유 공간 확보
      left: "50%",
      transform: "translateX(-50%)",
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
    }}
    onClick={!isConversationEnded ? startRecording : handleEndConversation} // ✅ 클릭 시 실행 함수 변경
  >
    {!isConversationEnded ? (
      <img 
        src={isRecording ? "/images/button2.png" : "/images/button1.png"} // ✅ 버튼 상태에 따른 이미지 변경
        alt="녹음 버튼"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    ) : (
      <img 
        src="/images/button2.png" // ✅ 녹음 종료 버튼 이미지
        alt="종료 버튼"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    )}
  </div>

 {/* 🔹 음성 자동 재생 */}
{audioSrc && (
  <audio 
    ref={audioRef} 
    autoPlay 
    controls 
    style={{ position: "absolute", bottom: "10vh", display: "none" }} // 📌 버튼 아래쪽 배치 (숨김)
    onEnded={() => {
      setIsPlaying(false);
      if (isConversationEnded) {
        router.push(`/experience?difficulty=${difficulty}`); // ✅ AI 응답 끝나면 자동 이동!
      }
    }}
  >
    <source src={audioSrc} type="audio/mp3" />
    브라우저가 오디오 태그를 지원하지 않습니다.
  </audio>
)}


  {/* 🔹 푸터 */}
  <Footer showModal={true} />
</div>

  );
}
