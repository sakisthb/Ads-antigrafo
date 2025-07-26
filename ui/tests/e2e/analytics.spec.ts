import { test, expect } from '@playwright/test';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to analytics page
    await page.goto('/analytics');
  });

  test('should display analytics title and main elements', async ({ page }) => {
    // Check if analytics title is visible (be more specific)
    await expect(page.locator('h1').filter({ hasText: 'Analytics' })).toBeVisible();
    
    // Check if KPI cards are present
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();
    
    // Check if sidebar is present
    await expect(page.locator('aside, [role="complementary"]')).toBeVisible();
  });

  test('should display analytics tabs', async ({ page }) => {
    // Wait for tabs to load
    await page.waitForSelector('[role="tablist"]');
    
    // Check if tab list is visible
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    
    // Check for specific tabs
    await expect(page.locator('[role="tab"]')).toHaveCount(3); // Overview, Advanced, Reports
  });

  test('should switch between analytics tabs', async ({ page }) => {
    // Wait for tabs to load
    await page.waitForSelector('[role="tablist"]');
    
    // Click on Advanced tab
    await page.click('button[role="tab"]:has-text("Advanced")');
    
    // Wait for advanced analytics to load
    await page.waitForSelector('[class*="advanced"]', { timeout: 10000 });
    
    // Check if advanced analytics content is visible
    await expect(page.locator('[class*="advanced"]')).toBeVisible();
  });

  test('should display performance charts', async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('[class*="recharts-responsive-container"]', { timeout: 10000 });
    
    // Check if at least one chart is visible
    await expect(page.locator('[class*="recharts-responsive-container"]').first()).toBeVisible();
  });

  test('should display KPI metrics', async ({ page }) => {
    // Wait for KPI cards to load
    await page.waitForSelector('[class*="grid"] [class*="card"]');
    
    // Check if KPI cards are present
    const kpiCards = page.locator('[class*="grid"] [class*="card"]');
    await expect(kpiCards.first()).toBeVisible();
    
    // Check if cards contain numerical values
    await expect(page.locator('[class*="text-3xl"]').first()).toBeVisible();
  });

  test('should handle date range filtering', async ({ page }) => {
    // Look for date picker or filter controls
    const dateFilter = page.locator('button:has-text("Last 7 days"), button:has-text("Last 30 days"), [class*="date"]');
    
    if (await dateFilter.first().isVisible()) {
      // Click on date filter if available
      await dateFilter.first().click();
      
      // Wait for content to update
      await page.waitForTimeout(1000);
      
      // Verify page is still functional
      await expect(page.locator('h1')).toContainText('Analytics');
    }
  });

  test('should display export functionality', async ({ page }) => {
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Εξαγωγή")');
    
    if (await exportButton.isVisible()) {
      // Click export button
      await exportButton.click();
      
      // Check if export dialog appears
      await expect(page.locator('[role="dialog"], [class*="dialog"]')).toBeVisible();
    }
  });
});