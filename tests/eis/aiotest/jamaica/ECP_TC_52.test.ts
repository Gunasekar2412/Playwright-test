import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    StructureCoverageDetails
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
    'Successfully create a Commercial Property policy - Jamaica',
    { tag: '@ECP-TC-52' },
    async ({ page }) => {
        const structureCoverageDetails: StructureCoverageDetails = {
            deductible: '0.02',
            addRemoveReason: 'CLIENT_REQUEST',
            limitAmount: '800000',
            ratingType: 'Class',
            causeOfLoss: 'CLAR',
            agreedValueOption: 'Yes',
            coinsurance: '100'
        };

        let customerName = '';
        let customerId = '';
        let effectiveDate = '';

        await test.step(
            'Step 1 - Create customer and start Jamaica Commercial Property quote',
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
                ({ effectiveDate } =
                    await ratingPage.setRegionalEffectiveDate(
                        'Jamaica',
                        5
                    ));
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
            'Step 3 - Select Property LOB',
            async () => {
                await commercialPolicyPage
                    .selectLOBs({
                        commercialAuto: false,
                        property: true,
                        liability: false,
                        businessAuto: false,
                        autoDealers: false,
                        garageKeepers: false,
                        structure: true,
                        personalProperty: false,
                        businessIncome: false,
                        premisesOperations: false,
                        productsOperations: false
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
            }
        );

        await test.step(
            'Step 5 - Add structure information',
            async () => {
                await commercialPolicyPage
                    .addStructure({
                        structureDescription: 'Test Structure',
                        constructionType: 'Concrete Block',
                        roofType: 'Metal Sheeting'
                    });
            }
        );

        await test.step(
            'Step 6 - Add occupancy information',
            async () => {
                await commercialPolicyPage
                    .addOccupancy({
                        occupancyDescription: 'Office Operations',
                        occupantName: 'John Smith'
                    });
            }
        );

        await test.step(
            'Step 7 - Configure structure coverage',
            async () => {
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .addStructureCoverage(structureCoverageDetails);
            }
        );

        await test.step(
            'Step 8 - Continue through remaining coverage screens',
            async () => {
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );

        await test.step(
            'Expected Result 1 - Rate policy and verify premium summary',
            async () => {
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
                    `LOB: Commercial Property`,
                    `Currency: JMD`
                ].join('\n');
            }
        );

        await test.step(
            'Expected Result 5 - Verify policy section',
            async () => {
                await page
                    .locator(
                        '#productConsolidatedViewForm\\:scolumn_Policy\\:0\\:policyNumber_navigationLink'
                    )
                    .click();
                await waitForBarbadosLoadingSpinner(ratingPage);
                await commercialPolicyPage
                    .verifyPolicySection({
                        country: 'Jamaica',
                        effectiveDate,
                        premiumFinancing: 'No',
                        currency: 'JMD'
                    });
            }
        );
    }
);
