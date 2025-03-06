"use client";

import { useState } from "react";
import CategoryModal from "./CategoryModal";

const categories = ["주문하기", "환불하기", "정보요청하기", "안부전화드리기", "기타"];

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <header className="p-4 bg-purple-200 flex justify-center">
      <div className="flex gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-gray-400 text-black px-6 py-2 rounded shadow"
            onClick={() => handleOpenModal(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 모달 */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectDifficulty={setSelectedDifficulty}
      />
    </header>
  );
};

export default Header;
