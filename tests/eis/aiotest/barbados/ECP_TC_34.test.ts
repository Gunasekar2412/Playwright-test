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
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { getFormattedDate } from '../../../../lib/utils';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let ratingPage: RatingPage;
let commissionPage: CommissionPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let renewalBatchPage: RenewalBatchPage;

let commissionGroupDetails: CommissionGroupDetails;
let selectedBroker: CommissionAgency;
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

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    commissionPage = new CommissionPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    renewalBatchPage = new RenewalBatchPage(page);
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Validate commission for renewal of a Private Motor Broker policy - Barbados',
    { tag: '@ECP-TC-34' },
    async ({ page }) => {
        const { effectiveDate, expiryDate } =
            getEffectiveDateFor28DayExpiry();
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

        await test.step('Step 2 - Create backdated Barbados Private Motor Broker policy', async () => {
            const customer =
                await customerPage.createNewCustomer(40, 'Barbados');

            customerName = customer.customerName;
            executionContext.customerName = customerName;
            executionContext.customerId = customer.customerId;

            await ratingPage.startNewQuote();
            await ratingPage.selectPolicyCounty('Barbados');
            await ratingPage.setEffectiveDate(effectiveDate);
            await expect(ratingPage.effectiveDateField)
                .toHaveValue(effectiveDate);

            await policyPage.checkPremiumFincancing('No');
            await commissionPage.changeAgencyProducer(selectedBroker.name);

            await ratingPage.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(ratingPage);

            await ratingPage.selectInsuredParty(
                customerName,
                'Trident Insurance Company Limited'
            );

            await ratingPage.goToNextTab('Driver');
            await ratingPage.selectExistingDriver(
                customerName,
                'Permanent',
                'Valid'
            );

            await ratingPage.clickVehicleTab();
            await ratingPage.addNewVehicle(vehicle);

            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.setCoverageAndPlan(
                coverageType,
                planSelection
            );
            await ratingPage.calculatePremium();

            const newBusinessPremium = await ratingPage.getPremiumValue();
            await ratingPage.verifyCommissionCalculation({
                premiumAmount: newBusinessPremium,
                commissionRate: commissionGroupDetails.commissionRate
            });

            await ratingPage.clickFundingSummaryTab();
            await ratingPage.selectPaymentPlan('FullPay');
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
                    'Private Motor'
                );        });

        await test.step('Step 5 - Trigger renewal premium calculation and verify broker commission', async () => {
            await ratingPage.clickPremiumsAndCoveragesTab();
            await ratingPage.calculatePremium();

            const renewalPremium = await ratingPage.getPremiumValue();
            await ratingPage.verifyCommissionCalculation({
                premiumAmount: renewalPremium,
                commissionRate: commissionGroupDetails.commissionRate
            });

            executionContext.premium = renewalPremium.toString();
        });

        await test.step('Step 6 - Purchase renewal', async () => {
            await ratingPage.clickFundingSummaryTab();

            await renewalBatchPage.purchaseButton.click();
            await waitForBarbadosLoadingSpinner(renewalBatchPage);
            await policyPage.handlePurchasePolicyConfirmation(true);

            await renewalBatchPage.finishButton.click();
            await waitForBarbadosLoadingSpinner(renewalBatchPage);

            const finalStatus =
                (
                    await page
                        .locator(
                            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                        )
                        .textContent()
                )?.trim() || '';           expect(finalStatus).toMatch(/Policy Pending|Policy Active/);
            executionContext.policyStatus = finalStatus;
        });
    }
);
