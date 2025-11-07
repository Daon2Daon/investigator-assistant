# Docker 배포 가이드 (Synology NAS)

## 📋 배포 개요

Synology NAS의 Docker 환경에 AI 탐정 보조 앱을 배포하는 가이드입니다.

**포트:** 1219 (외부) → 3000 (컨테이너 내부)

---

## 🔧 사전 준비

### **1. Synology NAS 설정**

- ✅ Docker 패키지 설치 (Package Center에서)
- ✅ SSH 접속 활성화 (Control Panel → Terminal & SNMP)
- ✅ 포트 1219 방화벽 허용

### **2. 필요한 파일**

프로젝트 루트에 다음 파일들이 있어야 합니다:

```
✅ Dockerfile                  # Docker 이미지 빌드 설정
✅ docker-compose.yml          # Docker Compose 설정
✅ .dockerignore               # Docker 빌드 제외 파일
✅ next.config.js              # Standalone 모드 설정
```

---

## 🚀 배포 방법

### **방법 1: Docker Compose 사용 (권장)**

#### **1-1. 환경변수 파일 생성**

프로젝트 루트에 `.env.production` 파일을 생성하세요:

```bash
# .env.production
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=3000
```

⚠️ **중요:** `.env.production` 파일은 Git에 커밋하지 마세요!

#### **1-2. Synology NAS에 파일 전송**

**옵션 A: Git Clone (권장)**
```bash
# SSH로 NAS 접속
ssh your-username@nas-ip

# 프로젝트 클론
git clone https://github.com/Daon2Daon/investigator-assistant.git
cd investigator-assistant

# .env.production 파일 생성
nano .env.production
# API 키 입력 후 저장 (Ctrl+X, Y, Enter)
```

**옵션 B: SFTP/FileStation 사용**
- FileStation에서 폴더 생성
- 프로젝트 파일들을 업로드
- `.env.production` 파일 생성

#### **1-3. Docker Compose로 실행**

```bash
# SSH로 NAS 접속 후 프로젝트 폴더로 이동
cd /volume1/docker/investigator-assistant

# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

#### **1-4. 접속 확인**

브라우저에서 접속:
```
http://NAS_IP:1219
```

예시:
```
http://192.168.0.100:1219
```

---

### **방법 2: Synology Docker GUI 사용**

#### **2-1. 이미지 빌드 (로컬에서)**

```bash
# 로컬 Mac에서 실행
cd /Users/sungmukchoi/cursor_workspace/investigator-assistant

# Docker 이미지 빌드
docker build -t investigator-assistant:latest .

# 이미지 저장 (tar 파일로)
docker save investigator-assistant:latest > investigator-assistant.tar
```

#### **2-2. NAS에 이미지 업로드**

1. **FileStation으로 tar 파일 업로드**
2. **Docker 앱 실행** (Synology)
3. **이미지 → 추가 → 파일에서 추가**
4. `investigator-assistant.tar` 선택

#### **2-3. 컨테이너 생성**

**Docker GUI에서:**

1. **이미지 → investigator-assistant → 실행**

2. **컨테이너 이름:** `investigator-assistant`

3. **포트 설정:**
   ```
   로컬 포트: 1219
   컨테이너 포트: 3000
   유형: TCP
   ```

4. **환경변수:**
   ```
   GEMINI_API_KEY=your_api_key_here
   NODE_ENV=production
   PORT=3000
   ```

5. **재시작 정책:** 자동 재시작

6. **적용** 클릭

---

## 🔧 빌드 및 배포 명령어

### **로컬에서 빌드 테스트:**

```bash
cd /Users/sungmukchoi/cursor_workspace/investigator-assistant

# 프로덕션 빌드 테스트
npm run build

# 프로덕션 서버 실행 테스트
npm start
```

### **Docker 이미지 빌드:**

```bash
# 이미지 빌드
docker build -t investigator-assistant:latest .

# 로컬에서 테스트
docker run -p 1219:3000 \
  -e GEMINI_API_KEY=your_api_key \
  investigator-assistant:latest

# 접속: http://localhost:1219
```

### **NAS에서 직접 빌드:**

```bash
# SSH로 NAS 접속
ssh your-username@nas-ip

# 프로젝트 폴더로 이동
cd /volume1/docker/investigator-assistant

# Docker Compose로 빌드 및 실행
docker-compose up -d --build

# 실시간 로그 확인
docker-compose logs -f
```

---

## 📊 Docker 설정 설명

### **Dockerfile 특징:**

1. **Multi-stage 빌드**
   - Stage 1 (deps): 의존성만 설치
   - Stage 2 (builder): 앱 빌드
   - Stage 3 (runner): 실행 환경 (최종 이미지 경량화)

2. **최적화**
   - Standalone 모드: 필요한 파일만 포함
   - Alpine Linux: 작은 이미지 크기 (~150MB)
   - 프로덕션 의존성만 포함

3. **보안**
   - Root가 아닌 사용자(nextjs) 실행
   - 불필요한 파일 제외

### **docker-compose.yml 특징:**

1. **포트 매핑**
   ```yaml
   ports:
     - "1219:3000"  # 외부:내부
   ```

2. **환경변수**
   - `.env.production` 파일 사용
   - 안전한 API 키 관리

3. **헬스체크**
   - 30초마다 상태 확인
   - 자동 재시작

4. **재시작 정책**
   ```yaml
   restart: unless-stopped  # NAS 재부팅 시 자동 시작
   ```

---

## 🔐 환경변수 설정

### **.env.production 파일 생성**

NAS의 프로젝트 폴더에서:

```bash
cat > .env.production << 'EOF'
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=production
PORT=3000
EOF
```

**또는 nano 에디터 사용:**
```bash
nano .env.production
```

파일 내용:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=3000
```

저장: `Ctrl+X`, `Y`, `Enter`

---

## 🧪 배포 테스트 순서

### **1단계: 로컬에서 Docker 빌드 테스트**

```bash
cd /Users/sungmukchoi/cursor_workspace/investigator-assistant

# Docker 이미지 빌드
docker build -t investigator-assistant:test .

# 로컬에서 실행
docker run -p 1219:3000 \
  -e GEMINI_API_KEY=your_api_key \
  investigator-assistant:test

# 브라우저에서 접속
# http://localhost:1219
```

### **2단계: NAS에 배포**

**Git을 통한 배포:**
```bash
# NAS SSH 접속
ssh admin@your-nas-ip

# Docker 폴더로 이동
cd /volume1/docker
mkdir -p investigator-assistant
cd investigator-assistant

# Git Clone
git clone https://github.com/Daon2Daon/investigator-assistant.git .

# .env.production 생성
nano .env.production
# GEMINI_API_KEY 입력

# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### **3단계: 접속 확인**

브라우저에서:
```
http://NAS_IP:1219
```

예시:
```
http://192.168.0.100:1219
```

---

## 🔍 문제 해결

### **빌드 실패 시:**

```bash
# 로그 확인
docker-compose logs

# 컨테이너 상태 확인
docker ps -a

# 이미지 재빌드
docker-compose down
docker-compose up -d --build
```

### **접속 안 될 시:**

1. **컨테이너 상태 확인**
   ```bash
   docker ps
   # STATUS가 "Up"이어야 함
   ```

2. **로그 확인**
   ```bash
   docker-compose logs investigator-assistant
   ```

3. **포트 확인**
   ```bash
   # NAS에서
   netstat -tuln | grep 1219
   ```

4. **방화벽 확인**
   - Synology Control Panel → Security → Firewall
   - 포트 1219 허용

### **환경변수 오류 시:**

```bash
# 컨테이너 내부 환경변수 확인
docker exec investigator-assistant env | grep GEMINI

# .env.production 파일 확인
cat .env.production
```

---

## 📊 리소스 요구사항

### **최소 사양:**
- CPU: 2 코어
- RAM: 1GB
- 디스크: 500MB

### **권장 사양:**
- CPU: 4 코어
- RAM: 2GB
- 디스크: 1GB

### **예상 이미지 크기:**
- 최종 이미지: ~150MB
- 빌드 중 임시: ~500MB

---

## 🔄 업데이트 방법

### **코드 업데이트 시:**

```bash
# NAS SSH 접속
ssh admin@nas-ip
cd /volume1/docker/investigator-assistant

# 최신 코드 받기
git pull origin main

# 컨테이너 재빌드 및 재시작
docker-compose down
docker-compose up -d --build
```

---

## 📝 유용한 Docker 명령어

### **컨테이너 관리:**
```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 중지
docker-compose down

# 컨테이너 재시작
docker-compose restart

# 컨테이너 삭제
docker-compose down --volumes
```

### **로그 확인:**
```bash
# 실시간 로그
docker-compose logs -f

# 최근 100줄
docker-compose logs --tail=100

# 특정 시간부터
docker-compose logs --since 30m
```

### **디버깅:**
```bash
# 컨테이너 내부 접속
docker exec -it investigator-assistant sh

# 내부에서:
ls -la
env | grep GEMINI
curl http://localhost:3000
```

---

## 🌐 외부 접속 설정 (선택사항)

### **포트 포워딩 (공인 IP로 접속)**

**라우터 설정:**
```
외부 포트: 1219
내부 IP: NAS_IP
내부 포트: 1219
프로토콜: TCP
```

접속:
```
http://your-public-ip:1219
```

### **도메인 연결 (DDNS)**

**Synology DDNS:**
1. Control Panel → External Access → DDNS
2. Synology DDNS 설정
3. 서브도메인 생성: `yourname.synology.me`

접속:
```
http://yourname.synology.me:1219
```

### **HTTPS 설정 (Let's Encrypt)**

**Reverse Proxy:**
1. Control Panel → Login Portal → Advanced
2. Reverse Proxy 추가
3. 소스: `yourname.synology.me`
4. 대상: `localhost:1219`
5. Let's Encrypt 인증서 적용

---

## 📋 배포 체크리스트

### **배포 전:**
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] `.env.production` 파일 준비 (API 키 포함)
- [ ] Synology Docker 패키지 설치
- [ ] SSH 접속 확인

### **배포 중:**
- [ ] 프로젝트 파일을 NAS에 전송
- [ ] `.env.production` 파일 생성
- [ ] `docker-compose up -d --build` 실행
- [ ] 빌드 성공 확인 (5-10분 소요)

### **배포 후:**
- [ ] `http://NAS_IP:1219` 접속 확인
- [ ] 스플래시 화면 표시 확인
- [ ] 테스트 이미지 업로드 테스트
- [ ] AI 분석 정상 작동 확인
- [ ] 모바일에서 접속 테스트

---

## 🎯 빠른 배포 스크립트

NAS에서 한 번에 실행할 수 있는 스크립트:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 AI 탐정 보조 배포 시작..."

# 프로젝트 폴더 생성
mkdir -p /volume1/docker/investigator-assistant
cd /volume1/docker/investigator-assistant

# Git Clone
echo "📥 코드 다운로드 중..."
git clone https://github.com/Daon2Daon/investigator-assistant.git .

# 환경변수 설정 (대화형)
echo "🔑 API 키를 입력하세요:"
read -p "GEMINI_API_KEY: " api_key

cat > .env.production << EOF
GEMINI_API_KEY=$api_key
NODE_ENV=production
PORT=3000
EOF

# Docker Compose 실행
echo "🐳 Docker 컨테이너 시작 중..."
docker-compose up -d --build

# 로그 출력
echo "📋 로그 확인 중..."
sleep 5
docker-compose logs --tail=50

echo "✅ 배포 완료!"
echo "🌐 접속: http://$(hostname -I | awk '{print $1}'):1219"
```

**사용 방법:**
```bash
# NAS에서 실행
chmod +x deploy.sh
./deploy.sh
```

---

## 🎮 배포 후 테스트

### **1. 기본 접속 테스트**
```
http://NAS_IP:1219
```
- ✅ 스플래시 화면 표시
- ✅ 대시보드 이동
- ✅ KTFlow 폰트 적용

### **2. 기능 테스트**
- ✅ [사건] 모달 열림
- ✅ [용의자] 모달 열림
- ✅ [💡] 힌트 모달 열림
- ✅ 🧪 테스트 도구 작동
- ✅ 테스트 이미지 바로 사용

### **3. AI 분석 테스트**
- ✅ 테스트 이미지 업로드
- ✅ Gemini AI 분석 작동
- ✅ 단서 분류 정확도
- ✅ localStorage 저장

### **4. 모바일 테스트**
- ✅ 모바일 브라우저 접속
- ✅ 카메라 작동
- ✅ 터치 반응
- ✅ Safe Area 적용

---

## 🔧 성능 최적화 (선택사항)

### **Nginx Reverse Proxy 추가**

더 나은 성능을 위해 Nginx를 프론트에 둘 수 있습니다:

```yaml
# docker-compose.yml에 추가
services:
  nginx:
    image: nginx:alpine
    ports:
      - "1219:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - investigator-assistant
    networks:
      - app-network

  investigator-assistant:
    # ... 기존 설정
    expose:
      - "3000"  # ports 대신 expose 사용
```

---

## 📊 모니터링

### **컨테이너 상태 확인:**

```bash
# 리소스 사용량
docker stats investigator-assistant

# 상태 확인
docker-compose ps

# 헬스체크
docker inspect investigator-assistant | grep Health -A 10
```

### **로그 모니터링:**

```bash
# 에러 로그만
docker-compose logs | grep -i error

# 최근 1시간
docker-compose logs --since 1h
```

---

## 🎉 배포 완료 체크리스트

- [ ] Dockerfile 생성 완료
- [ ] docker-compose.yml 생성 완료
- [ ] .dockerignore 생성 완료
- [ ] next.config.js에 standalone 모드 추가
- [ ] .env.production 파일 준비
- [ ] NAS에 프로젝트 파일 전송
- [ ] Docker 이미지 빌드 성공
- [ ] 컨테이너 실행 성공
- [ ] http://NAS_IP:1219 접속 성공
- [ ] AI 분석 정상 작동

---

## 🚀 지금 배포하세요!

### **가장 쉬운 방법:**

```bash
# 1. NAS SSH 접속
ssh admin@your-nas-ip

# 2. 프로젝트 클론
cd /volume1/docker
git clone https://github.com/Daon2Daon/investigator-assistant.git
cd investigator-assistant

# 3. 환경변수 설정
nano .env.production
# GEMINI_API_KEY=your_key 입력

# 4. 배포!
docker-compose up -d --build

# 5. 확인
docker-compose logs -f
```

**완료되면:**
```
http://NAS_IP:1219
```

---

**배포 파일이 모두 준비되었습니다!** 🎉

배포를 시작하시고 문제가 발생하면 말씀해주세요! 😊
