"use client";

import "../styles/globals.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/component/footer";

// 🔹 Firebase 연동 함수 (직접 만든 getSepXP, updateSepXP)
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

    // 🔹 Firestore에서 불러올 sep 유저의 기존 XP
    const [oldXP, setOldXP] = useState(0);

    // 🔹 난이도 선택 시 새로 더해질 XP (50, 100, 200)
    const [addedXP, setAddedXP] = useState(0);

    // 🔹 최종 XP (oldXP + addedXP)
    const [newXP, setNewXP] = useState(0);

    // 🔹 애니메이션으로 표시될 XP
    const [animatedXP, setAnimatedXP] = useState(0);

    // 🔹 난이도에 따른 UI 값
    const targetXP = xpValues[difficulty]?.xp || 50;       // 이번에 더할 XP
    const maxXP = xpValues[difficulty]?.maxXp || 500;    // 최대 XP
    const barColor = xpValues[difficulty]?.color || "#4caf50";

    // 🔹 진행바(%) 계산 => animatedXP를 기준으로
    const xpPercentage = (animatedXP / maxXP) * 100;

    // ----------------------------------------------------------
    // 🔹 [1] 페이지 로드 시 Firestore에서 sep XP 불러오기
    useEffect(() => {
        (async () => {
            try {
                const currentXP = await getSepXP();  // 예: 300
                setOldXP(currentXP);
            } catch (error) {
                console.error("❌ getSepXP error:", error);
            }
        })();
    }, []);

    // ----------------------------------------------------------
    // 🔹 [2] oldXP가 준비되면 => 처음 애니메이션 (0→oldXP)
    useEffect(() => {
        if (oldXP > 0 && newXP === 0) {
            animateXP(0, oldXP);
        }
    }, [oldXP]);

    // ----------------------------------------------------------
    // 🔹 [3] 난이도 파라미터가 생기면 => addedXP 계산 + Firestore 업데이트
    useEffect(() => {
        if (!difficulty) return; // URL 파라미터가 없으면 종료 (예: /experience?difficulty=중)

        const finalXP = oldXP + targetXP;
        setAddedXP(targetXP);
        setNewXP(finalXP);

        // Firestore 업데이트
        updateSepXP(finalXP).catch((err) => {
            console.error("❌ updateSepXP error:", err);
        });
    }, [difficulty, oldXP]);

    // ----------------------------------------------------------
    // 🔹 [4] newXP가 바뀌면 => oldXP→newXP 애니메이션
    useEffect(() => {
        if (newXP > oldXP) {
            animateXP(oldXP, newXP);
        }
    }, [newXP]);

    // ----------------------------------------------------------
    // 🔹 [함수] XP 애니메이션
    // fromValue → toValue (2초, 30fps)
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
            setAnimatedXP(current);

            if (frame >= totalFrames) {
                clearInterval(interval);
                setAnimatedXP(toValue);
            }
        }, frameRate);
    }

    // ----------------------------------------------------------
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center pt-16 relative"
            style={{ position: 'relative' }}
        >
            {/* --- 배경 이미지를 위한 오버레이 div (디자인) --- */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/images/background3.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.85,
                }}
            />

            {/* --- 전체 컨테이너 --- */}
            <div className="relative z-10 flex flex-col items-center w-full">
                {/* [이번에 획득한 XP 표시] */}
                <div className="text-center mb-6">
                    <div
                        className="text-5xl font-bold"
                        style={{ color: barColor, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                    >
                        + {Math.round(animatedXP)} XP
                    </div>
                </div>



                {/* --- 경험치 바 (디자인) --- */}
                <div
                    style={{
                        width: "1000px",
                        height: "24px",
                        backgroundColor: "rgba(245, 245, 245, 0.9)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "2px solid rgba(200, 200, 200, 0.7)",
                        position: "relative",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
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
                                fontSize: "12px",
                                fontWeight: "bold",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                            }}>
                {Math.round(xpPercentage)}%
              </span>
                        )}
                    </div>
                </div>

                {/* --- 중앙 원형 이미지 (디자인) --- */}
                <div className="flex flex-col items-center justify-center mt-12">
                    <div
                        style={{
                            width: "400px",
                            height: "400px",
                            backgroundColor: "rgba(240, 240, 240, 0.7)",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "16px",
                            color: "#555",
                            marginTop: "20px",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(255, 255, 255, 0.4)",
                            backgroundImage: "url('/images/potseed.png')",
                            backgroundSize: "300px 300px",
                            backgroundPosition: "center",
                            transition: "transform 0.3s ease",
                            backgroundRepeat: "no-repeat",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {/* 필요 시 내부 컨텐츠 */}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
