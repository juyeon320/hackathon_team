import "../styles/globals.css"; // Tailwind CSS 적용

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* 배경을 적용할 컨테이너 추가 */}
        <div
          className="h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background1.jpg')" }}
        >
          {children} {/* 모든 페이지의 내용이 여기에 들어감 */}
        </div>
      </body>
    </html>
  );
}
