import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage, PremiumSummary } from '../../../../sites/eis/pages/HomePolicyPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { closePartySearchPopupIfVisible, waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    CommissionAgency,
    CommissionGroupDetails,
    CommissionPage
} from '../../../../sites/eis/pages/CommissionPage';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let homePolicyPage: HomePolicyPage;
let renewalBatchPage: RenewalBatchPage;
let commissionPage: CommissionPage;

let customerName = '';
let policyNumber = '';
let selectedAgency: CommissionAgency;
let commissionGroupDetails: CommissionGroupDetails;

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

function parseCurrencyAmount(value = ''): number {
    return Number(value.replace(/[^\d.-]/g, '') || 0);
}

function expectCommissionCalculatedCorrectly(
    premiumSummary: PremiumSummary,
    commissionRate: number
): void {
    const actualPremium = parseCurrencyAmount(premiumSummary.actualPremium);
    const actualCommission = parseCurrencyAmount(
        premiumSummary.calculatedCommission
    );
    const expectedCommission = actualPremium * (commissionRate / 100);  expect(actualPremium).toBeGreaterThan(0);
    expect(actualCommission).toBeCloseTo(expectedCommission, 0);
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    homePolicyPage = new HomePolicyPage(page);
    renewalBatchPage = new RenewalBatchPage(page);
    commissionPage = new CommissionPage(page);

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Validate commission for renewal of a Private Motor Agent policy - Barbados',
    { tag: '@ECP-TC-32' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } = getEffectiveDateFor28DayExpiry();
        const coverageALimitAmount = getDynamicLimitAmount(100001, 250000);
        const coverageBLimitAmount = getDynamicLimitAmount(50000, 150000);

        await test.step('Step 1 - Select agent commission group and agency', async () => {
            await commissionPage.switchToAdmin();
            await commissionPage.openCommissionGroup();
            await commissionPage.searchCommissionGroups();

            const selectedGroup =
                await commissionPage.selectAlternateBarbadosHomeCommissionGroup();

            commissionGroupDetails =
                await commissionPage.getSelectedBarbadosHomeCommissionGroupDetails();

            expect(commissionGroupDetails.groupName).toBe(selectedGroup);

            selectedAgency =
                commissionGroupDetails.agencies[
                    Math.floor(
                        Math.random() * commissionGroupDetails.agencies.length
                    )
                ];            await commissionPage.switchToMain();
        });

        await test.step('Step 2 - Create backdated Home agent policy and purchase', async () => {
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
            await commissionPage.changeAgencyProducer(selectedAgency.name);

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
                addressLine1: `Barbados Agent Risk ${Date.now()}`,
                yearBuilt: '2015'
            });
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);

            const premiumSummary =
                await homePolicyPage.fillCoverageAndPremiumSection({
                    coverageALimitAmount,
                    coverageBLimitAmount
                });

            expectCommissionCalculatedCorrectly(
                premiumSummary,
                commissionGroupDetails.commissionRate
            );
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
                )?.trim() || '';         expect(policyNumber).toMatch(/^P\d+$/);
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

        await test.step('Step 5 - Trigger premium calculation and verify commission', async () => {
            await homePolicyPage.openCoveragesAndPremiumTab();
            await homePolicyPage.calculatePremium();
            const renewalPremiumSummary =
                await homePolicyPage.getPremiumSummary();

            expectCommissionCalculatedCorrectly(
                renewalPremiumSummary,
                commissionGroupDetails.commissionRate
            );
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

            const finishButton = page.locator(
                '#purchaseForm\\:yesButton_footer'
            );
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
