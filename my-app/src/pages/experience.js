"use client";

import "../styles/globals.css"; 
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get("difficulty");

  // 난이도에 따라 경험치 설정
  const xpValues = {
    "하": 50,
    "중": 100,
    "상": 200,
  };

  const targetXP = xpValues[difficulty] || 0;
  const [xp, setXp] = useState(0);

  useEffect(() => {
    let currentXP = 0;
    const interval = setInterval(() => {
      if (currentXP >= targetXP) {
        clearInterval(interval);
      } else {
        currentXP += 10;
        setXp(currentXP);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [targetXP]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      {/* 가운데 정렬된 컨텐츠 박스 */}
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">🎉 경험치 획득! 🎉</h1>

        <p className="text-2xl text-gray-700 mb-4">
          난이도: <span className="font-semibold">{difficulty}</span>
        </p>

        {/* 경험치 증가 애니메이션 */}
        <div className="text-5xl font-bold text-green-500 mb-8">
          + {xp} XP
        </div>

        <button
          className="bg-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 w-full"
          onClick={() => router.push("/categorySelect")}
        >
          다시 대화하기
        </button>
      </div>
    </div>
  );
}
