const { test, expect } = require('@playwright/test');

test.describe('Registration Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page before each test
    await page.goto('/register');
  });

  test('should display the registration form correctly', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Senior-Student Volunteer Connection/);
    
    // Check if the registration form is visible
    const registerForm = page.locator('form');
    await expect(registerForm).toBeVisible();
    
    // Check if the email input is present
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    
    // Check if the password input is present
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
    
    // Check if the first name input is present
    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible();
    
    // Check if the last name input is present
    const lastNameInput = page.getByLabel(/last name/i);
    await expect(lastNameInput).toBeVisible();
    
    // Check if the user type selection is present (student or senior)
    const userTypeSelection = page.locator('input[type="radio"], select');
    await expect(userTypeSelection).toBeVisible();
    
    // Check if the register button is present
    const registerButton = page.getByRole('button', { name: /register|sign up|create account/i });
    await expect(registerButton).toBeVisible();
    
    // Check if there's a link to the login page
    const loginLink = page.getByRole('link', { name: /login|sign in/i });
    await expect(loginLink).toBeVisible();
  });
  
  test('should show validation errors for empty form submission', async ({ page }) => {
    // Click the register button without filling the form
    await page.getByRole('button', { name: /register|sign up|create account/i }).click();
    
    // Check if validation errors are displayed
    const errorMessages = page.locator('.error-message, .validation-error, .alert-danger');
    await expect(errorMessages).toBeVisible();
  });
  
  test('should show error for invalid email format', async ({ page }) => {
    // Fill in the email field with an invalid email format
    await page.getByLabel(/email/i).fill('invalidemail');
    
    // Fill in other required fields
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/password/i).fill('password123');
    
    // Select a user type (assuming radio buttons)
    await page.locator('input[type="radio"][value="student"]').click();
    
    // Click the register button
    await page.getByRole('button', { name: /register|sign up|create account/i }).click();
    
    // Check if an error message about invalid email is displayed
    const errorMessage = page.locator('.error-message, .validation-error, .alert-danger');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/email|invalid/i);
  });
  
  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Click on the login link
    await page.getByRole('link', { name: /login|sign in/i }).click();
    
    // Check if we're on the login page
    await expect(page).toHaveURL(/.*login/);
  });
});
