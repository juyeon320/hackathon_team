"use client";

import { useState } from "react";
import Image from "next/image";
import "../styles/globals.css"; 
import Footer from "@/component/footer";

export default function HallOfFame() {
  const dummyImages = [
    "/images/sweetpotato.png",
    "/images/potato.png",
    "/images/carrot.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nicknames, setNicknames] = useState(["닉네임1", "닉네임2", "닉네임3"]); // 기본값 설정

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyImages.length) % dummyImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-cover bg-center pt-20"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}>
      
      {/* 타이틀 (가장 위로 이동) */}
      <h1 className="text-5xl font-extrabold text-white mb-12">🏆 명예의 전당 🏆</h1>

      {/* 이미지 슬라이드 컨테이너 */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        {/* 이전 버튼 (왼쪽) */}
        <button 
          onClick={prevSlide} 
          className="text-4xl bg-white rounded-full px-4 py-2 shadow-md hover:bg-gray-200 transition duration-200"
        >
          ⬅
        </button>

        {/* 이미지 (원 크기 400x400) */}
        <div className="w-[400px] h-[400px] bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
          <Image 
            src={dummyImages[currentIndex]}
            alt={`캐릭터 ${currentIndex + 1}`}
            width={400}
            height={400}
            className="rounded-full object-cover"
            priority
          />
        </div>

        {/* 다음 버튼 (오른쪽) */}
        <button 
          onClick={nextSlide} 
          className="text-4xl bg-white rounded-full px-4 py-2 shadow-md hover:bg-gray-200 transition duration-200"
        >
          ➡
        </button>
      </div>

      {/* 닉네임 */}
      <h2 className="text-3xl font-semibold text-white mt-6">{nicknames[currentIndex]}</h2>

      <Footer />
    </div>
  );
}
