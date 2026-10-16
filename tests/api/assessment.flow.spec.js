import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// ES Module Directory Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Assessment Flow - Step 1: Ratings API', () => {
    let authToken;
    const BASE_URL = 'http://localhost:5000';

    // ----------------------------------------------------
    // SETUP: Run before each test (Signup -> Signin -> Get Token)
    // ----------------------------------------------------
    test.beforeEach(async ({ request }) => {
        const userPassword = 'Password123!';
        const newUser = {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: userPassword,
            confirmPassword: userPassword,
            age: faker.number.int({ min: 18, max: 60 }),
            trustedEmail: faker.internet.email().toLowerCase()
        };

        // 1. Signup Request
        const registerRes = await request.post(`${BASE_URL}/api/auth/signup`, {
            data: newUser,
            headers: { 'Content-Type': 'application/json' }
        });
        expect(registerRes.status()).toBe(201);

        // 2. Signin Request
        const loginRes = await request.post(`${BASE_URL}/api/auth/signin`, {
            data: { 
                email: newUser.email, 
                password: userPassword 
            },
            headers: { 'Content-Type': 'application/json' }
        });

        expect(loginRes.status()).toBe(200);
        
        // 3. Extract Token safely
        const body = await loginRes.json();
        authToken = body.token || body.accessToken;
        expect(authToken).toBeDefined();
    });

    // ----------------------------------------------------
    // TEST 1.1: Submit Valid Assessment Data (snake_case keys)
    // ----------------------------------------------------
    test('1.1 - Submit Valid Step 1 Ratings (Positive Test)', async ({ request }) => {
        
        // Create dummy image if not exists
        const dummyImagePath = path.join(__dirname, 'test-image.jpg');
        if (!fs.existsSync(dummyImagePath)) {
            fs.writeFileSync(dummyImagePath, 'fake image binary string');
        }

        // Send Multipart Data with exact backend key names (snake_case)
        const response = await request.post(`${BASE_URL}/api/full-analysis`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            multipart: {
                // User Demo Fields
                gender: 'Male',
                age: '24',

                // Assessment Ratings (Required by Flask Backend)
                academic_pressure: '5',
                work_pressure: '5',
                academic_performance: '7',
                study_satisfaction: '6',
                job_satisfaction: '7',
                sleeping_hours: '8',
                dietary_habits: '3',
                suicidal_thoughts: '1',
                work_study_hours: '8',
                financial_stress: '3',
                family_mental_illness: '0',

                // Step 2 Text Question
                text: 'Feeling calm and peaceful, managing work-life balance well.',

                // Step 3 Image Upload
                image: {
                    name: 'test-image.jpg',
                    mimeType: 'image/jpeg',
                    buffer: fs.readFileSync(dummyImagePath)
                }
            }
        });

        const responseBody = await response.json();

        // Debug Log on Failure
        if (response.status() !== 200) {
            console.log('API Error Details:', responseBody);
        }

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('final_score');
        expect(responseBody).toHaveProperty('risk_level');
        expect(responseBody).toHaveProperty('main_causes');

        console.log('✅ Full Analysis Completed Successfully!');
        console.log('Final Score:', responseBody.final_score);
        console.log('Risk Level:', responseBody.risk_level);
    });
});