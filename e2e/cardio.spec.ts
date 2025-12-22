import { test, expect } from '@playwright/test';

test.describe('Cardio Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete a treadmill session', async ({ page }) => {
    // Switch to cardio mode using the toggle
    await page.getByRole('button', { name: /cardio/i }).click();

    // Start cardio workout
    await page.getByRole('button', { name: /start cardio workout/i }).click();

    // Should see cardio type selector
    await expect(page.getByText('Select Cardio Type')).toBeVisible();

    // Select Treadmill
    await page.getByRole('button', { name: 'Treadmill' }).click();

    // Fill in the form - Duration is required
    // Duration input uses spinbuttons
    await page.getByRole('spinbutton', { name: 'Minutes' }).fill('30');

    // Distance (input has text label "Distance (km)")
    await page.locator('input[type="number"]').nth(1).fill('5');

    // Save the session
    await page.getByRole('button', { name: /save session/i }).click();

    // Should see success message
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Should be back on home page
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('should complete a bike session', async ({ page }) => {
    // Switch to cardio mode
    await page.getByRole('button', { name: /cardio/i }).click();

    // Start cardio workout
    await page.getByRole('button', { name: /start cardio workout/i }).click();

    // Select Bike
    await page.getByRole('button', { name: 'Bike' }).click();

    // Fill in the form - Duration is required
    await page.getByRole('spinbutton', { name: 'Minutes' }).fill('20');

    // Distance
    await page.locator('input[type="number"]').nth(1).fill('10');

    // Save the session
    await page.getByRole('button', { name: /save session/i }).click();

    // Should see success message
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
  });

  test('should cancel cardio session', async ({ page }) => {
    // Switch to cardio mode
    await page.getByRole('button', { name: /cardio/i }).click();

    // Start cardio workout
    await page.getByRole('button', { name: /start cardio workout/i }).click();

    // Should see cardio type selector
    await expect(page.getByText('Select Cardio Type')).toBeVisible();

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Should be back on home page with start button
    await expect(page.getByRole('button', { name: /start cardio workout/i })).toBeVisible();
  });

  test('should go back from form to type selection', async ({ page }) => {
    // Switch to cardio mode
    await page.getByRole('button', { name: /cardio/i }).click();

    // Start cardio workout
    await page.getByRole('button', { name: /start cardio workout/i }).click();

    // Select Treadmill
    await page.getByRole('button', { name: 'Treadmill' }).click();

    // Should see duration form
    await expect(page.getByRole('spinbutton', { name: 'Minutes' })).toBeVisible();

    // Click back/cancel to go back to type selection
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Should see type selector again
    await expect(page.getByText('Select Cardio Type')).toBeVisible();
  });
});
