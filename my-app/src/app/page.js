"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <div className="bg-white bg-opacity-60 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">포비야</h1>
        <p className="text-lg text-gray-700 mb-6">함께 모험을 떠나요!</p>

        <button
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:bg-green-700 transition duration-200"
          onClick={() => router.push("/categorySelect")}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
