"use client";
import MainTopBar from "@/component/MainTopBar";

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

    const [currentTab, setCurrentTab] = useState('script');


    // 홈으로 돌아가기 버튼
    const goToHome = () => {
        router.push('/');
    };

    // 새 대화하기 버튼
    const startNewChat = () => {
        router.push('/');
    };

    return (
        <div className="w-screen bg-white relative" style={{ paddingTop: "220px" }}>

        <MainTopBar showMicNotice={false} />

        {/* 🔹 탭 메뉴 */}
        <div className="flex justify-end w-full mt-10 mb-6 pr-6 z-10">
        <div className="flex gap-2">
            <button
                style={{
                backgroundColor: currentTab === 'script' ? '#91D3F0' : '#ffffff',
                color: currentTab === 'script' ? '#ffffff' : '#91D3F0',
                border: '1.5px solid #9FDDFF',
                fontWeight: '600'
                }}
                className="px-4 py-2 rounded-lg "
                onClick={() => setCurrentTab('script')}
            >
                대화 스크립트
            </button>

            <button
                style={{
                backgroundColor: currentTab === 'word' ? '#91D3F0' : '#ffffff',
                color: currentTab === 'word' ? '#ffffff' : '#91D3F0',
                border: '1.5px solid #9FDDFF',
                fontWeight: '600'
                }}
                className="px-4 py-2 rounded-lg "
                onClick={() => setCurrentTab('word')}
            >
                워드 클라우드
            </button>

            <button
                style={{
                backgroundColor: currentTab === 'summary' ? '#91D3F0' : '#ffffff',
                color: currentTab === 'summary' ? '#ffffff' : '#91D3F0',
                border: '1.5px solid #9FDDFF',
                fontWeight: '600'
                }}
                className="px-4 py-2 rounded-lg "
                onClick={() => setCurrentTab('summary')}
            >
                수치 요약
            </button>
        </div>
        </div>
       


        {/* 말풍선 콘텐츠 */}
        <div className="w-full max-w-5xl mt-4 border-2 rounded-lg p-6 "
            style={{
                borderColor: "#9FDDFF", // 외곽 박스 테두리
                backgroundColor: "#ffffff" // 전체 박스 배경
            }}
            >
            <div className="flex items-start gap-3 mb-6">
                {/* 말풍선 왼쪽 아이콘 */}
                <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                    backgroundColor: "#ffffff", // 구름 원 배경색
                    color: "#ffffff", // 아이콘 색상
                    fontSize: "18px"
                }}
            >
            ☁️
            </div>

            {/* 말풍선 본문 */}
            <div
            className="px-4 py-3 rounded-lg leading-relaxed max-w-xl"
            style={{
                backgroundColor: "#ffffff", // 말풍선 배경색
                border: "1.5px solid ##9FDDFF", // 테두리
                color: "#333333" // 텍스트 색
            }}
            >
            별빛이 흐르는 다리를 건너 바람 부는 갈대 숲을 지나.<br />
            언제나 나를, 언제나 나를 기다리던 너의 아파트
            </div>
        </div>

        {/* 종료 안내 텍스트 */}
        <div
            className="text-center mt-4"
            style={{
            color: "#999999", // 안내 메시지 색상
            fontSize: "15px"
            }}
        >
            여기서 대화가 종료되었어요.
        </div>
        </div>
    </div>
    )
}