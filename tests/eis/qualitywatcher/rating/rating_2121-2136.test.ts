import { test as base, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, getJmdFinanceInterest, paymentPlans, customer } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob, getLicenseDates } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import { generateCustomerInformation } from '../../../../sites/eis/data/CustomerData';
import ErrorMessages from '../../../../sites/eis/data/ErrorMessageData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';

// Define fixture types

type CustomerPolicy = {
  customerId: string;
  customerName: string;
  policyNumber: string;
};

type MyFixtures = {
  ratingPage: RatingPage;
  policyPage: PolicyPage;
  customerPage: CustomerPage;
  customerPolicy: CustomerPolicy;
};

const test = base.extend<MyFixtures>({
  ratingPage: async ({ page }, use) => {
    const ratingPage = new RatingPage(page);
    await use(ratingPage);
  },
  policyPage: async ({ page }, use) => {
    const policyPage = new PolicyPage(page);
    await use(policyPage);
  },
  customerPage: async ({ page }, use) => {
    const customerPage = new CustomerPage(page);
    await use(customerPage);
  },
  customerPolicy: [async ({ page, ratingPage, policyPage, customerPage }, use) => {
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Barbados');

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Barbados');
    await policyPage.checkPremiumFincancing('No');

    // Set effective policy date to today's date
    await ratingPage.setEffectiveDate(new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/'));

    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();    await ratingPage.selectInsuredParty(customerName, 'Trident Insurance Company Limited');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    await ratingPage.goToNextTab('Vehicle');
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '70000',
      country: 'Barbados',
      address: '123 Test Street',
      parish: 'St. Michael',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
      billingAccountName: customerName,
      city: 'Test City'
    });
    let policyNumber = await policyPage.policyNumberText.textContent() || '';
    policyNumber = policyNumber.replace('#', '').trim();
    if (!policyNumber) throw new Error('Policy number not found');
    await use({ customerId, customerName, policyNumber });
  },
  {
    timeout: 520_000
  }]
});

// Helper functions updated to use destructured values

test.describe('Barbados Stamp Duty Renewal Scenarios', () => {
  test.setTimeout(240_000);

  test('S11C2121 - Verify that Stamp Duty calculations are correct when a renewal is done for Private Car Comprehensive coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.checkErrorMessage(
      '#errorsForm\\:msgList\\:0\\:messageCode'
    );
    await ratingPage.depreciateSumInsuredButton.click();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(15.75);
    expect(additionalStampDuty).toBe(13.25);
  });

  test('S11C2122 - Verify that Stamp Duty calculations are correct when a renewal is done for Private Car Third Party, Fire, and Theft coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();
    await ratingPage.checkErrorMessage(
      '#errorsForm\\:msgList\\:0\\:messageCode'
    );
    await ratingPage.depreciateSumInsuredButton.click();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(15.75);
    expect(additionalStampDuty).toBe(13.25);
  });

  test('S11C2123 - Verify that Stamp Duty calculations are correct when a renewal is done with an Increase in Sum Insured for Private Car Comprehensive coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.sumInsuredField.fill('50000');
    await ratingPage.page.keyboard.press('Enter');
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(12.5);
    expect(additionalStampDuty).toBe(10);
  });

  test('S11C2124 - Verify that Stamp Duty calculations are correct when a renewal is done with an Increase in Sum Insured for Private Car Third Party, Fire, and Theft coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.sumInsuredField.fill('50000');
    await ratingPage.page.keyboard.press('Enter');
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(12.5);
    expect(additionalStampDuty).toBe(10);
  });

  test('S11C2125 - Verify that Stamp Duty calculations are correct when a renewal is done with a new vehicle added for Private Car Comprehensive coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Toyota',
      model: 'Corolla',
      performance: 'A',
      bodyType: 'Station Wagon',
      sumInsured: '30000',
      country: 'Barbados',
      address: '456 Test Ave',
      parish: 'St. Michael',
      ccRating: '1800'
    };
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(2.5);
  });

  test('S11C2126 - Verify that Stamp Duty calculations are correct when a renewal is done with a new vehicle added for Private Car Third Party, Fire, and Theft coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Toyota',
      model: 'Corolla',
      performance: 'A',
      bodyType: 'Station Wagon',
      sumInsured: '30000',
      country: 'Barbados',
      address: '456 Test Ave',
      parish: 'St. Michael',
      ccRating: '1800',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(2.5);
  });

  test('S11C2127 - Verify that Stamp Duty calculations are correct when a renewal is done with a new vehicle added for Private Car Third Party plus Repair coverage type', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Toyota',
      model: 'Corolla',
      performance: 'A',
      bodyType: 'Station Wagon',
      sumInsured: '30000',
      country: 'Barbados',
      address: '456 Test Ave',
      parish: 'St. Michael',
      ccRating: '1800',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(2.5);
  });

  test('S11C2128 - Verify that Stamp Duty calculations are correct when a renewal is done with a new vehicle added for Private Car Third Party coverage type', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Toyota',
      model: 'Corolla',
      performance: 'A',
      bodyType: 'Station Wagon',
      sumInsured: '30000',
      country: 'Barbados',
      address: '456 Test Ave',
      parish: 'St. Michael',
      ccRating: '1800',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(2.5);
  });

  test('S11C2129 - Verify that Stamp Duty calculations are correct when a renewal is done for Private Car Third Party coverage type and the coverage type is changed to Private Car Comprehensive', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.checkErrorMessage(
      '#errorsForm\\:msgList\\:0\\:messageCode'
    );
    await ratingPage.depreciateSumInsuredButton.click();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(15.75);
    expect(additionalStampDuty).toBe(13.25);
  });

  test('S11C2130 - Verify that Stamp Duty calculations are correct when a renewal is done for Private Car Comprehensive coverage type and the coverage type is changed to Private Car Third Party', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startRenewalFromPolicy(ratingPage, policyPage);
    await ratingPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(0);
    expect(additionalStampDuty).toBe(0);
  });
});

test.describe('Endorsement After Renewal Scenarios', () => {
  test.setTimeout(220_000);

  test('S11C2131 - Verify that Stamp Duty calculations are correct when an endorsement after renewal is done for Private Car Comprehensive coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Adding a vehicle');
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Mazda',
      model: '3',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '25000',
      country: 'Barbados',
      address: '789 Test Blvd',
      parish: 'St. Michael',
      ccRating: '1700',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(0);
  });

  test('S11C2132 - Verify that Stamp Duty calculations are correct when an endorsement is done after renewal for Private Car Third Party, Fire, and Theft coverage type and any plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Adding a vehicle');
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Mazda',
      model: '3',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '25000',
      country: 'Barbados',
      address: '789 Test Blvd',
      parish: 'St. Michael',
      ccRating: '1700',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(0);
  });

  test('S11C2133 - Verify that Stamp Duty calculations are correct when an endorsement after renewal is done for Private Car Third Party plus Repair coverage type', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Adding a vehicle');
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Mazda',
      model: '3',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '25000',
      country: 'Barbados',
      address: '789 Test Blvd',
      parish: 'St. Michael',
      ccRating: '1700',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(0);
  });

  test('S11C2134 - Verify that Stamp Duty calculations are correct when an endorsement is done after renewal for Private Car Third Party coverage type and Standard plan', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Adding a vehicle');
    await ratingPage.clickVehicleTab();
    const newVehicle = {
      year: '2024',
      make: 'Mazda',
      model: '3',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '25000',
      country: 'Barbados',
      address: '789 Test Blvd',
      parish: 'St. Michael',
      ccRating: '1700',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(newVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(2.5);
    expect(additionalStampDuty).toBe(0);
  });

  test('S11C2135 - Verify that Stamp Duty calculations are correct when an endorsement after renewal is done for Private Car Comprehensive coverage type and a new vehicle was added at renewal', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Increase policy premium');
    await ratingPage.clickVehicleTab();
    await ratingPage.sumInsuredField.fill('50000');
    await ratingPage.page.keyboard.press('Enter');
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(12.5);
    expect(additionalStampDuty).toBe(10);
  });

  test('S11C2136 - Verify that Stamp Duty calculations are correct when an endorsement is done after renewal for Private Car Third Party, Fire, and Theft coverage type and a new vehicle was added at renewal', async ({ ratingPage, policyPage, customerPolicy }) => {
    await ratingPage.startEndorsementFromPolicy(ratingPage, policyPage, 'Increase policy premium');
    await ratingPage.clickVehicleTab();
    await ratingPage.sumInsuredField.fill('50000');
    await ratingPage.page.keyboard.press('Enter');
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    const totalStampDuty = await ratingPage.getTotalStampDutyValue();
    const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();    expect(totalStampDuty).toBe(12.5);
    expect(additionalStampDuty).toBe(10);
  });
});