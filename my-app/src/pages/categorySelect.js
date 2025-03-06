"use client";
import "../styles/globals.css"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryModal from "@/component/CategoryModal";
import Footer from "@/component/footer";
import Title from "@/component/Title"; 
// 🔹 카테고리 목록 (API에 맞게 값 설정)
const categories = [
  { name: "중국집 주문", value: "restaurant" },
  { name: "병원 문의", value: "hospital" },
  { name: "은행", value: "bank" },
];

export default function CategorySelectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  // 🔹 모달 열기
  const handleOpenModal = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setIsModalOpen(true);
  };

  // 🔹 난이도 선택 후 /chat 이동
  const handleSelectDifficulty = (difficulty) => {
    if (!selectedCategory || !difficulty) return;
    router.push(`/chat?category=${selectedCategory}&difficulty=${difficulty}`);
    setIsModalOpen(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16 relative"
      style={{ position: 'relative' }}
    >
      {/* 배경 이미지를 위한 오버레이 div */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/background2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,  
        }}
      />
      
      {/* 기존 컨텐츠를 위한 wrapper div */}
      <div className="relative z-10 flex flex-col items-center w-full">
      <Title>포비야</Title>

        {/* 카테고리 버튼들 */}
        <div className="flex gap-4 mt-4">
          {categories.map(({ name, value }) => (
            <button
              key={value}
              className="bg-gray-400 text-black px-6 py-3 rounded shadow-md hover:bg-gray-500 transition duration-200"
              onClick={() => handleOpenModal(value)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* 카테고리 선택 모달 */}
        {isModalOpen && (
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedCategory={selectedCategory}
            onSelectDifficulty={handleSelectDifficulty}
          />
        )}

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
              backgroundRepeat: "no-repeat",
              position: "relative",
              zIndex: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
