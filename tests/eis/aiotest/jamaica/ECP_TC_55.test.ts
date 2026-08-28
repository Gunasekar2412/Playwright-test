import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let renewalBatchPage: RenewalBatchPage;

function getEffectiveDateFor28DayExpiry(
    policyTermDays = 365,
    daysUntilExpiry = 28
) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

    const effectiveDate = new Date(expiryDate);
    effectiveDate.setDate(expiryDate.getDate() - policyTermDays);

    return {
        effectiveDate: getFormattedDate(effectiveDate),
        expiryDate: getFormattedDate(expiryDate)
    };
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    renewalBatchPage = new RenewalBatchPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify Private Motor automated renewals - Jamaica',
    { tag: '@ECP-TC-55' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } =
            getEffectiveDateFor28DayExpiry();
        const vehicle = {
            year: '2024',
            make: 'Audi',
            model: 'A4',
            performance: 'S',
            bodyType: 'Sedan',
            sumInsured: '14000000',
            country: 'JM',
            address: 'Old Harbour 120',
            parish: 'Kingston',
            fuelType: 'Gasoline',
            chassisVIN: faker.vehicle.vin()
        };

        let customerName = '';
        let customerId = '';
        let policyNumber = '';

        await test.step(
            'Step 1 - Create customer and start Jamaica Private Motor quote',
            async () => {
                const customer =
                    await customerPage.createNewCustomer(
                        40,
                        'Jamaica'
                    );

                customerName = customer.customerName;
                customerId = customer.customerId;
                executionContext.customerName = customerName;
                executionContext.customerId = customerId;
                executionContext.customerDetails = [
                    `Customer ID: ${customerId}`,
                    `Region: Jamaica`,
                    `Renewal Expiry Date: ${expiryDate}`
                ].join('\n');

                await ratingPage.startNewQuote();
                await ratingPage.selectPolicyCounty('Jamaica');
                await ratingPage.selectBranch('Head Office - Kingston');
                await ratingPage.setEffectiveDate(effectiveDate);
                await expect(ratingPage.effectiveDateField)
                    .toHaveValue(effectiveDate);

                await policyPage.checkPremiumFincancing('No');
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(ratingPage);
            }
        );

        await test.step(
            'Step 2 - Complete insured and driver details',
            async () => {
                await ratingPage.selectInsuredParty(
                    customerName,
                    'Advantage General Insurance Company'
                );
                await ratingPage.goToNextTab('Driver');
                await ratingPage.selectExistingDriver(
                    customerName,
                    'Permanent',
                    'Valid'
                );
            }
        );

        await test.step(
            'Step 3 - Complete vehicle, coverage, and premium details',
            async () => {
                await ratingPage.clickVehicleTab();
                await ratingPage.addNewVehicle(vehicle);
                await ratingPage.clickPremiumsAndCoveragesTab();
                await ratingPage.setCoverageAndPlan('Comprehensive');
                await ratingPage.calculatePremium();

                const actualPremium = await ratingPage.getPremiumValue();
                expect(actualPremium).toBeGreaterThan(0);
                executionContext.premium = actualPremium.toString();
            }
        );
        await test.step(
            'Step 4 - Purchase Jamaica Private Motor policy',
            async () => {
                await ratingPage.clickFundingSummaryTab();
                await ratingPage.selectPaymentPlan('FullPay');
                await policyPage.purchaseButton.click();
                await policyPage.handlePurchasePolicyConfirmation(true);

                await ratingPage.finishPayment({
                    billingAccountName: customerName,
                    city: 'Kingston',
                    paymentBranch: 'HEAD_OFFICE_KINGSTON'
                });

                policyNumber =
                    (await policyPage.policyNumberText.textContent()) || '';
                policyNumber = policyNumber.replace('#', '').trim();

                await expect(
                    page.locator(
                        '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                    )
                ).toHaveText('Policy Active');
                expect(policyNumber).toMatch(/^P\d+$/);

                executionContext.policyNumber = policyNumber;
                executionContext.policyStatus = 'Policy Active';
            }
        );

        await test.step(
            'Expected Result 1 - Execute renewal batch job',
            async () => {
                await renewalBatchPage.switchToAdmin();
                await renewalBatchPage.openScheduler();

                const batchStatus =
                    await renewalBatchPage.executePolicyBatchGroup();

                expect(batchStatus).toContain('(Passed)');
            }
        );

        await test.step(
            'Expected Result 2 - Move renewal to Data Gather',
            async () => {
                await renewalBatchPage.switchToMain();
                await renewalBatchPage.searchPolicy(policyNumber);
                await renewalBatchPage.openPolicyFromSearchResults(
                    policyNumber
                );
                await renewalBatchPage.moveRenewalToDataGather();
            }
        );

        await test.step(
            'Expected Result 3 - Verify renewal policy details',
            async () => {
                const renewalPolicyDetails =
                    await renewalBatchPage.verifyRenewalPolicyDetails(
                        policyNumber,
                        'Private Motor'
                    );

                expect(renewalPolicyDetails.policyNumber)
                    .toContain(policyNumber);
            }
        );

        await test.step(
            'Expected Result 4 - Purchase renewal and verify pending status',
            async () => {
                const finalPolicyStatus =
                    await renewalBatchPage
                        .completeRenewalPurchaseAndVerifyPending();

                expect(finalPolicyStatus).toBe('Policy Pending');
                executionContext.policyStatus = finalPolicyStatus;
            }
        );
    }
);
