import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    CommissionAgency,
    CommissionGroupDetails,
    CommissionPage
} from '../../../../sites/eis/pages/CommissionPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let commissionPage: CommissionPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;

let commissionGroupDetails: CommissionGroupDetails;
let selectedBroker: CommissionAgency;
let customerName = '';
let policyNumber = '';

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    commissionPage = new CommissionPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully create a Private Motor Broker policy - Barbados',
    { tag: '@ECP-TC-33' },
    async ({ page }) => {
        const coverageType = 'Comprehensive';
        const planSelection = 'StandardWRentalBenefits';
        const vehicle = {
            year: '2024',
            make: 'Honda',
            model: 'Civic',
            performance: 'A',
            bodyType: 'Sedan',
            sumInsured: '100000',
            country: 'Barbados',
            address: '123 Test Street',
            parish: 'St. Michael',
            ccRating: '1600',
            chassisVIN: faker.vehicle.vin()
        };

        await test.step('Step 1 - Select Barbados Private Motor broker commission group', async () => {
            await commissionPage.switchToAdmin();
            await commissionPage.openCommissionGroup();
            await commissionPage.searchCommissionGroups();

            const selectedGroup =
                await commissionPage.selectAlternateBarbadosPrivateMotorCommissionGroup();

            commissionGroupDetails =
                await commissionPage.getSelectedCommissionGroupDetails();

            expect(commissionGroupDetails.groupName).toBe(selectedGroup);

            selectedBroker =
                commissionGroupDetails.agencies[
                    Math.floor(
                        Math.random() * commissionGroupDetails.agencies.length
                    )
                ];            await commissionPage.switchToMain();
        });

        await test.step('Step 2 - Create customer and start Private Motor quote', async () => {
            const customer =
                await customerPage.createNewCustomer(40, 'Barbados');

            customerName = customer.customerName;
            executionContext.customerName = customerName;
            executionContext.customerId = customer.customerId;

            await ratingPage.startNewQuote();
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setRegionalEffectiveDate('Barbados', 5);

            await policyPage.checkPremiumFincancing('No');
            await commissionPage.changeAgencyProducer(selectedBroker.name);

            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(ratingPage);

            await ratingPage.selectInsuredParty(
                customerName,
                'Trident Insurance Company Limited'
            );
        });

        await test.step('Step 3 - Complete driver and vehicle information', async () => {
            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customerName,
                'Permanent',
                'Valid'
            );

            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);
        });

        await test.step('Step 4 - Select coverage and rate policy', async () => {
            await ratingPage.clickPremiumsAndCoveragesTab();
            await expect(ratingPage.vehiclesDropdown).toBeVisible();
            await expect(ratingPage.coverageTypeField).toBeVisible();
            await expect(ratingPage.planSelection).toBeVisible();

            await ratingPage.setCoverageAndPlan(
                coverageType,
                planSelection
            );

            await ratingPage.calculatePremium();
            const actualPremium = await ratingPage.getPremiumValue();

            await ratingPage.verifyCommissionCalculation({
                premiumAmount: actualPremium,
                commissionRate: commissionGroupDetails.commissionRate
            });

            executionContext.premium = actualPremium.toString();
        });

        await test.step('Step 5 - Navigate to Funding Summary', async () => {
            await ratingPage.clickFundingSummaryTab();
            await ratingPage.selectPaymentPlan('FullPay');

            await expect(ratingPage.totalPremiumField).toBeVisible();
            await expect(ratingPage.totalDueField).toBeVisible();
        });

        await test.step('Step 6 - Purchase Broker policy', async () => {
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });

            policyNumber =
                ((await policyPage.policyNumberText.textContent()) || '')
                    .replace('#', '')
                    .trim();

            const policyStatus =
                (
                    await page
                        .locator(
                            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                        )
                        .textContent()
                )?.trim() || '';          expect(policyNumber).toMatch(/^P\d+$/);
            expect(policyStatus).toBe('Policy Active');

            executionContext.policyNumber = policyNumber;
            executionContext.policyStatus = policyStatus;
        });
    }
);
