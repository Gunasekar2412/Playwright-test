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
    'Successfully create a Commercial Auto policy - Barbados',
    { tag: '@ECP-TC-22' },
    async ({ page }) => {
        let effectiveDate = '';
        const driverDetails: DriverDetails = {
            relationshipToApplicant: 'EMP',
            driverType: 'P',
            maritalStatus: 'S',
            licenceType: 'PER',
            ageFirstLicensed: '2',
            licenceNumber: faker.string.alphanumeric(12).toUpperCase(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            gender: 'male',
            dateOfBirth: '20/06/1995',
            country: 'BB',
            addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
            parish: 'BB-02',
            licensedDate: '20/06/2013',
            licenceCountry: 'BB'
        };

        const coverageAddressDetails: CoverageAddressDetails = {
            country: 'BB',
            addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
            parish: 'BB-08'
        };

        const vehicleDetails: VehicleDetails = {
            vinNumber: faker.string
                .alphanumeric(17)
                .toUpperCase(),
            modelYear: '2026',
            make: 'Acura',
            ccRating: '1800',
            model: 'CL',
            bodyType: 'BDYT147',
            sumInsured: '70000',
            sizeClass: 'SETRAIL',
            businessUse: 'OwnGoods',
            writtenOffIndicator: 'No'
        };

        const planSelectionDetails = {
            coverageType: 'Commercial Car Comprehensive'
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
        );
        await test.step(
            'Step 3 - Select Commercial Auto LOB',
            async () => {

                await commercialPolicyPage
                    .selectLOBs({
                        commercialAuto: true,
                        property: false,
                        liability: false,

                        businessAuto: true,
                        autoDealers: true,
                        garageKeepers: true,

                        structure: false,
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
            'Step 5 - Navigate to Commercial Auto Section',
            async () => {

                await commercialPolicyPage
                    .navigateToCommercialAuto();

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
            }
        );
        await test.step(
            'Step 6 - Add Driver Information',
            async () => {

                await commercialPolicyPage
                    .addDriver(
                        driverDetails
                    );
            }
        );
        await test.step(
            'Step 7 - Add Coverage Address',
            async () => {

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();

                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .addCoverageAddress(
                        coverageAddressDetails
                    );
            }
        );
        await test.step(
            'Step 8 - Add Vehicle Information',
            async () => {

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .addVehicle(
                        vehicleDetails
                    );
            }
        );
        await test.step(
            'Step 9 - Select Coverage Type',
            async () => {

                await ratingPage
                    .headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage
                    .selectCommercialAutoPlan(
                        planSelectionDetails
                    );
            }
        );
        await test.step(
            'Step 10 - Rate Policy and Verify Premium',
            async () => {

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

                const premiumTotals =
                    await commercialPolicyPage
                        .getOverallPremiumTotals();

                expect(
                    premiumSummary
                ).toBeTruthy();
            }
        );
        await test.step(
            'Step 11 - Verify Funding Summary',
            async () => {

                await commercialPolicyPage
                    .navigateToFundingSummary();
                await waitForBarbadosLoadingSpinner(policyPage);
                const summary =
                    await commercialPolicyPage
                        .fundingSummary();
            }
        );
        await test.step(
            'Step 12 - Purchase Policy',
            async () => {

                await policyPage
                    .purchaseButton.click();
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
                ); executionContext.policyNumber =
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


                // Click Auto 
                await commercialPolicyPage.navigateToCommercialAuto();
                // 2 X Next 

                await waitForBarbadosLoadingSpinner(ratingPage);

                await ratingPage.overviewNextButton.click();


                await waitForBarbadosLoadingSpinner(ratingPage);
                await ratingPage.overviewNextButton.click();

                await waitForBarbadosLoadingSpinner(ratingPage);

                await commercialPolicyPage.verifyDriverDetails({

                    driverType: 'Principal Driver',

                    firstName: driverDetails.firstName,

                    lastName: driverDetails.lastName,

                    gender: 'Male',

                    addressLine1: driverDetails.addressLine1,

                    parish: 'St. Andrew',

                    licenceType: 'Permanent',

                    licenceNumber: driverDetails.licenceNumber,

                    licenceCountry: 'Barbados'
                });
                // 3X  Next

                await waitForBarbadosLoadingSpinner(ratingPage);
                await ratingPage.overviewNextButton.click();

                await waitForBarbadosLoadingSpinner(ratingPage);
                await ratingPage.overviewNextButton.click();

                await waitForBarbadosLoadingSpinner(ratingPage);
                await ratingPage.overviewNextButton.click();

                await waitForBarbadosLoadingSpinner(ratingPage);
                await commercialPolicyPage
                    .verifyVehicleDetails({

                        vinNumber:
                            vehicleDetails.vinNumber,

                        modelYear:
                            vehicleDetails.modelYear,

                        make:
                            vehicleDetails.make,

                        model:
                            vehicleDetails.model,

                        bodyType:
                            'Sedan',

                        sumInsured:
                            'BBD70,000.00',

                        sizeClass:
                            'Semitrailer',

                        businessUse:
                            'Carriage of own goods',

                        writtenOffIndicator:
                            'No',

                        claimFreeYears:
                            'less than 1 year'
                    });

                await commercialPolicyPage
                    .navigateToFundingSummary();
                await commercialPolicyPage.verifyFundingSummary({

                    paymentPlan:
                        'Full Pay',

                    interestRate:
                        '0.00',

                    totalFinanceCharge:
                        'BBD0.00'
                });

            }
        );
    }
);
