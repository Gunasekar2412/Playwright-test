import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import { calculateExpectedPremium } from '../../../../lib/utils';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Successfully create a Private Motor policy - Jamaica',
    { tag: '@ECP-TC-50' },
    async ({ page }) => {
        const coverageType = 'Comprehensive';
        const vehicle = {
            year: '2024',
            make: 'Audi',
            model: 'A4',
            performance: 'S',
            bodyType: 'Sedan',
            sumInsured: '14000000',
            country: 'JM',
            address: 'Old Harbour 120',
            parish: 'Kingston',
            fuelType: 'Gasoline',
            chassisVIN: faker.vehicle.vin()
        };

        let customerDetails: any;
        let customerId = '';
        let customerName = '';
        let policyNumber = '';
        let actualPremium = 0;

        await test.step(
            'Step 1 - Login, customer, and initiate Jamaica quote',
            async () => {
                const customer =
                    await customerPage.createNewCustomer(
                        40,
                        'Jamaica'
                    );

                customerName = customer.customerName;
                customerId = customer.customerId;
                customerDetails = customer.customerDetails;
                executionContext.customerName = customerName;
                executionContext.customerId = customerId;
                executionContext.customerDetails =
                    `Customer ID: ${customerId}\nRegion: Jamaica`;

                await ratingPage.startNewQuote();
                await ratingPage.selectPolicyCounty('Jamaica');
                await ratingPage.selectBranch('Head Office - Kingston');
                await ratingPage.setRegionalEffectiveDate('Jamaica', 5);

                await policyPage.checkPremiumFincancing('No');
                await ratingPage.headerNextButton.click();
                await waitForBarbadosLoadingSpinner(ratingPage);
                await ratingPage.selectInsuredParty(
                    customerName,
                    'Advantage General Insurance Company'
                );
            }
        );

        await test.step('Step 2 - Driver tab', async () => {
            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customerName,
                'Permanent',
                'Valid'
            );
        });

        await test.step('Step 3 - Vehicle tab', async () => {
            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);
        });

        await test.step(
            'Expected Result 1 - Coverage and plan fields are visible',
            async () => {
                await ratingPage.clickPremiumsAndCoveragesTab();
                await expect(ratingPage.vehiclesDropdown).toBeVisible();
                await expect(ratingPage.coverageTypeField).toBeVisible();
                await expect(ratingPage.planSelection).toBeVisible();
            }
        );

        await test.step(
            'Expected Result 2 - Coverage is selected for Jamaica vehicle',
            async () => {
                await ratingPage.setCoverageAndPlan(coverageType);

                const selectedCoverage =
                    await ratingPage.coverageTypeField.inputValue();

                expect(selectedCoverage).toBe(coverageType);
            }
        );

        await test.step(
            'Expected Result 3 - Premium is calculated',
            async () => {
                await ratingPage.calculatePremium({
                    excessLimitOption: 'FIVEMIN15000MAX450KJMD'
                });
                actualPremium = await ratingPage.getPremiumValue();

                const expectedPremium = calculateExpectedPremium({
                    customer: customerDetails,
                    driver: customerDetails,
                    vehicle,
                    coverage: {
                        type: coverageType
                    },
                    options: {
                        country: 'Jamaica'
                    }
                });

                expect(actualPremium).toBeGreaterThan(0);
                executionContext.premium = actualPremium.toString();
                executionContext.customerDetails = [
                    `Customer ID: ${customerId}`,
                    `Region: Jamaica`,
                    `Calculated Premium: JMD${actualPremium}`,
                    `Expected Premium: JMD${expectedPremium.premium}`
                ].join('\n');
            }
        );

        await test.step('Step 4 - Funding summary', async () => {
            await ratingPage.clickFundingSummaryTab();
            await ratingPage.selectPaymentPlan('FullPay');
            await expect(ratingPage.totalPremiumField).toBeVisible();
            await expect(ratingPage.totalDueField).toBeVisible();
        });

        await test.step(
            'Expected Result 4 - Purchase policy',
            async () => {
                await policyPage.purchaseButton.click();
                await policyPage.handlePurchasePolicyConfirmation(true);
                await ratingPage.finishPayment({
                    billingAccountName: customerName,
                    city: 'Kingston'
                });

                policyNumber =
                    (await policyPage.policyNumberText.textContent()) || '';
                policyNumber = policyNumber.replace('#', '').trim();

                const policyStatus =
                    await ratingPage.expectActivePolicyStatus();
                expect(policyNumber).toMatch(/^P\d+$/);

                executionContext.policyNumber = policyNumber;
                executionContext.policyStatus = policyStatus;
            }
        );

        await test.step(
            'Expected Result 5 - Policy overview vehicle details',
            async () => {
                await expect(page.getByText(vehicle.make).first())
                    .toBeVisible();
                await expect(page.getByText(vehicle.model).first())
                    .toBeVisible();
                await expect(page.getByText(vehicle.year).first())
                    .toBeVisible();
            }
        );
    }
);
