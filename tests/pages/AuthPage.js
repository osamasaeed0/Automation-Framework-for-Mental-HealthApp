// 
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInBtn = page.getByRole('button', { name: /sign in/i });
        this.accountSignIn = page.getByRole('link', { name: 'Sign In' });
        this.createAccountBtn = page.getByRole('link', { name: /create an account/i });
        this.enterName = page.getByRole('textbox', { name: "Enter Your Name " });
        this.enterAge = page.getByRole('spinbutton', { name: 'Enter Your Age' });
        this.emailInput = page.getByRole('textbox', { name: 'Enter Your Email' });
        this.setPassword = page.locator('[name="password"]');
        this.confirmPassword = page.locator('[name="confirmPassword"]');
        this.trustedEmail = page.getByRole('textbox', { name: 'Email of your guardian or trusted friend' });
        this.createAccount = page.getByRole('button', { name: 'Create Account' });
        this.submitButton = page.locator("button[type='submit']:has-text('Sign in')");
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async login(email, password) {
        await this.signInBtn.click();
        await this.accountSignIn.click();
        await this.emailInput.fill(email);
        await this.setPassword.fill(password);
        await this.submitButton.click();
    }
    
}