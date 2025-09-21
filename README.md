# 🎬 ShortsGenie Frontend

AI 기반 숏폼 비디오 생성 도구 - 프론트엔드

## 📖 개요

ShortsGenie Frontend는 Electron, React, TypeScript, FFmpeg을 기반으로 한 크로스 플랫폼 데스크톱 애플리케이션입니다. 긴 비디오를 자동으로 분석하여 최적의 숏폼 비디오로 변환해주는 직관적인 사용자 인터페이스를 제공합니다.

## ✨ 주요 기능

- 🎥 **비디오 파일 업로드 및 처리**: 다양한 비디오 형식 지원
- ✂️ **자동 비디오 편집**: AI 기반 하이라이트 추출 및 30초 제한
- 📱 **모바일 최적화**: 세로형 포맷 (1080x1920) 자동 변환
- 🎨 **품질 최적화**: H.264 비디오 + AAC 오디오 인코딩
- ⚡ **실시간 미리보기**: 처리 과정 실시간 모니터링
- 🔧 **FFmpeg 통합**: 전문가급 비디오 처리 기능

## 🛠 기술 스택

### Core Technologies
- **Electron 38**: 크로스 플랫폼 데스크톱 애플리케이션 프레임워크
- **React 19**: 최신 React 기능을 활용한 사용자 인터페이스
- **TypeScript 5.9**: 타입 안전성과 개발 생산성 보장

### Build & Development
- **Webpack 5**: 모듈 번들링 및 개발 서버
- **pnpm**: 빠르고 효율적인 패키지 매니저
- **electron-builder**: 배포용 패키징 및 인스톨러 생성
- **concurrently**: 개발 프로세스 병렬 실행

### Video Processing
- **FFmpeg**: 전문가급 비디오 처리 엔진
- **fluent-ffmpeg**: FFmpeg Node.js 바인딩

## 📋 사전 요구사항

- **Node.js** 18+
- **pnpm** 8+
- **FFmpeg** (시스템에 설치되어 있거나 PATH에 등록)

### FFmpeg 설치

#### macOS
```bash
brew install ffmpeg
```

#### Windows
1. [FFmpeg 공식 웹사이트](https://ffmpeg.org/download.html)에서 다운로드
2. 압축 해제 후 PATH에 추가

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd shortsgenie-frontend
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 개발 모드 실행
```bash
pnpm dev
```

### 4. 프로덕션 빌드
```bash
# 빌드
pnpm build

# 패키징
pnpm package
```

## 📁 프로젝트 구조

```
shortsgenie-frontend/
├── src/
│   ├── main/                 # Electron 메인 프로세스
│   │   └── main.ts          # 메인 프로세스 로직 & FFmpeg 통합
│   ├── preload/             # 프리로드 스크립트
│   │   └── preload.ts       # IPC 브릿지 및 타입 정의
│   └── renderer/            # React 렌더러 프로세스
│       ├── index.html       # HTML 템플릿
│       ├── index.tsx        # React 엔트리 포인트
│       └── App.tsx          # 메인 React 컴포넌트
├── dist/                    # 빌드 출력물
│   ├── main/               # 컴파일된 메인 프로세스
│   ├── preload/            # 컴파일된 프리로드 스크립트
│   └── renderer/           # 번들된 React 앱
├── package.json            # 프로젝트 의존성 및 스크립트
├── tsconfig.json           # TypeScript 설정
├── webpack.config.js       # Webpack 설정
└── README.md              # 이 파일
```


## 🔧 개발 명령어

```bash
# 개발 모드 (Hot Reload 포함)
pnpm dev

# 렌더러 개발 서버만 실행
pnpm dev:renderer

# 메인 프로세스 빌드 (Watch 모드)
pnpm dev:main

# 프리로드 스크립트 빌드 (Watch 모드)
pnpm dev:preload

# 전체 빌드
pnpm build

# 개별 빌드
pnpm build:main      # 메인 프로세스
pnpm build:preload   # 프리로드 스크립트
pnpm build:renderer  # React 앱

# Electron 실행 (빌드 후)
pnpm start

# 배포용 패키징
pnpm package
```

## 🏗 아키텍처

### IPC 통신 구조
```
┌─────────────────┐    IPC     ┌─────────────────┐
│  Renderer       │ ◄────────► │  Main Process   │
│  (React UI)     │            │  (Node.js)      │
└─────────────────┘            └─────────────────┘
         ▲                             │
         │                             ▼
         │                     ┌─────────────────┐
         │                     │     FFmpeg      │
         └─────────────────────│   Processing    │
           Context Bridge      └─────────────────┘
```

### 주요 컴포넌트

#### Main Process (`src/main/main.ts`)
- Electron 애플리케이션 생명주기 관리
- FFmpeg 비디오 처리 로직
- IPC 핸들러 구현
- 윈도우 생성 및 관리

#### Preload Script (`src/preload/preload.ts`)
- 보안이 강화된 IPC 브릿지
- TypeScript 타입 정의
- Context Isolation 구현

#### Renderer Process (`src/renderer/`)
- React 기반 사용자 인터페이스
- 파일 경로 입력 폼
- 실시간 상태 표시
- FFmpeg 기능 상태 모니터링

## 🐛 문제 해결

### FFmpeg 관련 오류
- **증상**: FFmpeg을 찾을 수 없음
- **해결**: 터미널에서 `ffmpeg -version` 확인 후 PATH 설정

### 빌드 오류
- **증상**: TypeScript 컴파일 오류
- **해결**: Node.js 18+ 확인, `pnpm install` 재실행

### 개발 서버 오류
- **증상**: 포트 3000 접속 불가
- **해결**: 포트 사용 여부 확인, 방화벽 설정 점검

### Electron 실행 오류
- **증상**: 애플리케이션이 시작되지 않음
- **해결**: `pnpm build` 후 `pnpm start` 실행

## 📊 빌드 출력

성공적인 빌드 후 다음과 같은 구조가 생성됩니다:

```
dist/
├── main/
│   └── main.js              # 컴파일된 메인 프로세스
├── preload/
│   └── preload.js           # 컴파일된 프리로드 스크립트
└── renderer/
    ├── index.html           # 렌더러 HTML
    ├── bundle.js            # React 앱 번들
    └── bundle.js.map        # 소스맵
```
