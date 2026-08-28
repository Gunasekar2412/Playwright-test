import { test, expect } from '../../../../lib/aio/aioHooks';
import { faker } from '@faker-js/faker';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommissionPage } from '../../../../sites/eis/pages/CommissionPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

test('Successfully purchase a Private Motor Agent policy - Jamaica', { tag: '@ECP-TC-60' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const commissionPage = new CommissionPage(page);
    executionContext.region = 'Jamaica';

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

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const customer = await test.step('Create Jamaica customer', async () =>
        customerPage.createNewCustomer(40, 'Jamaica')
    );

    executionContext.customerName = customer.customerName;
    executionContext.customerId = customer.customerId;

    await test.step('Start Agent Private Motor quote', async () => {
        await ratingPage.startNewQuote();
        await ratingPage.selectPolicyCounty('Jamaica');
        await ratingPage.selectBranch('Head Office - Kingston');
        await policyPage.checkPremiumFincancing('No');
        await commissionPage.changeAgencyProducer('Technical Agency - JM');
        await ratingPage.headerNextButton.click();
        await waitForBarbadosLoadingSpinner(ratingPage);
    });

    await test.step('Complete insured, driver, and vehicle details', async () => {
        await ratingPage.selectInsuredParty(
            customer.customerName,
            'Advantage General Insurance Company'
        );
        await ratingPage.goToNextTab('Driver');
        await ratingPage.selectExistingDriver(
            customer.customerName,
            'Permanent',
            'Valid'
        );
        await ratingPage.clickVehicleTab();
        await ratingPage.addNewVehicle(vehicle);
    });

    await test.step('Rate Agent policy', async () => {
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.setCoverageAndPlan('Comprehensive');
        await ratingPage.calculatePremium();
        const premium = await ratingPage.getPremiumValue();
        expect(premium).toBeGreaterThan(0);
        executionContext.premium = premium.toString();
    });

    await test.step('Purchase and verify Agent policy', async () => {
        await ratingPage.clickFundingSummaryTab();
        await ratingPage.selectPaymentPlan('FullPay');
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);
        await ratingPage.finishPayment({
            billingAccountName: customer.customerName,
            city: 'Kingston',
            paymentBranch: 'HEAD_OFFICE_KINGSTON'
        });

        const policyNumber = ((await policyPage.policyNumberText.textContent()) || '')
            .replace('#', '')
            .trim();
        expect(policyNumber).toMatch(/^P\d+$/);
        await expect(page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        )).toHaveText('Policy Active');

        executionContext.policyNumber = policyNumber;
        executionContext.policyStatus = 'Policy Active';
        executionContext.customerDetails = 'Agency/Producer: Technical Agency - JM';
    });
});
