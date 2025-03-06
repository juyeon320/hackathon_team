"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import "../styles/globals.css";
import Footer from "@/component/footer";

// Firebase 인스턴스는 utils/firebase.js에서 가져옵니다.
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

// 🔹 Firebase 설정 관련 코드는 삭제합니다.
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// const firebaseConfig = { ... };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default function HallOfFame() {
  // 🔹 Firestore에서 불러올 데이터 (배열)
  const [hallOfFame, setHallOfFame] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Firestore에서 "hallOfFame" 컬렉션 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, "hallOfFame");
        const snapshot = await getDocs(ref);

        // Firestore 문서들 -> JS 객체 배열로 변환
        const dataArr = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHallOfFame(dataArr);
      } catch (error) {
        console.error("❌ Firestore 데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 슬라이드 버튼
  const nextSlide = () => {
    if (hallOfFame.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % hallOfFame.length);
  };

  const prevSlide = () => {
    if (hallOfFame.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + hallOfFame.length) % hallOfFame.length);
  };

  // 🔹 현재 인덱스 데이터 (빈 배열이면 기본 값 처리)
  const currentItem = hallOfFame[currentIndex] || {
    img: "/images/default.png", // Firestore에서 "img" 필드 사용
    name: "로딩 중...",
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
              opacity: 0.9,
              filter: "blur(3px)",
            }}
        />

        {/* 기존 컨텐츠를 위한 wrapper div */}
        <div className="relative z-10 flex flex-col items-center w-full">

          {/* 타이틀 개선 */}
          <h1 className="text-6xl font-extrabold text-white mb-16 tracking-wider drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
            명예의 전당
          </h1>

          {/* 이미지 슬라이드 컨테이너 */}
          <div className="flex items-center justify-center space-x-8 mt-4">
            {/* 이전 버튼 (왼쪽) */}
            <button
                onClick={prevSlide}
                className="text-white bg-gray-800/80 backdrop-blur-md rounded-full p-6 shadow-xl hover:bg-gray-900 hover:scale-110 transition-all duration-300 active:scale-95 flex items-center justify-center w-16 h-16"
                aria-label="이전"
            >
              ⬅
            </button>

            {/* 이미지 컨테이너 개선 */}
            <div className="w-[400px] h-[400px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-105">
              <div className="w-[380px] h-[380px] rounded-full overflow-hidden border-4 border-white/50">
                <Image
                    src={currentItem.img}
                    alt={`캐릭터 ${currentIndex + 1}`}
                    width={400}
                    height={400}
                    className="rounded-full object-cover transform transition-transform duration-500"
                    priority
                />
              </div>
            </div>

            {/* 다음 버튼 (오른쪽) */}
            <button
                onClick={nextSlide}
                className="text-white bg-gray-800/80 backdrop-blur-md rounded-full p-6 shadow-xl hover:bg-gray-900 hover:scale-110 transition-all duration-300 active:scale-95 flex items-center justify-center w-16 h-16"
                aria-label="다음"
            >
              ➡
            </button>
          </div>

          {/* 닉네임 스타일 개선 */}
          <div className="mt-6 bg-white/20 backdrop-blur-sm px-12 py-4 rounded-full">
            <h2 className="text-4xl font-bold text-white tracking-wider drop-shadow-lg">
              {currentItem.name}
            </h2>
          </div>

          <Footer />
        </div>
      </div>
  );
}
