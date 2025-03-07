/*"use client";

import { useRouter } from "next/navigation";

const difficultyLevels = {
  high: "까칠한",
  middle: "평범한",
  low: "온순한"
};

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

        <p className="text-lg mb-6">&nbsp;</p>


        <div className="flex justify-center gap-6">
          {Object.entries(difficultyLevels).map(([level, label]) => (
            <button
              key={level}
              className="bg-white border-2 border-gray-400 px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
              onClick={() => handleSelectDifficulty(level)}
            >
              {label}
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

export default CategoryModal;*/

"use client";

import { useEffect } from "react";
import Image from "next/image";

const difficultyLevels = {
  low: { label: "친절한", icon: "😊", description: "대화가 천천히 진행되고 도움을 많이 받습니다." },
  middle: { label: "평범한", icon: "😐", description: "일반적인 속도로 진행됩니다." },
  high: { label: "까칠한", icon: "😠", description: "빠른 대화와 더 도전적인 상황을 경험합니다." }
};

const CategoryModal = ({ isOpen, onClose, selectedCategory, onSelectDifficulty }) => {
  // 키보드 ESC를 눌러 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const getCategoryLabel = () => {
    const categories = {
      "restaurant": "중국집",
      "hospital": "병원",
      "bank": "은행"
    };
    return categories[selectedCategory] || selectedCategory;
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn"
      onClick={(e) => {
        // Click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center relative animate-scaleIn">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">난이도 선택</h2>
        <p className="text-gray-600 mb-6">
          {getCategoryLabel()} 상황에 맞는 난이도를 선택해주세요
        </p>

        <div className="grid grid-cols-1 gap-4 mb-4">
          {Object.entries(difficultyLevels).map(([level, { label, icon, description }]) => (
            <button
              key={level}
              className="bg-white border-2 border-gray-300 p-4 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center text-left"
              onClick={() => onSelectDifficulty(level)}
            >
              <div className="text-3xl mr-4">{icon}</div>
              <div>
                <div className="font-bold text-lg">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;