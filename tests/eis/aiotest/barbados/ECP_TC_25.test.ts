import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { closePartySearchPopupIfVisible, waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let commercialPolicyPage: CommercialPolicyPage;
let homePolicyPage: HomePolicyPage;
let policyNumber = '';
let customerId = '';
let customerName = '';
let validationComments: string[] = [];
let premiumSummary:
    | Awaited<ReturnType<HomePolicyPage['fillCoverageAndPremiumSection']>>
    | undefined;

function getDynamicLimitAmount(min: number, max: number): string {
    return faker.number.int({ min, max }).toString();
}

function formatBbdLimitAmount(amount: string): string {
    return `BBD${Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    commercialPolicyPage = new CommercialPolicyPage(
        page,
        ratingPage,
        policyPage
    );
    homePolicyPage = new HomePolicyPage(page);

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully create a Home policy - Barbados',
    { tag: '@ECP-TC-25' },
    async ({ page }) => {
        const coverageALimitAmount = getDynamicLimitAmount(100001, 250000);
        const coverageBLimitAmount = getDynamicLimitAmount(50000, 100001);

        await test.step('Step 1 - Create Customer and Start Quote', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            customerId = customer.customerId;

            await ratingPage.startQuote(
                'Personal Lines',
                'Home (Preconfigured)'
            );

            await ratingPage.selectPolicyCounty('Barbados');

            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
                .selectOption('BBD');
            await page.locator('#policyDataGatherForm\\:sedit_Policy_policyFormCd')
                .selectOption({ label: 'Cover All' });
            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });

        await test.step('Step 2 - Fill Insured Section', async () => {
            await page.locator(
                '#policyDataGatherForm\\:sedit_PreconfigInsured_partySelection'
            ).selectOption({ label: customerName });

            await waitForBarbadosLoadingSpinner(policyPage);

            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });

        await test.step('Step 3 - Fill Risk Address Section', async () => {
            await closePartySearchPopupIfVisible(ratingPage.page);

            await homePolicyPage.fillRiskAddressSection({
                addressLine1: `Barbados Risk Address ${Date.now()}`,
                yearBuilt: '2015'
            });

            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });

        await test.step('Step 4 - Fill Coverage & Premium Section', async () => {
            premiumSummary = await homePolicyPage.fillCoverageAndPremiumSection({
                coverageALimitAmount,
                coverageBLimitAmount
            });     });

        await test.step('Step 5 - Validate Funding Summary', async () => {
            const fundingSummary = await homePolicyPage.openAndPrintFundingSummary();          await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });

        await test.step('Step 6 - Purchase Policy', async () => {
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);

            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });

            policyNumber = (await policyPage.policyNumberText.textContent()) || '';
            policyNumber = policyNumber.replace('#', '').trim();

            await expect(
                page.locator('#productContextInfoForm\\:policyDetail_policyStatusCdText')
            ).toHaveText('Policy Active');

            expect(policyNumber).toMatch(/^P\d+$/);
        });
        
        await test.step('Step 7 - Review Policy Overview', async () => {
            // 
            await homePolicyPage.clickPolicyNumber(policyNumber);
            // 
            
            await homePolicyPage.assertCurrentOverviewFieldValues({
                Source: 'New',
                Country: 'Barbados',
                'Policy Form': 'Cover All',
                Currency: 'BBD',
                'Premium Financing': 'No',
                'RENOVATION - are any of the properties undergoing renovation or reconstruction?': 'No',
                'SALE - are any of the properties for sale?': 'No',
                'Agency/Producer': 'BCIC Jamaica BCIC Jamaica BCIC Jamaica',
                'Agent Sub Producer': /.+/
            });
            

            await ratingPage.overviewNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
            

            await homePolicyPage.assertCurrentOverviewFieldValues({
                'Insured Party Selection': customerName,
                'Primary Insured?': 'Yes',
                'First Name': customerName.split(' ')[0],
                'Last Name': customerName.split(' ').slice(1).join(' '),
                Age: '40',
                'Identification Type': /.+/,
                'Identification Number': /.+/
            });
            

            await homePolicyPage.openCoveragesAndPremiumTab();
            expect(premiumSummary).toBeDefined();
            await homePolicyPage.assertPremiumSummaryValues({
                coverageTermPremium: premiumSummary!.coverageTermPremium,
                actualPremium: premiumSummary!.actualPremium,
                billablePremium: premiumSummary!.billablePremium
            });
            

            await homePolicyPage.assertMainCoverageLimitValues({
                dwellingLimitAmount: formatBbdLimitAmount(coverageALimitAmount),
                otherStructuresLimitAmount: formatBbdLimitAmount(coverageBLimitAmount)
            });
        });
    }

);
