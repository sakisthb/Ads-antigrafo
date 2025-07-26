import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
  });

  test('should display dashboard title and main elements', async ({ page }) => {
    // Check if dashboard title is visible
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check if KPI cards are present
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
    
    // Check if sidebar is present
    await expect(page.locator('[data-slot="sidebar"]')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    // Click on campaigns link in sidebar
    await page.click('a[href="/campaigns"]');
    
    // Wait for navigation
    await page.waitForURL('**/campaigns');
    
    // Check if campaigns page loaded
    await expect(page.locator('h1')).toContainText('Campaigns');
  });

  test('should navigate to analytics page', async ({ page }) => {
    // Click on analytics link
    await page.click('a[href="/analytics"]');
    
    // Wait for navigation
    await page.waitForURL('**/analytics');
    
    // Check if analytics page loaded
    await expect(page.locator('h1')).toContainText('Analytics');
  });

  test('should display KPI cards with data', async ({ page }) => {
    // Wait for KPI cards to load
    await page.waitForSelector('[class*="grid"] [class*="card"]');
    
    // Check if KPI cards contain data
    const kpiCards = page.locator('[class*="grid"] [class*="card"]');
    await expect(kpiCards).toHaveCount(4); // Expecting 4 KPI cards
    
    // Check if cards contain values
    for (let i = 0; i < 4; i++) {
      const card = kpiCards.nth(i);
      await expect(card.locator('[class*="text-3xl"]')).toBeVisible();
    }
  });

  test('should display performance chart', async ({ page }) => {
    // Wait for chart to load
    await page.waitForSelector('[class*="recharts"]', { timeout: 10000 });
    
    // Check if chart is visible
    await expect(page.locator('[class*="recharts"]')).toBeVisible();
  });
});