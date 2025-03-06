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
    "하": { xp: 50, maxXp: 500, color: "#4caf50" },  // 경험치 50, 최대 경험치 500 (1/10)
    "중": { xp: 100, maxXp: 500, color: "#2196f3" }, // 경험치 100, 최대 경험치 500 (1/5)
    "상": { xp: 200, maxXp: 600, color: "#ff9800" }, // 경험치 200, 최대 경험치 600 (1/3)
  };

  const targetXP = xpValues[difficulty]?.xp || 0;
  const maxXP = xpValues[difficulty]?.maxXp || 500; // 기본 최대 경험치 500
  const barColor = xpValues[difficulty]?.color || "#4caf50"; // 기본 색상 추가
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
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16 relative"
      style={{ 
        position: 'relative',
      }}
    >
      {/* 배경 이미지를 위한 오버레이 div */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/background3.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.85,  // 약간 더 선명하게 조정
        }}
      />
      
      {/* 기존 컨텐츠를 위한 wrapper div */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* 경험치 획득 텍스트 (숫자 애니메이션 적용) */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold" style={{ color: barColor, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            + {Math.round(animatedXP)} XP
          </div>
        </div>

        {/* 경험치 바 */}
        <div 
          style={{
            width: "1000px",
            height: "24px", // 약간 더 높게
            backgroundColor: "rgba(245, 245, 245, 0.9)", // 더 밝고 투명도 있는 배경
            borderRadius: "12px", // 더 둥글게
            overflow: "hidden",
            border: "2px solid rgba(200, 200, 200, 0.7)",
            position: "relative",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" // 그림자 추가
          }}
        >
          <div 
            style={{
              width: `${xp}%`, 
              height: "100%",
              backgroundColor: barColor, // 난이도별 색상 사용
              transition: "width 0.3s ease-out", // 부드러운 애니메이션
              borderRadius: "10px", // 내부 바도 둥글게
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "8px"
            }}
          >
            {xp > 10 && (
              <span style={{ 
                color: "#fff", 
                fontSize: "12px", 
                fontWeight: "bold",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)"
              }}>
                {Math.round(xp)}%
              </span>
            )}
          </div>
        </div>

        {/* 중앙 원형 이미지 */}
        <div className="flex flex-col items-center justify-center mt-12">
          <div 
            style={{
              width: "400px",
              height: "400px",
              backgroundColor: "rgba(240, 240, 240, 0.7)", // 배경색 개선
              borderRadius: "50%", 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              color: "#555",
              marginTop: "20px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(255, 255, 255, 0.4)", // 그림자 개선
              backgroundImage: "url('/images/potseed.png')",
              backgroundSize: "300px 300px",
              backgroundPosition: "center",
              transition: "transform 0.3s ease", // 부드러운 전환 효과
              backgroundRepeat: "no-repeat"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}