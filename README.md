# 마케팅 10팀 출퇴근 현황

React + Vite + Tailwind CSS로 제작된 모바일 우선 출퇴근 현황 관리 웹사이트입니다.

## 기능

- 📱 모바일 화면에 최적화된 반응형 디자인
- 📅 주간 캘린더 (월~금)
- 👥 팀원 7명 상태 관리
- 💾 localStorage를 통한 데이터 자동 저장
- 🎨 직관적인 UI/UX
- 🌤️ 서울 날씨 정보 실시간 표시 (OpenWeatherMap API)
- 🌡️ 각 날짜별 최고/최저 기온 표시

## 팀원

- 김서영 (팀장)
- 김재훈 (SM)
- 오준헌 (매니저)
- 이예림 (매니저)
- 오유미 (매니저)
- 유수정 (매니저)
- 변자영 (매니저)

## 상태 옵션

### 근무 상태
- 🏢 출근
- 🏠 재택
- 🌴 연차
- 🌅 오전반차
- 🌆 오후반차
- 💼 미팅
- 🔄 오전재택-오후출근 (전일 야근)

### 실시간 상태
- 🍽️ 점심식사중
- 🍴 저녁식사중
- 🚶 사무실이동중

## 설치 및 실행

### 방법 1: 즉시 실행 (Node.js 불필요)

**가장 간단한 방법!** `index-standalone.html` 파일을 브라우저에서 바로 열기:

1. 파일 탐색기에서 `index-standalone.html` 파일을 찾기
2. 파일을 더블클릭하거나 우클릭 → "연결 프로그램" → "Chrome" 또는 다른 브라우저 선택
3. 바로 사용 가능! ✨

### 방법 2: Vite 개발 서버 (Node.js 필요)

Node.js가 설치되어 있다면:

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 사용 방법

1. 각 날짜 카드에서 팀원 이름을 클릭합니다.
2. 나타나는 상태 선택 메뉴에서 원하는 상태를 선택합니다.
3. 데이터는 자동으로 브라우저의 localStorage에 저장됩니다.
4. 화살표 버튼으로 이전/다음 주를 탐색할 수 있습니다.
5. "1/13 주로 이동" 버튼으로 시작 주(2026년 1월 13일)로 돌아갈 수 있습니다.

## 기술 스택

- React 18
- Vite 5
- Tailwind CSS 3

## 배포 방법

자세한 배포 가이드는 [DEPLOYMENT.md](DEPLOYMENT.md)를 참고하세요.

### 빠른 배포 (드래그 앤 드롭)
```bash
npm install
npm run build
```
그 다음 `dist` 폴더를 https://vercel.com/new 에 드래그 앤 드롭!

### Vercel CLI 배포
```bash
npm install -g vercel
vercel login
npm run deploy
```
