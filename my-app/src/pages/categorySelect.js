"use client";
import "../styles/globals.css"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryModal from "@/component/CategoryModal";
import Footer from "@/component/footer";

// 🔹 카테고리 목록 (API에 맞게 값 설정)
const categories = [
  { name: "중국집 주문", value: "restaurant" },
  { name: "병원 문의", value: "hospital" },
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
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">포비아</h1>

      {/* 카테고리 버튼들 */}
      <div className="flex gap-4 mt-4">
        {categories.map(({ name, value }) => (
          <button
            key={value}
            className="bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition duration-200"
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
          className="w-[400px] h-[400px] bg-gray-300 rounded-full flex justify-center items-center shadow-lg mt-5"
          style={{
            backgroundImage: "url('/images/seed.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <Footer />
    </div>
  );
}
