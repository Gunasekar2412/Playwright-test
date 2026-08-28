import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
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
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    renewalBatchPage = new RenewalBatchPage(page);

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify Private Motor automated renewals - Barbados',
    { tag: '@ECP-TC-26' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } = getEffectiveDateFor28DayExpiry();
        const customer = await customerPage.createNewCustomer(40, 'Barbados');
        const vehicle = {
            year: '2024',
            make: 'Audi',
            model: 'A4',
            performance: 'A',
            bodyType: 'Sedan',
            sumInsured: '100000',
            country: 'Barbados',
            address: '123 Test Street',
            parish: 'St. Michael',
            ccRating: '1600',
            chassisVIN: faker.vehicle.vin()
        };

        let policyNumber = '';

        await test.step('Step 1 - Navigate to EIS and start quote', async () => {
            await ratingPage.startQuote('Personal Lines', 'Private Motor');
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setEffectiveDate(effectiveDate);
            await expect(ratingPage.effectiveDateField)
                .toHaveValue(effectiveDate);

            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(ratingPage);
        });

        await test.step('Step 2 - Fill insured and driver details', async () => {
            await ratingPage.selectInsuredParty(
                customer.customerName,
                'Trident Insurance Company Limited'
            );
            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customer.customerName,
                'Permanent',
                'Valid'
            );
        });

        await test.step('Step 3 - Fill vehicle and coverage details', async () => {
            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);
            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.setCoverageAndPlan('Comprehensive');
            await ratingPage.calculatePremium();
        });

        await test.step('Step 4 - Complete purchase workflow', async () => {
            await ratingPage.clickFundingSummaryTab();
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.finishPayment({
                billingAccountName: customer.customerName,
                city: 'Test City'
            });

            policyNumber =
                (await policyPage.policyNumberText.textContent()) || '';
            policyNumber = policyNumber.replace('#', '').trim();

            await expect(
                page.locator('#productContextInfoForm\\:policyDetail_policyStatusCdText')
            ).toHaveText('Policy Active');
        });

        await test.step('Step 5 - Log policy details', async () => {
            const policyStatus =
                (await page
                    .locator('#productContextInfoForm\\:policyDetail_policyStatusCdText')
                    .textContent()) || '';          expect(policyNumber).toMatch(/^P\d+$/);
            expect(policyStatus.trim()).toBe('Policy Active');
        });
        

        await test.step('Step 6 - Execute renewal batch job', async () => {
            await renewalBatchPage.switchToAdmin();
            await renewalBatchPage.openScheduler();
            
            const batchStatus =
                await renewalBatchPage.executePolicyBatchGroup();        });

        await test.step('Step 7 - Move renewal to Data Gather', async () => {
            await renewalBatchPage.switchToMain();
            
            await renewalBatchPage.searchPolicy(policyNumber);
            
            await renewalBatchPage.openPolicyFromSearchResults(policyNumber);
            await renewalBatchPage.moveRenewalToDataGather();
        });

        await test.step('Step 8 - Verify renewal policy details', async () => {
            
            const renewalPolicyDetails =
                await renewalBatchPage.verifyRenewalPolicyDetails(policyNumber);        });

        await test.step('Step 9 - Purchase renewal and verify pending status', async () => {
            const finalPolicyStatus =
                await renewalBatchPage.completeRenewalPurchaseAndVerifyPending();

            expect(finalPolicyStatus).toBe('Policy Pending');
        });
    }
);
