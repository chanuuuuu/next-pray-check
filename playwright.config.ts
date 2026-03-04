import { defineConfig, devices } from "@playwright/test";

/**
 * 로컬 실행 전에 dev 서버가 실행 중이어야 합니다.
 *   npm run dev
 *
 * 테스트 계정 환경변수를 설정하세요 (.env.test.local 또는 shell):
 *   TEST_USER_NAME=홍길동
 *   TEST_USER_BIRTH=990101
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    // 1단계: 인증 상태 저장
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },

    // 2단계: 인증된 상태에서 테스트
    {
      name: "authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
      testIgnore: ["**/auth.setup.ts", "**/unauthenticated.spec.ts"],
    },

    // 비인증 테스트 (별도 프로젝트 — storageState 없음)
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/unauthenticated.spec.ts",
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true, // 이미 실행 중인 서버 재사용
    timeout: 60_000,
  },
});
