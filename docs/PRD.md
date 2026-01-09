# 날씨 정보 애플리케이션 PRD (Product Requirements Document)

## 1. 프로젝트 개요 (Overview)

기상 Open API와 대한민국 행정구역 데이터를 활용하여 사용자의 현재 위치 및 검색한 장소의 상세 날씨 정보를 제공하고, 자주 찾는 장소를 즐겨찾기로 관리할 수 있는 웹 애플리케이션입니다.

### 1.1. 목적

- 개발자의 React + TypeScript 활용 능력 및 FSD(Feature Sliced Design) 아키텍처 적용 능력 확인.
- Tanstack Query를 활용한 서버 상태 관리 능력 검증.
- 반응형 웹 UI/UX 구현 능력 평가.

---

## 2. 사용자 시나리오 (User Stories)

1. **내 위치 날씨 확인**: 사용자는 앱 접속 시 본인의 현재 위치(GPS)에 기반한 상세 날씨 정보를 즉시 확인할 수 있다.
2. **장소 검색**: 사용자는 시/군/구/동 단위로 대한민국 지역을 검색하여 리스트에서 선택할 수 있다.
3. **상세 날씨 조회**: 선택한 장소의 현재 기온, 최저/최고 기온, 시간대별 기온 변화를 볼 수 있다.
4. **즐겨찾기 관리**:
   - 조회한 장소를 즐겨찾기에 추가하여 메인 화면에서 요약 정보를 빠르게 확인할 수 있다.
   - 즐겨찾기 장소의 별칭(Nickname)을 수정하여 나만의 이름으로 관리할 수 있다.
   - 더 이상 필요 없는 장소는 삭제할 수 있다.

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1. 위치 및 기본 날씨 정보

- **초기 진입**: 브라우저의 Geolocation API를 사용하여 사용자 좌표 획득 후 해당 지역 날씨 표시.
- **날씨 데이터 표시**:
  - 현재 기온
  - 금일 최고 기온 / 최저 기온
  - 시간대별 기온 (Hourly Forecast)

### 3.2. 지역 검색 (Search)

- **데이터 소스**: 제공된 `korea_districts.json` 파일을 기반으로 검색.
- **검색 범위**: ‘도/시’, ‘시/군/구’, ‘읍/면/동’ 전체 레벨에서 검색 가능 (예: "종로구", "서울특별시", "청운동").
- **검색 결과**:
  - 검색어와 매칭되는 지역 리스트를 UI에 표시.
  - 검색 결과 클릭 시 해당 지역의 상세 날씨 정보 화면으로 전환(또는 표시).
- **예외 처리**: 일치하는 지역이 없거나 날씨 데이터가 없는 경우 “해당 장소의 정보가 제공되지 않습니다.” 메시지 표시.

### 3.3. 즐겨찾기 (Favorites)

- **추가/삭제**: 검색된 장소를 즐겨찾기에 추가 및 삭제 가능.
- **제한**: 최대 6개까지만 저장 가능 (6개 초과 시 추가 불가 알림 또는 오래된 순 삭제 등 정책 필요, 기본: 추가 불가 안내).
- **카드 UI**: 즐겨찾기 된 장소는 카드 형태의 요약 UI로 표시.
  - 표시 정보: 지역명(또는 별칭), 현재 기온, 최저/최고 기온.
- **별칭 수정**: 저장된 즐겨찾기 아이템의 이름 수정 기능.
- **상세 이동**: 카드 클릭 시 상세 날씨 페이지(Route)로 이동.

---

## 4. 기술 명세 (Technical Specifications)

### 4.1. 기술 스택 (Tech Stack)

- **Core**: React (Functional Component), TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State Management (Server)**: Tanstack Query (React Query) v5
- **Design Pattern**: FSD (Feature Sliced Design) 아키텍처 준수

### 4.2. 아키텍처 구조 (FSD)

프로젝트는 `src` 하위에 다음과 같은 레이어로 구성:

- **app/**: 전역 설정, Provider, Router 진입점.
- **pages/**: 라우팅 단위의 페이지 컴포넌트 (MainPage, DetailPage 등).
- **widgets/**: 페이지를 구성하는 독립적인 UI 블록 (Header, WeatherDashboard, FavoritesList).
- **features/**: 사용자 비즈니스 로직 단위 (WeatherSearch, AddFavorite, EditFavoriteAlias).
- **entities/**: 도메인 데이터 모델 및 UI (WeatherCard, LocationModel 등).
- **shared/**: 재사용 가능한 유틸리티, UI 키트(Button 등 shadcn/ui), API 클라이언트.

### 4.3. API 및 데이터

- **Weather API**: OpenWeatherMap (혹은 기상청 단기예보 조회 서비스) 사용.
  - _Note: OpenWeatherMap One Call API 3.0은 결제 등록이 필요하므로, 2.5 Weather/Forecast API를 조합하여 구현 고려._
- **Geocoding**: `korea_districts.json`에 포함된 좌표(위경도) 혹은 행정구역 코드를 사용하여 날씨 API 요청 매핑.

### 4.4. 반응형 디자인 (Responsive)

- **Breakpoint**: Tailwind CSS
- **Layout**:
  - Desktop: 넓은 화면 활용 (그리드 레이아웃, 사이드바 등).
  - Mobile: 세로 스크롤 위주의 레이아웃.

---

## 5. UI/UX 요구사항

- **디자인 시스템**: Shadcn UI + Tailwind CSS 조합 사용 (기존 설정 유지).
- **인터랙션**:
  - 로딩 시 Skeleton UI 또는 Spinner 제공.
  - 에러 발생 시 Toast 메시지 또는 에러 바운더리 처리.
  - 즐겨찾기 카드 Hover 효과 및 부드러운 전환 애니메이션.

---

## 6. 개발 로드맵 (Milestones)

1. **Step 1: 환경 설정 및 공통 컴포넌트**

   - Vite + TS + Tailwind + Shadcn 설정 (완료).
   - FSD 폴더 구조 세팅.
   - API Client (Axios) 및 React Query 설정.

2. **Step 2: 데이터 레이어 구현**

   - `korea_districts.json` 파싱 및 유틸리티 구현.
   - OpenWeatherMap API 연동.

3. **Step 3: 핵심 기능 - 검색 및 조회**

   - 검색창 (Autocomplete) UI 구현.
   - 위치 기반 날씨 조회 기능 구현.

4. **Step 4: 핵심 기능 - 즐겨찾기**

   - LocalStorage를 활용한 즐겨찾기 CRUD 구현.
   - 즐겨찾기 카드 및 별칭 수정 기능.

5. **Step 5: 페이지 조립 및 반응형 대응**

   - 상세 페이지 라우팅.
   - 모바일/데스크탑 뷰 최적화.

6. **Step 6: 문서화 및 최적화**
   - README 작성.
   - 코드 리팩토링 및 린트 점검.
