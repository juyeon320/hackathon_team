"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      
      {/* 텍스트 */}
      <h1 className="text-5xl font-bold text-gray-800 mb-4">포비야</h1>
      <p className="text-lg text-gray-700 mb-6">함께 모험을 떠나요!</p>

      {/* 중앙 이미지 추가 */}
      <Image 
            src="/images/homeimage.jpg"  // 원하는 이미지 경로로 변경
            alt="포비야 로고"
            width={300}  // 원하는 크기로 조정
            height={300}
            className="mb-6"
            priority
          />

      {/* 시작 버튼 */}
      <button
        className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:bg-green-700 transition duration-200"
        onClick={() => router.push("/categorySelect")}
      >
        시작하기
      </button>
    </div>
  );
}
