import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
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
let billingPage: BillingPage;

let customerName = '';
let policyNumber = '';

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    billingPage = new BillingPage(page);
    commercialPolicyPage = new CommercialPolicyPage(
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
    'Verify Commercial Auto endorsements - Barbados',
    { tag: '@ECP-TC-27' },
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
            vinNumber: faker.string.alphanumeric(17).toUpperCase(),
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

        await test.step('Step 1 - Create customer and start Commercial Auto quote', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            executionContext.customerName = customerName;

            await ratingPage.startQuote(
                'Commercial Lines',
                'Commercial (Preconfigured)'
            );
            await ratingPage.selectPolicyCounty('Barbados');
            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
                .selectOption('BBD');
            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });
        
        await test.step('Step 2 - Complete Commercial Auto policy details and purchase', async () => {
            await commercialPolicyPage.fillInsuredDetails(customerName);

            await commercialPolicyPage.selectLOBs({
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

            await commercialPolicyPage.addRiskLocation(
                'Barbados',
                '12 Hope Road',
                'St. Michael'
            );

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

            await commercialPolicyPage.navigateToTab('Premium');
            await waitForBarbadosLoadingSpinner(policyPage);
            await commercialPolicyPage.clickRateButton();
            await waitForBarbadosLoadingSpinner(policyPage);

            await commercialPolicyPage.navigateToFundingSummary();
            await waitForBarbadosLoadingSpinner(policyPage);
            await commercialPolicyPage.fundingSummary();

            await policyPage.purchaseButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
            await policyPage.handlePurchasePolicyConfirmation(true);

            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });

            const policyDetails = await commercialPolicyPage.getPolicyDetails();
            policyNumber = policyDetails.policyNumber?.trim() || '';            // expect(policyNumber).toMatch(/^[CP]\d+$/);
            expect(policyDetails.status?.trim()).toBe('Policy Active');

            executionContext.policyNumber = policyNumber;
            executionContext.policyStatus = policyDetails.status?.trim() || '';        });

        await test.step('Step 3 - Endorse the policy and update EML', async () => {
            // await page
            //     .locator(
            //         '#productConsolidatedViewForm\\:scolumn_Policy\\:0\\:policyNumber_navigationLink'
            //     )
            //     .click();
            await waitForBarbadosLoadingSpinner(ratingPage);

            // await expect(
            //     page.locator('#productContextInfoForm\\:policyDetail_policyNumTxt')
            // ).toContainText(policyNumber);

            await commercialPolicyPage.completeUpdateEmlEndorsement('100000');
        });

        await test.step('Step 4 - Verify billing transaction for endorsement', async () => {
            await billingPage.navigateToBilling();            
            await billingPage.verifyEndorsementUpdateEmlTransaction(
                policyNumber
            );
        });
    }
);
