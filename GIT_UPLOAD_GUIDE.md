# GitHub 업로드 가이드

## ✅ Git 준비 완료!

프로젝트가 Git 저장소로 초기화되고 초기 커밋이 완료되었습니다.

```
✅ Git 초기화 완료
✅ 48개 파일, 10,464줄 커밋됨
✅ 브랜치: main
✅ 커밋 ID: ce75615
```

---

## 📤 GitHub에 업로드하는 방법

### **1단계: GitHub에서 새 저장소 생성**

1. **GitHub 접속**
   - https://github.com

2. **New Repository 클릭**
   - 우측 상단 `+` 버튼 → "New repository"

3. **저장소 정보 입력**
   ```
   Repository name: investigator-assistant
   Description: AI 탐정 보조 - 추리 게임을 위한 AI 기반 단서 분석 앱
   
   ⚪ Public  (공개)
   🔘 Private (비공개) ← 추천
   
   ❌ Add a README file (체크 해제 - 이미 있음)
   ❌ Add .gitignore (체크 해제 - 이미 있음)
   ```

4. **Create repository** 클릭

### **2단계: 원격 저장소 연결**

GitHub에서 저장소가 생성되면 다음 명령어를 실행하세요:

```bash
cd /Users/sungmukchoi/cursor_workspace/investigator-assistant

# GitHub 저장소 URL을 원격 저장소로 추가
git remote add origin https://github.com/YOUR_USERNAME/investigator-assistant.git

# 브랜치 이름 확인
git branch -M main
```

**YOUR_USERNAME**을 실제 GitHub 사용자명으로 변경하세요!

### **3단계: 푸시 (업로드)**

```bash
git push -u origin main
```

**GitHub 인증:**
- 사용자명 입력
- Personal Access Token 입력 (비밀번호 대신)

---

## 🔑 GitHub Personal Access Token 발급

비밀번호 대신 토큰을 사용해야 합니다.

### **발급 방법:**

1. **GitHub 설정**
   - https://github.com/settings/tokens

2. **Generate new token (classic)** 클릭

3. **토큰 설정**
   ```
   Note: investigator-assistant
   Expiration: 90 days (또는 원하는 기간)
   
   Scopes (권한):
   ✅ repo (전체)
   ```

4. **Generate token** 클릭

5. **토큰 복사**
   - ⚠️ 즉시 복사! (다시 볼 수 없음)
   - 안전한 곳에 저장

6. **푸시 시 사용**
   ```bash
   git push -u origin main
   
   Username: your_github_username
   Password: ghp_xxxxxxxxxxxxx (복사한 토큰)
   ```

---

## 🚀 빠른 명령어 (복사해서 사용)

### **SSH 사용 (권장)**

```bash
# GitHub 저장소 생성 후 SSH URL 사용
git remote add origin git@github.com:YOUR_USERNAME/investigator-assistant.git
git push -u origin main
```

### **HTTPS 사용**

```bash
# GitHub 저장소 생성 후 HTTPS URL 사용
git remote add origin https://github.com/YOUR_USERNAME/investigator-assistant.git
git push -u origin main
```

---

## 📋 커밋 내용

### **커밋 메시지:**
```
feat: AI 탐정 보조 앱 초기 구현 (Phase 1-6 완료)
```

### **주요 기능:**
- ✅ Next.js 14 프로젝트 설정
- ✅ Gemini AI Vision API 연동
- ✅ 이미지 분석 및 단서 분류
- ✅ 게임플레이 시스템
- ✅ 모바일 최적화
- ✅ 테스트 도구

### **파일 통계:**
- 📁 48개 파일
- 📝 10,464줄 코드
- 🎨 4개 폰트 파일
- 🖼️ 2개 테스트 이미지

---

## 🔒 보안 체크리스트

### ✅ 안전하게 제외된 파일:

- [x] `.env.local` - 환경변수 (API 키)
- [x] `node_modules/` - 의존성 패키지
- [x] `.next/` - 빌드 파일
- [x] `.DS_Store` - macOS 시스템 파일

### ⚠️ 주의사항:

- **절대 커밋하면 안 되는 것:**
  - ❌ `.env.local` (API 키 포함)
  - ❌ API 키를 직접 코드에 하드코딩
  
- **커밋해도 되는 것:**
  - ✅ 소스 코드
  - ✅ 설정 파일
  - ✅ 문서
  - ✅ 폰트
  - ✅ 테스트 이미지

---

## 📖 README.md 확인

GitHub에 업로드되면 자동으로 표시될 README.md:

- ✅ 프로젝트 개요
- ✅ 기능 명세
- ✅ 개발 구현 단계
- ✅ 현재 구현 상태
- ✅ 프로젝트 구조

---

## 🎯 업로드 후 할 일

### **1. GitHub에서 확인**
- README.md가 제대로 표시되는지 확인
- 파일 구조 확인
- .env.local이 없는지 확인

### **2. 저장소 설정**
- Description 추가
- Topics 추가: `nextjs`, `typescript`, `ai`, `gemini`, `game`
- About 섹션 업데이트

### **3. 협업 설정 (필요시)**
- Collaborators 추가
- Branch protection rules 설정
- Issues/Projects 활성화

---

## 📝 다음 커밋을 위한 명령어

앞으로 파일을 수정하고 커밋할 때:

```bash
# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "feat: 새로운 기능 추가"

# 푸시
git push
```

---

## 🔧 자주 사용하는 Git 명령어

```bash
# 현재 상태 확인
git status

# 변경 내역 확인
git diff

# 커밋 히스토리
git log --oneline

# 원격 저장소 확인
git remote -v

# 브랜치 확인
git branch

# 최신 코드 받기
git pull
```

---

## ✅ 현재 상태 요약

```
✅ Git 저장소 초기화 완료
✅ .gitignore 설정 완료 (보안 파일 제외)
✅ 초기 커밋 완료 (ce75615)
✅ 브랜치: main
✅ 커밋 가능 상태: working tree clean

⏭️ 다음 단계: GitHub 저장소 생성 및 푸시
```

---

## 🎉 준비 완료!

**지금 할 일:**

1. **GitHub에 로그인**
   - https://github.com

2. **새 저장소 생성**
   - Repository name: `investigator-assistant`
   - Private 권장

3. **터미널 명령어 실행**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/investigator-assistant.git
   git push -u origin main
   ```

---

**GitHub 저장소를 생성하신 후 URL을 알려주시면 푸시를 도와드리겠습니다!** 😊

