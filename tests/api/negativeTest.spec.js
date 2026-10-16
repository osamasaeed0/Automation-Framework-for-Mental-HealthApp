import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
test.describe.configure({ mode: 'parallel' });

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5000';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, 'fixtures', 'WhatsApp Image.jpeg');

async function createAuthenticatedUser(request) {
  const password = 'Password123!';
  const email = faker.internet.email().toLowerCase();

  const signup = await request.post(`${BASE_URL}/api/auth/signup`, {
    data: {
      name: faker.person.fullName(),
      email,
      password,
      confirmPassword: password,
      age: 24,
      trustedEmail: faker.internet.email().toLowerCase(),
    },
  });

  expect(
    signup.status(),
    `Signup failed: ${await signup.text()}`
  ).toBe(201);

  const signin = await request.post(`${BASE_URL}/api/auth/signin`, {
    data: { email, password },
  });

  expect(
    signin.status(),
    `Signin failed: ${await signin.text()}`
  ).toBe(200);

  const body = await signin.json();
  const token = body.token ?? body.accessToken;

  expect(token, 'Signin response must contain a token').toEqual(
    expect.any(String)
  );
  expect(token.length).toBeGreaterThan(0);

  return token;
}

function makeAnalysisPayload(image) {
  return {
    gender: 'Male',
    age: '24',
    academic_pressure: '10',
    work_pressure: '10',
    academic_performance: '7',
    study_satisfaction: '10',
    job_satisfaction: '7',
    sleeping_hours: '8',
    dietary_habits: '10',
    suicidal_thoughts: '10',
    work_study_hours: '8',
    financial_stress: '10',
    family_mental_illness: '1',
    text: 'Feeling calm and managing work-life balance well.',
    image: {
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: image,
    },
  };
}

test('full analysis returns a result for valid input', async ({ request }) => {
  const image = fs.readFileSync(imagePath);
  const token = await createAuthenticatedUser(request);

  const response = await request.post(`${BASE_URL}/api/full-analysis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    
    multipart: makeAnalysisPayload(image),
  });

  const rawBody = await response.text();

  expect(
    response.status(),
    `Full analysis failed: ${rawBody}`
  ).toBe(200);

  const result = JSON.parse(rawBody);

  expect(result).toEqual(
    expect.objectContaining({
      final_score: expect.any(Number),
      risk_level: expect.any(String),
      main_causes: expect.any(Array),
    })
  );

  expect(Number.isFinite(result.final_score)).toBe(true);
  expect(result.risk_level.length).toBeGreaterThan(0);

  console.log('\n✅ Full Analysis API Result:');
  console.log('-----------------------------------');
  console.log('Final Score :', result.final_score);
  console.log('Risk Level  :', result.risk_level);
  console.log('Main Causes :', result.main_causes);
  console.log('-----------------------------------\n');
});

test('full analysis rejects a missing token', async ({ request }) => {
  const image = fs.readFileSync(imagePath);

  const response = await request.post(`${BASE_URL}/api/full-analysis`, {
    multipart: makeAnalysisPayload(image),
  });

  const rawBody = await response.text();

  expect(
    response.status(),
    `Expected 401 for missing token, got: ${rawBody}`
  ).toBe(401);
  console.log('Missing token status:', response.status());
});

test('full analysis rejects an invalid token', async ({ request }) => {
  const image = fs.readFileSync(imagePath);

  const response = await request.post(`${BASE_URL}/api/full-analysis`, {
    headers: {
      Authorization: 'Bearer this-is-not-a-real-token',
    },
    multipart: makeAnalysisPayload(image),
  });

  const rawBody = await response.text();

  expect(
    response.status(),
    `Expected 401 for invalid token, got: ${rawBody}`
  ).toBe(401);
});