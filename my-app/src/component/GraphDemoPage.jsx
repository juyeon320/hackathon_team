"use client";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar,
  } from "recharts";
import React from "react";
import { Customized } from "recharts";
import { PolarAngleAxis } from "recharts";


const COLORS = ["#A3D8FF", "#008ECC", "#FFF2B2", "#D7F0FF"];

const emotionData = [
  { name: "슬픔", value: 40 },
  { name: "불안", value: 30 },
  { name: "분노", value: 20 },
  { name: "무력감", value: 10 },
];
const data = [
  {
    name: "심리 불안",
    value: 92, // 이 값만큼만 채워짐
    fill: "#38BDF8",
  },
];

const negativeWordRatio = 80;
const focusScore = 90;
const anxietyScore = 92;
// 새로 추가
const consultationNeedScore = 85;


export default function GraphDemoPage() {
  return (
    <div className="w-full min-h-50 p-10 bg-white grid grid-cols-3 gap-6 text-gray-800">
      {/* 도넛 그래프 */}
      <div className="col-span-1">
        <h2 className="font-bold text-xl mb-4">감정 분포 그래프</h2>
        <PieChart width={260} height={260}>
          <Pie
            data={emotionData}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={100}
            dataKey="value"
          >
            {emotionData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        
      </div>

      {/* 부정적 단어 사용률 */}
        <div className="col-span-1 flex flex-col">
          <h2 className="font-bold text-lg mb-2 text-left">부정적 단어 사용률</h2>

          {/* 가운데 정렬하는 박스 */}
          <div className="flex flex-col justify-center items-left w-full">
            <div className="text-base text-left mt-10 mb-2">
              전체 대화의 <span className="text-sky-400 font-bold text-2xl">{negativeWordRatio}%</span>
            </div>
            <div className="w-60 h-2 bg-sky-100 rounded-full mt-2">
              <div
                className="h-full bg-[#9FDDFF] rounded-full transition-all"
                style={{ width: `${negativeWordRatio}%` }}
              ></div>
            </div>
          </div>
        </div>


      {/* 세로 막대 그래프 (대화 집중도) */}
      <div className="col-span-1">
        <h2 className="font-bold text-lg mb-4">대화 집중도</h2>
        <BarChart width={40} height={150} data={[{ name: "집중도", score: focusScore }]}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 100]} hide />
          <Bar dataKey="score" fill="#9FDDFF" radius={[10, 10, 0, 0]} barSize={20} />
        </BarChart>
        <div className="text-start text-[#9FDDFF] text-3xl font-bold">{focusScore}점</div>
      </div>

      {/* 감정 데이터 리스트 */}

      <div className="col-span-1 flex flex-col items-start">
        <ul className="mb-4 px-4 py-3 border-2 border-sky-300 rounded-xl w-fit space-y-2 text-sm">
          {emotionData.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></div>
              <div className="flex justify-between w-40">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 반원 그래프 (심리 불안 지수) */}
      <div className="col-span-1 col-start-2">
        <h2 className="font-bold text-lg mb-4">심리 불안 지수</h2>
        <ResponsiveContainer width={300} height={250}>
        <RadialBarChart
            width={300}
            height={180}
            cx={150}
            cy={150}
            innerRadius="70%"
            outerRadius="100%"
            barSize={10}
            data={[{ name: "심리 불안", value: anxietyScore, fill: "#9FDDFF" }]}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]} // 전체 100점 기준
              angleAxisId={0}
              tick={false}
              
            />
            <RadialBar
              background
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
            <text
              x={150}
              y={150}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={28}
              fontWeight="bold"
              fill="#9FDDFF"
            >
              {anxietyScore}점
            </text>
            <text
              x={150}
              y={175}
              textAnchor="middle"
              fontSize={14}
              fill="#"
            >
              매우 높음
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>


      
      {/* 상담 필요도 */}
      <div className="col-span-1 flex flex-col items-start">
        <h2 className="font-bold text-lg mb-2">상담 필요도</h2>
        <div className="w-full flex flex-col items-center">
          <img src="/images/patient.png" alt="상담 필요도" className="w-40 h-auto mb-2" />
          <div className="text-black-200 text-lg">상담이 필요해요</div>
        </div>
      </div>

      
    </div>
  );
}
