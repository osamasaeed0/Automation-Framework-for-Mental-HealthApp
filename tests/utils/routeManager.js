// Fix 1: Updated import attribute syntax (assert -> with)
import aiResultData from '../fixtures/mockData/aiResult.json' with { type: 'json' };

export class RouteManager {
    /**
     * Intercepts the single consolidated full-analysis endpoint.
     * 
     * @param {import('@playwright/test').Page} page
     * @param {string} endpointUrl - Endpoint URL pattern
     * @param {number} status - Expected HTTP status code (Default: 200)
     * @param {object|null} customError - Custom error object for non-200 responses
     */
    static async mockFullAnalysis(
        page, 
        endpointUrl = '**/api/full-analysis*', 
        status = 200,
        customError = null
    ) {
        await page.route(endpointUrl, async route => {
            const request = route.request();

            // Log POST payload for debugging
            if (request.method() === 'POST') {
                console.log('[RouteManager] Intercepted Full Analysis Submission:', request.postData());
            }

            if (status === 200) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: aiResultData
                });
            } else {
                // Fix 3: Dynamic error responses
                await route.fulfill({
                    status: status,
                    contentType: 'application/json',
                    json: customError || {
                        success: false,
                        statusCode: status,
                        error: status === 401 ? 'Unauthorized Access' : 'AI Analysis Engine Error'
                    }
                });
            }
        });
    }

    /**
     * Fault-Injection helper to simulate network delay/latency
     */
    static async mockFullAnalysisWithDelay(
        page, 
        endpointUrl = '**/api/full-analysis*', 
        delayMs = 3000
    ) {
        await page.route(endpointUrl, async route => {
            // Artificial latency simulation
            await new Promise(resolve => setTimeout(resolve, delayMs));
            
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: aiResultData
            });
        });
    }

    /**
     * Fix 5: Cleanup method to remove active routes
     */
    static async clearRoutes(page, endpointUrl = '**/api/v1/assessment/full-analysis*') {
        await page.unroute(endpointUrl);
    }
}