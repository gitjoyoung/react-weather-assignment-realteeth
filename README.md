# Weather Quest - Interactive Weather Quiz

**오늘의 기온을 맞추며 시작하는 인터랙티브 날씨 서비스**

Weather Quest는 단순한 정보 제공을 넘어, 사용자가 날씨와 더 깊이 상호작용할 수 있도록 설계된 차세대 날씨 애플리케이션입니다. 기상청 실시간 데이터를 기반으로 정확한 정보를 제공하며, 대기 시간을 즐거운 퀴즈 경험으로 승화시켰습니다.

## 🚀 주요 차별점

- **인터랙티브 로딩 (Interactive Loading)**: 기상 데이터를 불러오는 동안 현재 기온을 예측해보는 온도 퀴즈 게임. 정답 확인 시 제공되는 다이내믹한 연출.
- **고퀄리티 비주얼 (Premium UI)**: 시즌별 자동 변경되는 테마, 유리 질감의 Glassmorphism 디자인, 그리고 `framer-motion` 기반의 부드러운 애니메이션.
- **24시간 정밀 타임라인**: 현재 시점 기준 전후 12시간, 총 24시간의 기온 및 기상 상태를 한눈에 확인 가능.

---

## 🛠️ 설치 및 설정 방법

### 1. 저장소 클론 및 패키지 설치

```bash
git clone <repository-url>
cd weather-react
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 API 키를 설정하세요:

```env
# 기상청 단기예보 API 서비스 키 (필수)
VITE_WEATHER_API_SERVICE_KEY=your_key

# Kakao REST API 키 (선택)
VITE_KAKAO_REST_API_KEY=your_key
```

#### API 키 발급 방법

**기상청 API (필수)**

1. [공공데이터포털](https://www.data.go.kr/)에서 '기상청\_단기예보 조회서비스' 활용 신청.
2. 발급받은 **일반 인증키(Decoding)**를 사용하세요.

**Kakao API (선택)**

1. [Kakao Developers](https://developers.kakao.com/)에서 REST API 키 발급.
2. Web 플랫폼 추가 (도메인: `http://localhost:5173`).

### 3. 실행

```bash
npm run dev
```

---

## ⚡ 기술 스택 및 성능

- **Stack**: React 19, TypeScript, TanStack Query, Tailwind CSS v4, Framer Motion
- **성능 최적화**:
  - 행정구역 데이터 트리 구조화 (파일 크기 **72% 감소**)
  - 대용량 데이터 Dynamic Import를 통한 초기 로딩 속도 최적화
  - 트리 탐색 기반의 초고속 검색 로직
