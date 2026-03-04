import { test, expect } from "@playwright/test";

/**
 * 비인증 상태에서의 /requests 페이지 접근 테스트
 * 인증 쿠키 없이 실행됩니다.
 */
test.describe("/requests — 비인증 접근", () => {
  test("/requests 접근 시 /login으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/requests");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/login 페이지에 이름·생년월일 입력 필드가 존재한다", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#birth")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
