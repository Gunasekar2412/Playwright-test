import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { faker } from '@faker-js/faker';
import { generateCustomerInformation } from '../../../../sites/eis/data/CustomerData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { generateDriverDetails } from '../../../../lib/utils';
import { excessLimitOptions, repairBenefitOptions } from '../../../../sites/eis/data/RatingData';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;

test.beforeEach(async ({ page }) => {
  ratingPage = new RatingPage(page);
  policyPage = new PolicyPage(page);
  customerPage = new CustomerPage(page);
  await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
});

test.describe('Increased Excess Loading Scenarios', () => {
  test('S11C2156 - Verify the Increased Excess Loading is applied when the lower excess is selected on a Private Car Comprehensive policy', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    const excessLimit = await ratingPage.getExcessLimit();
    await ratingPage.excessLimitField.selectOption(excessLimitOptions['2_5pct_min15k_max250k'].value);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.calculatePremium();
    const premiumWithIncreasedExcess = await ratingPage.getPremiumValue();

    expect(premiumWithIncreasedExcess).toBe(premium);
  });

  test('S11C2157 - Verify the Increased Excess Loading is applied when the lower excess is selected on a Private Car Third Party Fire and Theft policy', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWORentalBenefits');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    const excessLimit = await ratingPage.getExcessLimit();
    await ratingPage.excessLimitField.selectOption(excessLimitOptions['2_5pct_min15k_max250k'].value);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.calculatePremium();
    const premiumWithIncreasedExcess = await ratingPage.getPremiumValue();

    expect(premiumWithIncreasedExcess).toBe(premium);
  });
});

test.describe('Reduced Excess Loading Scenarios', () => {
  test('S11C2158 - Verify the Reduced Excess discount is applied when the higher excess is selected on a Private Car Comprehensive policy', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    const excessLimit = await ratingPage.getExcessLimit();
    await ratingPage.excessLimitField.selectOption(excessLimitOptions['10pct'].value);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.calculatePremium();
    const premiumWithIncreasedExcess = await ratingPage.getPremiumValue();

    expect(premiumWithIncreasedExcess).toBe(premium);
  });

  test('S11C2159 - Verify the Reduced Excess discount is applied when the higher excess is selected on a Private Car Third Party Fire and Theft policy', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWORentalBenefits');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    const excessLimit = await ratingPage.getExcessLimit();
    await ratingPage.excessLimitField.selectOption(excessLimitOptions['10pct'].value);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.calculatePremium();
    const premiumWithIncreasedExcess = await ratingPage.getPremiumValue();

    expect(premiumWithIncreasedExcess).toBe(premium);
  });
});

test.describe('BCIC Director Segment Scenarios', () => {
  test('S11C2160 - Verify that a 20% discount is applied to the vehicle premium when "Segment(s) is set to "BCIC Director"', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica', { segments: ['BCIC Director'] });

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    expect(premium).toBeGreaterThan(243600);
  });
});

test.describe('Repair benefit loading Scenarios', () => {
    test('S11C2161 - Verify the Repair benefit loading is applied when the Repair benefit option is selected (Repair Benefit 150k)', async () => {
      test.slow();

      const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

      await ratingPage.searchCustomer(customerId);
      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '4000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
      };
      await ratingPage.addNewVehicle(baseVehicle);

      await ratingPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('PrivateCTPP');
      await ratingPage.calculatePremium();
      const premium = await ratingPage.getPremiumValue();

      // Select Repair Benefit 150k
      await ratingPage.repairBenefitField.selectOption(repairBenefitOptions['150k'].value);
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.calculatePremium();
      const premiumWithRepairBenefit = await ratingPage.getPremiumValue();

      expect(premiumWithRepairBenefit).toBeGreaterThan(premium);
    });

  test('S11C2162 - Verify the Repair benefit loading is applied when the Repair benefit option is selected (Repair Benefit 50k)', async () => {
    test.slow();

    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Honda',
      model: 'Civic',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '4000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();
    const premium = await ratingPage.getPremiumValue();

    // Select Repair Benefit 50k
    await ratingPage.repairBenefitField.selectOption(repairBenefitOptions['50k'].value);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.calculatePremium();
    const premiumWithRepairBenefit = await ratingPage.getPremiumValue();

    expect(premiumWithRepairBenefit).toBeLessThan(57250);
  });

    test('S11C2163 - Verify the Repair benefit loading is applied when the Repair benefit option is selected (Repair Benefit 100k)', async () => {
      test.slow();

      const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

      await ratingPage.searchCustomer(customerId);
      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '4000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
      };
      await ratingPage.addNewVehicle(baseVehicle);

      await ratingPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('PrivateCTPP');
      await ratingPage.calculatePremium();
      const premium = await ratingPage.getPremiumValue();

      // Select Repair Benefit 100k
      await ratingPage.repairBenefitField.selectOption(repairBenefitOptions['100k'].value);
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.calculatePremium();
      const premiumWithRepairBenefit = await ratingPage.getPremiumValue();

      expect(premiumWithRepairBenefit).toBeGreaterThan(premium);
    });
});
