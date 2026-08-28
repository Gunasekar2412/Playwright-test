import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly loginField: Locator;
    readonly passwordField: Locator;
    readonly submitFormButton: Locator;
    readonly loginErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginField = page.locator('[id="loginForm\\:j_username"]');
        this.passwordField = page.locator('[id="loginForm\\:j_password"]');
        this.submitFormButton = page.locator('[id="loginForm\\:submitForm"]');
        this.loginErrorMessage = page.getByText('Wrong password or user name');
    }

    async goto() {
        await this.page.goto(process.env.EIS_PORTAL_BASE_URL!, {
            timeout: 180000, // 3 minutes (in milliseconds)
            waitUntil: 'load' // optional (default)
        });
    }

    async login(username: string, password: string) {
        await this.loginField.fill(username);
        await this.passwordField.fill(password);

        await this.submitFormButton.click();
    }

    async expectCorrectLoginRedirect() {
        await expect(this.page).toHaveURL(/work-list\.xhtml/);
        await expect(this.loginErrorMessage).not.toBeVisible();
    }

    async expectIncorrectLoginRedirect() {
        await expect(this.page).toHaveURL(/login\.xhtml/);
        await expect(this.loginErrorMessage).toBeVisible();
    }
}