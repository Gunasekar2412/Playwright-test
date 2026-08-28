import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { faker } from '@faker-js/faker';

test.setTimeout(540_000);

test.describe('Billing - Branch Field Validation', () => {

    test('[S11C2290] Verify Branch dropdown is NOT displayed on Purchase screen when Country = Barbados', async ({ page }) => {
        const ratingPage = new RatingPage(page);
        const customerPage = new CustomerPage(page);
        const policyPage = new PolicyPage(page);

        // Login
        await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

        // Create a new customer
        const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Barbados');

        // Start a new quote
        await ratingPage.startNewQuote();

        // Set policy country to Barbados
        await ratingPage.selectPolicyCounty('Barbados');
        await ratingPage.waitForLoadingSpinner();

        // Verify Branch field is not present on Policy tab (since country is Barbados)
        const branchFieldOnPolicy = ratingPage.branchField;
        await expect(branchFieldOnPolicy).not.toBeVisible();

        // Select the Premium Finance payment plan
        await policyPage.checkPremiumFincancing('No');
        await policyPage.waitForLoadingSpinner();

        // Continue to Insured tab
        await ratingPage.headerNextButton.click();
        await ratingPage.waitForLoadingSpinner();

        // Select the newly created customer as insured party
        await ratingPage.selectInsuredParty(customerName, 'BGI', false);

        // Go to Driver tab and add driver
        await ratingPage.goToNextTab('Driver');
        await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

        // Go to Vehicle tab and add vehicle
        await ratingPage.goToNextTab('Vehicle');
        const vehicle = {
            year: '2020',
            make: 'Toyota',
            model: 'Corolla',
            performance: 'A',
            bodyType: 'Sedan',
            sumInsured: '50000',
            country: 'Barbados',
            address: '123 Test Street',
            parish: 'Christ Church',
            ccRating: '1600',
            chassisVIN: faker.vehicle.vin()
        };
        await ratingPage.addNewVehicle(vehicle);

        // Go to Premium & Coverages tab and calculate premium
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.setCoverageAndPlan('Comprehensive');
        await ratingPage.calculatePremium();

        // Go to Funding Summary tab
        await ratingPage.clickFundingSummaryTab();

        // Initiate Purchase
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);
        await ratingPage.waitForLoadingSpinner();

        // VERIFICATION: Confirm Branch field is NOT present on Purchase screen
        const branchFieldOnPurchase = page.locator('#purchaseForm\\:branch');
        await expect(branchFieldOnPurchase).not.toBeVisible();
        // Complete the purchase to verify process continues without Branch field
        await ratingPage.finishPayment({
            billingAccountName: customerName,
            city: 'Bridgetown'
        });

        // Attempt recovery if there are mandatory field errors after finishPayment
        const recovered = await ratingPage.recoverFromMandatoryErrors(vehicle);
        if (recovered) {
            // If recovery was performed, recalculate premium and try purchase again
            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.calculatePremium();
            await ratingPage.clickFundingSummaryTab();
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.waitForLoadingSpinner();

            // Verify Branch field again after recovery
            await expect(branchFieldOnPurchase).not.toBeVisible();

            // Retry finishPayment
            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Bridgetown'
            });
        }

        // Verify purchase completed successfully
        await ratingPage.waitForLoadingSpinner();
        const policyNumber = await policyPage.policyNumberText.textContent();
        expect(policyNumber).toBeTruthy();  });

    test.skip('[S11C2291] Verify that the system creates General Ledger entries with the full amount of Premium Interest when a policy is issued with a PF payment plan', async ({ page }) => {
        // Test skipped: Requires FTP server access to verify General Ledger entries
        // Automation does not have access to FTP server

        // Test outline:
        // 1. Create a new policy with Premium Finance (PF) payment plan
        // 2. Issue the policy
        // 3. Access FTP server to retrieve General Ledger files
        // 4. Verify GL entries contain correct Premium Interest amount
        // 5. Confirm full amount of Premium Interest is recorded
    });
});
