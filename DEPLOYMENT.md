# Vercel 배포 가이드

마케팅 10팀 출퇴근 현황 웹사이트를 Vercel에 배포하는 방법입니다.

## 방법 1: 드래그 앤 드롭 배포 (가장 간단!)

### 1단계: 빌드하기
```bash
npm install
npm run build
```

빌드가 완료되면 `dist` 폴더가 생성됩니다.

### 2단계: Vercel에 배포하기
1. https://vercel.com/new 로 이동
2. `dist` 폴더를 화면에 드래그 앤 드롭
3. 프로젝트 이름 입력 (예: `madup-attendance`)
4. "Deploy" 버튼 클릭
5. 완료! 🎉

배포 완료 후 제공되는 URL로 접속하면 됩니다.

## 방법 2: Vercel CLI 사용

### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

### 2단계: 로그인
```bash
vercel login
```

이메일 또는 GitHub 계정으로 로그인합니다.

### 3단계: 배포
```bash
npm run deploy
```

또는

```bash
vercel --prod
```

첫 배포 시 몇 가지 질문에 답해야 합니다:
- Set up and deploy? → Y
- Which scope? → 본인 계정 선택
- Link to existing project? → N
- Project name? → madup-attendance (또는 원하는 이름)
- In which directory is your code located? → ./

## 방법 3: GitHub 연동 (자동 배포)

### 1단계: GitHub Repository 생성
1. GitHub에서 새 Repository 생성
2. 로컬 프로젝트를 Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2단계: Vercel에 연결
1. https://vercel.com/new 접속
2. "Import Git Repository" 선택
3. GitHub Repository 선택
4. Framework Preset: Vite
5. "Deploy" 클릭

이후 GitHub에 Push할 때마다 자동으로 배포됩니다!

## 환경 변수 설정 (선택사항)

날씨 API 키를 환경 변수로 관리하려면:

1. Vercel Dashboard → 프로젝트 선택 → Settings → Environment Variables
2. 다음 추가:
   - Key: `VITE_WEATHER_API_KEY`
   - Value: `778545f1258007382a9868c2600d8b4b`

그 다음 `src/App.jsx`에서:
```javascript
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '778545f1258007382a9868c2600d8b4b'
```

## 배포 후 확인사항

✅ 모바일 화면에서 정상 작동하는지 확인
✅ localStorage가 잘 동작하는지 확인  
✅ 날씨 API가 정상 호출되는지 확인
✅ 모든 상태 변경이 잘 작동하는지 확인

## 커스텀 도메인 설정

Vercel Dashboard에서:
1. 프로젝트 선택 → Settings → Domains
2. 본인 도메인 입력 및 DNS 설정

## 유용한 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 로컬에서 미리보기
npm run preview

# Vercel에 배포
npm run deploy
```

## 문제 해결

### 빌드 오류 발생 시
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
npm run build
```

### 배포 후 페이지가 안 보일 때
- `vercel.json` 파일이 있는지 확인
- `dist` 폴더가 생성되었는지 확인
- Vercel 로그에서 에러 메시지 확인

## 배포 URL 예시

- Production: `https://madup-attendance.vercel.app`
- Preview: `https://madup-attendance-git-branch.vercel.app`

---

배포 완료 후 팀원들과 URL을 공유하세요! 🚀
