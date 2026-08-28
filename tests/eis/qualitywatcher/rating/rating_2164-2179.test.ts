import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { faker } from '@faker-js/faker';
import { generateCustomerInformation } from '../../../../sites/eis/data/CustomerData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { generateDriverDetails } from '../../../../lib/utils';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;

test.beforeEach(async ({ page }) => {
  ratingPage = new RatingPage(page);
  policyPage = new PolicyPage(page);
  customerPage = new CustomerPage(page);
  await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
});

test.describe('OpenL vehicle value scenarios', () => {
  // test('S11C2164 - Verify that OpenL component returns an error response when vehicle value is less than $500,000 for Private Car Comprehensive with any Standard plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '499999',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Sum insured is under 500,000 JMD');
  // });

  // test('S11C2165 - Verify that OpenL component returns an error response when vehicle value is less than $500,000 for Private Car Third Party, Fire, and Theft', async () => {
  //   test.setTimeout(420_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '499999',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('PrivateCTPFT');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Sum insured is under 500,000 JMD');
  // });

  // test('S11C2166 - Verify that OpenL component returns an error response when vehicle value is less than $300,000 for Private Car Comprehensive with any Diamond Max plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '299999',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Sum insured is under 300,000 JMD');
  // });

  // test('S11C2167 - Verify that OpenL component returns an error response when vehicle value exceeds $15,000,000 for Private Car Comprehensive with any plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '15000001',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Sum insured is over 15,000,000 JMD');
  // });

  // test('S11C2168 - Verify that OpenL component returns an error response when vehicle value exceeds $15,000,000 for Private Car Third Party, Fire, and Theft with any plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '15000001',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('PrivateCTPFT');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Sum insured is over 15,000,000 JMD');
  // });

  // test('S11C2169 - Verify that OpenL component returns an warning response when vehicle age is greater than 25 years for Private Car Third Party', async () => {
  //   test.setTimeout(420_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '1990',
  //     make: 'Honda',
  //     model: '',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '400000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('PrivateCTP');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Vehicles over 25 years require a mechanical report to be uploaded');
  // });

  // test('S11C2170 - Verify that OpenL component returns an warning response when vehicle age is greater than 25 years for Private Car Third Party plus Repair', async () => {
  //   test.setTimeout(420_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '1990',
  //     make: 'Honda',
  //     model: '',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '400000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('PrivateCTPP');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Vehicles over 25 years require a mechanical report to be uploaded');
  // });

  // test('S11C2171 - Verify that OpenL component returns an error response when vehicle is written off for Private Car Comprehensive with any plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '4000000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin(),
  //     writtenOff: true
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Vehicle has been written off');
  // });

  // test('S11C2172 - Verify that OpenL component returns an error response when vehicle is written off for Private Car Third Party, Fire, and Theft with any plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '4000000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin(),
  //     writtenOff: true
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('PrivateCTPFT');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Vehicle has been written off');
  // });

  // test('S11C2173 - Verify that OpenL component returns an error response when proposer is less than 60 years old for Private Car Comprehensive with any Diamond Max plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(59, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');
  //   await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '4000000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWRentalBenefits');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Proposer is under the minimum age');
  // });

  // test('S11C2174 - Verify that OpenL component returns an error response when driver is less than 60 years old for Private Car Comprehensive with any Diamond Max plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');

  //   const additionalDriver1 = generateDriverDetails({
  //     country: 'JM',
  //     relationship: 'Other',
  //     driverType: 'Main Driver',
  //     age: 59
  //   });


  //   await policyPage.clickAddNewDriverButton();
  //   await ratingPage.addNewDriver(additionalDriver1);

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '4000000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Driver is under the minimum age');
  // });

  // test('S11C2175 - Verify that OpenL component returns an error response when a drivers Driver’s Licence is less than 5 years old for Private Car Comprehensive with any Diamond Max plan', async () => {
  //   test.setTimeout(540_000);

  //   const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
  //   await ratingPage.startNewQuote();
  //   await ratingPage.selectPolicyCounty('Jamaica');
  //   await ratingPage.selectBranch('Head Office - Kingston');
  //   await policyPage.checkPremiumFincancing('No');
  //   await ratingPage.headerNextButton.click();
  //   await ratingPage.waitForLoadingSpinner();

  //   await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //   await ratingPage.goToNextTab('Driver');

  //   const additionalDriver1 = generateDriverDetails({
  //     country: 'JM',
  //     relationship: 'Other',
  //     driverType: 'Main Driver',
  //     age: 60,
  //     licenseIssued: 4,
  //     licenseValidity: 5
  //   });


  //   await policyPage.clickAddNewDriverButton();
  //   await ratingPage.addNewDriver(additionalDriver1);

  //   await ratingPage.clickVehicleTab();
  //   const baseVehicle = {
  //     year: '2024',
  //     make: 'Honda',
  //     model: 'Civic',
  //     performance: 'A',
  //     bodyType: 'Sedan',
  //     sumInsured: '4000000',
  //     country: 'Jamaica',
  //     address: '123 Test Street',
  //     parish: 'Kingston',
  //     ccRating: '1600',
  //     chassisVIN: faker.vehicle.vin()
  //   };
  //   await ratingPage.addNewVehicle(baseVehicle);

  //   await ratingPage.clickPremiumsAndCoveragesTab();
  //   await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
  //   await ratingPage.calculatePremium();

  //   await ratingPage.assertErrorMessage('Driver holds a Driver’s Licence for less than 5 years');
  // });

  test('S11C2176 - Verify that OpenL component returns an error response when a proposer tries to insure more than 2 vehicles for a Private Car Comprehensive coverage type with a Diamond Max plan', async () => {
    test.setTimeout(640_000);

    const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
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

    const additionalVehicle1 = {
      ...baseVehicle,
      year: '2023',
      chassisVIN: faker.vehicle.vin(),
    };

    const additionalVehicle2 = {
      ...baseVehicle,
      year: '2022',
      chassisVIN: faker.vehicle.vin(),
    };

    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
    await ratingPage.calculatePremium();

    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
      billingAccountName: customerName,
      city: 'Test City'
    });

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
    await ratingPage.addNewVehicle(additionalVehicle1);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
    await ratingPage.calculatePremium();

    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
      billingAccountName: customerName,
      city: 'Test City'
    });

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
    await ratingPage.addNewVehicle(additionalVehicle2);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
    await ratingPage.calculatePremium();

    await ratingPage.assertErrorMessage('Proposer cannot insure more than 2 vehicles under a Diamond Max plan');
  });

  // test.describe.serial('Additional Interests - Lender', () => {
  //   test('S11C2177 - Verify that OpenL component returns an error response when Interest Type is Lender and coverage is Private Car Third Party', async () => {
  //     test.setTimeout(540_000);

  //     const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
  //     await ratingPage.startNewQuote();
  //     await ratingPage.selectPolicyCounty('Jamaica');
  //     await ratingPage.selectBranch('Head Office - Kingston');
  //     await policyPage.checkPremiumFincancing('No');
  //     await ratingPage.headerNextButton.click();
  //     await ratingPage.waitForLoadingSpinner();

  //     await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //     await ratingPage.goToNextTab('Driver');

  //     const additionalDriver1 = generateDriverDetails({
  //       country: 'JM',
  //       relationship: 'Other',
  //       driverType: 'Main Driver',
  //       age: 60
  //     });


  //     await policyPage.clickAddNewDriverButton();
  //     await ratingPage.addNewDriver(additionalDriver1);

  //     await ratingPage.clickVehicleTab();
  //     const baseVehicle = {
  //       year: '2024',
  //       make: 'Honda',
  //       model: 'Civic',
  //       performance: 'A',
  //       bodyType: 'Sedan',
  //       sumInsured: '4000000',
  //       country: 'Jamaica',
  //       address: '123 Test Street',
  //       parish: 'Kingston',
  //       ccRating: '1600',
  //       chassisVIN: faker.vehicle.vin()
  //     };

  //     await ratingPage.addNewVehicle(baseVehicle);

  //     // Add Additional Interest: Lender
  //     await ratingPage.addAdditionalInterest({
  //       interestType: 'Lender',
  //       country: 'Jamaica',
  //       address: faker.location.streetAddress(),
  //       parish: 'Kingston'
  //     });

  //     await ratingPage.clickPremiumsAndCoveragesTab();
  //     await ratingPage.setCoverageAndPlan('PrivateCTP');
  //     await ratingPage.calculatePremium();

  //     await ratingPage.assertErrorMessage('Coverage type must be Comprehensive as an additional interest is noted');
  //   });

  //   test('S11C2178 - Verify that OpenL component returns an error response when Interest Type is Lender and coverage is Private Car Third Party, Fire, and Theft with any plan', async () => {
  //     test.setTimeout(540_000);

  //     const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
  //     await ratingPage.startNewQuote();
  //     await ratingPage.selectPolicyCounty('Jamaica');
  //     await ratingPage.selectBranch('Head Office - Kingston');
  //     await policyPage.checkPremiumFincancing('No');
  //     await ratingPage.headerNextButton.click();
  //     await ratingPage.waitForLoadingSpinner();

  //     await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //     await ratingPage.goToNextTab('Driver');

  //     const additionalDriver1 = generateDriverDetails({
  //       country: 'JM',
  //       relationship: 'Other',
  //       driverType: 'Main Driver',
  //       age: 60
  //     });


  //     await policyPage.clickAddNewDriverButton();
  //     await ratingPage.addNewDriver(additionalDriver1);

  //     await ratingPage.clickVehicleTab();
  //     const baseVehicle = {
  //       year: '2024',
  //       make: 'Honda',
  //       model: 'Civic',
  //       performance: 'A',
  //       bodyType: 'Sedan',
  //       sumInsured: '4000000',
  //       country: 'Jamaica',
  //       address: '123 Test Street',
  //       parish: 'Kingston',
  //       ccRating: '1600',
  //       chassisVIN: faker.vehicle.vin()
  //     };

  //     await ratingPage.addNewVehicle(baseVehicle);

  //     // Add Additional Interest: Lender
  //     await ratingPage.addAdditionalInterest({
  //       interestType: 'Lender',
  //       country: 'Jamaica',
  //       address: faker.location.streetAddress(),
  //       parish: 'Kingston'
  //     });

  //     await ratingPage.clickPremiumsAndCoveragesTab();
  //     await ratingPage.setCoverageAndPlan('PrivateCTPFT');
  //     await ratingPage.calculatePremium();

  //     await ratingPage.assertErrorMessage('Coverage type must be Comprehensive as an additional interest is noted');
  //   });

  //   test('S11C2179 - Verify that OpenL component returns an error response when Interest Type is Lender and coverage is Private Car Third Party plus Repair', async () => {
  //     test.setTimeout(540_000);

  //     const { customerName, customerId } = await customerPage.createNewCustomer(66, 'Jamaica');
  //     await ratingPage.startNewQuote();
  //     await ratingPage.selectPolicyCounty('Jamaica');
  //     await ratingPage.selectBranch('Head Office - Kingston');
  //     await policyPage.checkPremiumFincancing('No');
  //     await ratingPage.headerNextButton.click();
  //     await ratingPage.waitForLoadingSpinner();

  //     await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

  //     await ratingPage.goToNextTab('Driver');

  //     const additionalDriver1 = generateDriverDetails({
  //       country: 'JM',
  //       relationship: 'Other',
  //       driverType: 'Main Driver',
  //       age: 60
  //     });


  //     await policyPage.clickAddNewDriverButton();
  //     await ratingPage.addNewDriver(additionalDriver1);

  //     await ratingPage.clickVehicleTab();
  //     const baseVehicle = {
  //       year: '2024',
  //       make: 'Honda',
  //       model: 'Civic',
  //       performance: 'A',
  //       bodyType: 'Sedan',
  //       sumInsured: '4000000',
  //       country: 'Jamaica',
  //       address: '123 Test Street',
  //       parish: 'Kingston',
  //       ccRating: '1600',
  //       chassisVIN: faker.vehicle.vin()
  //     };

  //     await ratingPage.addNewVehicle(baseVehicle);

  //     // Add Additional Interest: Lender
  //     await ratingPage.addAdditionalInterest({
  //       interestType: 'Lender',
  //       country: 'Jamaica',
  //       address: faker.location.streetAddress(),
  //       parish: 'Kingston'
  //     });

  //     await ratingPage.clickPremiumsAndCoveragesTab();
  //     await ratingPage.setCoverageAndPlan('PrivateCTPP');
  //     await ratingPage.calculatePremium();

  //     await ratingPage.assertErrorMessage('Coverage type must be Comprehensive as an additional interest is noted');
  //   });
  // })
});