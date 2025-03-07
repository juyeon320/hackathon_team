import "../styles/globals.css"; // Tailwind CSS 적용
import { Inter } from 'next/font/google'; // 웹 폰트 추가

// 폰트 설정
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 폰트 로딩 중 텍스트 표시 개선
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* 배경을 적용할 컨테이너 추가 */}
        <div
          className="h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background2.jpg')" }}
        >
          {children} {/* 모든 페이지의 내용이 여기에 들어감 */}
        </div>
      </body>
    </html>
  );
}