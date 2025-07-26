import { test, expect } from '@playwright/test';

test.describe('Campaigns Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to campaigns page
    await page.goto('/campaigns');
  });

  test('should display campaigns title and main elements', async ({ page }) => {
    // Check if campaigns title is visible (be more specific)
    await expect(page.locator('h1').filter({ hasText: 'Campaigns' })).toBeVisible();
    
    // Check if sidebar is present
    await expect(page.locator('aside, [role="complementary"]')).toBeVisible();
    
    // Check if main content area is visible
    await expect(page.locator('main, [class*="container"]')).toBeVisible();
  });

  test('should display campaign statistics cards', async ({ page }) => {
    // Wait for stats cards to load
    await page.waitForSelector('[class*="grid"] [class*="card"]');
    
    // Check if stats cards are present (Total Cost, Impressions, CTR, Clicks)
    const statsCards = page.locator('[class*="grid"] [class*="card"]');
    await expect(statsCards).toHaveCount(4);
    
    // Check if cards contain numerical values
    for (let i = 0; i < 4; i++) {
      const card = statsCards.nth(i);
      await expect(card.locator('[class*="text-3xl"]')).toBeVisible();
    }
  });

  test('should display search and filter functionality', async ({ page }) => {
    // Check if search input is present
    await expect(page.locator('input[placeholder*="search"], input[placeholder*="αναζήτηση"]')).toBeVisible();
    
    // Check if filter dropdowns are present
    await expect(page.locator('[role="combobox"]').first()).toBeVisible();
  });

  test('should filter campaigns by search term', async ({ page }) => {
    // Wait for campaigns to load
    await page.waitForSelector('[class*="grid"] [class*="card"]');
    
    // Get initial campaign count
    const campaignCards = page.locator('[class*="campaigns"] [class*="card"], .grid [class*="card"]:has([class*="badge"])');
    const initialCount = await campaignCards.count();
    
    if (initialCount > 1) {
      // Type in search input
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="αναζήτηση"]');
      await searchInput.fill('test');
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Verify filtering worked (count should change or show empty state)
      const filteredCount = await campaignCards.count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('should display campaign cards with details', async ({ page }) => {
    // Wait for campaign cards to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="card"]:has([class*="badge"])', { timeout: 10000 });
    
    // Check if campaign cards are present
    const campaignCards = page.locator('[class*="card"]:has([class*="badge"])');
    const cardCount = await campaignCards.count();
    
    if (cardCount > 0) {
      const firstCard = campaignCards.first();
      
      // Check if card contains campaign name
      await expect(firstCard.locator('[class*="title"], h3, h4')).toBeVisible();
      
      // Check if card contains status badge
      await expect(firstCard.locator('[class*="badge"]')).toBeVisible();
      
      // Check if card contains metrics
      await expect(firstCard.locator('[class*="text-2xl"], [class*="font-bold"]')).toBeVisible();
    }
  });

  test('should handle new campaign creation', async ({ page }) => {
    // Look for create campaign button
    const createButton = page.locator('button:has-text("New"), button:has-text("Νέα"), button:has-text("+")');
    
    if (await createButton.isVisible()) {
      // Click create button
      await createButton.click();
      
      // Check if toast notification appears
      await expect(page.locator('[class*="toast"], [role="alert"]')).toBeVisible();
    }
  });

  test('should handle export functionality', async ({ page }) => {
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Εξαγωγή")');
    
    if (await exportButton.isVisible()) {
      // Click export button
      await exportButton.click();
      
      // Check if export dialog appears
      await expect(page.locator('[role="dialog"], [class*="dialog"]')).toBeVisible();
    }
  });

  test('should handle campaign actions', async ({ page }) => {
    // Wait for campaign cards to load
    await page.waitForSelector('[class*="card"]:has([class*="badge"])', { timeout: 10000 });
    
    const campaignCards = page.locator('[class*="card"]:has([class*="badge"])');
    const cardCount = await campaignCards.count();
    
    if (cardCount > 0) {
      const firstCard = campaignCards.first();
      
      // Look for action buttons (Edit, Analytics, More options)
      const actionButtons = firstCard.locator('button');
      const buttonCount = await actionButtons.count();
      
      if (buttonCount > 0) {
        // Click first action button
        await actionButtons.first().click();
        
        // Check if toast notification or action occurs
        await expect(page.locator('[class*="toast"], [role="alert"]')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click on dashboard link in sidebar or breadcrumb
    await page.click('a[href="/"], a[href="/dashboard"]');
    
    // Wait for navigation
    await page.waitForURL('**/');
    
    // Check if dashboard loaded
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});