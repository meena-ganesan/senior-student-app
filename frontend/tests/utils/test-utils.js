/**
 * Utility functions for tests
 */

/**
 * Mock user login
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {Object} user - User object with email, password, and userType
 */
async function mockUserLogin(page, user) {
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
          id: user.userType === 'student' ? 1 : 2,
          email: user.email,
          user_type: user.userType,
          first_name: user.userType === 'student' ? 'Student' : 'Senior',
          last_name: 'User',
          is_active: true,
          is_approved: true
        }
      })
    });
  });
  
  // Fill in login form and submit
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole('button', { name: /login|sign in/i }).click();
  
  // Wait for navigation to dashboard
  await page.waitForURL(/.*dashboard/);
}

/**
 * Mock API response
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} url - URL pattern to mock
 * @param {Object} responseData - Response data
 * @param {number} statusCode - HTTP status code
 */
async function mockApiResponse(page, url, responseData, statusCode = 200) {
  await page.route(url, async route => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(responseData)
    });
  });
}

module.exports = {
  mockUserLogin,
  mockApiResponse
};
