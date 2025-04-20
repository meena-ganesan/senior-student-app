# Frontend Tests

This directory contains tests for the Senior-Student Volunteer Connection frontend application.

## Test Structure

- `auth/`: Tests for authentication functionality (login, register)
- `pages/`: Tests for different pages in the application
- `components/`: Tests for individual components
- `utils/`: Utility functions for testing

## Running Tests

### End-to-End Tests with Playwright

To run all Playwright tests:

```bash
npm run e2e
```

To run tests with UI mode (for debugging):

```bash
npm run e2e:ui
```

To run tests in debug mode:

```bash
npm run e2e:debug
```

To view the last test report:

```bash
npm run e2e:report
```

### Unit Tests with Jest

To run unit tests:

```bash
npm test
```

## Test Configuration

The Playwright tests are configured in `playwright.config.js` in the root directory. The configuration includes:

- Browser configurations (Chrome, Firefox, Safari, mobile browsers)
- Test timeouts and retries
- Screenshot and trace settings
- Web server configuration

## Writing Tests

### End-to-End Tests

End-to-end tests use Playwright to simulate user interactions with the application. These tests should focus on user flows and integration between components.

Example:

```javascript
test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### Unit Tests

Unit tests use Jest and React Testing Library to test individual components in isolation. These tests should focus on component behavior and rendering.

Example:

```javascript
test('Button renders correctly', () => {
  render(<Button label="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Mocking

The tests use mocking to simulate API responses and avoid making actual network requests. See `utils/test-utils.js` for helper functions to set up mocks.

## Continuous Integration

The tests are automatically run in GitHub Actions on push and pull requests to the main branch. See `.github/workflows/playwright.yml` for the configuration.
