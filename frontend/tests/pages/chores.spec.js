const { test, expect } = require('@playwright/test');

// Mock user data for testing
const mockStudentUser = {
  email: 'student@example.com',
  password: 'password123',
  userType: 'student'
};

// Mock chores data
const mockChores = [
  {
    id: 1,
    title: 'Grocery Shopping',
    description: 'Help with weekly grocery shopping',
    date_needed: '2025-05-01T10:00:00Z',
    estimated_duration: 60,
    status: 'open',
    senior_id: 1,
    senior: {
      id: 1,
      user: {
        first_name: 'Jane',
        last_name: 'Doe'
      }
    }
  },
  {
    id: 2,
    title: 'Yard Work',
    description: 'Help with yard maintenance',
    date_needed: '2025-05-02T14:00:00Z',
    estimated_duration: 120,
    status: 'open',
    senior_id: 2,
    senior: {
      id: 2,
      user: {
        first_name: 'John',
        last_name: 'Smith'
      }
    }
  }
];

test.describe('Chore Pages', () => {
  test.describe('Chore List Page', () => {
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
      
      // Mock the chores API response
      await page.route('**/api/v1/chores', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockChores)
        });
      });
      
      // Fill in login form and submit
      await page.getByLabel(/email/i).fill(mockStudentUser.email);
      await page.getByLabel(/password/i).fill(mockStudentUser.password);
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      // Navigate to the chores page
      await page.goto('/chores');
    });
    
    test('should display the chore list correctly', async ({ page }) => {
      // Check if we're on the chores page
      await expect(page).toHaveURL(/.*chores/);
      
      // Check if the page title/heading is visible
      const pageTitle = page.getByRole('heading', { name: /chores|available chores/i });
      await expect(pageTitle).toBeVisible();
      
      // Check if the chore items are displayed
      const choreItems = page.locator('.chore-item, .chore-card');
      await expect(choreItems).toHaveCount(mockChores.length);
      
      // Check if the first chore title is visible
      const firstChoreTitle = page.getByText(mockChores[0].title);
      await expect(firstChoreTitle).toBeVisible();
      
      // Check if the second chore title is visible
      const secondChoreTitle = page.getByText(mockChores[1].title);
      await expect(secondChoreTitle).toBeVisible();
    });
    
    test('should navigate to chore detail page when a chore is clicked', async ({ page }) => {
      // Click on the first chore
      const firstChoreTitle = page.getByText(mockChores[0].title);
      await firstChoreTitle.click();
      
      // Check if we're on the chore detail page
      await expect(page).toHaveURL(/.*chores\/1/);
    });
  });
  
  test.describe('Chore Detail Page', () => {
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
      
      // Mock the chore detail API response
      await page.route('**/api/v1/chores/1', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockChores[0])
        });
      });
      
      // Fill in login form and submit
      await page.getByLabel(/email/i).fill(mockStudentUser.email);
      await page.getByLabel(/password/i).fill(mockStudentUser.password);
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      // Navigate to the chore detail page
      await page.goto('/chores/1');
    });
    
    test('should display the chore details correctly', async ({ page }) => {
      // Check if we're on the chore detail page
      await expect(page).toHaveURL(/.*chores\/1/);
      
      // Check if the chore title is visible
      const choreTitle = page.getByRole('heading', { name: mockChores[0].title });
      await expect(choreTitle).toBeVisible();
      
      // Check if the chore description is visible
      const choreDescription = page.getByText(mockChores[0].description);
      await expect(choreDescription).toBeVisible();
      
      // Check if the senior's name is visible
      const seniorName = page.getByText(`${mockChores[0].senior.user.first_name} ${mockChores[0].senior.user.last_name}`);
      await expect(seniorName).toBeVisible();
      
      // Check if the date needed is visible
      const dateNeeded = page.getByText(/May 1, 2025|05\/01\/2025|2025-05-01/);
      await expect(dateNeeded).toBeVisible();
      
      // Check if the estimated duration is visible
      const duration = page.getByText(/60 minutes|1 hour/);
      await expect(duration).toBeVisible();
      
      // Check if the volunteer button is visible for students
      const volunteerButton = page.getByRole('button', { name: /volunteer|accept|help/i });
      await expect(volunteerButton).toBeVisible();
    });
    
    test('should have a back button that returns to the chore list', async ({ page }) => {
      // Check if the back button is visible
      const backButton = page.getByRole('link', { name: /back|return/i });
      await expect(backButton).toBeVisible();
      
      // Click the back button
      await backButton.click();
      
      // Check if we're back on the chores list page
      await expect(page).toHaveURL(/.*chores$/);
    });
  });
});
