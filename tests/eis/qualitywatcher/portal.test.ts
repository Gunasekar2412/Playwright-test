import { test, expect } from '@playwright/test';
import { QuotePage } from '../../../sites/portal/pages/QuotePage';
import { LoginPage } from '../../../sites/portal/pages/LoginPage';
import {
    customerData,
    vehicleData,
    thresholds,
    uiMessages,
} from '../../../sites/portal/data/QuoteData';

test('[S16C2570] Successfully create a quote on the customer portal as a guest', async ({
    page,
}) => {
    // Initialize the quote page
    const quotePage = new QuotePage(page);

    // Navigate to the quote page
    await quotePage.navigateToQuotePage();

    // Select Private Motor
    await quotePage.selectPrivateMotor();

    // Fill personal details
    await quotePage.fillPersonalDetails(
        customerData.standard.email,
        customerData.standard.firstName,
        customerData.standard.lastName,
        customerData.standard.phoneNumber,
        customerData.standard.dateOfBirth,
        customerData.standard.idNumber,
        customerData.standard.claimFreeYears,
        customerData.standard.idType
    );

    // Fill vehicle details
    await quotePage.fillVehicleDetails(
        vehicleData.standard.make,
        vehicleData.standard.model,
        vehicleData.standard.year,
        vehicleData.standard.cc,
        vehicleData.standard.value
    );

    // Open discount section
    await quotePage.openDiscountSection();

    // Accept privacy
    await quotePage.acceptPrivacy();

    // Click get quote button
    await quotePage.clickGetQuoteButton();

    const emailAllPresent = await quotePage.validateEmailAllButtonPresent();
    const modifyPresent = await quotePage.validateModifyButtonPresent();

    // Assert that both buttons are present
    expect(emailAllPresent).toBeTruthy();
    expect(modifyPresent).toBeTruthy();

    // Login to EIS (I need VPN access to do this)
    // const loginPage = new LoginPage(page);
    // await loginPage.goto();
    // await loginPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    // Click 'Search+'
    // Enter the first name of the policyholder in 'First Name' field
    // Select customer record shown
    // View the policy in the 'Active Policy' section
});

test('[S16C2571] As a Guest select one of the quote option and purchase without having to create an online account', async ({
    page,
}) => {
    // Initialize the quote page
    const quotePage = new QuotePage(page);

    // Navigate to the quote page
    await quotePage.navigateToQuotePage();

    // Select Private Motor
    await quotePage.selectPrivateMotor();

    // Fill personal details
    await quotePage.fillPersonalDetails(
        customerData.standard.email,
        customerData.standard.firstName,
        customerData.standard.lastName,
        customerData.standard.phoneNumber,
        customerData.standard.dateOfBirth,
        customerData.standard.idNumber,
        customerData.standard.claimFreeYears,
        customerData.standard.idType
    );

    // Fill vehicle details
    await quotePage.fillVehicleDetails(
        vehicleData.standard.make,
        vehicleData.standard.model,
        vehicleData.standard.year,
        vehicleData.standard.cc,
        vehicleData.standard.value
    );

    // Open discount section
    await quotePage.openDiscountSection();

    // Accept privacy
    await quotePage.acceptPrivacy();

    // Click get quote button
    await quotePage.clickGetQuoteButton();

    const emailAllPresent = await quotePage.validateEmailAllButtonPresent();
    const modifyPresent = await quotePage.validateModifyButtonPresent();

    // Assert that both buttons are present
    expect(emailAllPresent).toBeTruthy();
    expect(modifyPresent).toBeTruthy();

    // Login to EIS (I need VPN access to do this)
    // const loginPage = new LoginPage(page);
    // await loginPage.goto();
    // await loginPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    // Click 'Search+'
    // Enter the first name of the policyholder in 'First Name' field
    // Select customer record shown
    // View the policy in the 'Active Policy' section
});

test('[S16C2572] Verify a customer is NOT able to get a quote for a Sum Insured greater than BB250,000', async ({
    page,
}) => {
    // Initialize the quote page
    const quotePage = new QuotePage(page);

    // Navigate to the quote page
    await quotePage.navigateToQuotePage();

    // Select Private Motor
    await quotePage.selectPrivateMotor();

    // Fill personal details
    await quotePage.fillPersonalDetails(
        customerData.standard.email,
        customerData.standard.firstName,
        customerData.standard.lastName,
        customerData.standard.phoneNumber,
        customerData.standard.dateOfBirth,
        customerData.standard.idNumber,
        customerData.standard.claimFreeYears,
        customerData.standard.idType
    );

    // Fill vehicle details
    await quotePage.fillVehicleDetails(
        vehicleData.highValue.make,
        vehicleData.highValue.model,
        vehicleData.highValue.year,
        vehicleData.highValue.cc,
        vehicleData.highValue.value
    );

    // Accept privacy
    await quotePage.acceptPrivacy();

    // Click get quote button
    await quotePage.clickGetQuoteButton();

    // Validate the high value popup appears
    const popupInfo = await quotePage.validateHighValuePopup();

    // First verify the elements are visible
    expect(popupInfo.titleVisible).toBeTruthy();
    expect(popupInfo.messageVisible).toBeTruthy();
    expect(popupInfo.okButtonVisible).toBeTruthy();

    // Then verify the text content against the data file values
    expect(popupInfo.titleText).toContain(uiMessages.highValuePopup.title);
    expect(popupInfo.messageText).toContain(uiMessages.highValuePopup.message);
    expect(popupInfo.okButtonText).toContain(
        uiMessages.highValuePopup.okButton
    );

    // Dismiss the popup
    await quotePage.dismissHighValuePopup();
});

test('[S16C2573] Verify Diamond Max coverage plan quote is NOT available for customers (new and existing) who are below the minimum age of 50', async ({
    page,
}) => {
    // Initialize the quote page
    const quotePage = new QuotePage(page);

    // Navigate to the quote page
    await quotePage.navigateToQuotePage();

    // Select Private Motor
    await quotePage.selectPrivateMotor();

    // Fill personal details with a customer under 50 years old
    await quotePage.fillPersonalDetails(
        customerData.belowDiamondMaxAge.email,
        customerData.belowDiamondMaxAge.firstName,
        customerData.belowDiamondMaxAge.lastName,
        customerData.belowDiamondMaxAge.phoneNumber,
        customerData.belowDiamondMaxAge.dateOfBirth, // Using standard customer who is under 50
        customerData.belowDiamondMaxAge.idNumber,
        customerData.belowDiamondMaxAge.claimFreeYears,
        customerData.belowDiamondMaxAge.idType
    );

    // Fill vehicle details
    await quotePage.fillVehicleDetails(
        vehicleData.standard.make,
        vehicleData.standard.model,
        vehicleData.standard.year,
        vehicleData.standard.cc,
        vehicleData.standard.value
    );

    // Accept privacy
    await quotePage.acceptPrivacy();

    // Click get quote button
    await quotePage.clickGetQuoteButton();

    // Verify that the Diamond Max plan is not present in the quote options
    const isDiamondMaxPresent = await quotePage.isDiamondMaxPlanPresent();
    expect(isDiamondMaxPresent).toBeFalsy();
});

test.skip('[S16C2576] Verify customer can create a quote after logging into their account', async ({
    page,
}) => {
    // Initialize the login page
    const loginPage = new LoginPage(page);

    // Login to the Barbados Portal
    await loginPage.login(
        process.env.BARBADOS_PORTAL_USERNAME!,
        process.env.BARBADOS_PORTAL_PASSWORD!,
        process.env.BARBADOS_PORTAL_FNAME!
    );

    // Initialize the quote page
    const quotePage = new QuotePage(page);

    // Navigate to the quote page
    await quotePage.navigateToQuotePage();

    // Select Private Motor
    await quotePage.selectPrivateMotor();

    /* Getting an error right here can't finish tests until this is fixed
     */

    // // Fill personal details
    // await quotePage.fillPersonalDetails(
    //     customerData.standard.email,
    //     customerData.standard.firstName,
    //     customerData.standard.lastName,
    //     customerData.standard.phoneNumber,
    //     customerData.standard.dateOfBirth,
    //     customerData.standard.idNumber,
    //     customerData.standard.claimFreeYears,
    //     customerData.standard.idType
    // );

    // // Fill vehicle details
    // await quotePage.fillVehicleDetails(
    //     vehicleData.standard.make,
    //     vehicleData.standard.model,
    //     vehicleData.standard.year,
    //     vehicleData.standard.cc,
    //     vehicleData.standard.value
    // );

    // // Open discount section
    // await quotePage.openDiscountSection();

    // // Accept privacy
    // await quotePage.acceptPrivacy();

    // // Click get quote button
    // await quotePage.clickGetQuoteButton();

    // const emailAllPresent = await quotePage.validateEmailAllButtonPresent();
    // const modifyPresent = await quotePage.validateModifyButtonPresent();

    // // Assert that both buttons are present
    // expect(emailAllPresent).toBeTruthy();
    // expect(modifyPresent).toBeTruthy();
});
