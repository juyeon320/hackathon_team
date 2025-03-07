"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import "../styles/globals.css"; 
import Footer from "@/component/footer";
import Title from "@/component/Title"; 

export default function HallOfFame() {
  const hallOfFameData = [
    {
      nickname: "콜포비아 현",
      image: "/images/sweetpotato.png"
    },
    {
      nickname: "나는 셉",
      image: "/images/potato.png"
    },
    {
      nickname: "헤조",
      image: "/images/carrot.png"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("");

  // 자동 슬라이드 기능 추가
  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      nextSlide();
    }, 8000); // 8초마다 자동 슬라이드

    return () => clearInterval(autoSlideTimer);
  }, [currentIndex]);

  const nextSlide = () => {
    if (isAnimating) return; // 애니메이션 중일 때는 클릭 방지
    
    setIsAnimating(true);
    setDirection("right");
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hallOfFameData.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isAnimating) return; // 애니메이션 중일 때는 클릭 방지
    
    setIsAnimating(true);
    setDirection("left");
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + hallOfFameData.length) % hallOfFameData.length
      );
      setIsAnimating(false);
    }, 300);
  };

  // 현재 프로필 및 이전/다음 프로필 (미리보기용)
  const currentProfile = hallOfFameData[currentIndex];
  const prevProfile = hallOfFameData[(currentIndex - 1 + hallOfFameData.length) % hallOfFameData.length];
  const nextProfile = hallOfFameData[(currentIndex + 1) % hallOfFameData.length];

  // 인디케이터 렌더링 함수
  const renderIndicators = () => {
    return (
      <div className="flex justify-center mt-6 gap-2">
        {hallOfFameData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx > currentIndex) {
                setDirection("right");
              } else if (idx < currentIndex) {
                setDirection("left");
              }
              setCurrentIndex(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? "bg-black w-6" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`프로필 ${idx + 1} 보기`}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
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
          padding: "10px 0",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        <Title>명예의 전당</Title>
      </div>

      {/* 여백 추가 (헤더 고려) */}
      <div style={{ marginTop: "120px" }}></div>

      {/* 닉네임과 설명 스타일 개선 */}
      <div 
        className={`transform transition-all duration-300 ${
          isAnimating 
            ? direction === "right" ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0" 
            : "translate-x-0 opacity-100"
        }`}
        style={{
          marginTop: "0px",
          marginBottom: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "8px 30px",
          borderRadius: "24px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          border: "2px solid rgba(255, 255, 255, 0.9)",
          textAlign: "center",
          maxWidth: "500px"
        }}
      >
        <h2 
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#333",
            letterSpacing: "0.03em",
            marginBottom: "10px"
          }}
        >
          {currentProfile.nickname}
        </h2>
        <p style={{ color: "#555", fontSize: "16px" }}>
          {currentProfile.description}
        </p>
      </div>

      {/* 이미지 슬라이드 컨테이너 개선 */}
      <div className="flex items-center justify-center relative w-full">
        {/* 이전 프로필 미리보기 (작은 크기) */}
        <div 
          className="relative mx-4 transition-opacity duration-300 hover:opacity-90"
          style={{
            width: "100px",
            height: "100px",
            opacity: 0.6,
            cursor: "pointer",
          }}
          onClick={prevSlide}
        >
          <Image 
            src={prevProfile.image}
            alt={`이전: ${prevProfile.nickname}`}
            width={100} 
            height={100}
            className="rounded-full object-cover"
            style={{ width: '100px', height: '100px' }}
          />
        </div>

        {/* 이미지 컨테이너 개선 */}
<div 
  className={`transform transition-all duration-300 ${
    isAnimating 
      ? direction === "right" ? "-translate-x-16 opacity-50" : "translate-x-16 opacity-50" 
      : "translate-x-0 opacity-100"
  }`}
  style={{
    width: "350px",  // 살짝 줄임
    height: "350px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-30px", // 화면 위쪽으로 이동
  }}
>
  <div 
    style={{
      position: "relative",
      width: "330px", // 살짝 줄임
      height: "330px",
      borderRadius: "50%",
      transition: "transform 0.3s ease",
    }}
    className="hover:scale-105"
  >
    <Image 
      src={currentProfile.image}
      alt={currentProfile.nickname}
      width={330} 
      height={330}
      className="rounded-full object-cover"
      style={{ width: '330px', height: '330px' }}
      priority
    />
  </div>
</div>


        {/* 다음 프로필 미리보기 (작은 크기) */}
        <div 
          className="relative mx-4 transition-opacity duration-300 hover:opacity-90"
          style={{
            width: "100px",
            height: "100px",
            opacity: 0.6,
            cursor: "pointer"
          }}
          onClick={nextSlide}
        >
          <Image 
            src={nextProfile.image}
            alt={`다음: ${nextProfile.nickname}`}
            width={100} 
            height={100}
            className="rounded-full object-cover"
            style={{ width: '100px', height: '100px' }}
          />
        </div>
      </div>

      {/* 화살표 버튼 개선 - 화면 양쪽에 배치 */}
      <div 
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          backgroundColor: "white",
          borderRadius: "50%",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 15
        }}
        onClick={prevSlide}
        className="hover:scale-110 hover:bg-gray-50"
        aria-label="이전 프로필"
      >
        <Image
          src="/images/left.png"
          alt="이전"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>

      <div 
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          backgroundColor: "white",
          borderRadius: "50%",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 15
        }}
        onClick={nextSlide}
        className="hover:scale-110 hover:bg-gray-50"
        aria-label="다음 프로필"
      >
        <Image
          src="/images/right.png"
          alt="다음"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>

      {/* 인디케이터 추가 */}
      {renderIndicators()}

      <Footer />
    </div>
    </div>
  );
}