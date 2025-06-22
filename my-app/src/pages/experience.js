"use client";
import MainTopBar from "@/component/MainTopBar";
import "../styles/globals.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperiencePage() {
  const [currentTab, setCurrentTab] = useState("script");

  return (
    <div className="w-screen justify-end bg-white" style={{ paddingTop: "220px" }}>
      {/* ✅ MainTopBar */}
      <MainTopBar showMicNotice={false} />

      {/* 오른쪽 상단에 수동 배치된 구름 + 탭 버튼 메뉴 */}
        <div
        style={{
            position: "absolute",
            top: "170px",      // 원하는 Y 위치로 조정
            right: "18px",     // 원하는 X 위치로 조정
            zIndex: 50,
        }}
        className="flex gap-2 items-end"
        >
       

        {/* 탭 버튼들 */}
        {["script", "word", "summary"].map((tab) => (
            <div key={tab} className="relative">
            {/* 구름 아이콘 - 현재 탭일 때만 표시 */}
            {currentTab === tab && (
              <img
                src="/images/cloud.png"
                alt="cloud"
                className="absolute bottom-full mb-1 w-12 h-12"
                style={{ top: "-110%", right: "50%", transform: "translateX(50%)" }}
              />
            )}
      
            <button
            
            onClick={() => setCurrentTab(tab)}
            className="px-6 py-2 rounded-lg"
            style={{
                backgroundColor: currentTab === tab ? "#91D3F0" : "#ffffff",
                color: currentTab === tab ? "#ffffff" : "#91D3F0",
                border: "1.5px solid #9FDDFF",
                fontWeight: "600",
            }}
            >
            {tab === "script" && "대화 스크립트"}
            {tab === "word" && "워드 클라우드"}
            {tab === "summary" && "수치 요약"}
            </button>
            </div>
        ))}
        </div>


      {/* ✅ 콘텐츠 영역 */}
      <div className="w-full max-w-6xl mx-auto px-4">
        {currentTab === "script" && (
          <div
            className="border-2 rounded-lg p-6"
            style={{ borderColor: "#9FDDFF", backgroundColor: "#ffffff" }}
          >
            {/* 대화 내용 */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">☁️</div>
                <div
                  className="px-4 py-3 rounded-lg leading-relaxed max-w-xl"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1.5px solid #9FDDFF",
                    color: "#333333",
                  }}
                >
                  별빛이 흐르는 다리를 건너 바람 부는 갈대 숲을 지나. <br />
                  언제나 나를, 언제나 나를 기다리던 너의 아파트
                </div>
              </div>
            ))}
            <div className="text-center text-gray-500 text-sm mt-2">
              여기서 대화가 종료되었어요.
            </div>
          </div>
        )}

        {currentTab === "word" && (
        <div className="px-4"> {/* ✅ 바깥 테두리 제거하고 여백만 유지 */}
            <div className="flex flex-row gap-6">
            {/* 왼쪽: 워드 클라우드 박스 */}
            <div className="flex-1 min-h-[400px] border-2 rounded-lg relative" style={{ borderColor: "#9FDDFF" }}>
                {/* 워드 클라우드 더미 데이터 */}
                <div className="relative w-full h-full p-4">
                {[
                    { text: "죽고싶어", size: "text-4xl", top: "40%", left: "30%" },
                    { text: "불안해", size: "text-2xl", top: "20%", left: "20%" },
                    { text: "살기 싫어", size: "text-xl", top: "60%", left: "50%" },
                    { text: "괴롭힘", size: "text-lg", top: "30%", left: "60%" },
                    { text: "학교", size: "text-base", top: "70%", left: "40%" },
                    { text: "죽으면그만이야", size: "text-base", top: "10%", left: "50%" },
                    { text: "아니 근데", size: "text-lg", top: "80%", left: "20%" },
                    { text: "내가이걸왜", size: "text-base", top: "60%", left: "70%" },
                ].map((word, idx) => (
                    <div
                    key={idx}
                    className={`absolute ${word.size} font-semibold text-sky-600`}
                    style={{ top: word.top, left: word.left }}
                    >
                    {word.text}
                    </div>
                ))}
                </div>
            </div>

            {/* 오른쪽: 키워드 리스트 박스 */}
                <div
                style={{
                    width: "300px",
                    marginLeft: "auto",
                    marginRight: "0px",
                    borderWidth: "2px",
                    borderColor: "#9FDDFF",
                }}
                className="rounded-lg p-4 space-y-4"
                >
                {/* 기존 박스 */}
                <div>
                    <h2 className="font-bold text-lg mb-2 text-center">
                    대화 중 가장 많이 사용된 키워드
                    </h2>
                    <ul className="text-base space-y-1">
                    {[
                        ["죽고싶어", "8회"],
                        ["살기 싫어", "7회"],
                        ["불안해", "6회"],
                        ["괴롭힘", "5회"],
                        ["학교", "5회"],
                        ["아니근데", "1회"],
                        ["죽으면그만이야", "1회"],
                        ["내가이걸왜", "1회"],
                    ].map(([word, count], idx) => (
                        <li key={idx} className="flex">
                        <span className="flex-1 text-left">{word}</span>
                        <span className="text-right w-[40px]">{count}</span>
                        </li>
                    ))}
                    </ul>

                </div>

               
                </div>

            </div>
        </div>
        )}



        
{currentTab === "summary" && (
  <div className="relative w-full h-[800px] bg-white border-2 rounded-lg" style={{ borderColor: "#9FDDFF" }}>
    {/* 왼쪽 감정 분포 */}
    <div className="absolute top-[30px] left-[40px] w-[280px] h-[320px] border-2 rounded-lg p-4" style={{ borderColor: "#9FDDFF" }}>
      <h2 className="font-bold text-lg mb-4">감정 분포 그래프</h2>
      <div className="flex justify-center items-center h-[140px]">
        <img src="/images/donut-chart.png" alt="감정 차트" className="w-[120px] h-[120px]" />
      </div>
      <div className="mt-4 text-sm space-y-1 text-gray-700">
        <div>🩵 슬픔 <span className="float-right">40</span></div>
        <div>🩶 불안 <span className="float-right">30</span></div>
        <div>💛 분노 <span className="float-right">20</span></div>
        <div>🤍 무력감 <span className="float-right">10</span></div>
      </div>
    </div>

    {/* 가운데: 부정적 단어 사용률 */}
    <div className="absolute top-[30px] left-[380px] w-[280px] h-[140px] border-2 rounded-lg p-4" style={{ borderColor: "#9FDDFF" }}>
      <h2 className="font-bold text-lg mb-2">부정적 단어 사용률</h2>
      <p className="text-center text-2xl font-bold text-sky-400">
        전체 대화의 <span className="text-3xl">80%</span>
      </p>
      <div className="h-3 bg-sky-100 rounded-full mt-3">
        <div className="h-full bg-sky-400 rounded-full" style={{ width: "80%" }}></div>
      </div>
    </div>

    {/* 가운데: 심리 불안 지수 */}
    <div className="absolute top-[190px] left-[380px] w-[280px] h-[160px] border-2 rounded-lg p-4" style={{ borderColor: "#9FDDFF" }}>
      <h2 className="font-bold text-lg mb-2">심리 불안 지수</h2>
      <div className="flex flex-col items-center">
        <div className="w-[120px] h-[60px] relative">
          <div className="absolute w-full h-full bg-sky-100 rounded-full"></div>
          <div className="absolute w-[92%] h-full bg-sky-400 rounded-full left-0 top-0"></div>
        </div>
        <div className="text-3xl font-bold text-sky-400 mt-2">92점</div>
        <div className="text-sm text-gray-600">매우 높음</div>
      </div>
    </div>

    {/* 오른쪽: 대화 집중도 */}
    <div className="absolute top-[30px] left-[720px] w-[280px] h-[160px] border-2 rounded-lg p-4" style={{ borderColor: "#9FDDFF" }}>
      <h2 className="font-bold text-lg mb-2">대화 집중도</h2>
      <div className="text-center text-sky-400 text-4xl font-bold">90점</div>
      <div className="mt-3 text-sm text-gray-600 border-t pt-2">
        <div className="flex justify-between"><span>대화 일관성</span><span>80%</span></div>
        <div className="flex justify-between"><span>감정 표현 명료도</span><span>90%</span></div>
      </div>
    </div>

    {/* 오른쪽 아래: 상담 필요도 */}
    <div className="absolute top-[220px] left-[720px] w-[280px] h-[140px] border-2 rounded-lg p-6 flex flex-col items-center justify-center" style={{ borderColor: "#9FDDFF" }}>
      <div className="text-red-500 text-5xl mb-2">❗</div>
      <div className="text-center text-lg font-semibold text-gray-800 leading-relaxed">
        최대한 빠른 시일 내에 <br />상담이 필요해요.
      </div>
    </div>
  </div>
)}






      </div>
    </div>
  );
}
