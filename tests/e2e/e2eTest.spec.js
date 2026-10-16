
import { test, expect } from '../fixtures/pageFixtures';
import { RouteManager } from '../utils/routeManager.js';

test('Complete Assessment Flow with Validation', async ({ 
    loginPage, 
    assessmentPage, 
    capturePage, 
    testData, 
    page 
}) => {
    // 1. Intercept network call using RouteManager
        await RouteManager.mockFullAnalysis(page);
    
    // 1. Login
    await loginPage.navigate(testData.url);
    await loginPage.login(testData.user.email, testData.user.password);

    // 2. Start Assessment
    await assessmentPage.startAssessment(testData.sliders, testData.responses);

    // 3. Photo Capture & Submit
    await capturePage.CapturePhotoAndResult();


});