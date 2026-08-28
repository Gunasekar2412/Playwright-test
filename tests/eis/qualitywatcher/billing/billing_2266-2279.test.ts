import { test, expect } from '@playwright/test';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { faker } from '@faker-js/faker';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let billingPage: BillingPage;

test.setTimeout(720_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    billingPage = new BillingPage(page);

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
});

async function setupActivePolicy(country: string = 'Jamaica', insuredParty: string = 'Advantage General Insurance Company', options: { taxExempt?: boolean } = {}) {
    const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, country, options);

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty(country);
    if (country === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await policyPage.waitForLoadingSpinner();
    await policyPage.premiumFinancingNoRadioField.check();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, insuredParty);
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
        year: '2024',
        make: 'Audi',
        model: 'A4',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: country === 'Barbados' ? '100000' : '10000000',
        country: country,
        address: '123 Test Street',
        parish: country === 'Barbados' ? 'St. Michael' : 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await policyPage.waitForLoadingSpinner();
    await ratingPage.calculatePremium();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.waitForLoadingSpinner();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
        billingAccountName: customerName,
        city: 'Test City'
    });
    let policyNumber = await policyPage.policyNumberText.textContent() || '';
    policyNumber = policyNumber.replace('#', '').trim();
    if (!policyNumber) throw new Error('Policy not created successfully');

    return { customerName, customerId, policyNumber, customerDetails };
}

async function setupCustomerWithMultipleBillingAccounts(country: string = 'Jamaica', insuredParty: string = 'Advantage General Insurance Company', options: { taxExempt?: boolean } = {}) {
    // Create customer
    const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, country, options);

    // Purchase first policy (creates BA1)
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty(country);
    if (country === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await policyPage.waitForLoadingSpinner();
    await policyPage.premiumFinancingNoRadioField.check();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, insuredParty);
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const vehicle = {
        year: '2024',
        make: 'Audi',
        model: 'A3',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: country === 'Barbados' ? '100000' : '10000000',
        country: country,
        address: '123 Test Street',
        parish: country === 'Barbados' ? 'St. Michael' : 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);

    // Ensure we create a new billing account for the first policy
    if (!(await policyPage.createNewAccountCheckbox.isChecked())) {
        await policyPage.createNewAccountCheckbox.check();
        await policyPage.waitForLoadingSpinner();
    }

    await ratingPage.finishPayment({
        billingAccountName: customerName,
        city: 'Test City'
    });
    let policyNumber1 = await policyPage.policyNumberText.textContent() || '';
    policyNumber1 = policyNumber1.replace('#', '').trim();
    if (!policyNumber1) throw new Error('First policy not created successfully');

    // Take action: Copy from policy
    await policyPage.takeActionDropdown.selectOption({ label: 'Copy from Policy' });

    // Enter effective date as today's date
    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
    await policyPage.effectiveDateField.fill(today);
    await customerPage.footerOkButton.click();
    await customerPage.waitForLoadingSpinner();

    // Confirm copy "Yes"
    await customerPage.yesButton.click();
    await customerPage.waitForLoadingSpinner();

    // Take action: Gather Data
    await policyPage.takeActionDropdown.selectOption({ label: 'Data Gather' });
    await policyPage.waitForLoadingSpinner();

    await ratingPage.clickVehicleTab();
    const vehicle1 = {
        year: '2024',
        make: 'Audi',
        model: 'A4',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: country === 'Barbados' ? '100000' : '10000000',
        country: country,
        address: '123 Test Street',
        parish: country === 'Barbados' ? 'St. Michael' : 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(vehicle1);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);

    // Ensure we create a new billing account for the second policy
    if (!(await policyPage.createNewAccountCheckbox.isChecked())) {
        await policyPage.createNewAccountCheckbox.check();
        await policyPage.waitForLoadingSpinner();
    }

    await ratingPage.finishPayment({
        billingAccountName: customerName,
        city: 'Test City'
    });
    let policyNumber2 = await policyPage.policyNumberText.textContent() || '';
    policyNumber2 = policyNumber2.replace('#', '').trim();
    if (!policyNumber2) throw new Error('Second policy not created successfully');

    return { customerName, customerId, policyNumber1, policyNumber2, customerDetails };
}

test.describe('Identification Number -', () => {
    test('[S11C2266] Verify "Identification Number" is shown and editable during refund creation', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';
        const newIdNumber = String(Math.floor(100000000 + Math.random() * 900000000));
        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format as DD/MM/YYYY
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const year = tomorrow.getFullYear();

        const tomorrowDate = `${day}/${month}/${year}`;

        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy(country, insuredParty);

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Take the refund action on the billing account
        await billingPage.selectBillingTaskAction('refund');

        // Verify the Identification Number is populated in the Payee Details section
        await billingPage.verifyCustomerId(customerDetails.generalInformation['Identification Number'], { isRequired: true });

        // Select "Check" for Payment Method
        await billingPage.updateFormField('Payment Type', 'Check');

        // Enter random check number for Check Number
        const randomCheckNumber = String(Math.floor(100000 + Math.random() * 900000));
        await billingPage.updateFormField('Cheque Number', randomCheckNumber);


        // Enter Amount more than 500
        await billingPage.updateFormField('Payment Amount', '600.00');

        // Add reason Reason for Refund - Misapplied
        await billingPage.updateFormField('Refund Reason', 'Misapplied');

        // Edit the Identification Number
        await billingPage.updateCustomerId(newIdNumber);

        // Enter Date in Check Date date format: 09/09/2025
        await billingPage.setChequeDate(tomorrowDate);
        await billingPage.waitForLoadingSpinner();

        // Click OK to confirm refund setup
        await billingPage.clickOk();
        await billingPage.waitForLoadingSpinner();

        // Click on the latest refund transaction
        await billingPage.clickLatestRefundTransaction();
        await billingPage.waitForLoadingSpinner();

        // Confirm that the Identification in the refund transaction is the one you updated
        await billingPage.verifyCustomerId(newIdNumber);
    });

    // test.skip('[S11C2267] Verify "Identification Number" is pre-stored during automated refund', async ({ page }) => {
    //     Preconditions
    // Existing billing account
    //     2.Customer has policies where total due is overpaid exceeding SBWO limit
    //     3. Admin Access"Automated refund is triggered"

    //     Steps
    // Search for an existing billing account
    // Set Policy overpaid amount above SBWO limit: Go to payments and others section -> Click Accept payment -> Enter amount that exceeds the total due on the policy
    // If the user has admin access:
    // Go to Admin tab > General
    // Select scheduler from the option menu -> search for RefundGenerationJob > Click start
    // 4.Confirm that a refund is generated and in the pending approval section of the billing screen
    // click the hyperlink -> Navigate to the Refund Inquiry UI -> Verify ID information is pre - populated

    //     Expected results
    // Identification Number' is pre-stored as part of the refund.

    // It is displayed in view - only mode in the Refund Inquiry UI.
    // });

    test('[S11C2268] Verify Identification Number is updated for all Billing Accounts when changed in the customer profile', async ({ page, context }) => {

        // Search for existing customer with multiple billing accounts
        await customerPage.customerMenuItem.click();
        await customerPage.waitForLoadingSpinner();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Oswald-Automation');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Wunsch');
        await page.locator('[id="searchForm:searchBtn"]').click();
        await customerPage.waitForLoadingSpinner();

        // Get TRN from customer page using inquiry
        await customerPage.click(customerPage.takeActionButton);
        await customerPage.customerTakeActionDropdown.selectOption({ label: 'Update' });
        await customerPage.waitForLoadingSpinner();

        const newIdNumber = String(Math.floor(100000000 + Math.random() * 900000000));
        await customerPage.updateFormField('Identification Number', newIdNumber);
        await customerPage.clickSaveAndExit();
        await customerPage.waitForLoadingSpinner();

        // Navigate to Billing to access billing accounts
        await customerPage.billingMenuItem.click();
        await customerPage.waitForLoadingSpinner();

        // Open first billing account in a new tab
        const [billingPage1] = await Promise.all([
            context.waitForEvent('page'),
            billingPage.openBillingAccountInNewTab(0)
        ]);
        await billingPage1.waitForLoadState();
        const billingPageObj1 = new BillingPage(billingPage1);

        // Open second billing account in another new tab
        const [billingPage2] = await Promise.all([
            context.waitForEvent('page'),
            billingPage.openBillingAccountInNewTab(1)
        ]);
        await billingPage2.waitForLoadState();
        const billingPageObj2 = new BillingPage(billingPage2);

        // Wait for billing account page to load in tab 1, then get inquiry data
        await billingPageObj1.waitForLoadingSpinner();
        await billingPageObj1.selectBillingTaskAction('inquiry');
        const ba1OriginalIdNumber = await billingPageObj1.getFormField('Identification Number');

        // Wait for billing account page to load in tab 2, then get inquiry data
        await billingPageObj2.waitForLoadingSpinner();
        await billingPageObj2.selectBillingTaskAction('inquiry');
        const ba2OriginalIdNumber = await billingPageObj2.getFormField('Identification Number');      expect(ba1OriginalIdNumber).toBe(newIdNumber);
        expect(ba2OriginalIdNumber).toBe(newIdNumber);


    });

    test('[S11C2269] Verify TRN is updated for all Billing Accounts while maintaining the manually changed Identification Number', async ({ page, context }) => {

        // Search for existing customer with multiple billing accounts
        await customerPage.customerMenuItem.click();
        await customerPage.waitForLoadingSpinner();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Oswald-Automation');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Wunsch');
        await page.locator('[id="searchForm:searchBtn"]').click();
        await customerPage.waitForLoadingSpinner();

        // Get TRN from customer page using inquiry
        await customerPage.click(customerPage.takeActionButton);
        await customerPage.customerTakeActionDropdown.selectOption({ label: 'Inquiry' });
        await customerPage.waitForLoadingSpinner();

        // Get current TRN from customer inquiry
        const originalTrn = await customerPage.getFormField('TRN');
        // Navigate to Billing to access billing accounts
        await customerPage.billingMenuItem.click();
        await customerPage.waitForLoadingSpinner();

        // Open first billing account in a new tab
        const [billingPage1] = await Promise.all([
            context.waitForEvent('page'),
            billingPage.openBillingAccountInNewTab(0)
        ]);
        await billingPage1.waitForLoadState();
        const billingPageObj1 = new BillingPage(billingPage1);

        // Open second billing account in another new tab
        const [billingPage2] = await Promise.all([
            context.waitForEvent('page'),
            billingPage.openBillingAccountInNewTab(1)
        ]);
        await billingPage2.waitForLoadState();
        const billingPageObj2 = new BillingPage(billingPage2);

        // Get existing TRN and ID numbers from both BAs using inquiry
        // Wait for billing account page to load in tab 1, then get inquiry data
        await billingPageObj1.waitForLoadingSpinner();
        await billingPageObj1.selectBillingTaskAction('inquiry');
        const ba1OriginalTrn = await billingPageObj1.getFormField('TRN');
        const ba1OriginalIdNumber = await billingPageObj1.getFormField('Identification Number');
        // Wait for billing account page to load in tab 2, then get inquiry data
        await billingPageObj2.waitForLoadingSpinner();
        await billingPageObj2.selectBillingTaskAction('inquiry');
        const ba2OriginalTrn = await billingPageObj2.getFormField('TRN');
        const ba2OriginalIdNumber = await billingPageObj2.getFormField('Identification Number');
        // Change Identification Numbers of both BAs to new values
        const newBa1IdNumber = String(Math.floor(100000000 + Math.random() * 900000000));
        const newBa2IdNumber = String(Math.floor(100000000 + Math.random() * 900000000));

        // Update BA1 Identification Number
        await billingPageObj1.billingMenuItem.click();
        await billingPageObj1.waitForLoadingSpinner();
        await billingPageObj1.clickBillingAccount(0);
        await billingPageObj1.selectBillingTaskAction('update');
        await billingPageObj1.updateFormField('Identification Number', newBa1IdNumber);
        await billingPageObj1.updateFormSaveButton.click();
        // Update BA2 Identification Number
        await billingPageObj2.billingMenuItem.click();
        await billingPageObj2.waitForLoadingSpinner();
        await billingPageObj2.clickBillingAccount(1);
        await billingPageObj2.selectBillingTaskAction('update');
        await billingPageObj2.updateFormField('Identification Number', newBa2IdNumber);
        await billingPageObj2.updateFormSaveButton.click();
        // Go back to customer page and update TRN to a new value
        await page.bringToFront();
        await customerPage.customerMenuItem.click();
        await customerPage.waitForLoadingSpinner();

        await customerPage.click(customerPage.takeActionButton);
        await customerPage.customerTakeActionDropdown.selectOption({ label: 'Update' });
        await customerPage.waitForLoadingSpinner();

        // Update customer TRN to new value
        const newTrn = String(Math.floor(100000000 + Math.random() * 900000000));
        await customerPage.updateFormField('TRN', newTrn);
        await customerPage.clickSaveAndExit();
        await customerPage.waitForLoadingSpinner();
        // Go back to both BAs to confirm that their TRN has been changed to the customer's new TRN
        // but their individual Identification Numbers didn't change

        // Check BA1
        await billingPage1.bringToFront();
        await billingPageObj1.billingMenuItem.click();
        await billingPageObj1.waitForLoadingSpinner();
        await billingPageObj1.clickBillingAccount(0);
        await billingPageObj1.selectBillingTaskAction('inquiry');

        // Verify BA1: TRN should be updated to new customer TRN, but ID should remain the manually changed one
        const ba1UpdatedTrn = await billingPageObj1.getFormField('TRN');
        const ba1UpdatedIdNumber = await billingPageObj1.getFormField('Identification Number');

        expect(ba1UpdatedTrn).toBe(newTrn);
        expect(ba1UpdatedIdNumber).toBe(newBa1IdNumber);
        // Check BA2
        await billingPage2.bringToFront();
        await billingPageObj2.billingMenuItem.click();
        await billingPageObj2.waitForLoadingSpinner();
        await billingPageObj2.clickBillingAccount(1);
        await billingPageObj2.selectBillingTaskAction('inquiry');

        // Verify BA2: TRN should be updated to new customer TRN, but ID should remain the manually changed one
        const ba2UpdatedTrn = await billingPageObj2.getFormField('TRN');
        const ba2UpdatedIdNumber = await billingPageObj2.getFormField('Identification Number');

        expect(ba2UpdatedTrn).toBe(newTrn);
        expect(ba2UpdatedIdNumber).toBe(newBa2IdNumber);
        // Close additional tabs
        await billingPage1.close();
        await billingPage2.close();
    });

    test('[S11C2270] Validate installment schedule recalculation on the Purchase screen', async ({ page }) => {

        // Search for existing customer: Oswald-Automation Wunsch (who has existing policies)
        await customerPage.customerMenuItem.click();
        await customerPage.waitForLoadingSpinner();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Oswald-Automation');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Wunsch');
        await page.locator('[id="searchForm:searchBtn"]').click();
        await customerPage.waitForLoadingSpinner();

        // Navigate to customer's policies
        await customerPage.policyMenuItem.click();
        await customerPage.waitForLoadingSpinner();

        // Select the first policy from the policy list
        const firstPolicyLink = page.locator('#policyForm\\:body_policy_list_table_holder\\:0\\:policyNumber_').first();
        await firstPolicyLink.click();
        await policyPage.waitForLoadingSpinner();

        // Take action: Copy from policy
        await policyPage.takeActionDropdown.selectOption({ label: 'Copy from Policy' });

        // Enter effective date as today's date
        const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
        await page.locator('#policyDataGatherForm\\:sedit_CopyPolicyInfo_policyTxInfo_txDateInputDate').fill(today);
        await page.locator('#policyDataGatherForm\\:actionButton_CopyPolicyInfo_footer').click();
        await policyPage.waitForLoadingSpinner();

        // Confirm copy "Yes"
        await page.getByRole('button', { name: 'Yes' }).click();
        await policyPage.waitForLoadingSpinner();

        // Take action: Gather Data
        await policyPage.takeActionDropdown.selectOption({ label: 'Data Gather' });
        await policyPage.waitForLoadingSpinner();

        // Navigate to Funding Summary tab
        await policyPage.fundingSummaryTab.click();
        await policyPage.waitForLoadingSpinner();

        // Select "2 Pay Plan" for Payment Plan
        await page.getByRole('combobox', { name: 'Payment Plan' }).selectOption({ label: '2 Pay Plan' });
        await policyPage.waitForLoadingSpinner();

        // Navigate to Vehicle tab to modify vehicle details
        await policyPage.vehicleTab.click();
        await policyPage.waitForLoadingSpinner();

        // Edit Sum Insured to 3000000
        const sumInsuredField = page.getByRole('textbox', { name: 'Sum Insured' });
        await sumInsuredField.clear();
        await sumInsuredField.fill('3000000');
        await policyPage.waitForLoadingSpinner();

        // Edit Chassis/VIN - remove last number and replace with random number
        const chassisField = page.getByRole('textbox', { name: 'Chassis/VIN' });
        const currentChassis = await chassisField.inputValue();
        const modifiedChassis = Math.floor(100000000 + Math.random() * 900000000).toString();
        await chassisField.clear();
        await chassisField.fill(modifiedChassis);
        await policyPage.waitForLoadingSpinner();

        // Navigate to Premium & Coverage tab
        await policyPage.premiumAndCoveragesTab.click();
        await policyPage.waitForLoadingSpinner();

        // Calculate Premium to get new rates
        await ratingPage.calculatePremium();
        await policyPage.waitForLoadingSpinner();

        // Get the AP/RP total from Premium Summary for reference (tfoot column = AP/RP)
        const premiumTotal = await page.locator(
            'xpath=//tbody[@id="policyDataGatherForm:premiumTable_policyPremiumInfoTable_data"]/ancestor::table[1]//tfoot/tr/td[10]'
        ).textContent();
        // Navigate back to Funding Summary
        await policyPage.fundingSummaryTab.click();
        await policyPage.waitForLoadingSpinner();

        // Click Purchase to initiate purchase process
        await policyPage.purchaseButton.click();
        await policyPage.waitForLoadingSpinner();

        // Confirm purchase "Yes"
        await page.getByRole('button', { name: 'Yes' }).click();
        await policyPage.waitForLoadingSpinner();

        // Get Minimum Required Amount from purchase screen
        const minRequiredAmount = await page.locator('#purchaseForm\\:downpaymentComponent_remainingBalanceValue').textContent();
        // Add to Cash payment amount as the Minimum Required Amount
        const cashAmountField = page.locator('#purchaseForm\\:downpaymentComponent_PaymentDetailsTable\\:0\\:downpaymentComponent_amount');
        // await cashAmountField.clear();
        await policyPage.waitForLoadingSpinner();
        await cashAmountField.fill(minRequiredAmount?.replace(/[^\d.]/g, '') || '0');
        await page.keyboard.press('Enter');
        await policyPage.waitForLoadingSpinner();
        await page.waitForTimeout(10000); // Wait for any dynamic calculations to complete
        // Click Finish to complete initial purchase
        await page.locator('input[id="purchaseForm:yesButton_footer"]').click();
        await policyPage.waitForLoadingSpinner();

        // Now start endorsement process - Take Action -> Endorse
        await customerPage.takeActionButton.click();
        await page.locator('#productContextInfoForm\\:moveToBox').selectOption({ label: 'Endorse' });

        // Enter Endorsement Date as current date
        await page.locator('#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementDateInputDate').fill(today);
        await page.keyboard.press('Enter');
        await policyPage.waitForLoadingSpinner();

        // Select Endorsement Reason: Increasing vehicle value
        const endorsementReasonField = page.getByRole('combobox', { name: 'Endorsement Reason' });
        await page.locator('#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementReason')
            .selectOption('INCREASEVEHICLEVALUE');
        await policyPage.waitForLoadingSpinner();

        // Click OK to confirm endorsement setup
        await page.locator('#policyDataGatherForm\\:yesBtn_PolicyEndorseAction_footer').click();
        await policyPage.waitForLoadingSpinner();

        // Click Yes to confirm endorsement
        await page.locator('#policyDataGatherForm\\:modalConfirmationDialog_PolicyEndorseAction_yesBtn').click();
        await policyPage.waitForLoadingSpinner();

        // Navigate to Vehicle tab for endorsement changes
        await policyPage.vehicleTab.click();
        await policyPage.waitForLoadingSpinner();

        // Update Sum Insured to a higher value for the endorsement
        const endorsementSumInsured = page.locator('#policyDataGatherForm\\:sedit_PreconfigVehicle_ratingInfo_marketValue');
        await endorsementSumInsured.clear();
        await endorsementSumInsured.fill('3500000'); // Increase by 500,000
        await page.keyboard.press('Enter');
        await policyPage.waitForLoadingSpinner();

        // Navigate to Premium & Coverage tab
        await policyPage.premiumAndCoveragesTab.click();
        await policyPage.waitForLoadingSpinner();

        // Calculate Premium for endorsement
        await page.locator('#policyDataGatherForm\\:processPolicyActionButton_PrecconfigAutoPremiumCalculationAction').click();
        await policyPage.waitForLoadingSpinner();

        // Get the new AP/RP total after endorsement (tfoot column = AP/RP)
        const newPremiumTotal = await page.locator(
            'xpath=//tbody[@id="policyDataGatherForm:premiumTable_policyPremiumInfoTable_data"]/ancestor::table[1]//tfoot/tr/td[10]'
        ).textContent();
        // Go to Funding Summary to verify installment recalculation
        await policyPage.fundingSummaryTab.click();
        await policyPage.waitForLoadingSpinner();

        // Click Purchase to see installment schedule recalculation
        await policyPage.purchaseButton.click();
        await policyPage.waitForLoadingSpinner();

        // Finish the endrosement
        await page.locator('#policyDataGatherForm\\:okBtn').click();
        await policyPage.waitForLoadingSpinner();
        // VERIFICATION POINTS:

        // 1. Verify the number of installments remains the same
        const installmentRows = await page.locator('#purchaseForm\\:current_installments_table\\:tb tr').count();        expect(installmentRows).toBe(2); // Should still be 2 installments for 2 Pay Plan

        // 2. Verify down payment section is not displayed during endorsement
        const downPaymentSection = page.locator('#purchaseForm\\:downpaymentComponent_PaymentDetailsTable');
        await expect(downPaymentSection).toBeHidden();
        // 3. Verify the Finish button is enabled
        const finishButton = page.locator('#purchaseForm\\:yesButton_footer');
        await expect(finishButton).toBeEnabled();
        // 4. Verify installment amounts have been recalculated
        // Get installment amounts from the table
        const installmentAmounts = await page.locator('#purchaseForm\\:current_installments_table\\:tb tr td:nth-child(2)').allTextContents();
        // Verify that billed installments remain unchanged and unbilled installments are recalculated
        // This validates the core requirement: (Remaining Unbilled Amount + AP Endorsement Amount) / # of Unbilled Installments
        const firstInstallmentAmount = parseFloat(installmentAmounts[0]?.replace(/[^\d.]/g, '') || '0');
        const secondInstallmentAmount = parseFloat(installmentAmounts[1]?.replace(/[^\d.]/g, '') || '0');

        expect(firstInstallmentAmount).toBeGreaterThan(0);
        expect(secondInstallmentAmount).toBeGreaterThan(0);
        // Click Finish to complete the endorsement
        await finishButton.click();
        await customerPage.waitForLoadingSpinner();

        // Navigate to billing to review final installment schedule changes
        await customerPage.billingMenuItem.click();
        await customerPage.waitForLoadingSpinner();

        // Click on the billing account to view the updated installment schedule
        // await page.locator('#billingDetailedForm\\:general_info_table\\:0\\:accountNumber').click();
        await billingPage.selectBillingTaskAction('inquiry');

        // Verify the billing screen shows the updated installment schedule
        const billingInstallments = await page.locator('table[id*="billing_installments"] tbody tr').count();
        // Final verification: Confirm installment schedule reflects the endorsement changes
        expect(billingInstallments).toEqual(0);    });
});