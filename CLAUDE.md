# 한줄 기도제목 나눔 — 프로젝트 컨텍스트

Next.js 기반 소규모 그룹 기도제목 공유 앱. 한국어 전용, 라이트 테마 (Glass Morphism).

---

## 주요 기능

### 1. 기도제목 공유 및 등록

- 그룹은 팀 > 조의 계층 구조를 가집니다. 각 게층별로 그룹화 되어 기도제목이 보여집니다.
- 기도제목은 동시에 최대 3개까지 등록 가능하며, 각 계층 별로 등록하여 노출 범위를 지정할 수 있습니다.
- 본인의 기도제목은 삭제가 가능합니다.
- 기도제목은 즐겨찾기가 가능하며, 즐겨찾기를 한 경우, 기도제목 목록 페이지 > 즐겨찾기 별에서 모아서 확인할 수 있습니다.

### 2. 출석 등록

- 리더로 등록된 유저의 경우, 출석 등록 페이지가 노출됩니다.
- DB에 사전에 등록된 조별로 출석 여부가 노출되고, 출석 등록 및 수정이 가능합니다.
- 출석에는 '대예배 참석', '조모임 참석' 항목이 존재합니다.

### 3. 팀원 관리

- 간사로 등록된 유저의 경우, 팀원 관리 페이지가 노출됩니다.
- 팀 전체 인원이 조별로 그룹화되어 노출됩니다.

## 기술 스택

| 영역       | 기술                                         |
| ---------- | -------------------------------------------- |
| 프레임워크 | Next.js 15 (App Router, Turbopack)           |
| 언어       | TypeScript (strict)                          |
| UI         | React 19                                     |
| 스타일     | CSS Modules + globals.css CSS 변수           |
| DB         | Neon PostgreSQL (`@neondatabase/serverless`) |
| 인증       | jose JWT (세션 쿠키, 7일 만료)               |
| 검증       | Zod (서버 사이드 전용)                       |
| 애니메이션 | GSAP, OGL                                    |
| 테스트     | Jest                                         |

---

## 파일 구조

```
app/
  (route)/           — 라우트별 page.tsx (서버 컴포넌트)
    login/
    attendance/
    requests/
    manage/
  action/            — Server Actions ("use server")
  component/         — 도메인별 Server/Client 컴포넌트
  hooks/             — 커스텀 훅 ("use client")
  utils/             — 클라이언트 유틸, 상수, 검증
  globals.css        — 전역 CSS 변수 (디자인 토큰)
  layout.tsx
db/
  neon.ts            — sql 태그 함수 export (`import { sql } from "@/db/neon"`)
server/
  dal/               — Repository 클래스 (DB 접근)
  services/          — Service 클래스 (비즈니스 로직)
  session.ts         — JWT 세션 (verifySession / getUserBySession)
types/               — 프로젝트 타입 정의
```

---

## 에이전트 역할 분담

세 개의 전문 에이전트를 상황에 따라 사용합니다.

### `next-fe-expert` — UI/기능 개발

다음 작업에 사용합니다:

- 페이지, 컴포넌트, 커스텀 훅 작성
- Server Action 구현 (`app/action/`)
- CSS Module 스타일링
- `server/services/` 비즈니스 로직 작성

### `neon-db-expert` — DB / 데이터 레이어

다음 작업에 사용합니다:

- SQL 쿼리 작성·실행·검증
- `server/dal/` Repository 코드 생성
- 테이블 스키마 탐색 및 변경 (마이그레이션)
- 슬로우 쿼리 분석 및 인덱스 최적화
- **전제**: Neon MCP 서버 등록 필요

### `pen-sync` — 디자인 동기화

다음 작업에 사용합니다:

- Figma 또는 `.pen` 파일 → 코드 반영
- 디자인 토큰(색상, 간격) 변경 동기화

> 하나의 작업이 여러 에이전트에 걸치면 **db-expert → fe-expert 순서**로 진행합니다.
> (타입 및 DB 레이어 먼저 확정 후 UI 작업)

---

## 환경변수

`.env.local`에 정의합니다. 값은 절대 코드에 하드코딩하지 않습니다.

| 키                     | 용도                               |
| ---------------------- | ---------------------------------- |
| `DATABASE_URL`         | Neon PostgreSQL 연결 문자열        |
| `JWT_SECRET`           | jose JWT 서명 키                   |
| `NEXT_PUBLIC_BASE_URL` | 클라이언트에서 접근하는 베이스 URL |

---

## 명령어

```bash
npm run dev       # 개발 서버 (Turbopack, 127.0.0.1)
npm run build     # 프로덕션 빌드 검증 (작업 완료 후 반드시 실행)
npm run lint      # ESLint 검사
npm run test      # Jest 테스트 전체 실행
npm run test:watch   # 감시 모드
npm run test:coverage # 커버리지 리포트
```

---

## 전역 금지 사항

모든 에이전트에 적용됩니다.

- **`interface` 사용 금지** — 타입은 `type`으로만 정의
- **클라이언트 사이드 fetch 금지** — 데이터 페칭은 Server Component 또는 Server Action으로만
- **Zod를 클라이언트에서 사용 금지** — `"use server"` 파일에서만 검증
- **SQL 문자열 직접 조합 금지** — 반드시 템플릿 태그(`sql\`...\``) 또는 `sql.unsafe()` 사용
- **DDL을 main 브랜치에 직접 실행 금지** — Neon 브랜치 기반 마이그레이션 워크플로우 사용
- **`npm run build` 없이 작업 완료 처리 금지**

---

## 핵심 컨벤션

| 항목            | 규칙                                                              |
| --------------- | ----------------------------------------------------------------- |
| DB 컬럼         | snake_case                                                        |
| TypeScript 필드 | camelCase (DB row 매핑 시 명시적 변환)                            |
| DB 연결         | `import { sql } from "@/db/neon"`                                 |
| 세션 검증       | `verifySession()` (리다이렉트) / `getUserBySession()` (null 반환) |
| 권한 레벨       | `level: 1` 일반 / `level: 2` 리더                                 |
| 폰트            | Cafe24 PROSlim (`c24ps` 클래스)                                   |
| 라우트          | `/` 홈 · `/login` · `/attendance` · `/requests` · `/manage`       |

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
