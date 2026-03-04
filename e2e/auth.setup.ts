import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

/**
 * 로그인 후 인증 상태를 파일에 저장합니다.
 * 환경변수로 테스트 계정을 설정하세요:
 *   TEST_USER_NAME=홍길동
 *   TEST_USER_BIRTH=990101
 */
setup("로그인 상태 저장", async ({ page }) => {
  const name = process.env.TEST_USER_NAME;
  const birth = process.env.TEST_USER_BIRTH;

  if (!name || !birth) {
    throw new Error(
      "테스트 계정 환경변수를 설정해주세요: TEST_USER_NAME, TEST_USER_BIRTH"
    );
  }

  await page.goto("/login");
  await expect(page).toHaveURL(/\/login/);

  await page.fill("#name", name);
  await page.fill("#birth", birth);
  await page.click('button[type="submit"]');

  await page.waitForURL("/requests", { timeout: 10_000 });

  await page.context().storageState({ path: authFile });
});
