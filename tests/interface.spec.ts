import { test, expect } from "@playwright/test";

test("deve carregar a página inicial da aplicação", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/visualizador|logs|sondagem|vite/i);
});

test("deve exibir algum conteúdo na tela inicial", async ({ page }) => {
  await page.goto("/");

  const body = page.locator("body");

  await expect(body).toBeVisible();
});
