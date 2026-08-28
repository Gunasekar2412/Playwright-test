import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    LiabilityLimitDetails
} from '../../../../sites/eis/data/LobConfig';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let commercialPolicyPage: CommercialPolicyPage;

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    commercialPolicyPage =
        new CommercialPolicyPage(
            page,
            ratingPage,
            policyPage
        );
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully create a Commercial Liability policy - Jamaica',
    { tag: '@ECP-TC-53' },
    async ({ page }) => {
        const liabilityLimits: LiabilityLimitDetails = {
            generalAggregateLimit: '2000000',
            eachOccurrenceLimit: '1000000'
        };

        const liabilityClassDetails = {
            payrollAmount: '500000'
        };

        let customerName = '';
        let customerId = '';

        await test.step(
            'Step 1 - Create customer and start Jamaica Commercial Liability quote',
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
                    'Commercial Lines',
                    'Commercial (Preconfigured)'
                );
                await ratingPage.selectPolicyCounty('Jamaica');
                await ratingPage.selectBranch('Head Office - Kingston');
                await page
                    .locator(
                        '#policyDataGatherForm\\:sedit_Policy_currencyCd'
                    )
                    .selectOption('JMD');
                await page.waitForTimeout(2000);
                await policyPage.checkPremiumFincancing('No');
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );
        await test.step(
            'Step 2 - Complete insured details',
            async () => {
                await commercialPolicyPage
                    .fillInsuredDetails(customerName);
            }
        );

        await test.step(
            'Step 3 - Select Liability LOB',
            async () => {
                await commercialPolicyPage
                    .selectLOBs({
                        commercialAuto: false,
                        property: false,
                        liability: true,
                        businessAuto: false,
                        autoDealers: false,
                        garageKeepers: false,
                        structure: false,
                        personalProperty: false,
                        businessIncome: false,
                        premisesOperations: true,
                        productsOperations: true
                    });
            }
        );

        await test.step(
            'Step 4 - Add Jamaica risk location',
            async () => {
                await commercialPolicyPage
                    .addRiskLocation(
                        'Jamaica',
                        '12 Hope Road',
                        'Kingston'
                    );

                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );

        await test.step(
            'Step 5 - Enter liability limits',
            async () => {
                await commercialPolicyPage
                    .addLiabilityLimits(liabilityLimits);
                // await ratingPage.headerNextButton.click();
                // await waitForBarbadosLoadingSpinner(policyPage);
            }
        );
        await test.step(
            'Step 6 - Add liability class information',
            async () => {
                await commercialPolicyPage
                    .addLiabilityClassInformation(
                        liabilityClassDetails
                    );
            }
        );
        await test.step(
            'Expected Result 1 - Rate policy and verify premium summary',
            async () => {
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.navigateToTab('Premium');
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.clickRateButton();
                await waitForBarbadosLoadingSpinner(policyPage);

                const premiumSummary =
                    await commercialPolicyPage
                        .getOverallPremiumSummary();

                expect(premiumSummary).toBeTruthy();
            }
        );

        await test.step(
            'Expected Result 2 - Verify funding summary',
            async () => {
                await commercialPolicyPage.navigateToFundingSummary();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.fundingSummary();
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
                const policyDetails =
                    await commercialPolicyPage.getPolicyDetails();

                const policyNumber =
                    policyDetails.policyNumber?.trim() || '';
                const policyStatus =
                    policyDetails.status?.trim() || '';

                expect(policyNumber).toBeTruthy();
                expect(policyStatus).toBe('Policy Active');

                executionContext.policyNumber = policyNumber;
                executionContext.policyStatus = policyStatus;
                executionContext.customerDetails = [
                    `Customer ID: ${customerId}`,
                    `Region: Jamaica`,
                    `LOB: Commercial Liability`,
                    `Currency: JMD`
                ].join('\n');
            }
        );
    }
);
