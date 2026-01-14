# 간단 배포 가이드 (Node.js 없이)

## 🚀 즉시 배포하기

### 방법 1: Vercel 드래그 앤 드롭

1. **배포 폴더 사용**
   - `deploy-standalone` 폴더가 생성되어 있습니다
   - 이 폴더 안에 `index.html` 파일이 있습니다

2. **Vercel에 배포**
   - https://vercel.com/new 로 이동
   - `deploy-standalone` 폴더를 드래그 앤 드롭
   - 프로젝트 이름 입력 (예: `madup-attendance`)
   - "Deploy" 클릭
   - 완료! 🎉

### 방법 2: Netlify Drop

1. https://app.netlify.com/drop 로 이동
2. `deploy-standalone` 폴더를 드래그 앤 드롭
3. 완료! 즉시 배포됨

### 방법 3: GitHub Pages

1. GitHub Repository 생성
2. `index-standalone.html` 파일을 `index.html`로 이름 변경
3. Repository에 업로드
4. Settings → Pages → Source를 "main" branch로 설정
5. 완료!

## 📱 현재 사용 가능한 방법

**로컬에서 바로 실행**
- `index-standalone.html` 파일을 브라우저에서 더블클릭
- 또는 우클릭 → "연결 프로그램" → Chrome/Edge

**모든 기능이 작동합니다:**
- ✅ 날씨 정보
- ✅ localStorage 저장
- ✅ 모든 상태 관리
- ✅ 모달 및 애니메이션

## 🔧 Node.js 설치 후 빌드하는 방법

나중에 Node.js를 설치하면:

1. **Node.js 설치**
   - https://nodejs.org 에서 다운로드
   - LTS 버전 권장

2. **빌드 실행**
   ```bash
   npm install
   npm run build
   ```

3. **dist 폴더 생성**
   - `dist` 폴더가 생성됩니다
   - 이 폴더를 Vercel에 드래그 앤 드롭

## 📂 파일 구조

```
MADUP/
├── index-standalone.html     ← 즉시 사용 가능! (브라우저에서 열기)
├── deploy-standalone/        ← 배포용 폴더
│   └── index.html           ← 배포할 파일
├── src/                     ← 개발용 (Node.js 필요)
│   └── App.jsx
└── package.json             ← 개발용 (Node.js 필요)
```

## 🎯 추천 방법

**지금 당장 배포하려면:**
→ `deploy-standalone` 폴더를 Vercel이나 Netlify에 드래그 앤 드롭

**팀원들과 공유하려면:**
→ 배포된 URL 공유하거나, `index-standalone.html` 파일 공유

**로컬에서 사용하려면:**
→ `index-standalone.html` 파일을 브라우저에서 열기

## 💡 팁

- 파일을 수정했다면 `index-standalone.html` 파일을 다시 `deploy-standalone` 폴더에 복사하세요
- 배포 후 모바일에서 테스트하는 것을 잊지 마세요!
- localStorage는 도메인별로 저장되므로, 새 URL로 배포하면 데이터가 초기화됩니다

---

**더 궁금한 점이 있으면 DEPLOYMENT.md를 참고하세요!**
