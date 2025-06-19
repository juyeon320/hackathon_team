import "../styles/globals.css"; // Tailwind CSS 적용
import { Inter } from 'next/font/google'; // 웹 폰트 추가
import Link from 'next/link';

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
        
        <div
          className="h-screen bg-cover bg-center"
          style={{ background: '#FFFFFF' }}
        >
          {children} 
        </div>
      </body>
    </html>
  );
}

