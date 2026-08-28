import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Barbados Portal
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly userLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        this.usernameField = page.locator('#login input#Email');
        this.passwordField = page.locator('#login input#Password');
        this.submitButton = page.locator('#login button[type="submit"]');
        this.userLogin = page.locator('li.dropdown-trigger.user-login');
    }

    async login(username: string, password: string, name?: string) {
        await this.page.goto('https://prodbbd.redmanlabs.net/Login');
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.submitButton.click();
        await this.expectBarbadosPortalLoginSuccess(name);
    }

    async expectBarbadosPortalLoginSuccess(name?: string) {
        // Wait for the user login dropdown to be visible
        await expect(this.userLogin).toBeVisible({
            timeout: 10000,
        });

        if (name) {
            // If a specific username is provided, verify it appears in the greeting
            const helloText = await this.userLogin
                .locator('span.show-on-large')
                .textContent();
            expect(helloText).toContain(`Hello, ${name}`);
        }

        // Additional verification that we're on a logged-in page
        await expect(this.page).not.toHaveURL(/.*\/Login$/);
    }
}
