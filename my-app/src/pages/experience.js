"use client";

import "../styles/globals.css"; 
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/component/footer";

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get("difficulty");

  // 난이도에 따라 경험치 설정 및 비율 조정
  const xpValues = {
    "하": { xp: 50, maxXp: 500 },  // 경험치 50, 최대 경험치 500 (1/10)
    "중": { xp: 100, maxXp: 500 }, // 경험치 100, 최대 경험치 500 (1/5)
    "상": { xp: 200, maxXp: 600 }, // 경험치 200, 최대 경험치 600 (1/3)
  };

  const targetXP = xpValues[difficulty]?.xp || 0;
  const maxXP = xpValues[difficulty]?.maxXp || 500; // 기본 최대 경험치 500
  const xpPercentage = (targetXP / maxXP) * 100; // 경험치 바 비율 계산

  const [xp, setXp] = useState(0);
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    const duration = 2000; // 전체 애니메이션 지속 시간 (ms)
    const frameRate = 30; // 프레임 속도 (ms)
    const totalFrames = duration / frameRate; // 총 프레임 수
    const xpIncrement = xpPercentage / totalFrames; // 매 프레임 증가량
    const xpNumberIncrement = targetXP / totalFrames; // XP 숫자 증가량

    let currentXP = 0;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      currentXP += xpIncrement;
      setXp(currentXP);
      setAnimatedXP((prevXP) => Math.min(prevXP + xpNumberIncrement, targetXP));

      if (frame >= totalFrames) {
        clearInterval(interval);
        setXp(xpPercentage); // 최종 값 보정
        setAnimatedXP(targetXP);
      }
    }, frameRate);

    return () => clearInterval(interval);
  }, [xpPercentage, targetXP]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-10"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      {/* 경험치 획득 텍스트 (숫자 애니메이션 적용) */}
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-green-500">
          + {Math.round(animatedXP)} XP
        </div>
      </div>

      {/* 경험치 바 */}
      <div 
        style={{
          width: "1000px",
          height: "20px",
          backgroundColor: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
          border: "2px solid #ccc",
          position: "relative"
        }}
      >
        <div 
          style={{
            width: `${xp}%`, 
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.3s linear",
          }}
        ></div>
      </div>

      {/* 중앙 원형 이미지 */}
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
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 그림자 추가
      backgroundImage: "url('/images/seed.png')", // 이미지 추가
      backgroundSize: "cover", // 이미지가 div에 꽉 차도록 설정
      backgroundPosition: "center", // 이미지 중앙 정렬
    }}
  >
  </div>
</div>


      {/* Footer */}
      <Footer />
    </div>
  );
}
