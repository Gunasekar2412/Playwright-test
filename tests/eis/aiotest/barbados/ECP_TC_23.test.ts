import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { addCommentToTestCase } from '../../../../lib/aio/aioHelper';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import { calculateExpectedPremium } from '../../../../lib/utils';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { BusinessIncomeCoverageDetails, CoverageAddressDetails, DriverDetails, OccupancyDetails, PersonalPropertyCoverageDetails, StructureCoverageDetails, VehicleDetails } from '../../../../sites/eis/data/LobConfig';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let commercialPolicyPage: CommercialPolicyPage;

let customerId = '';
let customerName = '';
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
    'Successfully create a Commercial Property policy - Barbados',
    { tag: '@ECP-TC-23' },
    async ({ page }) => {
        let effectiveDate = '';
        const structureCoverageDetails: StructureCoverageDetails = {
            deductible: '0.02',
            addRemoveReason: 'CLIENT_REQUEST',
            limitAmount: '8000',
            ratingType: 'Class',
            causeOfLoss: 'CLAR',
            agreedValueOption: 'Yes',
            coinsurance: '100'
        };
        const personalPropertyCoverageDetails: PersonalPropertyCoverageDetails = {
            ratingType: 'Class'
        };
        const businessIncomeCoverageDetails: BusinessIncomeCoverageDetails = {
            riskType: 'Mining',
            causeOfLoss: 'Commercial All Risk',
            limitAmount: '50000',
            riskDescription: 'Wages',
            indemnityPeriod: '2'
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
                ({ effectiveDate } =
                    await ratingPage.setRegionalEffectiveDate(
                        'Barbados',
                        5
                    ));

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
        ); await test.step(
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
            'Step 4 - Add Risk Location',
            async () => {

                await commercialPolicyPage
                    .addRiskLocation(
                        'Barbados',
                        '12 Hope Road',
                        'St. Michael'
                    );
            }
        );
        await test.step(
            'Step 5 - Add Structure Information',
            async () => {

                await commercialPolicyPage
                    .addStructure({
                        structureDescription:
                            'Test Structure',

                        constructionType:
                            'Concrete Block',

                        roofType:
                            'Metal Sheeting'
                    });
            }
        );
        await test.step(
            'Step 6 - Add Occupancy Information',
            async () => {

                await commercialPolicyPage
                    .addOccupancy({
                        occupancyDescription:
                            'Office Operations',

                        occupantName:
                            'John Smith'
                    });
            }
        );
        await test.step(
            'Step 7 - Configure Structure Coverage',
            async () => {

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .addStructureCoverage(
                        structureCoverageDetails
                    );
            }
        );
        await test.step(
            'Step 8 - Configure Personal Property Coverage',
            async () => {

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                // await commercialPolicyPage
                //     .addPersonalPropertyCoverage(
                //         personalPropertyCoverageDetails
                //     );
            }
        );
        // await test.step(
        //     'Step 9 - Configure Business Income Coverage',
        //     async () => {

        //         await ratingPage
        //             .headerNextButton.click();

        //         await ratingPage
        //             .headerNextButton.click();

        //         await commercialPolicyPage
        //             .addBusinessIncomeCoverage(
        //                 businessIncomeCoverageDetails
        //             );
        //     }
        // );
        await test.step(
            'Step 10 - Rate Policy and Verify Premium',
            async () => {

                // await ratingPage
                //     .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .navigateToTab(
                        'Premium'
                    );
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .clickRateButton();

                const premiumSummary =
                    await commercialPolicyPage
                        .getOverallPremiumSummary();

                const premiumTotals =
                    await commercialPolicyPage
                        .getOverallPremiumTotals();

                expect(
                    premiumSummary
                ).toBeTruthy();
            }
        ); await test.step(
            'Step 11 - Verify Funding Summary',
            async () => {

                await commercialPolicyPage
                    .navigateToFundingSummary();

                await commercialPolicyPage
                    .fundingSummary();
            }
        );
        await test.step(
            'Step 12 - Purchase Policy',
            async () => {

                await policyPage
                    .purchaseButton.click();

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
            'Step 13 - Verify Policy Status and Policy Number',
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
                    customerName;
            }
        );
        await test.step(
            'Step 14 - Verify Policy Section',
            async () => {
                await page
                    .locator(
                        '#productConsolidatedViewForm\\:scolumn_Policy\\:0\\:policyNumber_navigationLink'
                    )
                    .click();
                await waitForBarbadosLoadingSpinner(ratingPage);
                await commercialPolicyPage
                    .verifyPolicySection({

                        country:
                            'Barbados',

                        effectiveDate,

                        premiumFinancing:
                            'No',

                        currency:
                            'BBD'
                    });


                // next click
                // await ratingPage.navigat

            }
        );
    }
);
