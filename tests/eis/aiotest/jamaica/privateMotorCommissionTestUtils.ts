import { expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import {
    CommissionAgency,
    CommissionGroupDetails,
    CommissionPage
} from '../../../../sites/eis/pages/CommissionPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

export const jamaicaPrivateMotorVehicle = () => ({
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
});

export function getRenewalDates() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 28);
    const effectiveDate = new Date(expiryDate);
    effectiveDate.setDate(expiryDate.getDate() - 365);
    return {
        effectiveDate: getFormattedDate(effectiveDate),
        expiryDate: getFormattedDate(expiryDate)
    };
}

export async function selectJamaicaCommissionProducer(
    commissionPage: CommissionPage
): Promise<{ group: CommissionGroupDetails; producer: CommissionAgency }> {
    await commissionPage.switchToAdmin();
    await commissionPage.openCommissionGroup();
    await commissionPage.searchCommissionGroups();
    const selectedGroup = await commissionPage.selectJamaicaPrivateMotorCommissionGroup();
    const group = await commissionPage.getSelectedJamaicaPrivateMotorCommissionGroupDetails();
    expect(group.groupName).toBe(selectedGroup);
    const producer = group.agencies[Math.floor(Math.random() * group.agencies.length)];

    console.log('\n========== Selected Commission Producer ==========');
    console.log(`Agent/Broker Name : ${producer.name}`);
    console.log(`Agent/Broker Code : ${producer.code}`);
    console.log(`Commission Rate   : ${group.commissionRate.toFixed(2)}%`);
    console.log('==================================================\n');

    await commissionPage.switchToMain();
    return { group, producer };
}

export async function createJamaicaPrivateMotorPolicy(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    commissionPage: CommissionPage,
    producer: CommissionAgency,
    commissionRate: number,
    effectiveDate?: string,
    excessLimitOption?: string
) {
    const customer = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    if (effectiveDate) {
        await ratingPage.setEffectiveDate(effectiveDate);
        await expect(ratingPage.effectiveDateField).toHaveValue(effectiveDate);
    }
    await policyPage.checkPremiumFincancing('No');
    await commissionPage.changeAgencyProducer(producer.name);
    await ratingPage.headerNextButton.click();
    await waitForBarbadosLoadingSpinner(ratingPage);
    await ratingPage.selectInsuredParty(
        customer.customerName,
        'Advantage General Insurance Company'
    );
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await ratingPage.clickVehicleTab();
    await ratingPage.addNewVehicle(jamaicaPrivateMotorVehicle());
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium({ excessLimitOption });
    const premium = await ratingPage.getPremiumValue();
    expect(premium).toBeGreaterThan(0);
    await ratingPage.verifyCommissionCalculation({ premiumAmount: premium, commissionRate });
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
    await expect(page.locator('#productContextInfoForm\\:policyDetail_policyStatusCdText'))
        .toHaveText('Policy Active');
    return { ...customer, policyNumber, premium };
}
