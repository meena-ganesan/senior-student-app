const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');
  });

  test('should display the login form correctly', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Senior-Student Volunteer Connection/);
    
    // Check if the login form is visible
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    
    // Check if the email input is present
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    
    // Check if the password input is present
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
    
    // Check if the login button is present
    const loginButton = page.getByRole('button', { name: /login|sign in/i });
    await expect(loginButton).toBeVisible();
    
    // Check if there's a link to the registration page
    const registerLink = page.getByRole('link', { name: /register|sign up/i });
    await expect(registerLink).toBeVisible();
  });
  
  test('should show validation errors for empty form submission', async ({ page }) => {
    // Click the login button without filling the form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Check if validation errors are displayed
    const errorMessages = page.locator('.error-message, .validation-error, .alert-danger');
    await expect(errorMessages).toBeVisible();
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in the email field with an invalid email
    await page.getByLabel(/email/i).fill('invalid@example.com');
    
    // Fill in the password field with an invalid password
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Click the login button
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Check if an error message is displayed
    const errorMessage = page.locator('.error-message, .validation-error, .alert-danger');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid|incorrect|wrong/i);
  });
  
  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // Click on the register link
    await page.getByRole('link', { name: /register|sign up/i }).click();
    
    // Check if we're on the register page
    await expect(page).toHaveURL(/.*register/);
  });
});
