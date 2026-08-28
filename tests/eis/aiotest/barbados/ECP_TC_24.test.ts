import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { addCommentToTestCase } from '../../../../lib/aio/aioHelper';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    calculateExpectedPremium,
    getFormattedDate
} from '../../../../lib/utils';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { BusinessIncomeCoverageDetails, CoverageAddressDetails, DriverDetails, LiabilityLimitDetails, OccupancyDetails, PersonalPropertyCoverageDetails, StructureCoverageDetails, VehicleDetails } from '../../../../sites/eis/data/LobConfig';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let commercialPolicyPage: CommercialPolicyPage;

let customerId = '';
let customerName = '';
let policyNumber = '';
let validationComments: string[] = [];

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    validationComments = [];
    commercialPolicyPage =
        new CommercialPolicyPage(
            page,
            ratingPage,
            policyPage
        );
    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});


test(
    'Successfully create a Commercial Liability policy - Barbados',
    { tag: '@ECP-TC-24' },
    async ({ page }) => {

        const liabilityLimits: LiabilityLimitDetails = {
            generalAggregateLimit: '2000000',
            eachOccurrenceLimit: '1000000'
        };

        const liabilityClassDetails = {
            payrollAmount: '500000'
        };
        await test.step(
            'Step 1 - Create Customer and Start Quote',
            async () => {

                const customer =
                    await customerPage.createNewCustomer(
                        40,
                        'Barbados'
                    );

                customerName =
                    customer.customerName;

                customerId =
                    customer.customerId;

                await ratingPage.startQuote(
                    'Commercial Lines',
                    'Commercial (Preconfigured)'
                );

                await ratingPage.selectPolicyCounty(
                    'Barbados'
                );

                await page
                    .locator(
                        '#policyDataGatherForm\\:sedit_Policy_currencyCd'
                    )
                    .selectOption('BBD');

                await policyPage.checkPremiumFincancing(
                    'No'
                );

                await ratingPage.headerNextButton.click();
            }
        );
        await test.step(
            'Step 2 - Complete Insured Details',
            async () => {

                await commercialPolicyPage
                    .fillInsuredDetails(
                        customerName
                    );
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
            'Step 4 - Add Risk Location',
            async () => {

                await commercialPolicyPage
                    .addRiskLocation(
                        'Barbados',
                        '12 Hope Road',
                        'St. Michael'
                    );

                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
            }
        );
        await test.step(
            'Step 5 - Enter Liability Limits',
            async () => {
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .addLiabilityLimits(
                        liabilityLimits
                    );

            }
        );
        await test.step(
            'Step 6 - Add Liability Class Information',
            async () => {
                await commercialPolicyPage
                    .addLiabilityClassInformation(
                        liabilityClassDetails
                    );
            }
        );
        await test.step(
            'Step 7 - Rate Policy and Verify Premium',
            async () => {
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .navigateToTab(
                        'Premium'
                    );
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .clickRateButton();
                await waitForBarbadosLoadingSpinner(policyPage);
                const premiumSummary =
                    await commercialPolicyPage
                        .getOverallPremiumSummary();

                expect(
                    premiumSummary
                ).toBeTruthy();            }
        );
        await test.step(
            'Step 8 - Verify Funding Summary',
            async () => {

                await commercialPolicyPage
                    .navigateToFundingSummary();
                await waitForBarbadosLoadingSpinner(policyPage);
                const summary =
                    await commercialPolicyPage
                        .fundingSummary();            }
        );
        await test.step(
            'Step 9 - Purchase Policy',
            async () => {

                await policyPage
                    .purchaseButton
                    .click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await policyPage
                    .handlePurchasePolicyConfirmation(
                        true
                    );

                await ratingPage
                    .finishPayment({
                        billingAccountName:
                            customerName,

                        city:
                            'Test City'
                    });
            }
        );
        await test.step(
            'Step 10 - Verify Policy Status and Policy Number',
            async () => {

                const policyDetails =
                    await commercialPolicyPage
                        .getPolicyDetails();

                expect(
                    policyDetails.policyNumber
                ).toBeTruthy();

                expect(
                    policyDetails.status
                ).toBe(
                    'Policy Active'
                );

                executionContext.policyNumber =
                    policyDetails.policyNumber;

                executionContext.policyStatus =
                    policyDetails.status;

                executionContext.customerName =
                    customerName;            }
        );
    }
);
