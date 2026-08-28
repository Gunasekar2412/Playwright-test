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

test.setTimeout(780_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
});

test.describe.skip('Jamaica Certificate Code Scenarios', () => {
  // Skip all certificate tests if not running on env15 or env16
  test.beforeAll(async () => {
    const baseURL = process.env.EIS_PORTAL_BASE_URL;
    if (!baseURL || (!baseURL.includes('env15') && !baseURL.includes('env16'))) {
      test.skip(true, 'Certificate tests only run on env15 and env16');
    }
  });

  async function waitForCertificateToBeGenerated() {
    // wait for 45 seconds to allow the certificate to be generated
    await ratingPage.page.waitForTimeout(45000);
  }

  test('S11C2137 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    await ratingPage.goToNextTab('Vehicle');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: indv:');
  });

  test('S11C2138 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver'
    });
    
    const additionalDriver2 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional'
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver2);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 50
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 30
      },
      {
        driverName: additionalDriver2.firstName + ' ' + additionalDriver2.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 20
      }
    ]);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: indv:');
  });

  test('S11C2139 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: indv: x');
  });

  test('S11C2140 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica', { deceased: true });
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver'
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13d: indv:');
  });

  test('S11C2141 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Standard plan', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    const additionalInsured1 = generateCustomerInformation(40, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: jtin:');
  });

  test('S11C2142 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    const additionalInsured1 = generateCustomerInformation(40, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await policyPage.clickAddNewDriverButton();
    await ratingPage.selectExistingDriver(additionalInsured1.generalInformation['First Name'] + ' ' + additionalInsured1.generalInformation['Last Name'], 'Permanent', 'Valid');
    
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver'
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 50
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 30
      },
      {
        driverName: additionalInsured1.generalInformation['First Name'] + ' ' + additionalInsured1.generalInformation['Last Name'],
        assignmentType: 'Occasional',
        percentOfUse: 20
      }
    ]);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: jtin: r');
  });

  test('S11C2143 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    const additionalInsured1 = generateCustomerInformation(65, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    const additionalInsured2 = generateCustomerInformation(65, 'Jamaica');
    await ratingPage.addNewInsuredParty(additionalInsured2);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await policyPage.clickAddNewDriverButton();
    await ratingPage.selectExistingDriver(additionalInsured1.generalInformation['First Name'] + ' ' + additionalInsured1.generalInformation['Last Name'], 'Permanent', 'Valid');
    
    // Add one additional driver that is excluded from driving
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: jtin: x');
  });

  test('S11C2144 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with sales or commercial travelling', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid', 'Insured', 'Excluded');
    
    // Add one additional driver that is excluded from driving
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Main Driver',
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    // Select Yes for 'View Business Use Questionnaire?'
    await ratingPage.selectBusinessUseQuestionnaire(0);
    // Select Yes for 'Sales or commercial traveling'
    await ratingPage.selectSalesOrCommercialTraveling(0);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.1: indv: e');
  });

  test('S11C2145 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    // Add two additional drivers 
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver'
    });
    
    const additionalDriver2 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional'
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver2);

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

    // Select Yes for 'View Business Use Questionnaire?'
    await ratingPage.selectBusinessUseQuestionnaire(0);
    // Select Yes for 'Sales or commercial traveling'
    await ratingPage.selectSalesOrCommercialTraveling(0);

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 60
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 25
      },
      {
        driverName: additionalDriver2.firstName + ' ' + additionalDriver2.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 15
      }
    ]);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.1: indv: r');
  });

  test('S11C2146 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver'
    });
    
    const additionalDriver2 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional'
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver2);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 50
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 30
      },
      {
        driverName: additionalDriver2.firstName + ' ' + additionalDriver2.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 20
      }
    ]);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: indv: r');
  });

  test('S11C2147 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    // Add one additional driver that is excluded from driving
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: indv: x');
  });

  test('S11C2148 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    const additionalInsured1 = generateCustomerInformation(40, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
    
    // Add one additional driver that is excluded from driving
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: jtin: x');
  });

  test('S11C2149 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Standard plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Add two additional insureds
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    const additionalInsured1 = generateCustomerInformation(40, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await policyPage.clickAddNewDriverButton();
    await ratingPage.selectExistingDriver(additionalInsured1.generalInformation['First Name'] + ' ' + additionalInsured1.generalInformation['Last Name'], 'Permanent', 'Valid');
    
    // Add one additional driver that is an occasional driver
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional',
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Occasional',
        percentOfUse: 15
      },
      {
        driverName: additionalInsured1.generalInformation['First Name'] + ' ' + additionalInsured1.generalInformation['Last Name'],
        assignmentType: 'Principal',
        percentOfUse: 75
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 10
      }
    ]);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.13: jtin: r');
  });

  test('S11C2150 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Diamond Max plan', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: indv');
  });

  test('S11C2151 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver',
      age: 65
    });
    
    const additionalDriver2 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver2);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 50
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 30
      },
      {
        driverName: additionalDriver2.firstName + ' ' + additionalDriver2.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 20
      }
    ]);

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
    let policyNumber = await policyPage.policyNumberText.textContent() || '';
    policyNumber = policyNumber.replace('#', '').trim();
    if (!policyNumber) throw new Error('Policy number not found');

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: indv: r');
  });

  test('S11C2152 - Verify that Certificate is correct for a single Insured Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: indv: x');
  });

  test('S11C2153 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Diamond Max plan', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    // Add one additional insured
    const additionalInsured1 = generateCustomerInformation(65, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: jtin:');
  });

  test('S11C2154 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    // Add one additional insured
    const additionalInsured1 = generateCustomerInformation(70, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    // Add two additional drivers that are occasional drivers
    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Occasional Driver',
      age: 65
    });
    
    const additionalDriver2 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Additional',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver2);

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

    // assign 3 named drivers to the vehicle
    await ratingPage.assignNamedDrivers([
      {
        driverName: customerName,
        assignmentType: 'Principal',
        percentOfUse: 80
      },
      {
        driverName: additionalDriver1.firstName + ' ' + additionalDriver1.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 10
      },
      {
        driverName: additionalDriver2.firstName + ' ' + additionalDriver2.lastName,
        assignmentType: 'Occasional',
        percentOfUse: 10
      }
    ]);

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
    let policyNumber = await policyPage.policyNumberText.textContent() || '';
    policyNumber = policyNumber.replace('#', '').trim();
    if (!policyNumber) throw new Error('Policy number not found');

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: jtin: r');
  });

  test('S11C2155 - Verify that Certificate is correct for two or more Insureds Private Car Comprehensive coverage type and Diamond Max plan with restricted driving', async () => {
    const { customerName, customerId } = await customerPage.createNewCustomer(65, 'Jamaica');
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

    // Add two additional insureds
    const additionalInsured1 = generateCustomerInformation(67, 'Jamaica');
    await ratingPage.clickInsuredTab();
    await ratingPage.addNewInsuredParty(additionalInsured1);

    const additionalInsured2 = generateCustomerInformation(75, 'Jamaica');
    await ratingPage.addNewInsuredParty(additionalInsured2);

    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    const additionalDriver1 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Excluded',
      age: 65
    });

    await policyPage.clickAddNewDriverButton();
    await ratingPage.addNewDriver(additionalDriver1);

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
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
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

    await waitForCertificateToBeGenerated();

    await ratingPage.searchCustomer(customerId);
    await ratingPage.clickPolicyTab();
    await ratingPage.clickPolicyNumberLink(policyNumber);

    const certificateText = await ratingPage.downloadAndVerifyCertificate();

    // Assert the certificate code
    expect(certificateText).toContain('J.X.23: jtin: x');
  });
});
