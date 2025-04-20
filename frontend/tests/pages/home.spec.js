const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check if the title is correct
    await expect(page).toHaveTitle(/Senior-Student Volunteer Connection/);
    
    // Check if the main heading is visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Check if there are navigation links
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(3); // Assuming there are 3 nav links: Home, Login, Register
    
    // Check if the login and register links are present
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
    
    // Check if the footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
  
  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Click on the login link
    await page.getByRole('link', { name: /login/i }).click();
    
    // Check if we're on the login page
    await expect(page).toHaveURL(/.*login/);
    
    // Check if the login form is visible
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });
  
  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Click on the register link
    await page.getByRole('link', { name: /register/i }).click();
    
    // Check if we're on the register page
    await expect(page).toHaveURL(/.*register/);
    
    // Check if the register form is visible
    const registerForm = page.locator('form');
    await expect(registerForm).toBeVisible();
  });
});
