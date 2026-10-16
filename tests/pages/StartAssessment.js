export class AssessmentPage {
    constructor(page) {
        this.page = page;
        this.startAssessmentBtn = page.getByRole('button', { name: 'Start' });
        
        // Handling slider through loop or array 
        this.sliders = [
            page.locator('button').filter({ hasText: '+' }).nth(0),
            page.locator('button').filter({ hasText: '+' }).nth(1),
            page.locator('button').filter({ hasText: '+' }).nth(2),
            page.locator('button').filter({ hasText: '+' }).nth(3),
            page.locator('button').filter({ hasText: '+' }).nth(4),
            page.locator('button').filter({ hasText: '+' }).nth(5),
            page.locator('button').filter({ hasText: '+' }).nth(6),
        ];

        this.toNextStep2 = page.getByRole('button', { name: 'Next' });
        this.emotional = page.locator('[name="emotional"]');
        this.challenge = page.locator('[name="challenge"]');
        this.support = page.locator('[name="support"]');
        this.toNextStep3 = page.getByRole('button', { name: 'Next' });
       
    }

    async startAssessment(sliderCounts, responses) {
        await this.startAssessmentBtn.click();

        // Clicking Sliders through loop
        for (let i = 0; i < this.sliders.length; i++) {
            if (sliderCounts[i]) {
                await this.sliders[i].click({ clickCount: sliderCounts[i] });
            }
        }
        await this.toNextStep2.click();

        // AI text responses filling
        await this.emotional.fill(responses.emotional);
        await this.challenge.fill(responses.challenge);
        await this.support.fill(responses.support);
        await this.toNextStep3.click();
     
       
        
    }
   
}