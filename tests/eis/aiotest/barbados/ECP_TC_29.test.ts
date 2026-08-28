import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { closePartySearchPopupIfVisible, waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let homePolicyPage: HomePolicyPage;
let billingPage: BillingPage;

let customerName = '';
let policyNumber = '';

function getDynamicLimitAmount(min: number, max: number): string {
    return faker.number.int({ min, max }).toString();
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    homePolicyPage = new HomePolicyPage(page);
    billingPage = new BillingPage(page);

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify Home policy endorsements - Barbados',
    { tag: '@ECP-TC-29' },
    async ({ page }) => {
        const coverageALimitAmount = getDynamicLimitAmount(100001, 200000);
        const coverageBLimitAmount = getDynamicLimitAmount(50000, 150000);
        const endorsedCoverageALimitAmount = (
            Number(coverageALimitAmount) + 25000
        ).toString();
        const endorsedCoverageBLimitAmount = (
            Number(coverageBLimitAmount) + 25000
        ).toString();

        await test.step('Step 1 - Create new customer', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            executionContext.customerName = customerName;
            executionContext.customerId = customer.customerId;
        });

        await test.step('Step 2 - Create Home policy and complete purchase flow', async () => {
            await ratingPage.startQuote(
                'Personal Lines',
                'Home (Preconfigured)'
            );
            await ratingPage.selectPolicyCounty('Barbados');

            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
                .selectOption('BBD');
            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_policyFormCd')
                .selectOption({ label: 'Cover All' });
            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            await page
                .locator(
                    '#policyDataGatherForm\\:sedit_PreconfigInsured_partySelection'
                )
                .selectOption({ label: customerName });
            await waitForBarbadosLoadingSpinner(policyPage);
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            await closePartySearchPopupIfVisible(ratingPage.page);
            await homePolicyPage.fillRiskAddressSection({
                addressLine1: `Barbados Risk Address ${Date.now()}`,
                yearBuilt: '2015'
            });
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            const premiumSummary =
                await homePolicyPage.fillCoverageAndPremiumSection({
                    coverageALimitAmount,
                    coverageBLimitAmount
                });
            executionContext.premium = premiumSummary.billablePremium;

            await homePolicyPage.openAndPrintFundingSummary();
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });

            policyNumber =
                ((await policyPage.policyNumberText.textContent()) || '')
                    .replace('#', '')
                    .trim();

            await expect(
                page.locator(
                    '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                )
            ).toHaveText('Policy Active');
            // expect(policyNumber).toMatch(/^P\d+$/);

            executionContext.policyNumber = policyNumber;
            executionContext.policyStatus = 'Policy Active';
        });

        await test.step('Step 3 - Endorse Home policy and approve payment', async () => {
            await homePolicyPage.completeHomePolicyEndorsement({
                endorsementReason: 'Increasing risk sum insured/limit',
                coverageALimitAmount: endorsedCoverageALimitAmount,
                coverageBLimitAmount: endorsedCoverageBLimitAmount,
                billingAccountName: customerName,
                city: 'Test City'
            });

            const policyStatus =
                (
                    await page
                        .locator(
                            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                        )
                        .textContent()
                )?.trim() || '';

            executionContext.policyStatus = policyStatus;
            expect(policyStatus).toMatch(/Policy Active|Policy Pending/);
        });

        await test.step('Step 4 - Verify endorsement transaction in billing account', async () => {
            await billingPage.navigateToBilling();
            await billingPage.verifyEndorsementTransaction(policyNumber);
        });
    }
);
