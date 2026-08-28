import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { closePartySearchPopupIfVisible, waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let homePolicyPage: HomePolicyPage;
let renewalBatchPage: RenewalBatchPage;

let customerName = '';
let policyNumber = '';

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

function getDynamicLimitAmount(min: number, max: number): string {
    return faker.number.int({ min, max }).toString();
}

function parsePremiumAmount(value = ''): number {
    return Number(value.replace(/[^\d.-]/g, '') || 0);
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    homePolicyPage = new HomePolicyPage(page);
    renewalBatchPage = new RenewalBatchPage(page);

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify Home automated renewals - Barbados',
    { tag: '@ECP-TC-30' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } = getEffectiveDateFor28DayExpiry();
        const coverageALimitAmount = getDynamicLimitAmount(100001, 250000);
        const coverageBLimitAmount = getDynamicLimitAmount(50000, 150000);

        await test.step('Step 1 - Create customer and start backdated Home quote', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            executionContext.customerName = customerName;
            executionContext.customerId = customer.customerId;

            await ratingPage.startQuote(
                'Personal Lines',
                'Home (Preconfigured)'
            );
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setEffectiveDate(effectiveDate);
            await expect(ratingPage.effectiveDateField)
                .toHaveValue(effectiveDate);

            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
                .selectOption('BBD');
            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_policyFormCd')
                .selectOption({ label: 'Cover All' });
            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });

        await test.step('Step 2 - Create Home policy and complete purchase', async () => {
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

            const policyStatus =
                (
                    await page
                        .locator(
                            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                        )
                        .textContent()
                )?.trim() || '';          expect(policyNumber).toMatch(/^P\d+$/);
            expect(policyStatus).toBe('Policy Active');

            executionContext.policyNumber = policyNumber;
            executionContext.policyStatus = policyStatus;
        });

        await test.step('Step 3 - Run renewal batch job', async () => {
            await renewalBatchPage.switchToAdmin();
            await renewalBatchPage.openScheduler();

            const batchStatus =
                await renewalBatchPage.executePolicyBatchGroup();        });

        await test.step('Step 4 - Generate renewal quote from the policy', async () => {
            await renewalBatchPage.switchToMain();
            await renewalBatchPage.searchPolicy(policyNumber);
            await renewalBatchPage.openPolicyFromSearchResults(policyNumber);
            await renewalBatchPage.moveRenewalToDataGather();

            const renewalDetails =
                await renewalBatchPage.verifyRenewalPolicyDetails(
                    policyNumber,
                    /Home/i
                );        });

        await test.step('Step 5 - Trigger renewal premium calculation', async () => {
            await homePolicyPage.openCoveragesAndPremiumTab();
            await homePolicyPage.calculatePremium();

            const renewalPremiumSummary =
                await homePolicyPage.getPremiumSummary();
            const billablePremium = parsePremiumAmount(
                renewalPremiumSummary.billablePremium
            );            expect(billablePremium).toBeGreaterThan(0);
            executionContext.premium = renewalPremiumSummary.billablePremium;
        });

        await test.step('Step 6 - Purchase renewal', async () => {
            await homePolicyPage.openAndPrintFundingSummary();
            await page
                .locator('#policyDataGatherForm\\:next_footer')
                .click();
            await waitForBarbadosLoadingSpinner(policyPage);

            await page
                .locator(
                    '#policyDataGatherForm\\:purchaseQuote_footer, form[id="headerForm"] input[value="Purchase"][type="submit"]'
                )
                .first()
                .click();
            await waitForBarbadosLoadingSpinner(policyPage);
            await policyPage.handlePurchasePolicyConfirmation(true);

            const finishButton = page.locator('#purchaseForm\\:yesButton_footer');
            await finishButton.waitFor({ state: 'visible', timeout: 60_000 });
            await finishButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            const finalStatus =
                (
                    await page
                        .locator(
                            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                        )
                        .textContent()
                )?.trim() || '';            expect(finalStatus).toMatch(/Policy Pending|Policy Active/);
            executionContext.policyStatus = finalStatus;
        });
    }
);
