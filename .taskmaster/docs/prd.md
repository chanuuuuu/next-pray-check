# 한줄 기도제목 나눔 — PRD (Product Requirements Document)

## Overview

소규모 청년부 신앙 공동체를 위한 기도제목 공유 웹 앱.
구성원이 언제나 기도제목을 등록·공유할 수 있고, 리더는 출석을 관리하고 출석 통계를 통해 조원들을 쉽게 파악할 수 있으며,
간사가 팀원 전체를 관리할 수 있는 역할 기반 플랫폼.

- 대상 사용자: 청년부 소그룹 (중규모 20~100명 단일 팀)
- 언어: 한국어 전용
- 테마: 다크 테마 전용
- 배포 환경: Vercel + Neon PostgreSQL

---

## Core Features

### 1. 기도제목 공유

- 팀 > 조 계층 구조로 기도제목을 그룹화하여 노출
- 1인당 동시에 최대 3개 기도제목 등록 가능 (insert_id 1~3으로 슬롯 관리)
- 등록 시 노출 범위 선택 가능 (팀 전체 공개 / 우리 조 내만 공개)
- 본인의 기도제목은 삭제 가능
- 즐겨찾기 추가/해제, 즐겨찾기 탭에서 모아보기
- 주차(week_id)는 날짜 기반 자동 계산 (매주 일요일 기준 주차 구분)
- 최대 2주 동안의 주차별 기도제목 이력 관리

### 2. 출석 등록

- 리더(level ≥ 2)만 접근 가능한 전용 페이지
- 항목: 대예배 참석 / 조모임 참석 (각각 boolean)
- 조별 구성원 목록과 출석 여부를 한눈에 확인
- 출석 등록 및 수정 (UPSERT — 이미 등록된 경우 덮어씀)
- 주차(week_id)별 출석 이력 관리

### 3. 팀원 관리

- 간사(level = 3)만 접근 가능한 전용 페이지
- 전체 팀원을 조별로 그룹화하여 표시 (리더 최상단 정렬)
- 팀원 신규 등록 (이름, 생년월일, 조, 권한 레벨, 기수 입력)
- 팀원 정보 수정 / 삭제
- 기수(gisu)는 출생년도 기준으로 자동적으로 계산

### 4. 인증 및 세션

- 이름 + 생년월일(6자리 YYMMDD) 조합으로 로그인 (비밀번호 없음)
- jose JWT 기반 세션 쿠키 (7일 만료, httpOnly, secure)
- 라우트별 권한 미들웨어: 미인증 시 `/login` 리다이렉트, 권한 부족 시 `/requests` 리다이렉트
- 회원 가입: 간사가 팀원 관리 페이지에서 직접 등록 (자가 가입 불가)

---

## User Experience

### 사용자 페르소나

| 페르소나 | 레벨    | 접근 가능 페이지           | 주요 행동                        |
| -------- | ------- | -------------------------- | -------------------------------- |
| 팀원     | level 1 | `/requests`                | 기도제목 조회, 등록, 즐겨찾기    |
| 리더     | level 2 | `/requests`, `/attendance` | 기도제목 + 조원 출석 등록        |
| 간사     | level 3 | 전체                       | 기도제목 + 출석 확인 + 팀원 관리 |

### 주요 사용자 플로우

#### 로그인

1. `/login` 접속 → 이름, 생년월일 입력
2. 서버에서 일치 사용자 조회 → 세션 생성
3. `/requests`로 리다이렉트

#### 기도제목 등록

1. `/requests`에서 기도제목 목록 확인 (주차 자동 적용)
2. 등록 버튼 → 슬롯(1~3) 선택, 내용 작성, 노출 범위 선택
3. 등록 후 목록 즉시 갱신 (캐시 무효화)

#### 출석 등록 (리더)

1. `/attendance` 접속 → 현재 주차 조원 목록 확인
2. 대예배/조모임 출석 체크 후 저장
3. 저장 즉시 반영 (UPSERT)

#### 팀원 등록 (간사)

1. `/manage` 접속 → 조별 팀원 목록 확인
2. 신규 등록 버튼 → 이름, 생년월일, 조, 권한 입력
3. 등록/수정/삭제 가능

### UI/UX 고려사항

- 모바일 환경 (20~100명의 스마트폰 사용자)
- Cafe24 PROSlim 폰트 사용 (`c24ps` 클래스)
- 다크 테마 전용 CSS 변수 기반 디자인 토큰
- 페이지 전환 및 데이터 로딩 시 Suspense + 스켈레톤 UI
- GSAP / OGL 기반 애니메이션 (로그인 화면 등)

---

## Technical Architecture

### 시스템 구성

```
Client (Browser)
  ↓ HTTPS
Next.js App (Vercel)
  ├── App Router (Server Components)
  ├── Server Actions (Mutation)
  └── Middleware (Auth Guard)
  ↓
Neon PostgreSQL (Serverless)
```

### 기술 스택

| 영역        | 기술                                         |
| ----------- | -------------------------------------------- |
| 프레임워크  | Next.js 15 (App Router, Turbopack)           |
| 언어        | TypeScript (strict)                          |
| UI          | React 19 + CSS Modules + globals.css 변수    |
| DB          | Neon PostgreSQL (`@neondatabase/serverless`) |
| 인증        | jose JWT (세션 쿠키, 7일 만료)               |
| 검증        | Zod (서버사이드 전용)                        |
| 애니메이션  | GSAP, OGL                                    |
| 단위 테스트 | Jest                                         |
| E2E 테스트  | Playwright                                   |

### 파일 구조

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
  neon.ts            — sql 태그 함수 export
server/
  dal/               — Repository 클래스 (DB 접근)
  services/          — Service 클래스 (비즈니스 로직)
  session.ts         — JWT 세션
types/               — 프로젝트 타입 정의
```

### 데이터 모델

#### users 테이블

| 컬럼       | 타입      | 설명                                  |
| ---------- | --------- | ------------------------------------- |
| user_id    | PK        | 사용자 고유 ID                        |
| group_id   | FK        | 팀 ID                                 |
| cell_id    | FK        | 조 ID                                 |
| name       | text      | 이름                                  |
| birth      | text      | 생년월일 (YYMMDD)                     |
| level      | int       | 권한 레벨 (1: 팀원, 2: 리더, 3: 간사) |
| gisu       | int       | 기수                                  |
| created_at | timestamp | 등록일                                |

#### requests 테이블

| 컬럼       | 타입      | 설명                              |
| ---------- | --------- | --------------------------------- |
| request_id | PK        | 기도제목 고유 ID                  |
| user_id    | FK        | 작성자 ID                         |
| week_id    | text      | 주차 식별자 (날짜 기반 자동 계산) |
| text       | text      | 기도제목 내용                     |
| insert_id  | int       | 슬롯 번호 (1~3)                   |
| created_at | timestamp | 작성일                            |

#### request_status 테이블

| 컬럼       | 타입      | 설명        |
| ---------- | --------- | ----------- |
| request_id | FK        | 기도제목 ID |
| is_urgent  | boolean   | 긴급 여부   |
| is_solved  | boolean   | 해결됨 여부 |
| updated_at | timestamp | 수정일      |

#### request_favorites 테이블

| 컬럼       | 타입      | 설명            |
| ---------- | --------- | --------------- |
| user_id    | FK        | 사용자 ID       |
| request_id | FK        | 기도제목 ID     |
| week_id    | text      | 주차 식별자     |
| created_at | timestamp | 즐겨찾기 추가일 |

#### attendance 테이블

| 컬럼          | 타입      | 설명             |
| ------------- | --------- | ---------------- |
| attendance_id | PK        | 출석 고유 ID     |
| user_id       | FK        | 사용자 ID        |
| week_id       | text      | 주차 식별자      |
| worship       | boolean   | 대예배 참석 여부 |
| community     | boolean   | 조모임 참석 여부 |
| created_at    | timestamp | 등록일           |

### 핵심 설계 원칙

- **Server Components 우선**: 페이지와 데이터 페칭은 서버 컴포넌트로 처리
- **Server Actions 단일 진입점**: 모든 변이(mutation)는 Server Action으로만 처리
- **캐싱 전략**: `unstable_cache` + `revalidateTag` 조합 (5분 캐시)
- **검증 서버사이드 전용**: Zod는 `"use server"` 파일에서만 사용
- **CSS Modules 전용**: Tailwind 클래스 직접 사용 금지, CSS 변수 기반

### 권한 레벨

| 레벨 | 명칭 | 접근 가능                   |
| ---- | ---- | --------------------------- |
| 1    | 팀원 | 기도제목 조회/등록/즐겨찾기 |
| 2    | 리더 | 위 + 출석 등록              |
| 3    | 간사 | 위 + 팀원 관리              |

---

## Development Roadmap

### Phase 1 — MVP (구현 완료)

- [x] 로그인/세션 시스템 (이름+생년월일, JWT)
- [x] 라우트별 권한 미들웨어
- [x] 기도제목 CRUD (최대 3개, 노출 범위 선택)
- [x] 기도제목 즐겨찾기 (추가/해제/모아보기)
- [x] 주차(week_id) 날짜 기반 자동 계산
- [x] 출석 등록 (리더, UPSERT, 대예배/조모임)
- [x] 팀원 관리 (간사, 등록/수정/삭제)
- [x] Suspense + 스켈레톤 로딩 UI
- [x] 캐싱 전략 (unstable_cache + revalidateTag)
- [x] Service/Repository 3계층 아키텍처

### Phase 2 — 개선 및 신규 기능

> 아래는 DB 구조에 준비되어 있으나 UI 미구현 또는 기획 확정이 필요한 항목.
> 구체적인 기능 목록은 추후 보완 예정.

- [ ] 기도제목 페이지 UI 리팩토링
- [ ] 긴급 기도제목 표시 (`is_urgent` 필드 활용)
- [ ] 기도제목 해결됨 표시 (`is_solved` 필드 활용)
- [ ] E2E 테스트 시나리오 작성 (Playwright)
- [ ] (추후 추가 예정)

---

## Logical Dependency Chain

```
1. DB 스키마 확정 (users, requests, attendance)
   ↓
2. 인증 시스템 (JWT 세션, 미들웨어)
   ↓
3. 기도제목 기능 (조회 → 등록 → 삭제 → 즐겨찾기)
   ↓
4. 출석 기능 (조회 → 등록/수정)
   ↓
5. 팀원 관리 기능 (조회 → 등록 → 수정 → 삭제)
   ↓
6. Phase 2 기능 (is_urgent/is_solved UI, E2E 테스트 등)
```

---

## Risks and Mitigations

| 위험 요소   | 내용                                        | 완화 방안                                        |
| ----------- | ------------------------------------------- | ------------------------------------------------ |
| 인증 보안   | 이름+생년월일만으로 인증 — 무단 접근 가능성 | 조직 내부용 앱으로 한정, 회원 등록은 간사만 가능 |
| 데이터 누적 | 주차별 기록이 쌓이면 쿼리 성능 저하         | week_id 인덱스 최적화, 필요 시 아카이브 전략     |
| 모바일 UX   | 주 사용 환경이 스마트폰                     | 반응형 레이아웃, 터치 UX 최적화                  |
| 동시 편집   | 출석 리더 여러 명이 동시 수정 가능          | UPSERT로 충돌 처리 (마지막 저장 우선)            |

---

## Appendix

### 환경변수

| 키                     | 용도                        |
| ---------------------- | --------------------------- |
| `DATABASE_URL`         | Neon PostgreSQL 연결 문자열 |
| `JWT_SECRET`           | jose JWT 서명 키            |
| `NEXT_PUBLIC_BASE_URL` | 클라이언트 베이스 URL       |

### 개발 명령어

```bash
npm run dev            # 개발 서버 (Turbopack, 127.0.0.1)
npm run build          # 프로덕션 빌드 검증 (작업 완료 후 필수)
npm run lint           # ESLint 검사
npm run test           # Jest 단위 테스트
npm run test:e2e       # Playwright E2E 테스트
```

### 핵심 컨벤션

| 항목            | 규칙                                                              |
| --------------- | ----------------------------------------------------------------- |
| DB 컬럼         | snake_case                                                        |
| TypeScript 필드 | camelCase (DB row 매핑 시 명시적 변환)                            |
| 타입 정의       | `type`만 사용 (`interface` 금지)                                  |
| DB 연결         | `import { sql } from "@/db/neon"`                                 |
| 세션 검증       | `verifySession()` (리다이렉트) / `getUserBySession()` (null 반환) |
