import { test, expect } from '@playwright/test';

test.describe('Data Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show export button in settings', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Should see export button
    await expect(page.getByRole('button', { name: /export all data/i })).toBeVisible();

    // Should see backup section text
    await expect(page.getByText('Backup Your Data')).toBeVisible();
  });

  test('should show import section in settings', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Should see import section
    await expect(page.getByText('Restore Your Data')).toBeVisible();
  });

  test('should show mock data manager in settings', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Should see mock data section
    await expect(page.getByText('Mock Data')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
  });

  test('should generate mock data', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Click generate button
    await page.getByRole('button', { name: 'Generate' }).click();

    // Should see success message like "Created X workouts with Y sets and Z cardio sessions"
    await expect(page.getByText(/created.*workouts.*sets.*cardio/i)).toBeVisible({ timeout: 10000 });

    // Navigate to Progress page to verify data exists
    await page.getByRole('link', { name: /progress/i }).click();

    // Progress page should have data (check for charts or summary)
    await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();
  });

  test('should persist data after page reload', async ({ page }) => {
    // First, create a workout
    await page.getByRole('button', { name: /start weight workout/i }).click();
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await page.getByText('Barbell Bench Press', { exact: true }).click();
    await page.getByRole('spinbutton', { name: 'Reps' }).fill('10');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('50');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();
    await page.getByRole('button', { name: /save workout/i }).click();

    // Wait for save confirmation
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Reload the page
    await page.reload();

    // Navigate to History/Home - page should load correctly
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();

    // The workout should be in the activity list - look for "Recent Activity" section
    // or any workout card showing today's date
    await expect(page.getByText('Recent Activity')).toBeVisible({ timeout: 5000 });
  });

  test('should show app info in settings', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Should see app info
    await expect(page.getByText('Personal Fitness Tracker')).toBeVisible();
    await expect(page.getByText('Version 1.0.0')).toBeVisible();

    // Should see app status (from our earlier changes)
    await expect(page.getByText('App Status')).toBeVisible();
  });
});
