import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    CoverageAddressDetails,
    DriverDetails,
    VehicleDetails
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
    'Successfully create a Commercial Auto policy - Jamaica',
    { tag: '@ECP-TC-51' },
    async ({ page }) => {
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
            country: 'JM',
            addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
            parish: 'Kingston',
            licensedDate: '20/06/2013',
            licenceCountry: 'JM'
        };

        const coverageAddressDetails: CoverageAddressDetails = {
            country: 'JM',
            addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
            parish: 'Kingston'
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
            sumInsured: '5000000',
            sizeClass: 'SETRAIL',
            businessUse: 'OwnGoods',
            writtenOffIndicator: 'No'
        };

        let customerName = '';
        let customerId = '';

        await test.step(
            'Step 1 - Create customer and start Jamaica Commercial Auto quote',
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
            'Step 5 - Complete Commercial Auto details',
            async () => {
                await commercialPolicyPage.navigateToCommercialAuto();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);

                await commercialPolicyPage.addDriver(driverDetails);

                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.addCoverageAddress(
                    coverageAddressDetails
                );
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.addVehicle(vehicleDetails);

                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(policyPage);
                await commercialPolicyPage.selectCommercialAutoPlan({
                    coverageType: 'Commercial Car Comprehensive'
                });
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
                    `LOB: Commercial Auto`,
                    `Currency: JMD`
                ].join('\n');
            }
        );
    }
);
