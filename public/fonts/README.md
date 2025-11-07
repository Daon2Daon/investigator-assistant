# 폰트 파일 폴더

이 폴더에 커스텀 폰트 파일을 저장하세요.

## 지원하는 폰트 포맷

- `.woff2` (권장 - 최적화된 압축률)
- `.woff` (fallback용)
- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)

## 사용 방법

1. 폰트 파일을 이 폴더에 복사
2. `app/globals.css` 파일에서 `@font-face` 선언
3. Tailwind CSS 설정에서 폰트 패밀리 추가

예시:
```
public/fonts/
├── Pretendard-Regular.woff2
├── Pretendard-Bold.woff2
└── Pretendard-Light.woff2
```

