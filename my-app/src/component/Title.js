"use client"; // 👈 클라이언트 컴포넌트 설정 추가

export default function Title({ children }) {
  return (
    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg font-hakgyo">
      {children}
    </h1>
  );
}
