// import { test as setup } from '@playwright/test';
// import { AuthPage } from '../pages/AuthPage';

// const authFile = '.auth/user.json';

// setup('Authenticate User', async ({ page }) => {
//     const auth = new AuthPage(page);

//     // Sirf yahan Localhost ka link chalega
//     await page.goto('http://localhost:5173');

//     // Aapke fixed user login credentials
//     await auth.signInToAccount('testuser@gmail.com', 'Password123!');

//     // Session status save ho jayega
//     await page.context().storageState({ path: authFile });
// });