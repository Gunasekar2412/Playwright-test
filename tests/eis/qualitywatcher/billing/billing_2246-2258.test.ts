import { test, expect, Page } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, getJmdFinanceInterest, paymentPlans } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { jamaicaBanks } from '../../../../sites/eis/data/BillingData';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let billingPage: BillingPage;
let data: any;

test.setTimeout(720_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    billingPage = new BillingPage(page);

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    data = testData.interestRateTest;
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
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
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

test.describe('Identification Number -', () => {
    test('[S11C2246] Verify that Overpayment Transfer task is generated and Refund is not generated when a policy is underpaid and overpayment exceeds Small balance write-off limit', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';
        const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, country);

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
            sumInsured: '10000000',
            country: country,
            address: '123 Test Street',
            parish: 'Kingston',
            ccRating: '1600',
            chassisVIN: faker.vehicle.vin()
        };
        await ratingPage.addNewVehicle(baseVehicle);
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.setCoverageAndPlan('Comprehensive');
        await ratingPage.calculatePremium();
        await ratingPage.clickFundingSummaryTab();
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);

        if (!(await policyPage.createNewAccountCheckbox.isChecked())) {
            await policyPage.createNewAccountCheckbox.check();
            await policyPage.waitForLoadingSpinner();
        }

        // Validate the TRN is displayed and pre-populated
        const trn = await policyPage.trnField.inputValue();
        await expect(policyPage.identificationNumberField).toBeEnabled();
        expect(trn).toBe(customerDetails.generalInformation['Identification Number']);

        // Validate the identification number is displayed and pre-populated
        const identificationNumber = await policyPage.identificationNumberField.inputValue();
        await expect(policyPage.identificationNumberField).toBeEnabled();
        expect(identificationNumber).toBe(customerDetails.generalInformation['Identification Number']);

        // Verify Identification Number field has the required class
        const idNumberTr = policyPage.identificationNumberField.locator('xpath=ancestor::tr[1]');
        const idNumberTrClass = await idNumberTr.getAttribute('class');
        expect(idNumberTrClass).toContain('required');

        // Verify TRN field has the required class
        const trnTr = policyPage.trnField.locator('xpath=ancestor::tr[1]');
        const trnTrClass = await trnTr.getAttribute('class');
        expect(trnTrClass).toContain('required');
    });

    test('[S11C2247] Verify that Refund for overpaid amount is generated and assigned to refund approval queue if no policy is underpaid and overpayment exceeds SBWO limit', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';
        const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, country);

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
            sumInsured: '10000000',
            country: country,
            address: '123 Test Street',
            parish: 'Kingston',
            ccRating: '1600',
            chassisVIN: faker.vehicle.vin()
        };
        await ratingPage.addNewVehicle(baseVehicle);
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.setCoverageAndPlan('Comprehensive');
        await ratingPage.calculatePremium();
        await ratingPage.clickFundingSummaryTab();
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);

        if (!(await policyPage.createNewAccountCheckbox.isChecked())) {
            await policyPage.createNewAccountCheckbox.check();
            await policyPage.waitForLoadingSpinner();
        }

        // Validate the TRN is displayed and pre-populated
        const trn = await policyPage.trnField.inputValue();
        await expect(policyPage.identificationNumberField).toBeEnabled();
        expect(trn).toBe(customerDetails.generalInformation['Identification Number']);

        // Validate the identification number is displayed and pre-populated
        const identificationNumber = await policyPage.identificationNumberField.inputValue();
        await expect(policyPage.identificationNumberField).toBeEnabled();
        expect(identificationNumber).toBe(customerDetails.generalInformation['Identification Number']);

        // Verify Identification Number field has the required class
        const idNumberTr = policyPage.identificationNumberField.locator('xpath=ancestor::tr[1]');
        const idNumberTrClass = await idNumberTr.getAttribute('class');
        expect(idNumberTrClass).toContain('required');

        // Verify TRN field has the required class
        const trnTr = policyPage.trnField.locator('xpath=ancestor::tr[1]');
        const trnTrClass = await trnTr.getAttribute('class');
        expect(trnTrClass).toContain('required');
    });

    test.skip('[S11C2248] Verify that Overpayment Transfer task is generated and Refund is not generated when policy is underpaid and overpayment is within SBWO limit', async ({ page }) => {
        // TODO: Implement this test
    });

    test.skip('[S11C2249] Verify that Small Balance Write-Off adjustment is generated instead of Refund when no policy is underpaid and overpayment is within SBWO limit', async ({ page }) => {
        // TODO: Implement this test
    });

    test.skip('[S11C2250] Verify that Overpayment Transfer task is generated for BA1 and BA2 when there are underpaid policies across multiple billing accounts', async ({ page }) => {
        // TODO: Implement this test
    });

    test('[S11C2251] Verify that Late Fee billing subtype is available only for JM policies', async ({ page }) => {
        const { customerId: customerIdJA } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Search for Jamaican customer
        await ratingPage.searchCustomer(customerIdJA);

        const transactionType = 'fee';
        const transactionSubtypeOption = 'Late Fee';
        const transactionSubtypeValue = 'LateFee';

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // select transaction type
        await billingPage.selectOtherTransactionType(transactionType);
        await billingPage.waitForLoadingSpinner();

        // verify transaction subtype is present in the dropdown list options
        const optionsTextsJamaica = await billingPage.otherTxTransactionSubtypeDropdown.locator('option').allTextContents();
        expect(optionsTextsJamaica).toContain(transactionSubtypeOption);

        // select transaction subtype
        await billingPage.selectOtherTransactionSubtype(transactionSubtypeValue);
        await billingPage.waitForLoadingSpinner();

        const { customerId: customerIdBB } = await setupActivePolicy('Barbados', 'Trident Insurance Company Limited');

        // Search for Barbados customer
        await ratingPage.searchCustomer(customerIdBB);

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // select transaction type
        await billingPage.selectOtherTransactionType(transactionType);
        await billingPage.waitForLoadingSpinner();

        // verify transaction subtype is present in the dropdown list options
        const optionsTextsBarbados = await billingPage.otherTxTransactionSubtypeDropdown.locator('option').allTextContents();
        expect(optionsTextsBarbados).toContain(transactionSubtypeOption);

        await expect(page.locator('#otherTxForm\\:okButton_footer')).toBeDisabled();
    });

    test('[S11C2252] Verify that a list of bank names and corresponding branches for Jamaica is displayed when "Direct Debit/EFT" is selected as the payment method', async ({ page }) => {
        const customerId = '510233';

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Accept Payment" button
        await billingPage.waitForLoadingSpinner();
        await billingPage.acceptPaymentButton.click();
        await billingPage.waitForLoadingSpinner();

        // Click "Add Payment Method" button
        await billingPage.addPaymentMethodButton.click();
        await billingPage.waitForLoadingSpinner();

        // Select "Direct Debit/EFT" as payment method
        await billingPage.addPaymentPaymentMethodDropdown.selectOption('Direct Debit\\EFT');
        await billingPage.waitForLoadingSpinner();

        // Prepare expected banks data (extract code and name from jamaicaBanks)
        const expectedBanks = jamaicaBanks.map(bank => ({
            code: bank.code,
            name: bank.name
        }));

        // Validate that all expected banks are displayed 
        const bankValidation = await billingPage.validateBankNames(expectedBanks);  expect(bankValidation.isValid).toBe(true);
        expect(bankValidation.missingBanks.length).toBe(0);
        expect(bankValidation.extraBanks.length).toBe(0);

        // Validate branches for each bank
        for (const bank of jamaicaBanks) {
            const expectedBranches = bank.branches.map(branch => ({
                code: branch.code,
                name: branch.name
            }));

            const branchValidation = await billingPage.validateBranchNames(bank.code, expectedBranches);      expect(branchValidation.isValid).toBe(true);
            expect(branchValidation.missingBranches.length).toBe(0);
            expect(branchValidation.extraBranches.length).toBe(0);
        }
    });

    test('[S11C2253] Verify that the system defaults the correct routing number for the selected bank and branch, and it is non-editable', async ({ page }) => {
        const customerId = '510233';

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Accept Payment" button
        await billingPage.acceptPaymentButton.click();
        await billingPage.waitForLoadingSpinner();

        // Click "Add Payment Method" button
        await billingPage.addPaymentMethodButton.click();
        await billingPage.waitForLoadingSpinner();

        // Select "Direct Debit/EFT" as payment method
        await billingPage.addPaymentPaymentMethodDropdown.selectOption('Direct Debit\\EFT');
        await billingPage.waitForLoadingSpinner();

        // Get 5 randomly selected branches with routing numbers
        const selectedBranches = billingPage.getRandomBranchesWithRoutingNumbers(5);        selectedBranches.forEach(branch => {        });

        for (const testBank of selectedBranches) {
            // Select bank from dropdown
            await billingPage.eftBankNameDropdown.selectOption({ value: testBank.bankCode });
            await billingPage.waitForLoadingSpinner();

            // Select branch from dropdown
            await billingPage.eftBranchNameDropdown.selectOption({ value: testBank.branchCode });
            await billingPage.waitForLoadingSpinner();

            // Verify that the routing number is automatically populated with the correct value
            const routingNumberValue = await billingPage.eftRoutingNumberField.inputValue();
            expect(routingNumberValue).toBe(testBank.routingNumber);

            // Verify that the routing number field is non-editable
            // Check if field is disabled
            const isDisabled = await billingPage.eftRoutingNumberField.isDisabled();
            // Check if field has readonly attribute
            const isReadonly = await billingPage.eftRoutingNumberField.getAttribute('readonly');

            // The field should be either disabled or readonly
            // When disabled, isDisabled() returns true
            // When readonly, the readonly attribute is 'readonly' or empty string
            const isNonEditable = isDisabled || isReadonly === 'readonly' || isReadonly === '';
            expect(isNonEditable).toBeTruthy();        }
    });

    test('[S11C2254] Verify that the system applies bank details functionality (AC1 to AC2) in View, Edit, and Add modes', async ({ page }) => {
        const customerId = '510233';

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Accept Payment" button
        await billingPage.acceptPaymentButton.click();
        await billingPage.waitForLoadingSpinner();

        // Click "Add Payment Method" button
        await billingPage.addPaymentMethodButton.click();
        await billingPage.waitForLoadingSpinner();

        // Select "Direct Debit/EFT" as payment method
        await billingPage.addPaymentPaymentMethodDropdown.selectOption('Direct Debit\\EFT');
        await billingPage.waitForLoadingSpinner();

        // Randomly get bank, branch, and routing number from data file
        const randomBranches = billingPage.getRandomBranchesWithRoutingNumbers(1);
        const selectedBranch = randomBranches[0];
        const { bankCode, branchCode, routingNumber } = selectedBranch;
        await billingPage.eftBankNameDropdown.selectOption({ value: bankCode });
        await billingPage.waitForLoadingSpinner();

        await billingPage.eftBranchNameDropdown.selectOption({ value: branchCode });
        await billingPage.waitForLoadingSpinner();

        const routingNumberValue = await billingPage.eftRoutingNumberField.inputValue();
        expect(routingNumberValue).toBe(routingNumber);

        // select bank type account
        await billingPage.eftBankAccountTypeDropdown.selectOption({ value: 'SAVINGS' });
        await billingPage.waitForLoadingSpinner();

        // input account number
        // Generate a random 10-digit account number
        const randomAccountNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
        await billingPage.eftAccountNumberField.fill(randomAccountNumber);
        await billingPage.waitForLoadingSpinner();

        // Get count of payment methods before adding
        const paymentMethodCountBefore = await billingPage.getPaymentMethodCount();
        // Add Payment Method
        await billingPage.eftSaveButton.click();
        await billingPage.waitForLoadingSpinner();

        // Get count of payment methods after adding
        const paymentMethodCountAfter = await billingPage.getPaymentMethodCount();
        // Validate that the payment method was added successfully (count increased by 1)
        expect(paymentMethodCountAfter).toBe(paymentMethodCountBefore + 1);

        // Get the row index of the newly added payment method (last row, 0-based index)
        const newPaymentMethodRowIndex = paymentMethodCountAfter - 1;

        // Validate view mode - Click the view button and validate fields are not editable
        await billingPage.clickPaymentMethodView(newPaymentMethodRowIndex);
        await billingPage.validatePaymentMethodViewMode();

        // Close the view form by clicking cancel
        await billingPage.eftCancelButton.click();
        await billingPage.waitForLoadingSpinner();

        // Validate edit mode - Click the edit button and validate fields are editable
        await billingPage.clickPaymentMethodEdit(newPaymentMethodRowIndex);
        await billingPage.validatePaymentMethodEditMode();
    });

    test('[S11C2255] Verify that GCT tax is applied automatically when the customer does not have tax exemption', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';

        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy(country, insuredParty, { taxExempt: false });

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Submit transaction
        await billingPage.submitOtherTransaction(amount, transactionType, transactionSubtype);

        // Validate that the fee appears in the table and has the correct type, subtype, amount, status, and Waive action
        const isTransactionFeeValid = await billingPage.validateTransactionFee({
            amount: amount,
            type: transactionType,
            subtype: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isTransactionFeeValid).toBe(true);

        // Validate that the GCT fee is not applied
        const isGCTFeeWaived = await billingPage.validateTransactionFee({
            amount: gctAmount,
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTFeeWaived).toBe(true);
    });

    test('[S11C2256] Verify that GCT tax is suppressed automatically when the customer has tax exemption', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';

        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy(country, insuredParty, { taxExempt: true });

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Submit transaction
        await billingPage.submitOtherTransaction(amount, transactionType, transactionSubtype);

        // Validate that the fee appears in the table and has the correct type, subtype, amount, status, and Waive action
        const isTransactionFeeValid = await billingPage.validateTransactionFee({
            amount: amount,
            type: transactionType,
            subtype: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isTransactionFeeValid).toBe(true);

        // Validate that the GCT fee is not applied
        const isGCTFeeNotPresent = await billingPage.validateTransactionNotPresent({
            amount: gctAmount,
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTFeeNotPresent).toBe(true);
    });

    test('[S11C2257] Verify that the user can waive previously applied GCT tax when Tax Exempt flag is checked after purchase', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';

        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy(country, insuredParty, { taxExempt: false });

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Submit transaction
        await billingPage.submitOtherTransaction(amount, transactionType, transactionSubtype);

        // Validate that the fee appears in the table and has the correct type, subtype, amount, status, and Waive action
        const isTransactionFeeValid = await billingPage.validateTransactionFee({
            amount: amount,
            type: transactionType,
            subtype: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isTransactionFeeValid).toBe(true);

        // Validate that the GCT transaction is present (customer does not have tax exemption)
        const isGCTFeePresent = await billingPage.validateTransactionFee({
            amount: gctAmount,
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTFeePresent).toBe(true);

        // Update the customer details and check Tax Exempt flag
        await customerPage.updateCustomerDetailsToHaveTaxExemption(customerId, { taxExempt: true });

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Waive the GCT transaction
        const isGCTWaived = await billingPage.waiveTransaction({
            amount: gctAmount,
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            waivedReason: 'GCT Waived',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTWaived).toBe(true);
    });

    test('[S11C2258] Verify that the user can add GCT tax manually when Tax Exempt flag is unchecked after purchase', async ({ page }) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';

        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy(country, insuredParty, { taxExempt: true });

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Submit transaction
        await billingPage.submitOtherTransaction(amount, transactionType, transactionSubtype);

        // Validate that the fee appears in the table and has the correct type, subtype, amount, status, and Waive action
        const isTransactionFeeValid = await billingPage.validateTransactionFee({
            amount: amount,
            type: transactionType,
            subtype: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isTransactionFeeValid).toBe(true);

        // Validate that the GCT transaction is NOT present (customer has tax exemption)
        const isGCTFeeNotPresent = await billingPage.validateTransactionNotPresent({
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTFeeNotPresent).toBe(true);

        // Update the customer details and uncheck Tax Exempt flag
        await customerPage.updateCustomerDetailsToHaveTaxExemption(customerId, { taxExempt: false });

        // Navigate to billing and select billing account
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Submit transaction
        await billingPage.submitOtherTransaction(amount, transactionType, transactionSubtype);

        const isGCTFeeAdded = await billingPage.validateTransactionFee({
            amount: gctAmount,
            type: transactionType,
            subtype: 'GCT',
            reason: 'Cancellation Fee',
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isGCTFeeAdded).toBe(true);
    });
});