// test-prompt.js
import { OpenAI } from "openai";
import * as dotenv from "dotenv";
dotenv.config(); // .env 파일에서 OPENAI_API_KEY 읽어오기

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 테스트용 messages 
const messages = [
  { role: "user", content: "인생이 너무 힘들어. 죽고싶어." },
  { role: "system", content: "혹시 어떤일이 있었는지 말해줄 수 있나요?" },
  { role: "user", content: "친구들이 나를 괴롭히고 나는 항상 혼자야. 더 이상 어떻게 해야될지 모르겠어." },
];

// 분석용 프롬프트 
const analysisPrompt = `
당신은 학생 감정 분석 전문 AI입니다.
아래는 한 학생과 AI의 전체 대화입니다:

${messages.map(m => `${m.role === "user" ? "학생" : "AI"}: ${m.content}`).join("\n")}

이 대화를 분석하여 JSON 형식으로 다음 항목들을 출력하세요:
      1. 감정 분포 (%)
      - 감정 범주 : 슬픔, 불안 분노, 무력감
      - 각 감정이 얼마나 자주 나타나는지 백분율로 표시 
      2. 부정 단어 사용률 (%)
      - 전체 발화 중 부정적인 키워드의 비율 
      - 예: "죽고 싶다", "싫다", "불안하다" 등의 단어 
      3. 대화에서 많이 사용된 주요 키워드 
      - 자주 사용하는 단어와 빈도 (예: "죽고 싶어": 6회)
      4. 심리 불안 지수 (0~100)
      - 감정 강도, 반복 빈도, 단어 수위 등을 기반으로 점수화 
      - 예: 0=낮음, 90>=매우 높음
      5. 대화 집중도 (0~100)
      - 감정 표현의 다양성, 대화 길이, 몰입 정도 기준 
      6. 상담 필요도 등급 
      - "낮음 / 주기적 관찰 / 즉시 상담 필요" 중 하나 
      7. 상담사용 요약문 (300자 이내)
      - 학생의 감정 상태를 상담사가 빠르게 이해할 수 있도록 핵심 내용 요약 

      모든 JSON 항목의 키를 한국어로 작성하세요.
`;

async function main() {
  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: analysisPrompt }
    ],
  });

  console.log("\n 분석 결과:");
  console.log(res.choices[0].message.content);
}

main();
