"use client";

import "../styles/globals.css"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CategoryModal from "@/component/CategoryModal";
import Footer from "@/component/footer";
import Title from "@/component/Title"; 

// 카테고리 목록
const categories = [
  { name: "중국집", value: "restaurant" },
  { name: "병원 ", value: "hospital" },
  { name: "은행", value: "bank"},
];

export default function CategorySelectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const router = useRouter();

  // Animation on page load
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // 모달 열기
  const handleOpenModal = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 relative">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/background2.jpg')",
          opacity: 0.85,
        }}
      />
      
      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* 타이틀 */}
        <div className={`fixed top-0 left-0 right-0 p-5 text-center z-20 transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <Title>포비야</Title>
        </div>

        {/* 카테고리 버튼 - 타이틀 아래 배치 */}
        <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: "0.2s", gap: "20px", margin: "60px" }}>
          {categories.map(({ name, value, icon }) => (
            <button
              key={value}
              className={`text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center
                        ${activeCategory === value ? 'bg-green-600 scale-105' : 'bg-green-500 hover:bg-green-600'}`}
              onClick={() => {
                setActiveCategory(value);
                setTimeout(() => handleOpenModal(value), 200);
              }}
            >
              <span className="text-xl mr-2">{icon}</span>
              {name}
            </button>
          ))}
        </div>

                        {/* 중앙 원형 이미지 */}
                        <div className="flex flex-col items-center justify-center" style={{ marginTop: "50px" }}>
                            <div 
                                style={{
                                    width: "320px",
                                    height: "320px",
                                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                                    borderRadius: "50%", 
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "16px",
                                    color: "#555",
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(255, 255, 255, 0.5)",
                                    backgroundImage: "url('/images/potseed.png')",
                                    backgroundSize: "80%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    transition: "transform 0.3s ease",
                                    
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
                        </div>

        {/* 설명 텍스트 */}
        <div className={`mt-6 text-center max-w-lg w-full p-4 transition-all duration-700 
          ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} shadow-none`}
          style={{ transitionDelay: "0.6s" }}>
          <p className="text-lg text-black bg-white/30 rounded-lg p-4 w-full shadow-none">
            위 카테고리 중 하나를 선택하여 시뮬레이션을 시작하세요.
          </p>
        </div>



        {/* 카테고리 선택 모달 */}
        {isModalOpen && (
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setActiveCategory(null);
            }}
            selectedCategory={selectedCategory}
            onSelectDifficulty={(difficulty) => {
              router.push(`/chat?category=${selectedCategory}&difficulty=${difficulty}`);
              setIsModalOpen(false);
            }}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}