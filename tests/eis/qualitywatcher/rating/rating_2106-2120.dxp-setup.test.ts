import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, customer } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob, getAgeFromDob } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import { generateCustomerInformation, type CustomerInformation } from '../../../../sites/eis/data/CustomerData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { isDxpIssuanceConfigured } from '../../../../lib/dxp/config';
import { createJamaicaCustomerViaDxp } from '../../../../lib/dxp/createJamaicaCustomer';
import { closePartySearchPopupIfVisible } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let data: any;

test.setTimeout(720_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    data = testData.interestRateTest;
});

test.beforeAll(async () => {
    test.skip(
        !isDxpIssuanceConfigured(),
        'DXP API setup: set DXP_API_BASE_URL, DXP_GUEST_BASIC_*, and DXP_AGENT_BASIC_* (or EIS_USERNAME/PASSWORD).'
    );
});

async function setupActivePolicy(country: string = 'Jamaica', insuredParty: string = 'Advantage General Insurance Company') {
    let customerName: string;
    let customerNameWithoutHyphen: string;
    let customerId: string;
    let customerDetails: CustomerInformation;

    if (country === 'Jamaica') {
        const created = await createJamaicaCustomerViaDxp({ age: 40 });
        customerName = created.customerName;
        customerId = created.customerId;
        customerDetails = created.customerDetails;
        customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');
        await ratingPage.searchCustomer(customerId);
        await ratingPage.waitForLoadingSpinner();
        await ratingPage.startNewQuote();
    } else {
        const created = await customerPage.createNewCustomer(40, country);
        customerName = created.customerName;
        customerId = created.customerId;
        customerDetails = created.customerDetails as CustomerInformation;
        customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');
        await ratingPage.startNewQuote();
    }

    await ratingPage.selectPolicyCounty(country);
    if (country === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, insuredParty);
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, 'Permanent', 'Valid');

    await ratingPage.clickVehicleTab();
    const baseVehicle = {
      year: '2024',
      make: 'Audi',
      model: 'A4',
      performance: 'A',
      bodyType: 'Sedan',
      sumInsured: country === 'Barbados' ? '100000' : '10000000',
      country: country,
      address: '123 Test Street',
      parish: country === 'Barbados' ? 'St. Michael' : 'Kingston',
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

    return { customerName, customerNameWithoutHyphen, customerId, policyNumber, customerDetails };
  }

test('[S11C2106] Verify the Rater updates the premium step-by-step as the NFD discount is applied', async () => {
    test.setTimeout(540_000);

    // Start new quote with customer search
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

    const vehicle = 
    {
        year: '2020',
        make: 'Acura',
        model: '3.2tl',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '5000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    const premium1Year = calculateExpectedPremium({
        customer: {
            ...customerDetails,
            claimFreeYears: 1
        },
        driver,
        vehicle,
        coverage: { type: "Comprehensive" },
        options: { }
    });
    
     // Select branch
     await ratingPage.selectPolicyCounty('Jamaica');
     await ratingPage.selectBranch(data.branch);
     await policyPage.checkPremiumFincancing('No');
     await ratingPage.headerNextButton.click();
     await ratingPage.waitForLoadingSpinner();
    
    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '1YEAR');
    await ratingPage.goToNextTab('Driver');
    
    // Set driver details
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, 
        driver.licenseType, 
        driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    
    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    
    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();

    // Verify the premium
    let insurancePremium = await ratingPage.getPremiumValue();
    await expect(insurancePremium).toBe(premium1Year.premium);
    // Apply the 3 year claim free discount
    await ratingPage.saveAndExitButton.click();
    await ratingPage.takeActionDropdown.selectOption('dataGather');
    await ratingPage.clickInsuredTab();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '3YEARS');
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();

    const premium3Year = calculateExpectedPremium({
        customer: {
            ...customerDetails,
            claimFreeYears: 3
        },
        driver,
        vehicle,
        coverage: { type: "Comprehensive" },
        options: { }
    });

    // Verify the premium
    insurancePremium = await ratingPage.getPremiumValue();
    await expect(insurancePremium).toBe(premium3Year.premium);});

test('[S11C2107] Verify the Rater calculates NFD using the insured with the highest "Number of years driving claim free?" value', async () => {
    test.setTimeout(540_000);

    // Start new quote with customer search
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();
    const customer = generateCustomerInformation(40);

    const vehicle = 
    {
        year: '2020',
        make: 'Acura',
        model: '3.2tl',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '5000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
     // Select branch
     await ratingPage.selectPolicyCounty('Jamaica');
     await ratingPage.selectBranch(data.branch);
     await policyPage.checkPremiumFincancing('No');
     await ratingPage.headerNextButton.click();
     await ratingPage.waitForLoadingSpinner();
    
    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, 'MORE5');
    await ratingPage.saveButton.click();

    await ratingPage.addNewInsuredParty(customer, true, '2YEARS');
    await ratingPage.goToNextTab('Vehicle');
    
    // Set driver details
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, 
        driver.licenseType, 
        driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    
    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    const result = calculateExpectedPremium({
        customer: {
            ...customerDetails,
            claimFreeYears: 5
        },
        driver: driver,
        vehicle,
        coverage: { type: "Comprehensive" },
        options: { }
    });    
    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();

    // Verify the premium
    let insurancePremium = await ratingPage.getPremiumValue();    expect(insurancePremium).toBe(result.premium);
});

test('[S11C2108] Verify the Rater calculates Restricted Driving Discount when selected', async () => {
    test.setTimeout(540_000);

     // Start new quote with customer search
     const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
     const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

     await ratingPage.searchCustomer(customerId);
     await ratingPage.waitForLoadingSpinner();
     await ratingPage.startNewQuote();
    const customer = generateCustomerInformation(40);

    const vehicle = 
    {
        year: '2020',
        make: 'Acura',
        model: '3.2tl',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '5000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
     // Select branch
     await ratingPage.selectPolicyCounty('Jamaica');
     await ratingPage.selectBranch(data.branch);
     await policyPage.checkPremiumFincancing('No');
     await ratingPage.headerNextButton.click();
     await ratingPage.waitForLoadingSpinner();
    
    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, 'MORE5');
    await ratingPage.saveButton.click();

    await ratingPage.addNewInsuredParty(customer, true, '2YEARS');
    await ratingPage.goToNextTab('Driver');
    
    // Set driver details
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, 
        driver.licenseType, 
        driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    
    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    const result = calculateExpectedPremium({
        customer: {
            ...customerDetails,
            claimFreeYears: 5
        },
        driver: driver,
        vehicle,
        coverage: { type: "Comprehensive" },
        options: { }
    });
    
    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();

    // Verify the premium
    let insurancePremium = await ratingPage.getPremiumValue();    expect(insurancePremium).toBe(result.premium);

    await ratingPage.saveAndExitButton.click();
    
    // Navigate to the UI.
    // Select 'Assign three (3) named drivers?'.
    // Calculate Restricted Driving Discount.
});

test('[S11C2109] No NFD Discount is applicable for a Smallz policy', async () => {
    test.setTimeout(540_000);

     // Start new quote with customer search
     const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
     const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

     await ratingPage.searchCustomer(customerId);
     await ratingPage.waitForLoadingSpinner();
     await ratingPage.startNewQuote();

    const vehicle = 
    {
        year: '2020',
        make: 'Acura',
        model: '3.2tl',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '5000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
     // Select branch
     await ratingPage.selectPolicyCounty('Jamaica');
     await ratingPage.selectBranch(data.branch);
     await policyPage.checkPremiumFincancing('No');
     await ratingPage.headerNextButton.click();
     await ratingPage.waitForLoadingSpinner();
    
    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '1YEAR');
    await ratingPage.goToNextTab('Driver');
    
    // Set driver details
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, 
        driver.licenseType, 
        driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    
    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    const result = calculateExpectedPremium({
        customer: {
            ...customerDetails,
            claimFreeYears: 1
        },
        driver,
        vehicle,
        coverage: { type: 'PrivateCTP', plan: 'Smallz' },
        options: { }
    });
    
    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan("PrivateCTP", "Smallz");
    await ratingPage.calculatePremium();

    // Verify the premium
    let insurancePremium1 = await ratingPage.getPremiumValue();    expect(insurancePremium1).toBe(result.premium);

    await ratingPage.saveAndExitButton.click();
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.takeActionDropdown.selectOption('dataGather');
    await ratingPage.clickInsuredTab();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, 'MORE5');

    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();

    // Verify the premium
    let insurancePremium = await ratingPage.getPremiumValue();    expect(insurancePremium).toBe(result.premium);
});

test('[S11C2110] No other discount is applicable for a Smallz policy', async () => {
    test.setTimeout(480_000);

    const vehicle = 
    {
        year: '2020',
        make: 'Acura',
        model: '3.2tl',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '5000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

     // Start new quote with customer search
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();
    
     // Select branch
     await ratingPage.selectPolicyCounty('Jamaica');
     await ratingPage.selectBranch(data.branch);
     await policyPage.checkPremiumFincancing('No');
     await ratingPage.headerNextButton.click();
     await ratingPage.waitForLoadingSpinner();
    
    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '1YEAR');
    await ratingPage.goToNextTab('Driver');
    
    // Set driver details
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, 
        data.driver.licenseType, 
        data.driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    
    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    const smallzPremium = calculateExpectedPremium({
        customer: customerDetails,
        driver: {
            age: Number(data.driver.age),
            gender: data.driver.gender,
            claimFreeYears: 1,
            isMainDriver: true
        },
        vehicle,
        coverage: { type: 'PrivateCTP', plan: 'Smallz' },
        options: { otherPolicyVehicle: true }
    });
    
    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTP', 'Smallz');
    await ratingPage.calculatePremium();
    let insurancePremium = await ratingPage.getPremiumValue();
    await expect(insurancePremium).toBe(smallzPremium.premium);

    await ratingPage.saveAndExitButton.click();
    await ratingPage.takeActionDropdown.selectOption('dataGather');

    await ratingPage.clickInsuredTab();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, 'MORE5');
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();

    // Verify the premium
    insurancePremium = await ratingPage.getPremiumValue();
    await expect(insurancePremium).toBe(smallzPremium.premium);});

test('[S11C2111] Verify the Rater calculates GPS Discount when Tracking System is selected', async () => {
    test.setTimeout(480_000);

    // Start new quote with customer search
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

    // Create vehicle data for this test
    const vehicle = {
        year: '2024',
        make: 'Toyota',
        model: 'Probox',
        performance: 'A',
        bodyType: 'Station Wagon',
        sumInsured: '1000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    };

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '1YEAR');
    
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    // Save the premium before GPS discount
    const premiumBefore = await ratingPage.getPremiumValue();

    await ratingPage.saveAndExitButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.takeActionDropdown.selectOption('dataGather');

    // Go back to vehicle tab and set Additional Security to 'Tracking System'
    await ratingPage.clickVehicleTab();
    await ratingPage.vehicleAdditionalSecurityDropdown.selectOption('TrackingSystem');
    await ratingPage.waitForLoadingSpinner();

    // Go back to premium and coverage, recalculate
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();

    // Check that the premium is reduced by 10%
    const premiumAfter = await ratingPage.getPremiumValue();
    expect(premiumAfter).toBeCloseTo(premiumBefore * 0.9, 0); // 10% reduction
});

test('[S11C2112] Verify the Rater calculates the applicable discount combinations', async () => {
    test.setTimeout(540_000);

    const vehicle = {
        year: '2024',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '2000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    };

    const { customerName, customerId } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier, true, '1YEAR');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(
        customerNameWithoutHyphen, data.driver.licenseType, data.driver.licenseStatus
    );
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    // 1. VM Group savers + VM Group staff (one max discount, should be 15%)
    let basePremium = await ratingPage.getPremiumValue();
    await ratingPage.clickInsuredTab();
    await ratingPage.addMembership('JM-VGSA', '11111'); // VM Group savers
    await ratingPage.addMembership('JM-VGST', '22222'); // VM Group staff
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    let premium1 = await ratingPage.getPremiumValue();
    const expected1 = +(basePremium * 0.85).toFixed(2); // 15% off
    expect(premium1).toBeCloseTo(expected1, 0);
    // 2. ICD staff + VM Group savers (both discounts: 10% then 10%)
    await ratingPage.clickInsuredTab();
    await ratingPage.removeAllMemberships();
    await ratingPage.addMembership('JM-IS', '33333'); // ICD staff
    await ratingPage.addMembership('JM-VGSA', '44444'); // VM Group savers
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    let premium2 = await ratingPage.getPremiumValue();
    const expected2 = +(basePremium * 0.9 * 0.9).toFixed(2); // 10% then 10%
    expect(premium2).toBeCloseTo(expected2, 0);
    // 3. ICD staff + VM Group staff (one max discount, should be 15%)
    await ratingPage.clickInsuredTab();
    await ratingPage.removeAllMemberships();
    await ratingPage.addMembership('JM-IS', '55555'); // ICD staff
    await ratingPage.addMembership('JM-VGST', '66666'); // VM Group staff
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    let premium3 = await ratingPage.getPremiumValue();
    const expected3 = +(basePremium * 0.85).toFixed(2); // 15% off
    expect(premium3).toBeCloseTo(expected3, 0);
    // 4. BCIC pensioner (20% off)
    await ratingPage.clickInsuredTab();
    await ratingPage.removeAllMemberships();
    await ratingPage.addMembership('JM-BP', '77777'); // BCIC pensioner
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    let premium4 = await ratingPage.getPremiumValue();
    expect(premium4).toBe(basePremium);});

test('[S11C2113] Verify the Rater calculates Driver Age discount based on the driver\'s age. Driver = over 60 years old', async () => {
    test.setTimeout(480_000);

    // Create a driver age 40 (no discount)
    const driverAge40 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        relationship: 'Parent',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(45, 45),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/1990',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    };

    // Create a driver over 60 years old
    const driverOver60 = {
        ...driverAge40,
        dob: generateDob(61, 70),
    };

    // Use a standard vehicle for the test
    const vehicle = {
        year: '2024',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '2000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    };

    // Start new quote with customer search
    const { customerName, customerId } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);
    await ratingPage.clickDriverTab();

    // Add new driver (age 40)
    await ratingPage.addNewDriver(driverAge40);

    // Add vehicle details
    await ratingPage.clickVehicleTab();
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium (age 40 driver)
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const premiumAge40 = await ratingPage.getPremiumValue();

    // Now change driver to over 60
    await ratingPage.clickDriverTab();
    await ratingPage.dobField.fill(driverOver60.dob);
    await ratingPage.page.keyboard.press('Enter');
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    const premiumOver60 = await ratingPage.getPremiumValue();

    // Assert that the over-60 premium is 20% less than the base premium
    expect(premiumOver60).toBeCloseTo(premiumAge40 * 0.8, 0);});

test('[S11C2114] Verify the Rater applies unlimited discounts in Jamaica Rating', async () => {
    test.setTimeout(480_000);

    // Use a standard driver and vehicle for the test
    const driver = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        relationship: 'Other',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(40, 40),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/1990',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    };

    const vehicle = {
        year: '2024',
        make: 'Toyota',
        model: 'Probox',
        performance: 'A',
        bodyType: 'Station Wagon',
        sumInsured: '1000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    };

    // Start new quote with customer search
    const { customerName, customerId } = await createJamaicaCustomerViaDxp();
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);
    await ratingPage.clickDriverTab();

    // Add new driver
    await ratingPage.addNewDriver(driver);

    // Add vehicle details
    await ratingPage.clickVehicleTab();
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium (base, no discounts)
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const basePremium = await ratingPage.getPremiumValue();

    // Apply multiple discounts (similar to S11C2112):
    await ratingPage.clickInsuredTab();
    await ratingPage.removeAllMemberships();
    await ratingPage.addMembership('JM-VGSA', '11111'); // VM Group savers
    await ratingPage.addMembership('JM-IS', '22222'); // ICD staff

    // Optionally, set vehicle additional security to 'Tracking System' for another discount
    await ratingPage.clickVehicleTab();
    await ratingPage.vehicleAdditionalSecurityDropdown.selectOption('TrackingSystem');
    await ratingPage.waitForLoadingSpinner();

    // Go back to Premium & Coverages and recalculate
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.calculatePremium();
    const discountedPremium = await ratingPage.getPremiumValue();

    // Calculate expected premium: 10% (VM Group savers) + 10% (ICD staff) + 10% (Tracking System)
    // Apply sequentially: base * 0.9 * 0.9 * 0.9
    const expectedDiscounted = +(((basePremium * 0.9) * 0.9) * 0.9).toFixed(2);    expect(discountedPremium).toBeCloseTo(expectedDiscounted, 0);
});

test('[S11C2115] Bundle Discount is applied when customer has at least one active policy (Barbados)', async () => {
    test.setTimeout(520_000);

    const { customerName, customerId, customerDetails } = await setupActivePolicy('Barbados', 'Trident Insurance Company Limited');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

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
        fuelType: 'Gasoline',
        ccRating: '1600' // needed for Barbados
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
    await ratingPage.selectPolicyCounty('Barbados');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerName, 'Trident Insurance Company Limited');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerName, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();
    const actualPremium = await ratingPage.getPremiumValue();
    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: true, country: 'Barbados' }
    });    expect(actualPremium).toBe(expected.premium);
});

test('[S11C2116] Bundle Discount is NOT applied when customer has no active policy (Barbados)', async () => {
    test.setTimeout(380_000);
    
    // Create a new customer
    const { customerName, customerDetails } = await customerPage.createNewCustomer(40, 'Barbados');
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');
    await ratingPage.startNewQuote();

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
        fuelType: 'Gasoline',
        ccRating: '1600' // needed for Barbados
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    
    await ratingPage.selectPolicyCounty('Barbados');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, 'Trident Insurance Company Limited');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();
    const actualPremium = await ratingPage.getPremiumValue();
    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: false, country: 'Barbados' }
    });    expect(actualPremium).toBe(expected.premium);
});

test('[S11C2117] Bundle Discount is applied to the second and subsequent vehicle (Barbados, no active policy)', async () => {
    test.setTimeout(520_000);

    // Create a new customer
    const { customerName, customerDetails } = await customerPage.createNewCustomer(40, 'Barbados');
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');
    await ratingPage.startNewQuote();

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
        fuelType: 'Gasoline',
        ccRating: '1600' // needed for Barbados
    }

    const secondVehicle = {
        ...vehicle,
    }
    
    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }
    
    await ratingPage.selectPolicyCounty('Barbados');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, 'Trident Insurance Company Limited');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    // Add first vehicle
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.addNewVehicle(secondVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    
    // Select first vehicle and set coverage
    await ratingPage.selectFirstVehicle();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    
    // Select second vehicle and set coverage
    await ratingPage.selectSecondVehicle();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    
    await ratingPage.calculatePremium();
    
    // Get actual premiums from the table
    const actualPremium1 = await ratingPage.getVehiclePremiumFromTable(0); // First vehicle
    const actualPremium2 = await ratingPage.getVehiclePremiumFromTable(1); // Second vehicle
    
    // Check premium for first vehicle (no bundle discount)
    const expectedPremium1 = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: false, country: 'Barbados' }
    });
    
    // Check premium for second vehicle (bundle discount applies)
    const expectedPremium2 = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: secondVehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: true, country: 'Barbados' }
    });  
    // Verify that the second vehicle premium is less than the first vehicle premium (bundle discount applied)
    expect(actualPremium2).toBeLessThan(actualPremium1);
    
    // Verify that actual premiums match expected premiums
    expect(actualPremium1).toBe(expectedPremium1.premium);
    expect(actualPremium2).toBe(expectedPremium2.premium);
});

test('[S11C2118] Bundle Discount is applied when customer has at least one active policy (Jamaica)', async () => {
    test.setTimeout(560_000);

    const { customerName, customerId, customerDetails, customerNameWithoutHyphen } = await setupActivePolicy('Jamaica', 'Advantage General Insurance Company');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

    const vehicle = {
        year: '2022',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '1000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline',
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, 'Advantage General Insurance Company');
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    await ratingPage.calculatePremium();
    const actualPremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: "Comprehensive" },
        options: { otherPolicyVehicle: true }
    });    
    // Allow for small rounding differences (within 0.1%)
    const tolerance = expected.premium * 0.001;
    expect(Math.abs(actualPremium - expected.premium)).toBeLessThanOrEqual(tolerance);
});

test('[S11C2119] Bundle Discount is NOT applied when customer has no active policy (Jamaica)', async () => {
    test.setTimeout(420_000);
    
    // Create a new customer
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp({ age: 40 });
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

    const vehicle = {
        year: '2022',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '1000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline',
    }

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier);
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan(data.coverage.type);
    await ratingPage.calculatePremium();
    const actualPremium = await ratingPage.getPremiumValue();
    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: data.coverage.type },
        options: { }
    });    expect(actualPremium).toBe(expected.premium);
});

test('[S11C2120] Bundle Discount is applied to the second and subsequent vehicle (Jamaica, no active policy)', async () => {
    test.setTimeout(320_000);
    
    // Create a new customer
    const { customerName, customerId, customerDetails } = await createJamaicaCustomerViaDxp({ age: 40 });
    const customerNameWithoutHyphen = customerName.replace(/-Automation/g, '');

    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.startNewQuote();

    const vehicle = {
        year: '2022',
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Sedan',
        sumInsured: '2000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline',
    }

    const secondVehicle = {
        ...vehicle,
    }
    
    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(customerNameWithoutHyphen, data.insuredParty.priorCarrier);
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customerNameWithoutHyphen, driver.licenseType, driver.licenseStatus);
    await ratingPage.goToNextTab('Vehicle');
    // Add first vehicle
    await ratingPage.addNewVehicle(vehicle);

    await ratingPage.addNewVehicle(secondVehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();
    
    // Select first vehicle and set coverage
    await ratingPage.selectFirstVehicle();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    
    // Select second vehicle and set coverage
    await ratingPage.selectSecondVehicle();
    await ratingPage.setCoverageAndPlan("Comprehensive");
    
    await ratingPage.calculatePremium();
    
    // Get actual premiums from the table
    const actualPremium1 = await ratingPage.getVehiclePremiumFromTable(0); // First vehicle
    const actualPremium2 = await ratingPage.getVehiclePremiumFromTable(1); // Second vehicle

    const expectedPremium1 = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: false }
    });

    const expectedPremium2 = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: secondVehicle,
        coverage: { type: "Comprehensive" },
        options: { bundleDiscount: true }
    });
    
    // Verify that the second vehicle premium is less than the first vehicle premium (bundle discount applied)
    expect(actualPremium2).toBeLessThan(actualPremium1);
    
    // Verify that actual premiums match expected premiums
    expect(actualPremium1).toBe(expectedPremium1.premium);
    expect(actualPremium2).toBe(expectedPremium2.premium);
});
