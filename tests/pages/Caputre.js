export class CapturePhoto {
    constructor(page) {
        this.page = page;
        this.TakePicture = page.getByRole('button', { name: 'Capture Photo' })
        this.SubmitAssessment = page.getByRole('button', { name: 'Submit Assessment' })
        this.ViewResult =  page.getByRole('button', { name: 'View Results' })
        this.ViewGuidance = page.getByRole('button', { name: 'Get Guidance' })
    }

       async CapturePhotoAndResult() {
    // 1. Waiting for Camera
    await this.page.waitForTimeout(5000); 

    // 2. Waiting for this button to be visible 'Capture Photo'
    await this.TakePicture.waitFor({ state: 'visible' });
    await this.TakePicture.click();

    await this.page.waitForTimeout(2000);

    // 4. 'Submit Assessment' button click karein
    await this.SubmitAssessment.waitFor({ state: 'visible' });
    await this.SubmitAssessment.click();
    
    await this.ViewResult.click()
      await this.page.waitForTimeout(3000);
    await this.ViewGuidance.click()

    
}
}