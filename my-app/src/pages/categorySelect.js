"use client";
import "../styles/globals.css"; 
import { useState } from "react";
import CategoryModal from "@/component/CategoryModal";
import Footer from "@/component/footer";
const categories = ["주문 하기", "환불 하기", "정보 요청하기", "안부전화 드리기", "기타"];

export default function CategorySelectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-6">포비아</h1>

      {/* 카테고리 버튼들 */}
      <div className="flex gap-4 mt-4">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-gray-400 text-black px-6 py-3 rounded shadow-md hover:bg-gray-500 transition duration-200"
            onClick={() => {
              setSelectedCategory(category);
              setIsModalOpen(true);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 카테고리 선택 모달 */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
      />

      {/* 중앙 원형 이미지 */}
      <div className="flex flex-col items-center justify-center mt-12">
  <div 
    style={{
      width: "400px",
      height: "400px",
      backgroundColor: "#ddd", 
      borderRadius: "50%", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      color: "#555",
      marginTop: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 그림자 추가
      backgroundImage: "url('/images/dummy1.jpeg')", // 이미지 추가
      backgroundSize: "cover", // 이미지가 div에 꽉 차도록 설정
      backgroundPosition: "center", // 이미지 중앙 정렬
    }}
  >
  </div>
</div>


      <Footer />
    </div>
  );
}
