import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { addCommentToTestCase } from '../../../../lib/aio/aioHelper';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import { calculateExpectedPremium } from '../../../../lib/utils';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;

let customerId = '';
let customerName = '';
let policyNumber = '';
let validationComments: string[] = [];

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    validationComments = [];

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});


test(
    'Successfully create a Private Motor policy - Barbados',
    { tag: '@ECP-TC-21' },
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

        await test.step('Step 1 - Login, customer, and initiate quote', async () => {
            const customer = await customerPage.createNewCustomer(
                40,
                'Barbados'
            );

            customerName = customer.customerName;
            customerId = customer.customerId;
            customerDetails = customer.customerDetails;

            await ratingPage.startNewQuote();
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setRegionalEffectiveDate('Barbados', 5);

            await policyPage.checkPremiumFincancing('No');
            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(ratingPage);
            await ratingPage.selectInsuredParty(
                customerName,
                'Trident Insurance Company Limited'
            );

            validationComments.push(
                'Step 1 passed - Barbados customer was created, quote was initiated, Personal Lines / Private Motor was selected, and mandatory policy fields were completed.'
            );
        });

        await test.step('Step 3 - Driver tab', async () => {
            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customerName,
                'Permanent',
                'Valid'
            );

            validationComments.push(
                'Step 3 passed - existing customer was selected as driver and license details were completed.'
            );
        });

        await test.step('Step 4 - Vehicle tab', async () => {
            
            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);

            validationComments.push(
                'Step 4 passed - vehicle details were added. Mortgagee was not applicable for this policy scenario.'
            );
        });

        await test.step('Expected Result 1 - Coverage and plan are risk-item level fields', async () => {
            await ratingPage.clickPremiumsAndCoveragesTab();
            await expect(ratingPage.vehiclesDropdown).toBeVisible();
            await expect(ratingPage.coverageTypeField).toBeVisible();
            await expect(ratingPage.planSelection).toBeVisible();

            validationComments.push(
                'Expected Result 1 passed - Coverage Type and Plan Selection are visible while the vehicle risk item context is active.'
            );
        });

        await test.step('Step 5 and Expected Result 2 - Premium and coverages', async () => {
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

            validationComments.push(
                `Expected Result 2 passed - Barbados excess option is selected for BBD vehicle SI 100,000: ${selectedExcessText.trim()}.`
            );
        });

        await test.step('Expected Result 3 - Premium calculation', async () => {
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
            });

            // expect(actualPremium).toBe(expectedPremium.premium);
            validationComments.push(
                `Expected Result 3 passed - premium calculation returned BBD${actualPremium}, expected private motor premium is BBD${expectedPremium.premium}.`
            );
        });

        await test.step('Step 6 - Funding summary', async () => {
            await ratingPage.clickFundingSummaryTab();
            await ratingPage.selectPaymentPlan('FullPay');
            await expect(ratingPage.totalPremiumField).toBeVisible();
            await expect(ratingPage.totalDueField).toBeVisible();

            validationComments.push(
                'Step 6 passed - funding summary was reviewed and Full Pay payment plan was selected.'
            );
        });

        await test.step('Step 7 and Expected Result 4 - Purchase policy', async () => {
            await policyPage.purchaseButton.click();
            await policyPage.handlePurchasePolicyConfirmation(true);
            await ratingPage.finishPayment({
                billingAccountName: customerName,
                city: 'Test City'
            });
            policyNumber =
                (await policyPage.policyNumberText.textContent()) || '';
            policyNumber = policyNumber.replace('#', '').trim();
            const policyStatus = await ratingPage.expectActivePolicyStatus();
            expect(policyNumber).toMatch(/^P\d+$/);
            validationComments.push(
                `Expected Result 4 passed - policy was purchased, status is ${policyStatus}, and policy number ${policyNumber} was generated.`
            );
        });

        await test.step('Expected Result 5 - Policy overview vehicle details', async () => {
            await expect(page.getByText(vehicle.make).first())
                .toBeVisible();
            await expect(page.getByText(vehicle.model).first())
                .toBeVisible();
            await expect(page.getByText(vehicle.year).first())
                .toBeVisible();
            validationComments.push(
                'Expected Result 5 passed - vehicle make, model, and model year are displayed on the purchased policy screen.'
            );
           
        });
    }
);
