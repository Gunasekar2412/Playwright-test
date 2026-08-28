import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    CommissionGroupDetails,
    CommissionPage
} from '../../../../sites/eis/pages/CommissionPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { faker } from '@faker-js/faker';
import { calculateExpectedPremium } from '../../../../lib/utils';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let commissionPage: CommissionPage;
let commissionGroupDetails: CommissionGroupDetails;

let customerPage: CustomerPage;
let policyPage: PolicyPage;

let customerId = '';
let customerName = '';
let policyNumber = '';
let validationComments: string[] = [];
let selectedAgency: { code: string; name: string };

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    commissionPage = new CommissionPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    validationComments = [];
    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully purchase a Private Motor Agent policy - Barbados',
    { tag: '@ECP-TC-31' },
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
        let customerDetails: any;
        let actualPremium = 0;
        await test.step('Step 1 - Get Barbados Private Motor commission group agencies', async () => {
            await commissionPage.switchToAdmin();
            await commissionPage.openCommissionGroup();
            await commissionPage.searchCommissionGroups();

            const selectedGroup =
                await commissionPage.selectAlternateBarbadosPrivateMotorCommissionGroup();

            commissionGroupDetails =
                await commissionPage.getSelectedCommissionGroupDetails();

            expect(commissionGroupDetails.groupName).toBe(selectedGroup);

            selectedAgency =
                commissionGroupDetails.agencies[
                Math.floor(Math.random() * commissionGroupDetails.agencies.length)
                ];           await page.locator("//a[@id='logoutForm:logout_link']").click();
            await page.locator("//input[@id='logoutConfirmDialogDialog_form:buttonYes']").click();

        });
        await test.step('Step 2 - Create customer and start Private Motor quote', async () => {
            await ratingPage.login(
                process.env.EIS_USERNAME!,
                process.env.EIS_PASSWORD!
            );
            await waitForBarbadosLoadingSpinner(ratingPage);
            // await expect(ratingPage.addQuoteButton).toBeVisible();

            const customer = await customerPage.createNewCustomer(40, 'Barbados');

            customerName = customer.customerName;
            customerId = customer.customerId;
            customerDetails = customer.customerDetails;

            await ratingPage.startNewQuote();
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setRegionalEffectiveDate('Barbados', 5);

            await policyPage.checkPremiumFincancing('No');

            await commissionPage.changeAgencyProducer(selectedAgency.name);

            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(ratingPage);

            await ratingPage.selectInsuredParty(
                customerName,
                'Trident Insurance Company Limited'
            );
        });
        await test.step('Step 3 - Driver section fill ups', async () => {
            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customerName,
                'Permanent',
                'Valid'
            );
        });
        await test.step('Step 4 - Vehicle Section fill ups ', async () => {
            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);
        });
        await test.step('Step 5 - premium & Coverage plan section', async () => {
            await ratingPage.clickPremiumsAndCoveragesTab();
            await expect(ratingPage.vehiclesDropdown).toBeVisible();
            await expect(ratingPage.coverageTypeField).toBeVisible();
            await expect(ratingPage.planSelection).toBeVisible();
        });
        await test.step('Step 6 - selected the Coverage plan option', async () => {
            await ratingPage.setCoverageAndPlan(
                coverageType,
                planSelection
            );

            const selectedCoverage =
                await ratingPage.coverageTypeField.inputValue();
            const selectedPlan =
                await ratingPage.planSelection.inputValue();
            const selectedExcessText =
                (await ratingPage.excessLimitField
                    .locator('option:checked')
                    .textContent()) || '';

            expect(selectedCoverage).toBe(coverageType);
            expect(selectedPlan).toBe(planSelection);
            expect(selectedExcessText).toContain('BBD');

        });
        await test.step('Step 7 - Calculate premium section', async () => {
            await ratingPage.calculatePremium();
            actualPremium = await ratingPage.getPremiumValue();
            const expectedPremium = calculateExpectedPremium({
                customer: customerDetails,
                driver: customerDetails,
                vehicle,
                coverage: {
                    type: coverageType,
                    plan: planSelection
                },
                options: {
                    country: 'Barbados'
                }
            });           // expect(actualPremium).toBe(expectedPremium.premium);

            await ratingPage.verifyCommissionCalculation({
                premiumAmount: actualPremium,
                commissionRate: commissionGroupDetails.commissionRate
            });
        });
        await test.step('Step 8 - ', async () => {
            await ratingPage.clickFundingSummaryTab();
            await ratingPage.selectPaymentPlan('FullPay');
            await expect(ratingPage.totalPremiumField).toBeVisible();
            await expect(ratingPage.totalDueField).toBeVisible();

        });
        await test.step('Step 9 - ', async () => {
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await page.waitForTimeout(500);
            if (!(await ratingPage.createNewAccountCheckbox.isChecked())) {
                await ratingPage.createNewAccountCheckbox.check();
                await waitForBarbadosLoadingSpinner(ratingPage);
            }

            await page.waitForTimeout(1000);
            await ratingPage.billingAccountNameField.click();
            await waitForBarbadosLoadingSpinner(ratingPage);
            await ratingPage.billingAccountNameField.fill(customerName);
            await waitForBarbadosLoadingSpinner(ratingPage);
            await page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(ratingPage);
            await ratingPage.cityField.fill('Test City');
            await waitForBarbadosLoadingSpinner(ratingPage);
            await page.waitForTimeout(500);
            await page.keyboard.press('Tab');
            await page.waitForTimeout(1500);
            await waitForBarbadosLoadingSpinner(ratingPage);
            await page.waitForTimeout(1500);

            await ratingPage.finishButton.click();

            policyNumber =
                (await policyPage.policyNumberText.textContent()) || '';
            policyNumber = policyNumber.replace('#', '').trim();
            await expect(
                page.locator(
                    '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                )
            ).toHaveText('Policy Active');
            expect(policyNumber).toMatch(/^P\d+$/);
            validationComments.push(
                `Expected Result 4 passed - policy was purchased, status is Policy Active, and policy number ${policyNumber} was generated.`
            );
        });
        await test.step('Step 10 - ', async () => {

        });
    }

);
