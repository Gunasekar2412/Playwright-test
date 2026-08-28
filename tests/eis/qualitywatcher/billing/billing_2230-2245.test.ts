import { test, expect, Page } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, getJmdFinanceInterest, paymentPlans } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let billingPage: BillingPage;
let data: any;

test.setTimeout(820_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    billingPage = new BillingPage(page);

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    data = testData.interestRateTest;
});

async function setupActivePolicy(country: string = 'Jamaica', insuredParty: string = 'Advantage General Insurance Company') {
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

test.describe.serial('Refund - Billing Authority Levels (BBD)', () => {

test('[S11C2230] Verify Approve and Reject Actions for Pending Refund or Adjustment Transactions with Amount ≤ $3,500 BBD', async ({page}) => {

        const { customerName, customerId, customerDetails } = await setupActivePolicy('Barbados', 'Trident Insurance Company Limited');

        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 3');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (3500 - 100) + 100).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'BBD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });

test('[S11C2231] Verify Approve and Reject actions are not available for refund or adjustment transactions exceeding $100,000 for Billing Authority Level 2', async ({page}) => {
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 2');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (100000 - 90000) + 90000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });

test('[S11C2232] Verify Approve and Reject actions are not available for refund or adjustment transactions exceeding $250,000 for Billing Authority Level 3', async ({page}) => {
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 3');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (100000 - 90000) + 90000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });

test('[S11C2233] Verify that Approve and Reject actions are available for ALL refund and adjustment transactions', async ({page}) => {
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 4');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (250999 - 250000) + 250000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });
});
// These tests require accessing the FTP server which we do not have access to and are not feasible to automate
test.describe('GL integrity - ', () => {

    test.skip('[S11C2234] Validate Earned & Unearned Interest GL Allocation for Premium Recap Batch Job', async ({page}) => {

    });
    test.skip('[S11C2235] Ensure the accuracy of earned and unearned interest calculations for payments made before the next installment date', async ({page}) => {

    });
});
test.describe('GCT Calculation - ', () => {
    test('[S11C2236] Confirm that GCT is automatically calculated and applied to JM policies in addition to any billing fees', async ({page}) => {
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        await billingPage.clickPremiumType();

        // Validate GCT calculation for Jamaica customers
        const premiumAmounts = await billingPage.getPremiumAmounts();
        expect(premiumAmounts.hasGCT).toBe(true);
        expect(premiumAmounts.totalAmount).toBe(premiumAmounts.premium + premiumAmounts.gct);
        expect(premiumAmounts.gct).toBe(premiumAmounts.premium * 0.15);
        expect(premiumAmounts.gct).toBe(premiumAmounts.totalAmount - premiumAmounts.premium);
    });

    test('[S11C2237] Verify GCT is not automatically applied for BB policies when a billing fee is added', async ({page}) => {
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Barbados', 'Trident Insurance Company Limited');

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        await billingPage.clickPremiumType();

        // Validate GCT is not displayed for Barbados customers
        const premiumAmounts = await billingPage.getPremiumAmounts();
        expect(premiumAmounts.hasGCT).toBe(false);
        expect(premiumAmounts.gct).toBe(0);
        expect(premiumAmounts.totalAmount).toBe(premiumAmounts.premium);
    });

    test('[S11C2238] Verify GCT subtype is available in the Transaction Subtype dropdown for JM policies in the allocation section', async ({page}) => {
        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Select Transaction Type: Fee
        await billingPage.selectOtherTransactionType('fee');

        // Verify GCT is available in the Transaction Subtype dropdown
        const isGCTAvailable = await billingPage.isTransactionSubtypeAvailable('GCT');
        expect(isGCTAvailable).toBe(true);

        // Select GCT from the subtype dropdown
        await billingPage.selectOtherTransactionSubtype('GCT');

        // Verify JM policy appears in the allocations section
        const hasAllocations = await billingPage.hasPolicyAllocations();
        expect(hasAllocations).toBe(true);

        // Verify the policy number appears in allocations
        const policyNumbers = await billingPage.getPolicyNumbersFromAllocations();
        expect(policyNumbers.length).toBeGreaterThan(0);
        const isPolicyFound = await billingPage.isPolicyInAllocations(policyNumber);
        expect(isPolicyFound).toBe(true);
    });

    test('[S11C2239] Verify GCT subtype is available in the Transaction Subtype dropdown but is not displayed in the allocations section for BB policies', async ({page}) => {
        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy('Barbados', 'Trident Insurance Company Limited');

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer('514491');
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();

        // Click "Other Transactions" button
        await billingPage.clickOtherTransactions();

        // Select Transaction Type: Fee
        await billingPage.selectOtherTransactionType('fee');

        // Verify GCT is available in the Transaction Subtype dropdown
        const isGCTAvailable = await billingPage.isTransactionSubtypeAvailable('GCT');
        expect(isGCTAvailable).toBe(true);

        // Select GCT from the subtype dropdown
        await billingPage.selectOtherTransactionSubtype('GCT');

        // Verify BB policy does NOT appear in the allocations section
        const hasAllocations = await billingPage.hasPolicyAllocations();
        expect(hasAllocations).toBe(false);
    });

    test('[S11C2240] Verify Waive action is available for billing fees, including the GCT subtype, in the Payments & Other Transactions section', async ({page}) => {
        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');
        const transactionType = 'fee';
        const transactionSubtype = 'GCT';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
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
            subtype: transactionSubtype,
            status: 'Applied',
            currency: 'JMD'
        });
        expect(isTransactionFeeValid).toBe(true);
    });

    test('[S11C2241] Verify GCT fee is automatically waived when related billing fee (e.g., Cancellation Fee) is waived', async ({page}) => {
        const { customerName, customerId, customerDetails, policyNumber } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');
        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
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

        // Validate that the GCT fee is waived
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

    test('[S11C2242] Verify GCT fee is calculated correctly when a billing fee is allocated to multiple policies', async ({page}) => {
        const country = 'Jamaica';
        const insuredParty = 'Advantage General Insurance Company';

        const { customerName, customerId, customerDetails , policyNumber } = await setupActivePolicy(country, insuredParty);

        // Search for customer
        await ratingPage.searchCustomer(customerId);

        // Create another policy for the same customer
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
            sumInsured: '12000000',
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
        await ratingPage.finishPayment({
            billingAccountName: customerName,
            city: 'Test City',
            useExistingAccount: true
        });
        let secondPolicyNumber = await policyPage.policyNumberText.textContent() || '';
        secondPolicyNumber = secondPolicyNumber.replace('#', '').trim();
        if (!secondPolicyNumber) throw new Error('Policy not created successfully');


        const transactionType = 'fee';
        const transactionSubtype = 'CancellationFee';
        const amount = (Math.random() * (10000 - 1000) + 1000).toFixed(2);
        const gctAmount = (Number(amount) * 0.15).toFixed(2).toString();

        // Navigate to billing and select billing account
        await ratingPage.searchCustomer(customerId);
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

        // Validate that the GCT fee is waived
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
});

test.describe.serial('Refund - Billing Authority Levels (JMD)', () => {
    test('[S11C2243] Verify that the user can approve pending refunds only within the authority level for JMD policies [Level 2]', async ({page}) => {
        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 2');
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (90000 - 10000) + 10000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });

    test('[S11C2244] Verify that the user can approve pending refunds only within the authority level for JMD policies [Level 3]', async ({page}) => {
        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 3');
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (249000 - 100000) + 100000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);
    });

    test('[S11C2245] Verify that the user can approve pending refunds only within the authority level for JMD policies [Level 4]', async ({page}) => {
        // Set authority level for this test
        await billingPage.setUserAuthorityLevel('jegadeeshwaranm', 'Billing', 'Level 4');
        const { customerName, customerId, customerDetails } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

        await ratingPage.searchCustomer(customerId);

        // Navigate to billing and accept payment
        await billingPage.navigateToBilling();
        await billingPage.selectBillingAccount();
        const randomAmount = (Math.random() * (300000 - 250000) + 250000).toFixed(2);
        const paymentAmount = randomAmount;
        const paymentMethod = 'cheque';
        const paymentType = 'Refund';
        const paymentSubType = 'Manual Refund';
        const checkNumber = '1234567890';
        const checkDate = new Date().toLocaleDateString('en-GB');
        const reason = 'Misapplied';
        const currency = 'JMD';
        const status = 'Approved';

        await billingPage.selectRefundFromTakeAction();
        await billingPage.fillRefundDetails({
            paymentMethod: paymentMethod,
            checkNumber: checkNumber,
            checkDate: checkDate,
            amount: paymentAmount,
            reason: reason
        });

        await billingPage.submitRefund();

        await billingPage.validatePendingRefund({
            amount: paymentAmount,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            currency: currency
        });

        await billingPage.approveOrRejectPendingTransaction(paymentAmount, 'Approve', currency);

        // Validate the payment was successful
        const isPaymentSuccessful = await billingPage.validatePaymentSuccess({
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            paymentType: paymentType,
            paymentSubType: paymentSubType,
            reason: reason,
            status: status,
            currency: currency
        });

        expect(isPaymentSuccessful).toBe(true);

    });
});