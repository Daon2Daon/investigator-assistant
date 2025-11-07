# Gemini API Key 설정 가이드

이 가이드는 **AI 탐정 보조** 앱에서 Gemini AI를 사용하기 위한 API 키 설정 방법을 안내합니다.

---

## 📋 전체 과정 요약

1. Google AI Studio에서 API 키 발급
2. 프로젝트에 `.env.local` 파일 생성
3. API 키 입력
4. 개발 서버 재시작
5. 테스트

**소요 시간:** 약 5분

---

## 🔑 1단계: Gemini API Key 발급

### 1-1. Google AI Studio 접속

브라우저에서 다음 링크로 이동:

👉 **[https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)**

### 1-2. Google 계정으로 로그인

- 개인 Gmail 계정 사용 권장
- 조직/회사 계정은 API 사용에 제한이 있을 수 있습니다

### 1-3. API Key 생성

1. **"Create API Key"** 또는 **"Get API Key"** 버튼을 클릭합니다
2. 다음 중 선택:
   - **Create API key in new project** (새 프로젝트) - 권장
   - **Create API key in existing project** (기존 프로젝트)
3. API 키가 생성되면 **즉시 복사**하세요
   - ⚠️ 다시 볼 수 없으므로 꼭 복사해두세요!

### API 키 형식
```
AIzaSy...xxxxx (약 39자의 영문/숫자 조합)
```

---

## 💻 2단계: 프로젝트에 API 키 설정

### 2-1. 터미널에서 프로젝트 폴더로 이동

```bash
cd /Users/sungmukchoi/cursor_workspace/investigator-assistant
```

### 2-2. .env.local 파일 생성

**방법 1: 터미널 사용 (macOS/Linux)**

```bash
# 파일 생성
touch .env.local

# 텍스트 에디터로 열기
open .env.local
```

**방법 2: Cursor에서 직접 생성**

1. Cursor 왼쪽 사이드바에서 프로젝트 루트 우클릭
2. "New File" 선택
3. 파일명: `.env.local`

### 2-3. API 키 입력

`.env.local` 파일에 다음 내용을 입력하세요:

```env
GEMINI_API_KEY=여기에_복사한_API_키를_붙여넣기
```

**예시:**
```env
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

**주의사항:**
- ⚠️ 따옴표(`"`) 사용하지 마세요
- ⚠️ 공백이나 줄바꿈 없이 한 줄로 입력
- ⚠️ `=` 앞뒤로 공백 없이

### 2-4. 파일 저장

- Cursor: `Cmd+S` (Mac) 또는 `Ctrl+S` (Windows)
- 파일을 저장하고 닫습니다

---

## 🔄 3단계: 개발 서버 재시작

환경변수를 적용하려면 서버를 재시작해야 합니다.

### 3-1. 기존 서버 중지

터미널에서 개발 서버가 실행 중이라면:
- `Ctrl+C` 키를 눌러 중지

### 3-2. 서버 재시작

```bash
npm run dev
```

**성공 메시지:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Network:      http://172.30.1.8:3000

✓ Ready in X.Xs
```

---

## ✅ 4단계: API 키 테스트

### 4-1. 브라우저에서 앱 열기

```
http://localhost:3000
```

### 4-2. 테스트 이미지 업로드

1. 스플래시 화면 지나기
2. 대시보드에서 우측 하단 **카메라 버튼** 클릭
3. 아무 이미지나 선택
4. 미리보기에서 **"이 사진으로 분석하기"** 클릭

### 4-3. 결과 확인

#### ✅ **성공 (API 키 정상)**
```
AI가 이미지를 분석한 결과:
"흠... 이건 결정적인 단서는 아닌 것 같네요. 좀 더 자세히 살펴보시죠."
```

#### ❌ **실패 (API 키 문제)**
```
⚠️ API 키가 설정되지 않았습니다. 
.env.local 파일에 GEMINI_API_KEY를 추가해주세요.
```

---

## 🔧 문제 해결 (Troubleshooting)

### 문제 1: "API 키가 설정되지 않았습니다"

**원인:**
- `.env.local` 파일이 없거나
- API 키가 올바르게 입력되지 않았거나
- 서버를 재시작하지 않음

**해결:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
   ```bash
   ls -la | grep .env.local
   ```
2. 파일 내용 확인
   ```bash
   cat .env.local
   ```
3. 서버 재시작
   ```bash
   npm run dev
   ```

### 문제 2: "Gemini API 키가 올바르지 않습니다"

**원인:**
- API 키가 잘못 복사됨
- 공백이나 줄바꿈이 포함됨
- 따옴표가 포함됨

**해결:**
1. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 다시 확인
2. `.env.local` 파일 형식 재확인:
   ```env
   GEMINI_API_KEY=AIzaSy...xxxxx
   ```
   - 따옴표 없음
   - 공백 없음
   - 한 줄로

### 문제 3: "분당 요청 제한 초과"

**원인:**
- 무료 티어 할당량 초과 (분당 15회)

**해결:**
- 1분 정도 기다린 후 다시 시도
- 너무 빠르게 연속으로 이미지를 업로드하지 마세요

### 문제 4: 서버 콘솔에 오류 표시

**확인사항:**
1. 터미널에서 에러 메시지 확인
2. `.env.local` 파일명 확인 (`.env.local.example`이 아님)
3. Node.js 버전 확인 (18+ 필요)
   ```bash
   node --version
   ```

---

## 🔒 보안 주의사항

### ⚠️ 절대 하지 말아야 할 것

1. **Git에 커밋하지 마세요**
   - `.env.local`은 `.gitignore`에 포함되어 있음
   - GitHub, GitLab 등에 절대 업로드하지 마세요

2. **공개적으로 공유하지 마세요**
   - 스크린샷에 API 키가 보이지 않도록 주의
   - 코드 예제에 실제 API 키를 넣지 마세요

3. **프론트엔드에 노출하지 마세요**
   - 환경변수는 서버 사이드에서만 사용됨
   - `NEXT_PUBLIC_` 접두사를 사용하지 마세요

### 🔐 API 키 재발급

API 키가 노출되었다면:

1. [Google AI Studio](https://aistudio.google.com/apikey) 접속
2. 기존 API 키 삭제
3. 새 API 키 생성
4. `.env.local` 파일 업데이트

---

## 📊 Gemini API 무료 할당량

### 무료 티어 (Free Tier)

| 항목 | 제한 |
|------|------|
| **분당 요청** | 15회 |
| **일일 요청** | 1,500회 |
| **비용** | 무료 |

### 게임 진행에 충분한가요?

✅ **예!**
- 플레이어 1명당 약 10-20회 단서 촬영
- 동시 플레이어 3-5명 가능
- 테스트 및 소규모 게임에 충분

---

## 📞 추가 도움이 필요한 경우

### 공식 문서
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 문서](https://ai.google.dev/docs)

### 프로젝트 문서
- `SETUP.md` - 전체 설정 가이드
- `README.md` - 프로젝트 개요

---

## ✅ 체크리스트

API 키 설정이 완료되었는지 확인하세요:

- [ ] Google AI Studio에서 API 키 발급
- [ ] `.env.local` 파일 생성
- [ ] API 키 입력 및 저장
- [ ] 개발 서버 재시작
- [ ] 이미지 업로드 테스트 성공
- [ ] AI 분석 결과 정상 표시

**모두 체크되었다면 Phase 4 완료! 🎉**

이제 실제 게임에서 AI 탐정 보조 기능을 사용할 수 있습니다!

