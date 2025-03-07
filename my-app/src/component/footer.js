"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Check current page
    const path = window.location.pathname;
    setCurrentPage(path);
    
    // Check if modal should be shown (only on chat page)
    setShouldShowModal(path === "/chat");
  }, []);

  const handleHomeClick = (e) => {
    if (shouldShowModal) {
      e.preventDefault();
      setIsModalOpen(true);
    } else {
      router.push("/categorySelect");
    }
  };

  const buttons = [
    { 
      imgSrc: "/images/seeds.png", 
      path: "/experience", 
      alt: "성장", 
      label: "성장"
    },
    { 
      imgSrc: "/images/home.png", 
      path: "/categorySelect", 
      alt: "홈", 
      onClick: handleHomeClick,
      label: "홈"
    },
    { 
      imgSrc: "/images/c2.png", 
      path: "/hallOfFame", 
      alt: "명예의 전당",
      label: "명예의 전당"
    },
  ];

  return (
    <>
      {/* Confirmation Modal with animation */}
      {isModalOpen && shouldShowModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn"
          onClick={(e) => {
            // Close when clicking outside the modal
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[320px] md:w-[400px] text-center flex flex-col items-center transform transition-all duration-300 animate-scaleIn">
            <div className="text-amber-500 text-4xl mb-3">⚠️</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">홈으로 나가시겠습니까?</h2>
            <p className="text-lg text-gray-600 mb-6">기록이 삭제됩니다. 나가려면 확인을 눌러주세요.</p>
            <div className="flex justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/categorySelect");
                }} 
                className="bg-[#31572C] text-white px-5 py-2 rounded-lg hover:bg-[#2A4A26] active:bg-[#223D20] transition-all duration-200 shadow-md flex-1"
              >
                확인
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-gray-300 text-black px-5 py-2 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition-all duration-200 shadow-md flex-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive footer */}
      <footer
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md rounded-t-3xl bg-white/90 backdrop-blur-md shadow-lg py-3 px-4 z-40"
      >
        <div className="flex justify-around items-center">
          {buttons.map((button, index) => {
            const isActive = currentPage === button.path;
            
            return (
              <Link
                key={index}
                href={button.path}
                onClick={button.onClick}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                          ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'}`}
                aria-label={button.alt}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-1 relative">
                  <Image 
                    src={button.imgSrc} 
                    alt={button.alt} 
                    width={48}
                    height={48}
                    className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                  />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs font-medium">{button.label}</span>
              </Link>
            );
          })}
        </div>
      </footer>
    </>
  );
};

export default Footer;