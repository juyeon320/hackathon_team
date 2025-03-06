import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    // ✅ 특정 페이지에서만 모달을 띄우도록 설정 (예: "/chat"에서만)
    setShouldShowModal(window.location.pathname === "/chat");
  }, []);

  const handleHomeClick = (e) => {
    if (shouldShowModal) {
      e.preventDefault(); // ✅ 모달을 띄울 때는 기본 이동 막기
      setIsModalOpen(true);
    } else {
      router.push("/categorySelect"); // ✅ 다른 페이지에서는 바로 이동
    }
  };

  const buttons = [
    { imgSrc: "/images/seeds.png", path: "/experience", alt: "작물" },
    { imgSrc: "/images/home.png", path: "/categorySelect", alt: "홈", onClick: handleHomeClick }, // ✅ 홈 버튼에 onClick 추가
    { imgSrc: "/images/c2.png", path: "/hallOfFame", alt: "명예의 전당" },
  ];

  return (
    <>
      {/* ✅ 특정 페이지에서만 모달 표시 */}
      {isModalOpen && shouldShowModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] text-center flex flex-col items-center transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">⚠️ 홈으로 나가시겠습니까?</h2>
            <p className="text-lg text-gray-600 mb-6">기록이 삭제됩니다. 나가려면 확인을 눌러주세요.</p>
            <div className="flex justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/categorySelect"); // ✅ 홈으로 이동
                }} 
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md"
              >
                확인
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-gray-300 text-black px-5 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-md"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "30%",
          borderRadius: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "20px 0",
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
            padding: "0 24px",
          }}
        >
          {buttons.map((button, index) => (
            <Link
              key={index}
              href={button.path}
              onClick={button.onClick} // ✅ 클릭 이벤트 추가
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img 
                src={button.imgSrc} 
                alt={button.alt} 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }} 
              />
            </Link>
          ))}
        </div>
      </footer>
    </>
  );
};

export default Footer;