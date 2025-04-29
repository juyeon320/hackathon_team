# 📞 포비야 (Phobia)

> 전화 공포증(Call Phobia)을 극복하고 싶은 사람들을 위한 **AI 전화 시뮬레이션 서비스**

## 🗓 프로젝트 기간
- v1 : 2025.03.04 ~ 2025.03.07

---

## 📌 개요

**포비야**는 전화 공포증(Call Phobia)을 가진 사용자들이  
실제에 가까운 음성 기반 시뮬레이션을 통해 연습하고 극복할 수 있도록 돕는 서비스입니다.  
사용자는 대화 미션을 수행하며 경험치를 얻고, 작물이 성장함에 따라 성취를 시각적으로 확인할 수 있습니다.

---

## 👥 만든 사람들 
- 팀장 : hazel.jo (조하연)
- 프론트엔드 개발 : hyun.lee (이주현)
- AI API 연동 및 로직 구현 : sep.park (박요셉), aaron.hwang (황지원), yeoni.lee (이주연)
- 배포 : siena.eom (엄시연)

---

## 🚀 주요 기능
|  기능  | 설명 |
|------|------|
| 🗂 **카테고리/난이도 선택** | 사용자는 "중국집", "병원", "은행" 중 카테고리를 고르고, 난이도(친절한/평범한/까칠한)를 선택해 시뮬레이션을 시작할 수 있습니다. |
| 🎙 **음성 기반 시뮬레이션** | Whisper API(STT)를 통해 사용자의 음성을 텍스트로 변환, GPT의 답변을 ElevenLabs API(TTS)로 다시 음성으로 들려줍니다. |
| 🌱 **성장 시스템** | 시뮬레이션을 완료하면 경험치를 얻고, 경험치가 일정 수준을 넘으면 작물이 성장합니다. |
| 🏆 **명예의 전당** | 작물이 완전히 성장하면 ‘졸업’ 처리되며, 명예의 전당에 등록되어 성취감을 제공합니다. |
| ⚠ **중도 종료 방지** | 진행 중 홈으로 나갈 경우 경고 팝업을 띄워 실수 방지를 도와줍니다. |

---


## 🧪 사용 기술

- **프론트엔드**: JavaScript, Next.js, Tailwind CSS
- **AI 챗봇**: OpenAI GPT-3.5 Turbo
  - 난이도 3단계 (친절한, 평범한, 까칠한)
  - CS 응대 매뉴얼 및 상담 데이터를 기반으로 시나리오 구성
- **TTS**: ElevenLabs API (텍스트 → 음성 변환)
- **STT**: Whisper API (음성 → 텍스트 변환)
- **DB**: Firestore (클라우드 실시간 DB)
- **배포**: Vercel (Next.js 배포)

---


## 🛠 실행 방법

```bash
cd my-app
npm install
npm run dev
```

---


## 🖼️ 주요 화면 구성

| Home | Category | Modal |
|------|--------|-------|
| <img width="1509" alt="스크린샷 2025-03-07 15 23 35" src="https://github.com/user-attachments/assets/fd658f45-90f5-4833-bf3b-d4dffc4bdeb8" /> | <img width="1510" alt="스크린샷 2025-03-07 15 16 24" src="https://github.com/user-attachments/assets/e5c9bf5f-1904-4ffd-b9f5-e5e643c32211" /> | <img width="1503" alt="스크린샷 2025-03-07 15 16 53" src="https://github.com/user-attachments/assets/7dcae7d9-7085-4697-8c25-87506c6230aa" /> |
| 메인 페이지 | 카테고리 선택 페이지 | 카테고리 선택 모달 | 


| Simulation | Level | Hall of Fame |
|------|--------|-------|
| <img width="1510" alt="스크린샷 2025-03-07 15 16 59" src="https://github.com/user-attachments/assets/6800761b-3e1f-45ad-8471-1786873122f9" /> | <img width="1509" alt="스크린샷 2025-03-07 15 16 38" src="https://github.com/user-attachments/assets/202078b7-0528-42e3-8d7d-b8fa56f3e625" /> | <img width="1505" alt="스크린샷 2025-03-07 15 16 44" src="https://github.com/user-attachments/assets/53def9f4-78aa-4f88-b7bf-5205ff6ee620" /> |
| 시뮬레이션 | 작물 키우기 | 명예의 전당 | 






























