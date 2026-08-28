import {test, expect} from '@playwright/test';
import {LoginPage} from "../../../sites/eis/pages/LoginPage";


test("Login page - Successful Login", async ({page}) => {
    const loginPOM = new LoginPage(page);

    await loginPOM.goto();
    await loginPOM.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    await loginPOM.expectCorrectLoginRedirect();
})

test("Login page - Unsuccessful Login", async ({page}) => {
    const loginPOM = new LoginPage(page);

    await loginPOM.goto();
    await loginPOM.login(process.env.EIS_USERNAME!, 'incorrectPassword');
    await loginPOM.expectIncorrectLoginRedirect();
})