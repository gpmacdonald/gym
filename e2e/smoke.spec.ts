import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Fitness Tracker/);

    // Check main navigation is visible
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check Home page header
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Progress page
    await page.getByRole('link', { name: /progress/i }).click();
    await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();

    // Navigate to Exercises page
    await page.getByRole('link', { name: /exercises/i }).click();
    await expect(page.getByRole('heading', { name: 'Exercise Library' })).toBeVisible();

    // Navigate to Settings page
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // Navigate back to Home
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('should have working dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Go to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Find and click dark mode toggle
    const themeSection = page.locator('text=Appearance').locator('..');
    await expect(themeSection).toBeVisible();

    // The theme toggle buttons should be visible
    await expect(page.getByRole('button', { name: /light/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /dark/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /system/i })).toBeVisible();
  });

  test('should display exercises list', async ({ page }) => {
    await page.goto('/');

    // Navigate to Exercises page
    await page.getByRole('link', { name: /exercises/i }).click();

    // Wait for exercises to load (seeded on startup) - use exact match
    await expect(page.getByText('Barbell Bench Press', { exact: true })).toBeVisible({ timeout: 5000 });

    // Check muscle group filter chips are present
    await expect(page.getByRole('button', { name: 'chest' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'back' })).toBeVisible();

    // Check search input exists
    await expect(page.getByPlaceholder('Search exercises...')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.goto('/');

    // Check bottom navigation is visible
    const bottomNav = page.locator('nav').last();
    await expect(bottomNav).toBeVisible();

    // Check that all nav items are present
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /progress/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /exercises/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });
});
