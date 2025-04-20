const { test, expect } = require('@playwright/test');

// Mock user data for testing
const mockStudentUser = {
  email: 'student@example.com',
  password: 'password123',
  userType: 'student'
};

const mockSeniorUser = {
  email: 'senior@example.com',
  password: 'password123',
  userType: 'senior'
};

test.describe('Dashboard Pages', () => {
  test.describe('Student Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the login page
      await page.goto('/login');
      
      // Mock the authentication API response
      await page.route('**/api/v1/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-token',
            token_type: 'bearer',
            user: {
              id: 1,
              email: mockStudentUser.email,
              user_type: mockStudentUser.userType,
              first_name: 'Student',
              last_name: 'User',
              is_active: true,
              is_approved: true
            }
          })
        });
      });
      
      // Fill in login form and submit
      await page.getByLabel(/email/i).fill(mockStudentUser.email);
      await page.getByLabel(/password/i).fill(mockStudentUser.password);
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      // Wait for navigation to dashboard
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should display the student dashboard correctly', async ({ page }) => {
      // Check if we're on the dashboard page
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Check if the welcome message is visible
      const welcomeMessage = page.getByText(/welcome|hello|hi/i);
      await expect(welcomeMessage).toBeVisible();
      
      // Check if student-specific elements are visible
      const availableChores = page.getByText(/available chores|find chores/i);
      await expect(availableChores).toBeVisible();
      
      // Check if the navigation menu has the expected links
      await expect(page.getByRole('link', { name: /profile/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /chores/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
    });
  });
  
  test.describe('Senior Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the login page
      await page.goto('/login');
      
      // Mock the authentication API response
      await page.route('**/api/v1/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-token',
            token_type: 'bearer',
            user: {
              id: 2,
              email: mockSeniorUser.email,
              user_type: mockSeniorUser.userType,
              first_name: 'Senior',
              last_name: 'User',
              is_active: true,
              is_approved: true
            }
          })
        });
      });
      
      // Fill in login form and submit
      await page.getByLabel(/email/i).fill(mockSeniorUser.email);
      await page.getByLabel(/password/i).fill(mockSeniorUser.password);
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      // Wait for navigation to dashboard
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should display the senior dashboard correctly', async ({ page }) => {
      // Check if we're on the dashboard page
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Check if the welcome message is visible
      const welcomeMessage = page.getByText(/welcome|hello|hi/i);
      await expect(welcomeMessage).toBeVisible();
      
      // Check if senior-specific elements are visible
      const myChores = page.getByText(/my chores|create chore/i);
      await expect(myChores).toBeVisible();
      
      // Check if the navigation menu has the expected links
      await expect(page.getByRole('link', { name: /profile/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /chores/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
    });
  });
});
