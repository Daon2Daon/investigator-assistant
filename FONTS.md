# 커스텀 폰트 사용 가이드

## 📂 폰트 파일 위치

커스텀 폰트 파일은 다음 폴더에 저장하세요:

```
public/fonts/
```

## 📥 폰트 파일 추가 방법

### 1단계: 폰트 파일 다운로드 및 복사

폰트 파일을 `public/fonts/` 폴더에 복사하세요.

**권장 포맷:** `.woff2` (최적 압축률과 성능)

예시:
```
public/fonts/
├── Pretendard-Regular.woff2
├── Pretendard-Bold.woff2
└── Pretendard-Light.woff2
```

### 2단계: `app/globals.css`에서 폰트 선언

`app/globals.css` 파일에 이미 예제 코드가 주석으로 포함되어 있습니다.

주석을 해제하고 폰트 이름과 파일명을 수정하세요:

```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### 3단계: body에 기본 폰트 적용

`app/globals.css`의 `body` 스타일을 수정:

```css
body {
  color: var(--foreground);
  background: var(--background);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 4단계 (선택): Tailwind CSS에 폰트 추가

`tailwind.config.ts`에서 커스텀 폰트를 추가:

```typescript
fontFamily: {
  'pretendard': ['Pretendard', 'sans-serif'],
},
```

사용법:
```tsx
<h1 className="font-pretendard">안녕하세요</h1>
```

## 🎨 추천 한글 폰트

### 1. Pretendard (무료)
- **다운로드:** https://github.com/orioncactus/pretendard
- **특징:** 깔끔하고 가독성이 좋은 한글 폰트
- **라이선스:** SIL Open Font License

### 2. Noto Sans KR (Google Fonts)
- **다운로드:** https://fonts.google.com/noto/specimen/Noto+Sans+KR
- **특징:** Google의 공식 한글 폰트
- **라이선스:** Open Font License

### 3. Spoqa Han Sans Neo (무료)
- **다운로드:** https://github.com/spoqa/spoqa-han-sans
- **특징:** 가독성 중심의 고딕체
- **라이선스:** SIL Open Font License

## 💡 성능 최적화 팁

### 1. WOFF2 포맷 우선 사용
```css
src: url('/fonts/Font.woff2') format('woff2'),    /* 최신 브라우저 */
     url('/fonts/Font.woff') format('woff');      /* 구형 브라우저 fallback */
```

### 2. font-display 속성 활용
```css
font-display: swap;  /* 폰트 로딩 중에도 텍스트 표시 */
```

### 3. 필요한 폰트 굵기만 포함
- Regular (400) - 기본 텍스트용
- Bold (700) - 제목용

### 4. 서브셋 폰트 사용
한글 전체가 아닌 자주 사용하는 글자만 포함된 서브셋 폰트 사용 권장

## 🔍 확인 방법

개발 서버 실행 후 브라우저 DevTools에서 확인:
1. `F12` → `Network` 탭
2. 페이지 새로고침
3. `.woff2` 파일이 로드되는지 확인
4. `Elements` 탭에서 폰트가 적용되었는지 확인

## ⚠️ 주의사항

1. **라이선스 확인**: 상업적 사용이 가능한지 확인하세요
2. **파일 크기**: 한글 폰트는 용량이 크므로 서브셋 사용 권장
3. **폰트 경로**: public 폴더 내의 파일은 `/fonts/...`로 시작 (public 생략)

## 📱 탐정 앱 UI에 어울리는 폰트

**추천 조합:**
- **제목/헤더**: Pretendard Bold (700)
- **본문 텍스트**: Pretendard Regular (400)
- **강조 텍스트**: Pretendard SemiBold (600)

추리 게임의 분위기를 위해 깔끔하고 전문적인 느낌의 폰트를 사용하세요!

