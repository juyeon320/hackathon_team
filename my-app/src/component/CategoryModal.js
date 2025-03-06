"use client";

import { useRouter } from "next/navigation";

const difficultyLevels = ["high", "middle", "low"];

const CategoryModal = ({ isOpen, onClose, selectedCategory }) => {
  const router = useRouter();

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링 안 함

  const handleSelectDifficulty = (level) => {
    router.push(`/chat?category=${selectedCategory}&difficulty=${level}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
     style={{ zIndex: 50 }} // 🔥 모달의 z-index를 높임
>
  <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
    <h2 className="text-2xl font-bold mb-4">난이도 선택</h2>

    <p className="text-lg mb-6">{selectedCategory}</p>

    <div className="flex justify-center gap-6">
      {difficultyLevels.map((level) => (
        <button
          key={level}
          className="bg-white border-2 border-gray-400 px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
          onClick={() => handleSelectDifficulty(level)}
        >
          {level}
        </button>
      ))}
    </div>

    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-black text-xl"
    >
      ✕
    </button>
  </div>
</div>

  );
};

export default CategoryModal;
