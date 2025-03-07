"use client";

import "../styles/globals.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/component/footer";
import Image from "next/image";

// Firebase 연동 함수
import { getSepXP, updateSepXP } from "@/utils/firebase";

export default function ExperiencePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const difficulty = searchParams.get("difficulty");

    // 난이도별 설정: XP 증가량, 최대치, 진행바 색상
    const xpValues = {
        "하": { xp: 50, maxXp: 500, color: "#4caf50" },
        "중": { xp: 100, maxXp: 500, color: "#2196f3" },
        "상": { xp: 200, maxXp: 600, color: "#ff9800" },
    };

    // Firestore에서 불러올 sep 유저의 기존 XP
    const [oldXP, setOldXP] = useState(0);
    const [addedXP, setAddedXP] = useState(0);
    const [newXP, setNewXP] = useState(0);
    const [animatedXP, setAnimatedXP] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    // 난이도에 따른 UI 값
    const targetXP = xpValues[difficulty]?.xp || 50;       // 이번에 더할 XP
    const maxXP = xpValues[difficulty]?.maxXp || 500;    // 최대 XP
    const barColor = xpValues[difficulty]?.color || "#4caf50";

    // 진행바(%) 계산 => animatedXP를 기준으로
    const xpPercentage = (animatedXP / maxXP) * 100;

    // [1] 페이지 로드 시 Firestore에서 sep XP 불러오기
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const currentXP = await getSepXP();
                setOldXP(currentXP);
                setIsLoading(false);
            } catch (error) {
                console.error("❌ getSepXP error:", error);
                setIsLoading(false);
            }
        })();
    }, []);

    // [2] oldXP가 준비되면 => 처음 애니메이션 (0→oldXP)
    useEffect(() => {
        if (oldXP > 0 && newXP === 0) {
            animateXP(0, oldXP);
        }
    }, [oldXP]);

    // [3] 난이도 파라미터가 생기면 => addedXP 계산 + Firestore 업데이트
    useEffect(() => {
        if (!difficulty) return; // URL 파라미터가 없으면 종료

        const finalXP = oldXP + targetXP;
        setAddedXP(targetXP);
        setNewXP(finalXP);

        // Firestore 업데이트
        updateSepXP(finalXP).catch((err) => {
            console.error("❌ updateSepXP error:", err);
        });
    }, [difficulty, oldXP]);

    // [4] newXP가 바뀌면 => oldXP→newXP 애니메이션
    useEffect(() => {
        if (newXP > oldXP) {
            setTimeout(() => {
                animateXP(oldXP, newXP);
                setShowConfetti(true);
                setTimeout(() => {
                    setShowCongrats(true);
                }, 1000);
            }, 1000);
        }
    }, [newXP]);

    // [함수] XP 애니메이션
    function animateXP(fromValue, toValue) {
        const duration = 2000;
        const frameRate = 30;
        const totalFrames = duration / frameRate;
        const increment = (toValue - fromValue) / totalFrames;

        let current = fromValue;
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            current += increment;
            setAnimatedXP(Math.round(current));

            if (frame >= totalFrames) {
                clearInterval(interval);
                setAnimatedXP(toValue);
            }
        }, frameRate);
    }

    // 홈으로 돌아가기 버튼
    const goToHome = () => {
        router.push('/');
    };

    // 새 대화하기 버튼
    const startNewChat = () => {
        router.push('/category');
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16 relative"
            style={{ position: 'relative' }}
        >
            {/* 배경 이미지 */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/images/background3.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.85,
                }}
            />

            {/* 전체 컨테이너 */}
            <div className="relative z-10 flex flex-col items-center w-full">
                {/* 로딩 표시 */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-56">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-white text-lg font-bold">경험치 불러오는 중...</p>
                    </div>
                ) : (
                    <>

                        {/* 획득한 XP 표시 */}
                        <div className="text-center mb-6 relative">
                            <div
                                className="text-6xl font-bold"
                                style={{ 
                                    color: barColor, 
                                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                    animation: showConfetti ? "pulse 2s infinite" : "none"
                                }}
                            >
                                + {addedXP} XP
                            </div>
                            {showConfetti && (
                                <div 
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        color: "#FFD700",
                                        fontSize: "2rem",
                                        animation: "confetti 1s ease-out infinite",
                                        opacity: 0.8
                                    }}
                                >
                                    🎉
                                </div>
                            )}
                        </div>

                        {/* 경험치 표시 */}
                        <div className="text-center mb-2">
                            <span className="text-white font-bold text-xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                                {animatedXP} / {maxXP} XP
                            </span>
                        </div>

                        {/* 경험치 바 */}
                        <div
                            style={{
                                width: "80vw",
                                maxWidth: "700px",
                                height: "28px",
                                backgroundColor: "rgba(245, 245, 245, 0.9)",
                                borderRadius: "14px",
                                overflow: "hidden",
                                border: "2px solid rgba(200, 200, 200, 0.7)",
                                position: "relative",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            <div
                                style={{
                                    width: `${xpPercentage}%`,
                                    height: "100%",
                                    backgroundColor: barColor,
                                    transition: "width 0.3s ease-out",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    paddingRight: "8px"
                                }}
                            >
                                {xpPercentage > 10 && (
                                    <span style={{
                                        color: "#fff",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                                    }}>
                                        {Math.round(xpPercentage)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 중앙 원형 이미지 */}
                        <div className="flex flex-col items-center justify-center" style={{ marginTop: "50px" }}>
                            <div 
                                style={{
                                    width: "320px",
                                    height: "320px",
                                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                                    borderRadius: "50%", 
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "16px",
                                    color: "#555",
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(255, 255, 255, 0.5)",
                                    backgroundImage: "url('/images/potseed.png')",
                                    backgroundSize: "80%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    transition: "transform 0.3s ease",
                                    animation: showConfetti ? "float 3s ease-in-out infinite" : "none"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
                        </div>

                        {/* 버튼 영역 */}
                        <div className="mt-10 flex gap-4">
                            <button
                                onClick={goToHome}
                                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold transition-all hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                
                            </button>
                            <button
                                onClick={startNewChat}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                
                            </button>
                        </div>
                    </>
                )}

                {/* 애니메이션 스타일 */}
                <style jsx>{`
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    @keyframes confetti {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes bounceIn {
                        0% { transform: scale(0.8); opacity: 0; }
                        70% { transform: scale(1.05); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>

                <Footer />
            </div>
        </div>
    );
}