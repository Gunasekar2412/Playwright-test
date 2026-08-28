import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { faker } from '@faker-js/faker';
import { generateCustomerInformation } from '../../../../sites/eis/data/CustomerData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { calculateExpectedPremium, generateDriverDetails, getAgeFromDob } from '../../../../lib/utils';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
});

test.describe('Gender Non Conforming Scenarios', () => {  
    async function setupActiveQuote() {
      const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, 'Jamaica');

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
        make: 'Audi',
        model: 'A4',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '10000000',
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
      if (!policyNumber) throw new Error('Policy not created successfully');

      return { customerName, customerId, policyNumber, customerDetails };
    }

    test('S11C2180 - Verify that OpenL component returns an warning response when a driver\'s gender is "Non Conforming" and coverage is Private Car Comprehensive with any plan', async () => {
      test.slow();
      
      const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();
  
      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

      await ratingPage.clickInsuredTab();
      await ratingPage.waitForLoadingSpinner();
      await ratingPage.insuredGenderField.selectOption({ label: "Non Conforming" });
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
  
      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Audi',
        model: 'A4',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '20000000',
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
  
      await ratingPage.assertErrorMessage('Gender can not be Non Conforming');
    });

    test('S11C2181 - Verify that OpenL component returns an warning response when a driver\'s gender is "Non Conforming" and coverage is Private Car Third Party, Fire, and Theft', async () => {
      test.slow();
      
      const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();
  
      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

      await ratingPage.clickInsuredTab();
      await ratingPage.waitForLoadingSpinner();
      await ratingPage.insuredGenderField.selectOption({ label: "Non Conforming" });
      await ratingPage.waitForLoadingSpinner();

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
  
      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Audi',
        model: 'A4',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '20000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin()
      };
      
      await ratingPage.addNewVehicle(baseVehicle);
  
      await ratingPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('PrivateCTPFT');
      await ratingPage.calculatePremium();
  
      await ratingPage.assertErrorMessage('Gender can not be Non Conforming');
    });

    test('S11C2182 - Verify that OpenL component returns an warning response when a driver\'s gender is "Non Conforming" and coverage is Private Car Third Party plus Repair', async () => {
      test.setTimeout(580_000);

      const { customerName, customerId, customerDetails } = await setupActiveQuote();
      await ratingPage.searchCustomer(customerId);

      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();
  
      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company', false, undefined, 'Non Conforming');

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
  
      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Audi',
        model: '',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin(),
      };
      
      await ratingPage.addNewVehicle(baseVehicle);
  
      await ratingPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('PrivateCTPP');
      await ratingPage.calculatePremium();
  
      await ratingPage.assertErrorMessage('Gender can not be Non Conforming');
    });

    test('S11C2183 - Verify that OpenL component returns an warning response when a driver\'s gender is "Non Conforming" and coverage is Private Car Third Party', async () => {
      test.slow();
      
      const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

      await ratingPage.startNewQuote();
      await ratingPage.selectPolicyCounty('Jamaica');
      await ratingPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await ratingPage.headerNextButton.click();
      await ratingPage.waitForLoadingSpinner();
  
      await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company', false, undefined, 'Non Conforming');

      await ratingPage.goToNextTab('Driver');
      await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
  
      await ratingPage.clickVehicleTab();
      const baseVehicle = {
        year: '2024',
        make: 'Audi',
        model: '',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        ccRating: '1600',
        chassisVIN: faker.vehicle.vin(),
      };
      
      await ratingPage.addNewVehicle(baseVehicle);
  
      await ratingPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('PrivateCTP');
      await ratingPage.calculatePremium();
  
      await ratingPage.assertErrorMessage('Gender can not be Non Conforming');
    });
});

test.describe('OpenL Component Scenarios', () => {  
  test('S11C2184 - Verify that OpenL component returns an error response when a driver\'s age is less than 21 and coverage is Private Car Third Party with a Smallz plan', async () => {
    test.slow();
    
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    
    const driverUnder21 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Main Driver',
      age: 20
    });

    await ratingPage.addNewDriver(driverUnder21);

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Audi',
      model: 'A4',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '10000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP', 'Smallz');
    await ratingPage.calculatePremium();

    await ratingPage.assertErrorMessage('Driver is under the minimum age');
  });

  test('S11C2185 - Verify that OpenL component returns an error response when a drivers Driver’s Licence is less than 2 years old and coverage is Private Car Third Party with a Smallz plan', async () => {
    test.slow();
    
    const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    
    const driverUnder21 = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Main Driver',
      age: 20,
      licenseIssued: 1,
      licenseValidity: 3
    });

    await ratingPage.addNewDriver(driverUnder21);

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Audi',
      model: 'A4',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '10000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    
    await ratingPage.addNewVehicle(baseVehicle);

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP', 'Smallz');
    await ratingPage.calculatePremium();

    await ratingPage.assertErrorMessage('Driver holds a Driver’s Licence for less than 2 years');
  });
});

test.describe('Additional Premium Scenarios', () => {  
  async function setupBaseQuote() {
    const { customerName, customerId, customerDetails } = await customerPage.createNewCustomer(40, 'Jamaica');

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    const driver = {
      age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
      gender: customerDetails['generalInformation']['Gender'],
      licenseType: 'Permanent',
      licenseStatus: 'Valid',
    }

    await ratingPage.clickVehicleTab();

    const baseVehicle = {
      year: '2024',
      make: 'Audi',
      model: 'A4',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: '10000000',
      country: 'Jamaica',
      address: '123 Test Street',
      parish: 'Kingston',
      ccRating: '1600',
      chassisVIN: faker.vehicle.vin()
    };
    await ratingPage.addNewVehicle(baseVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    return {customerDetails, baseVehicle, driver};
  }

  async function getPremiumAfterLimits(biLimit: string, pdLimit: string) {
    await ratingPage.setBodilyInjuryLimit(biLimit);
    await ratingPage.setPropertyDamageLimit(pdLimit);
    await ratingPage.calculatePremium();
    return await ratingPage.getPremiumValue();
  }

  test('S11C2186 - Verify that an additional premium of 10,000 is added when Option 1 (10,000,000) is selected for both Bodily Injury and Property Damage.', async () => {
    test.setTimeout(580_000);
    const { customerDetails, baseVehicle, driver } = await setupBaseQuote();

    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();
  
    const expectedBasePremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { }
    });    expect(basePremium).toBe(expectedBasePremium.premium);

    const newPremium = await getPremiumAfterLimits('10000000/10000000', '10000000.00');

    const expectedNewPremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { increasedThirdPartyLimits: 'OptionI' }
    });    expect(newPremium).toBe(expectedNewPremium.premium);
    await policyPage.clickSaveAndExit();
  });

  test('S11C2187 - Verify that an additional premium of 15,000 is added when Option 2 (20,000,000) is selected for both Bodily Injury and Property Damage.', async () => {
    test.setTimeout(580_000);
    const { customerDetails, baseVehicle, driver } = await setupBaseQuote();

    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();

    const expectedBasePremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { }
    });    expect(basePremium).toBe(expectedBasePremium.premium);

    const newPremium = await getPremiumAfterLimits('20000000/20000000', '20000000.00');

    const expectedNewPremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { increasedThirdPartyLimits: 'OptionII' }
    });    expect(newPremium).toBe(expectedNewPremium.premium);
    await policyPage.clickSaveAndExit();
  });

  test('S11C2188 - Verify that an additional premium of 15,000 is added when Option 1 is selected for Bodily Injury and Option 2 for Property Damage.', async () => {
    test.setTimeout(580_000);
    const { customerDetails, baseVehicle, driver } = await setupBaseQuote();

    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();

    const expectedBasePremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { }
    });    expect(basePremium).toBe(expectedBasePremium.premium);

    const newPremium = await getPremiumAfterLimits('10000000/10000000', '20000000.00');

    const expectedNewPremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { increasedThirdPartyLimits: 'OptionII' }
    });    expect(newPremium).toBe(expectedNewPremium.premium);
    await policyPage.clickSaveAndExit();
  });

  test('S11C2189 - Verify that an additional premium of 10,000 is added when Option 1 is selected for Bodily Injury and the standard limit (5,000,000) is selected for Property Damage.', async () => {
    test.setTimeout(580_000);
    const { customerDetails, baseVehicle, driver } = await setupBaseQuote();

    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();

    const expectedBasePremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { }
    });    expect(basePremium).toBe(expectedBasePremium.premium);

    const newPremium = await getPremiumAfterLimits('10000000/10000000', '5000000.00');

    const expectedNewPremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { increasedThirdPartyLimits: 'OptionI' }
    });    expect(newPremium).toBe(expectedNewPremium.premium);
    await policyPage.clickSaveAndExit();
  });

  test('S11C2190 - Verify that an additional premium of 15,000 is added when Option 2 is selected for Bodily Injury and the standard limit (5,000,000) is selected for Property Damage.', async () => {
    test.setTimeout(580_000);
    const { customerDetails, baseVehicle, driver } = await setupBaseQuote();

    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();

    const expectedBasePremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { }
    });    expect(basePremium).toBe(expectedBasePremium.premium);

    const newPremium = await getPremiumAfterLimits('20000000/20000000', '5000000.00');

    const expectedNewPremium = calculateExpectedPremium({
      customer: customerDetails,
      driver: driver,
      vehicle: baseVehicle,
      coverage: { type: 'PrivateCTP' },
      options: { increasedThirdPartyLimits: 'OptionII' }
    }); 
    expect(newPremium).toBe(expectedNewPremium.premium);
    await policyPage.clickSaveAndExit();
  });
});

// TODO: These tests are skipped until we can confirm how to validate them
test.describe.skip('OpenL Scenarios', () => {  
  test('S11C2191 - Verify that policy loadings are re-calculated at renewal', async () => {
    // Confirming if there is another way to validate instead of OpenL
  });

  test('S11C2192 - Verify that rater calculates the vehicle\'s age as of the endorsement effective date', async () => {
     // Confirming if there is another way to validate instead of OpenL
  });

  test('S11C2193 - Verify that rater calculates the driver\'s age as of the endorsement effective date', async () => {
     // Confirming if there is another way to validate instead of OpenL
  });
});

// TODO: This test is skipped until we can confirm how to change the Source field on the policy tab
test.skip('S11C2194 - Verify that the stamp duty for a migrated policy is being calculated correctly', async () => {
  test.setTimeout(580_000);
  
  const { customerName, customerId } = await customerPage.createNewCustomer(40, 'Barbados');

  await ratingPage.startNewQuote();
  await ratingPage.selectPolicyCounty('Barbados');
  await ratingPage.headerNextButton.click();
  await ratingPage.waitForLoadingSpinner();

  await ratingPage.selectInsuredParty(customerName, 'Trident Insurance Company Limited');

  await ratingPage.goToNextTab('Driver');
  await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

  await ratingPage.clickVehicleTab();
  const baseVehicle = {
    year: '2024',
    make: 'Audi',
    model: 'A4',
    performance: 'A',
    bodyType: 'Sedan',
    sumInsured: '10000000',
    country: 'Jamaica',
    address: '123 Test Street',
    parish: 'Kingston',
    ccRating: '1600',
    chassisVIN: faker.vehicle.vin()
  };
  
  await ratingPage.addNewVehicle(baseVehicle);


//   A Barbados customer exists in EIS

// Create a new quote/policy for a Barbados customer
// Set the Source field on Policy tab to "Conversion"
// Calculate premium
// Go to Funding Summary tab
// Confirm that the Additional Stamp Duty = 0 and Total Stamp Duty = 0
// Expected results
// Verified that the stamp duty is Additional Stamp Duty = 0 and Total Stamp Duty = 0

  
  await ratingPage.clickPremiumsAndCoveragesTab();
  await ratingPage.setCoverageAndPlan('PrivateCTP');
  await ratingPage.calculatePremium();
  await ratingPage.clickFundingSummaryTab();
  const totalStampDuty = await ratingPage.getTotalStampDutyValue();
  const additionalStampDuty = await ratingPage.getAdditionalStampDutyValue();  expect(totalStampDuty).toBe(0);
  expect(additionalStampDuty).toBe(0);
});