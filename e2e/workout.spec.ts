import { test, expect } from '@playwright/test';

test.describe('Workout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh - go to home page
    await page.goto('/');
  });

  test('should complete a full workout logging flow', async ({ page }) => {
    // Click Start Weight Workout button
    await page.getByRole('button', { name: /start weight workout/i }).click();

    // Should see the workout logger
    await expect(page.getByRole('button', { name: 'Add Exercise' })).toBeVisible();
    await expect(page.getByRole('button', { name: /save workout/i })).toBeDisabled();

    // Add an exercise
    await page.getByRole('button', { name: 'Add Exercise' }).click();

    // Wait for exercise selector modal
    await expect(page.getByRole('heading', { name: 'Select Exercise' })).toBeVisible();

    // Select Barbell Bench Press
    await page.getByText('Barbell Bench Press', { exact: true }).click();

    // Modal should close and exercise card should appear
    await expect(page.getByText('No sets logged yet')).toBeVisible();

    // Add a set - fill in weight and reps
    const weightInput = page.getByRole('spinbutton', { name: 'Weight' });
    const repsInput = page.getByRole('spinbutton', { name: 'Reps' });

    await repsInput.fill('8');
    await weightInput.fill('60');

    // Click Add Set button
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    // Set should be added (format: "8 reps × 60 kg")
    await expect(page.getByText('8 reps × 60 kg')).toBeVisible();

    // Save button should now be enabled
    await expect(page.getByRole('button', { name: /save workout/i })).toBeEnabled();

    // Add another set
    await repsInput.fill('6');
    await weightInput.fill('65');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    await expect(page.getByText('6 reps × 65 kg')).toBeVisible();

    // Save the workout
    await page.getByRole('button', { name: /save workout/i }).click();

    // Should see success message
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Should be back on home page with workout in history
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('should cancel workout without saving', async ({ page }) => {
    // Start workout
    await page.getByRole('button', { name: /start weight workout/i }).click();

    // Add an exercise
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await page.getByText('Barbell Bench Press', { exact: true }).click();

    // Add a set
    await page.getByRole('spinbutton', { name: 'Reps' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('60');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    // Cancel the workout
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Should be back on home, no workout saved
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: /start weight workout/i })).toBeVisible();
  });

  test('should add multiple exercises to a workout', async ({ page }) => {
    // Start workout
    await page.getByRole('button', { name: /start weight workout/i }).click();

    // Add first exercise - Bench Press
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await page.getByText('Barbell Bench Press', { exact: true }).click();
    await page.getByRole('spinbutton', { name: 'Reps' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('60');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    // Add second exercise - Squat
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await page.getByText('Barbell Back Squat', { exact: true }).click();
    await page.getByRole('spinbutton', { name: 'Reps' }).fill('5');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('80');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    // Both exercises should be visible
    await expect(page.getByRole('heading', { name: 'Barbell Bench Press' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Barbell Back Squat' })).toBeVisible();
    await expect(page.getByText('8 reps × 60 kg')).toBeVisible();
    await expect(page.getByText('5 reps × 80 kg')).toBeVisible();

    // Save workout
    await page.getByRole('button', { name: /save workout/i }).click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
  });

  test('should filter exercises in selector', async ({ page }) => {
    // Start workout
    await page.getByRole('button', { name: /start weight workout/i }).click();

    // Open exercise selector
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await expect(page.getByRole('heading', { name: 'Select Exercise' })).toBeVisible();

    // Search for "squat"
    await page.getByPlaceholder(/search/i).fill('squat');

    // Should only show squat exercises
    await expect(page.getByText('Barbell Back Squat')).toBeVisible();
    await expect(page.getByText('Barbell Front Squat')).toBeVisible();
    await expect(page.getByText('Bulgarian Split Squat')).toBeVisible();

    // Bench press should not be visible
    await expect(page.getByText('Barbell Bench Press', { exact: true })).not.toBeVisible();
  });

  test('should remove a set from exercise', async ({ page }) => {
    // Start workout and add exercise
    await page.getByRole('button', { name: /start weight workout/i }).click();
    await page.getByRole('button', { name: 'Add Exercise' }).click();
    await page.getByText('Barbell Bench Press', { exact: true }).click();

    // Add two sets
    await page.getByRole('spinbutton', { name: 'Reps' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('60');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    await page.getByRole('spinbutton', { name: 'Reps' }).fill('6');
    await page.getByRole('spinbutton', { name: 'Weight' }).fill('65');
    await page.getByRole('button', { name: 'Add set', exact: true }).click();

    // Both sets visible
    await expect(page.getByText('8 reps × 60 kg')).toBeVisible();
    await expect(page.getByText('6 reps × 65 kg')).toBeVisible();

    // Remove first set (aria-label is "Remove set 1")
    await page.getByRole('button', { name: 'Remove set 1' }).click();

    // First set should be gone, second still there
    await expect(page.getByText('8 reps × 60 kg')).not.toBeVisible();
    await expect(page.getByText('6 reps × 65 kg')).toBeVisible();
  });
});
