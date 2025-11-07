# 프로젝트 설정 가이드

## 1. 의존성 패키지 설치

```bash
npm install
```

## 2. 환경변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Gemini AI API Key
# https://aistudio.google.com/apikey 에서 발급받으세요
GEMINI_API_KEY=your_gemini_api_key_here
```

### Gemini API Key 발급 방법 (상세)

#### 1단계: Google AI Studio 접속
[https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

#### 2단계: Google 계정 로그인
- 개인 Gmail 계정 사용 권장
- 조직 계정의 경우 API 사용 제한이 있을 수 있음

#### 3단계: API Key 생성
1. "Create API Key" 버튼 클릭
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. API Key가 생성되면 즉시 복사 (다시 볼 수 없음)

#### 4단계: .env.local 파일 생성
프로젝트 루트 디렉토리에서:

```bash
# macOS/Linux
touch .env.local

# 파일 내용 (실제 API 키로 교체)
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env.local
```

**중요:** 
- API 키는 외부에 노출되지 않도록 주의하세요
- `.env.local` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다
- API 키 형식: `AIza...` (약 39자)

#### 5단계: 개발 서버 재시작
환경변수를 적용하려면 서버를 재시작해야 합니다:

```bash
# 기존 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

### API 키 테스트

서버 시작 후 이미지를 업로드하면:
- ✅ 정상: AI가 단서를 분석한 결과가 표시됩니다
- ❌ 오류: "API 키가 설정되지 않았습니다" 메시지가 표시됩니다

### Gemini API 무료 할당량

- **무료 티어**: 분당 15회 요청, 하루 1,500회 요청
- **충분한 양**: 테스트 및 소규모 게임 진행에 충분
- **비용**: 기본적으로 무료 (유료 전환 시에만 과금)

## 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
investigator-assistant/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 페이지 (리다이렉트)
│   ├── globals.css          # 글로벌 스타일
│   ├── splash/              # 스플래시 스크린
│   ├── dashboard/           # 메인 대시보드
│   └── api/
│       └── analyze/         # AI 분석 API
├── components/              # React 컴포넌트
├── lib/                     # 유틸리티 함수
│   ├── storage.ts          # localStorage 관리
│   ├── clues.ts            # 단서 데이터베이스
│   └── gemini.ts           # Gemini AI 연동
├── types/                   # TypeScript 타입 정의
├── data/                    # 게임 데이터
│   ├── case-info.ts        # 사건 정보
│   └── suspects.ts         # 용의자 정보
└── public/                  # 정적 파일
```

## 다음 단계

Phase 1 설정이 완료되었습니다. 다음 Phase를 진행하세요:

- **Phase 2**: UI 컴포넌트 개발
- **Phase 3**: 카메라 및 이미지 처리
- **Phase 4**: 백엔드 API 완성

