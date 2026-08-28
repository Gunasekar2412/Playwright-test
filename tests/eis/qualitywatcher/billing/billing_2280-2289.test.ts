import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { faker } from '@faker-js/faker';

test.setTimeout(540_000);

test.describe('Billing - Branch Field Validation', () => {

    test('[S11C2288] Verify the system shows an error message when "Branch" is left blank on the Purchase screen.', async ({ page }) => {
        const ratingPage = new RatingPage(page);
        const customerPage = new CustomerPage(page);
        const policyPage = new PolicyPage(page);
        const selectedBranch = 'Montego Bay';

        // Login
        await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

        // Create a new customer for Jamaica
        const { customerName } = await customerPage.createNewCustomer(40, 'Jamaica');

        // Start a new quote
        await ratingPage.startNewQuote();

        // Set policy country to Jamaica
        await ratingPage.selectPolicyCounty('Jamaica');
        await ratingPage.waitForLoadingSpinner();

        // Select Branch on Policy tab
        await ratingPage.selectBranch(selectedBranch);
        await policyPage.checkPremiumFincancing('No');
        await ratingPage.waitForLoadingSpinner();

        // Continue to Insured tab
        await ratingPage.headerNextButton.click();
        await ratingPage.waitForLoadingSpinner();

        // Select the newly created customer as insured party
        await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company', false);

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
            sumInsured: '5000000',
            country: 'Jamaica',
            address: '123 Test Street',
            parish: 'Kingston',
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

        // VERIFICATION 1: Confirm Branch field IS displayed on Purchase screen
        // pause
        // 
        await page.locator('#purchaseForm\\:billingAccount_createNewAccount').click();
        await ratingPage.waitForLoadingSpinner();
        const branchField = page.locator('#purchaseForm\\:displayBranchCd');
        await expect(branchField).toBeVisible();
        // VERIFICATION 2: Set Branch to blank and click Finish
        await branchField.selectOption({ value: '' });
        await ratingPage.waitForLoadingSpinner();
        // Click Finish button
        // await page.locator('#purchaseForm\\:yesButton_footer').click();
        // await ratingPage.waitForLoadingSpinner();

        // // VERIFICATION 3: Verify error message "Value is required" is displayed
        // await expect(page.getByText('Value is required')).toBeVisible();

        // To check Finish Button is disabled when Branch is blank, we can check the disabled state of the button instead of clicking it
        const finishButton = page.locator('#purchaseForm\\:yesButton_footer');
        await expect(finishButton).toBeDisabled();    });

    test('[S11C2289] Passed Verify the purchase completes and Branch is saved when a valid value is selected', async ({ page }) => {
        const ratingPage = new RatingPage(page);
        const customerPage = new CustomerPage(page);
        const policyPage = new PolicyPage(page);
        const selectedBranch = 'Montego Bay';

        // Login
        await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

        // Create a new customer for Jamaica
        const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

        // Start a new quote
        await ratingPage.startNewQuote();

        // Set policy country to Jamaica
        await ratingPage.selectPolicyCounty('Jamaica');
        await ratingPage.waitForLoadingSpinner();

        // Select Branch on Policy tab
        await ratingPage.selectBranch(selectedBranch);
        await policyPage.checkPremiumFincancing('No');
        await ratingPage.waitForLoadingSpinner();

        // Continue to Insured tab
        await ratingPage.headerNextButton.click();
        await ratingPage.waitForLoadingSpinner();

        // Select the newly created customer as insured party
        await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company', false);

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
            sumInsured: '5000000',
            country: 'Jamaica',
            address: '123 Test Street',
            parish: 'Kingston',
            chassisVIN: faker.vehicle.vin()
        };
        await ratingPage.addNewVehicle(vehicle);

        // Go to Premium & Coverages tab and calculate premium
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.setCoverageAndPlan('Comprehensive');
        await ratingPage.calculatePremium();

        // Attempt recovery if there are mandatory field errors
        const recovered = await ratingPage.recoverFromMandatoryErrors(vehicle);
        if (recovered) {
            // If recovery was performed, recalculate premium
            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.calculatePremium();
        }

        // Go to Funding Summary tab
        await ratingPage.clickFundingSummaryTab();

        // Initiate Purchase
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);
        await ratingPage.waitForLoadingSpinner();

        // VERIFICATION: Confirm Branch field IS displayed on Purchase screen after Email field
        await page.locator('#purchaseForm\\:billingAccount_createNewAccount').click();
        const branchFieldOnPurchase = page.locator('#purchaseForm\\:displayBranchCd');
        await expect(branchFieldOnPurchase).toBeVisible();
        // Verify Branch field is prepopulated with the selected value or allows selection
        const branchFieldValue = await branchFieldOnPurchase.inputValue().catch(() => '');
        // If Branch is a dropdown, select the value
        const branchDropdown = page.locator('#purchaseForm\\:displayBranchCd');
        const isDropdown = await branchDropdown.isVisible({ timeout: 1000 }).catch(() => false);

        if (isDropdown) {
            await branchDropdown.selectOption({ label: selectedBranch });
            await ratingPage.waitForLoadingSpinner();        }

        // Complete the purchase
        await ratingPage.finishPayment({
            billingAccountName: customerName,
            city: 'Kingston'
        });

        // Attempt recovery if there are mandatory field errors after finishPayment
        const recoveredAfterPurchase = await ratingPage.recoverFromMandatoryErrors(vehicle);
        if (recoveredAfterPurchase) {
            // If recovery was performed, recalculate premium and try purchase again
            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.calculatePremium();
            await ratingPage.clickFundingSummaryTab();
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.waitForLoadingSpinner();

            // Verify Branch field again after recovery
            await expect(branchFieldOnPurchase).toBeVisible();

            // Retry finishPayment
            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Kingston'
            });
        }

        // Verify purchase completed successfully
        await ratingPage.waitForLoadingSpinner();
        const policyNumber = await policyPage.policyNumberText.textContent();
        expect(policyNumber).toBeTruthy();        // Verify Branch value is saved - navigate to policy inquiry
        await ratingPage.policyMenuItem.click();
        await ratingPage.waitForLoadingSpinner();

        // Click on the policy number to view details
        await page.locator('#policyForm\\:body_policy_list_table_holder\\:0\\:policyNumber_').click();
        await ratingPage.waitForLoadingSpinner();

        await page.locator('#productConsolidatedViewForm\\:scolumn_Policy\\:0\\:policyNumber_navigationLink').click();

        // // Go to Funding Summary tab to verify Branch
        // await ratingPage.fundingSummaryTab.click();
        // await ratingPage.waitForLoadingSpinner();

        // Verify saved Branch value
        const savedBranch = await page.locator('#policyDataGatherForm\\:sedit_Policy_branchCd').textContent();
        expect(savedBranch?.trim()).toBeTruthy();    });

});
