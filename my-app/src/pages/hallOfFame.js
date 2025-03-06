"use client";

import { useState } from "react";
import Image from "next/image";
import "../styles/globals.css"; 
import Footer from "@/component/footer";
import Title from "@/component/Title"; 

export default function HallOfFame() {
  const dummyImages = [
    "/images/sweetpotato.png",
    "/images/potato.png",
    "/images/carrot.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nicknames, setNicknames] = useState(["콜포비아 현", "나는 셉", "헤조"]); // 기본값 설정

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyImages.length) % dummyImages.length);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ position: "relative" }}
    >
      {/* 배경 이미지를 위한 오버레이 div */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/ver1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      />
      
      {/* 기존 컨텐츠를 위한 wrapper div */}
      <div className="relative z-10 flex flex-col items-center w-full">
      
      {/* 타이틀 개선 - 헤더 위치로 이동 */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 0",
          textAlign: "center",
          zIndex: 20
        }}
      >
      <Title>명예의 전당</Title>
      </div>

      {/* 여백 추가 (헤더 고려) */}
      <div style={{ marginTop: "80px" }}></div>

      {/* 닉네임 스타일 개선 */}
      <div 
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(8px)",
          padding: "12px 30px",
          borderRadius: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "2px solid rgba(255, 255, 255, 0.8)"
        }}
      >
        <h2 
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#333",
            letterSpacing: "0.03em",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
        >
          {nicknames[currentIndex]}
        </h2>
      </div>

      {/* 이미지 슬라이드 컨테이너 - 마진으로 간격 조정 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%" }}>
        {/* 이전 버튼 (왼쪽) - position absolute로 배치 */}
        <div 
          style={{
            position: "absolute",
            left: "calc(50% - 300px)",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onClick={prevSlide}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.backgroundColor = "#f8f8f8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          <Image
            src="/images/left.png"
            alt="이전"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        {/* 이미지 컨테이너 개선 */}
        <div 
          style={{
            width: "400px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.5s ease"
          }}
        >
          <div 
            style={{
              position: "relative",
              width: "380px",
              height: "380px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image 
              src={dummyImages[currentIndex]}
              alt={`캐릭터 ${currentIndex + 1}`}
              width={380} 
              height={380}
              className="rounded-full object-cover"
              style={{ width: '380px', height: '380px' }}
              priority
            />
          </div>
        </div>

        {/* 다음 버튼 (오른쪽) - position absolute로 배치 */}
        <div 
          style={{
            position: "absolute",
            right: "calc(50% - 300px)",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onClick={nextSlide}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.backgroundColor = "#f8f8f8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          <Image
            src="/images/right.png"
            alt="다음"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
      </div>

      <Footer />
    </div>
    </div>
  );
}