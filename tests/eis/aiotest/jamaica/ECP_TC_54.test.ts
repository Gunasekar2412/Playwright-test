import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { waitForBarbadosLoadingSpinner, closePartySearchPopupIfVisible } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let homePolicyPage: HomePolicyPage;

function getDynamicLimitAmount(min: number, max: number): string {
    return faker.number.int({ min, max }).toString();
}

function formatJmdLimitAmount(amount: string): string {
    return `JMD${Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    homePolicyPage = new HomePolicyPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully create a Home policy - Jamaica',
    { tag: '@ECP-TC-54' },
    async ({ page }) => {
        const coverageALimitAmount = getDynamicLimitAmount(5000001, 7500000);
        const coverageBLimitAmount = getDynamicLimitAmount(5000001, 7500000);
        let customerName = '';
        let customerId = '';
        let policyNumber = '';
        let premiumSummary:
            | Awaited<ReturnType<HomePolicyPage['fillCoverageAndPremiumSection']>>
            | undefined;

        await test.step(
            'Step 1 - Create customer and start Jamaica Home quote',
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

                await ratingPage.startQuote(
                    'Personal Lines',
                    'Home (Preconfigured)'
                );
                await ratingPage.selectPolicyCounty('Jamaica');
                await ratingPage.selectBranch('Head Office - Kingston');
                await page
                    .locator(
                        '#policyDataGatherForm\\:sedit_Policy_currencyCd'
                    )
                    .selectOption('JMD');
                await page
                    .locator(
                        '#policyDataGatherForm\\:sedit_Policy_policyFormCd'
                    )
                    .selectOption({ label: 'Cover All' });
                await policyPage.checkPremiumFincancing('No');
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );
        await test.step(
            'Step 2 - Complete insured details',
            async () => {
                await page
                    .locator(
                        '#policyDataGatherForm\\:sedit_PreconfigInsured_partySelection'
                    )
                    .selectOption({ label: customerName });

                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );

        await test.step(
            'Step 3 - Fill Jamaica risk address',
            async () => {
                await closePartySearchPopupIfVisible(ratingPage.page);

                await homePolicyPage.fillRiskAddressSection({
                    countryCd: 'JM',
                    parishCd: 'JM-01',
                    addressLine1: `Jamaica Risk Address ${Date.now()}`,
                    yearBuilt: '2015'
                });

                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );

        await test.step(
            'Expected Result 1 - Rate policy and verify premium summary',
            async () => {
                premiumSummary =
                    await homePolicyPage.fillCoverageAndPremiumSection({
                        coverageALimitAmount,
                        coverageBLimitAmount
                    });

                expect(premiumSummary).toBeTruthy();
            }
        );

        await test.step(
            'Expected Result 2 - Verify funding summary',
            async () => {
                const fundingSummary =
                    await homePolicyPage.openAndPrintFundingSummary();

                expect(fundingSummary).toBeTruthy();
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );
        await test.step(
            'Expected Result 3 - Purchase policy',
            async () => {
                await policyPage.purchaseButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await policyPage.handlePurchasePolicyConfirmation(true);

                await ratingPage.finishPayment({
                    billingAccountName: customerName,
                    city: 'Kingston',
                    paymentBranch: 'HEAD_OFFICE_KINGSTON'
                });
            }
        );

        await test.step(
            'Expected Result 4 - Verify policy status and policy number',
            async () => {
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
                executionContext.customerDetails = [
                    `Customer ID: ${customerId}`,
                    `Region: Jamaica`,
                    `LOB: Home`,
                    `Currency: JMD`
                ].join('\n');
            }
        );
        await test.step(
            'Expected Result 5 - Verify policy overview and coverage limits',
            async () => {
                await homePolicyPage.clickPolicyNumber(policyNumber);
                await homePolicyPage.reopenPolicyIfVersionNotCurrent(
                    customerId,
                    policyNumber
                );

                await homePolicyPage.assertCurrentOverviewFieldValues({
                    Source: 'New',
                    Country: 'Jamaica',
                    'Policy Form': 'Cover All',
                    Currency: 'JMD',
                    'Premium Financing': 'No',
                    'Agency/Producer': /BCIC Jamaica/,
                    'Agent Sub Producer': /.+/
                });

                await homePolicyPage.openCoveragesAndPremiumTab();
                expect(premiumSummary).toBeDefined();
                await homePolicyPage.assertPremiumSummaryValues({
                    coverageTermPremium: premiumSummary!.coverageTermPremium,
                    actualPremium: premiumSummary!.actualPremium,
                    billablePremium: premiumSummary!.billablePremium
                });

            }
        );
    }
);
