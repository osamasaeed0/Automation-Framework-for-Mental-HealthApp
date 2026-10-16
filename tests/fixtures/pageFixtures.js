import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/AuthPage';
import { AssessmentPage } from '../pages/StartAssessment';
import { CapturePhoto } from '../pages/Caputre';
import { testData } from '../pages/TestData';

// Custom Fixtures export kar rahe hain
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    assessmentPage: async ({ page }, use) => {
        await use(new AssessmentPage(page));
    },
    capturePage: async ({ page }, use) => {
        await use(new CapturePhoto(page));
    },
    testData: async ({}, use) => {
        await use(testData);
    }
});

export { expect } from '@playwright/test';