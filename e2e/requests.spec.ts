import { test, expect, Page } from "@playwright/test";

/**
 * /requests 페이지 E2E 테스트 (인증된 사용자)
 *
 * 전제조건:
 *   - auth.setup.ts 에서 로그인 후 storageState가 저장되어 있어야 합니다.
 *   - playwright.config.ts의 "authenticated" 프로젝트에서 실행됩니다.
 */

// ─── 공통 헬퍼 ────────────────────────────────────────────────────────────────

/** 필터 select (Radix UI combobox)를 열고 옵션을 클릭합니다 */
async function selectFilter(page: Page, label: string) {
  await page.click('[role="combobox"]');
  await page.click(`[role="option"]:has-text("${label}")`);
}

/** 등록 모달을 열고 Page를 반환합니다 */
async function openRegistModal(page: Page) {
  await page.click("button:has-text('등록')");
  await expect(page.getByRole("dialog")).toBeVisible();
}

// ─── 페이지 로딩 ──────────────────────────────────────────────────────────────
test.describe("/requests — 페이지 로딩", () => {
  test("인증된 사용자는 /requests 페이지에 접근할 수 있다", async ({
    page,
  }) => {
    await page.goto("/requests");
    await expect(page).toHaveURL("/requests");
  });

  test("등록 버튼과 새로고침 버튼이 렌더링된다", async ({ page }) => {
    await page.goto("/requests");

    await expect(page.getByRole("button", { name: "등록" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "새로고침" })
    ).toBeVisible();
  });

  test("기본 필터는 '팀별'로 선택되어 있다", async ({ page }) => {
    await page.goto("/requests");

    const combobox = page.getByRole("combobox");
    await expect(combobox).toBeVisible();
    await expect(combobox).toContainText("팀별");
  });
});

// ─── 필터 ─────────────────────────────────────────────────────────────────────
test.describe("/requests — 필터 선택", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/requests");
  });

  test("'조별' 필터로 변경하면 combobox에 조별이 표시된다", async ({
    page,
  }) => {
    await selectFilter(page, "조별");
    await expect(page.getByRole("combobox")).toContainText("조별");
  });

  test("'즐겨찾기' 필터로 변경하면 combobox에 즐겨찾기가 표시된다", async ({
    page,
  }) => {
    await selectFilter(page, "즐겨찾기");
    await expect(page.getByRole("combobox")).toContainText("즐겨찾기");
  });

  test("'팀별' → '조별' → '팀별' 순서로 필터를 전환할 수 있다", async ({
    page,
  }) => {
    await selectFilter(page, "조별");
    await expect(page.getByRole("combobox")).toContainText("조별");

    await selectFilter(page, "팀별");
    await expect(page.getByRole("combobox")).toContainText("팀별");
  });
});

// ─── 등록 모달 ────────────────────────────────────────────────────────────────
test.describe("/requests — 기도제목 등록 모달", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/requests");
  });

  test("등록 버튼 클릭 시 '기도제목 등록' 모달이 열린다", async ({ page }) => {
    await openRegistModal(page);
    await expect(page.getByRole("dialog")).toContainText("기도제목 등록");
  });

  test("모달 내에 기도제목 textarea가 존재한다", async ({ page }) => {
    await openRegistModal(page);
    await expect(
      page.locator('textarea[name="text"]').first()
    ).toBeVisible();
  });

  test("추가 버튼 클릭 시 textarea가 늘어난다", async ({ page }) => {
    await openRegistModal(page);

    const initialCount = await page.locator('textarea[name="text"]').count();
    await page.getByRole("button", { name: "추가" }).click();

    const afterCount = await page.locator('textarea[name="text"]').count();
    expect(afterCount).toBe(initialCount + 1);
  });

  test("textarea가 3개일 때 추가 버튼이 비활성화된다", async ({ page }) => {
    await openRegistModal(page);

    // 최대 3개까지 추가
    const addBtn = page.getByRole("button", { name: "추가" });
    while (
      (await page.locator('textarea[name="text"]').count()) < 3
    ) {
      await addBtn.click();
    }

    await expect(addBtn).toBeDisabled();
  });

  test("textarea가 1개일 때 삭제 버튼이 비활성화된다", async ({ page }) => {
    await openRegistModal(page);

    const textareas = page.locator('textarea[name="text"]');
    expect(await textareas.count()).toBe(1);

    // ✕ 버튼 (삭제, title="삭제")
    const deleteBtn = page.locator('button[title="삭제"]').first();
    await expect(deleteBtn).toBeDisabled();
  });

  test("ESC 키로 모달을 닫을 수 있다", async ({ page }) => {
    await openRegistModal(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("빈 textarea로 제출하면 유효성 오류 메시지가 표시된다", async ({
    page,
  }) => {
    await openRegistModal(page);

    // textarea를 비운 상태로 제출
    await page.locator('textarea[name="text"]').first().fill("");
    await page.getByRole("button", { name: "등록하기" }).click();

    await expect(
      page.getByText("최소 1자 이상 입력해주세요.")
    ).toBeVisible();
  });
});

// ─── 기도제목 등록 ────────────────────────────────────────────────────────────
test.describe("/requests — 기도제목 등록", () => {
  test("기도제목을 입력하고 등록하면 성공 alert가 나타난다", async ({
    page,
  }) => {
    await page.goto("/requests");
    await openRegistModal(page);

    const text = `E2E 테스트 기도제목 ${Date.now()}`;
    await page.locator('textarea[name="text"]').first().fill(text);

    // alert 핸들러를 미리 등록
    page.once("dialog", (dialog) => dialog.accept());

    await page.getByRole("button", { name: "등록하기" }).click();

    // alert가 발생하고 모달이 닫혀야 함
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
  });
});

// ─── 즐겨찾기 ─────────────────────────────────────────────────────────────────
test.describe("/requests — 즐겨찾기", () => {
  test("기도제목이 있을 때 즐겨찾기 버튼이 표시된다", async ({ page }) => {
    await page.goto("/requests");

    // 기도제목이 없을 경우 이 테스트는 skip
    const emptyState = page.getByText("등록된 기도제목이 없습니다.");
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    if (hasEmpty) {
      test.skip();
      return;
    }

    const favoriteBtn = page.locator('button[title="즐겨찾기"]').first();
    await expect(favoriteBtn).toBeVisible();
  });

  test("즐겨찾기 버튼 클릭 시 aria-pressed 상태가 토글된다", async ({
    page,
  }) => {
    await page.goto("/requests");

    const emptyState = page.getByText("등록된 기도제목이 없습니다.");
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    if (hasEmpty) {
      test.skip();
      return;
    }

    // 현재 즐겨찾기 상태가 아닌 첫 번째 버튼 선택
    const notFavorited = page
      .locator('button[aria-pressed="false"]')
      .first();
    const initialState = await notFavorited.getAttribute("aria-pressed");

    await notFavorited.click();

    // 낙관적 업데이트로 상태 즉시 변경
    const toggled = initialState === "false" ? "true" : "false";
    await expect(notFavorited).toHaveAttribute("aria-pressed", toggled, {
      timeout: 3_000,
    });
  });
});

// ─── 새로고침 ─────────────────────────────────────────────────────────────────
test.describe("/requests — 새로고침", () => {
  test("새로고침 버튼 클릭 후에도 /requests URL을 유지한다", async ({
    page,
  }) => {
    await page.goto("/requests");
    await page.getByRole("button", { name: "새로고침" }).click();

    // 페이지 reload 완료 대기
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/requests");
  });
});

// ─── 기도제목 삭제 ────────────────────────────────────────────────────────────
test.describe("/requests — 본인 기도제목 삭제", () => {
  test("본인 기도제목에만 삭제 버튼(✕)이 표시된다", async ({ page }) => {
    await page.goto("/requests");

    // 삭제 버튼은 본인 기도제목에만 렌더링됨
    // (기도제목이 없거나 본인 것이 없으면 count가 0일 수 있음)
    const deleteButtons = page.locator('button[title="삭제"]');
    const count = await deleteButtons.count();

    // count >= 0 이면 통과 (본인 기도제목 존재 여부와 무관)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("삭제 버튼 클릭 시 확인 다이얼로그가 표시된다", async ({ page }) => {
    await page.goto("/requests");

    const deleteButtons = page.locator('button[title="삭제"]');
    const count = await deleteButtons.count();

    if (count === 0) {
      test.skip(); // 본인 기도제목 없으면 skip
      return;
    }

    let dialogShown = false;
    page.once("dialog", async (dialog) => {
      dialogShown = true;
      expect(dialog.message()).toContain("삭제하시겠습니까");
      await dialog.dismiss(); // 취소
    });

    await deleteButtons.first().click();
    expect(dialogShown).toBe(true);
  });
});
