# Weather React App

한국 기상청 API와 Kakao 지도 API를 활용한 날씨 정보 웹 애플리케이션입니다.

## 설치 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd weather-react
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 API 키를 설정하세요:

```env
# 기상청 단기예보 API 서비스 키 (필수)
VITE_WEATHER_API_SERVICE_KEY=your_weather_api_service_key

# Kakao REST API 키 (선택)
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

#### API 키 발급 방법

**기상청 API (필수)**

1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. [기상청\_단기예보 조회서비스](https://www.data.go.kr/data/15084084/openapi.do) 활용신청
3. 발급받은 일반 인증키(Decoding)를 `VITE_WEATHER_API_SERVICE_KEY`에 설정

**Kakao API (선택)**

1. [Kakao Developers](https://developers.kakao.com/) 로그인
2. 애플리케이션 추가
3. REST API 키를 `VITE_KAKAO_REST_API_KEY`에 설정
4. 플랫폼 설정에서 Web 플랫폼 추가 (사이트 도메인: `http://localhost:5173`)

> **참고**: Kakao API 키가 없어도 앱은 정상 작동하지만, 로컬 데이터만 사용하여 검색 결과가 제한됩니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 주요 기능

- 실시간 날씨 정보 조회
- 지역 검색 및 즐겨찾기
- 시간대별 날씨 예보
- 위치 기반 자동 검색
- 반응형 UI 디자인

## 기술 스택

- React 19
- TypeScript
- Redux Toolkit
- TanStack Query
- Tailwind CSS
- Vite
