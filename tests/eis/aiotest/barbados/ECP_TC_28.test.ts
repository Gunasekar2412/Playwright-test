import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
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
let renewalBatchPage: RenewalBatchPage;
let commercialPolicyPage: CommercialPolicyPage;

let customerName = '';
let policyNumber = '';

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

function parsePremiumAmount(value = ''): number {
    return Number(value.replace(/[^\d.-]/g, '') || 0);
}

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    renewalBatchPage = new RenewalBatchPage(page);
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
    'Verify Commercial Auto automated renewals - Barbados',
    { tag: '@ECP-TC-28' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } = getEffectiveDateFor28DayExpiry();

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

        await test.step('Step 1 - Create customer and start backdated Commercial Auto quote', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            executionContext.customerName = customerName;
            executionContext.customerId = customer.customerId;

            await ratingPage.startQuote(
                'Commercial Lines',
                'Commercial (Preconfigured)'
            );
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setEffectiveDate(effectiveDate);
            await expect(ratingPage.effectiveDateField)
                .toHaveValue(effectiveDate);
            await page
                .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
                .selectOption('BBD');
            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
        });
        
        await test.step('Step 2 - Create Commercial Auto policy and complete purchase', async () => {
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
            await commercialPolicyPage.clickRateButton();
            await commercialPolicyPage.getOverallPremiumTotals();

            await commercialPolicyPage.navigateToFundingSummary();
            await commercialPolicyPage.fundingSummary();

            await policyPage.purchaseButton.click();
            await waitForBarbadosLoadingSpinner(policyPage);
            await policyPage.handlePurchasePolicyConfirmation(true);

            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });

            const policyDetails = await commercialPolicyPage.getPolicyDetails();
            policyNumber = policyDetails.policyNumber?.trim() || '';
            const policyStatus = policyDetails.status?.trim() || '';          expect(policyNumber).toMatch(/^C\d+$/);
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
                    /Commercial/i
                );        });

        await test.step('Step 5 - Trigger renewal premium calculation', async () => {
            await commercialPolicyPage.navigateToTab('Premium');
            await commercialPolicyPage.clickRateButton();

            const premiumTotals =
                await commercialPolicyPage.getOverallPremiumTotals();
            const billablePremium = parsePremiumAmount(
                premiumTotals.billablePremium
            );            expect(billablePremium).toBeGreaterThan(0);
            executionContext.premium = premiumTotals.billablePremium || '';
        });
        
        await test.step('Step 6 - Purchase renewal', async () => {
            await commercialPolicyPage.navigateToFundingSummary();
            await commercialPolicyPage.fundingSummary();

            await page
                .locator(
                    '#policyDataGatherForm\\:purchaseQuote_footer, form[id="headerForm"] input[value="Purchase"][type="submit"]'
                )
                .first()
                .click();
            await waitForBarbadosLoadingSpinner(policyPage);
            await policyPage.handlePurchasePolicyConfirmation(true);

            const finishButton = page.locator('#purchaseForm\\:yesButton_footer');
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
