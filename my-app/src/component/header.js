"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryModal from "./CategoryModal";

// 🔹 카테고리 목록
const categories = [
  { name: "중국집 주문", value: "restaurant" },
  { name: "병원 문의", value: "hospital" },
  { name: "은행", value: "bank" },
];

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  // 🔹 모달 열기
  const handleOpenModal = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setIsModalOpen(true);
  };

  // 🔹 난이도 선택 후 /chat으로 이동
  const handleSelectDifficulty = (difficulty) => {
    if (!selectedCategory || !difficulty) return;
    router.push(`/chat?category=${selectedCategory}&difficulty=${difficulty}`);
    setIsModalOpen(false);
  };

  return (
    <header className="p-4 bg-purple-200 flex justify-center">
      <div className="flex gap-4">
        {categories.map(({ name, value }) => (
          <button
            key={value}
            className="bg-gray-400 text-black px-6 py-2 rounded-lg shadow hover:bg-gray-500 transition duration-200"
            onClick={() => handleOpenModal(value)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 🔹 난이도 선택 모달 */}
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCategory={selectedCategory}
          onSelectDifficulty={handleSelectDifficulty}
        />
      )}
    </header>
  );
};

export default Header;
