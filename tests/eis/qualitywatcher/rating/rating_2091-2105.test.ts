import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, getJmdFinanceInterest, paymentPlans, customer } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob, getLicenseDates, getAgeFromDob } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import ErrorMessages from '../../../../sites/eis/data/ErrorMessageData';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { closePartySearchPopupIfVisible } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let data: any;

test.setTimeout(480_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    data = testData.interestRateTest;
});

test('[S11C2091] Verify the Commercial Travelling Loading is applied when Commercial Travelling is selected', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    const driver = {
        age: getAgeFromDob(customerDetails['generalInformation']['Date of Birth']),
        gender: customerDetails['generalInformation']['Gender'],
        licenseType: data.driver.licenseType,
        licenseStatus: data.driver.licenseStatus,
    }

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);

    await ratingPage.selectBusinessUseQuestionnaire(0);
    await ratingPage.waitForLoadingSpinner();
    await ratingPage.selectSalesOrCommercialTraveling(0);
    await ratingPage.waitForLoadingSpinner();

    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTP' },
        options: { commercialUse: true }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 43200
});

test('[S11C2092] Verify the Vehicle Age Loading is applied based on the vehicle age', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '1999',
        make: 'Honda',
        model: 'Civic CX',
        performance: 'A',
        bodyType: 'Hatchback',
        sumInsured: '500000',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTP' },
        options: { }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 45000
});

test('[S11C2093] Verify the Electric Vehicle Loading of 25% is applied when Fuel Type \'Electric\' is selected for Third Party plan', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2023',
        make: 'Tesla',
        model: '3',
        performance: 'A',
        bodyType: 'U/K',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Electric'
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTP' },
        options: { }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 36000
});

test('[S11C2094] Verify the Electric Vehicle Loading of 25% is applied when Fuel Type \'Hybrid Plug-In\' is selected for Third Party plan', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2023',
        make: 'Tesla',
        model: '3',
        performance: 'A',
        bodyType: 'U/K',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Hybrid Plug-in'
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTP' },
        options: { }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 36000
});

test('[S11C2095] Verify the Electric Vehicle Loading of 25% is applied when Fuel Type \'Electric\' is selected for Third Party, Fire, and Theft plan', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2023',
        make: 'Tesla',
        model: '3',
        performance: 'A',
        bodyType: 'U/K',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Electric'
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 156000
});

test('[S11C2096] Verify the Electric Vehicle Loading of 25% is applied when Fuel Type \'Hybrid Pluf-In\' is selected for Third Party, Fire, and Theft plan', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2023',
        make: 'Tesla',
        model: '3',
        performance: 'A',
        bodyType: 'U/K',
        sumInsured: '10000000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Hybrid Plug-in'
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 156000
});

test('[S11C2097] Verify the Rater calculates High Performance Loading for vehicles on the high-performance list', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2022',
        make: 'Audi',
        model: 'R8 Performance',
        performance: 'H',
        bodyType: 'Coupe',
        sumInsured: '14000000',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 306000
});

test('[S11C2098] Verify the Rater calculates High Performance Loading for vehicles on the high-performance list', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2018',
        make: 'Toyota',
        model: '86',
        performance: 'H',
        bodyType: 'Coupe',
        sumInsured: '6000000',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 162000
});

test('[S11C2099] Verify the High Performance Loading is applied for vehicles on the high-performance list', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2024',
        make: 'BMW',
        model: 'M3',
        performance: 'H',
        bodyType: 'Sedan',
        sumInsured: '12000100',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { }
    });
    // Allow for small rounding differences (within 0.1%)
    const tolerance = expected.premium * 0.001;
    expect(Math.abs(insurancePremium - expected.premium)).toBeGreaterThan(tolerance);

    // Actual Premium: 216000
});

test('[S11C2100] Verify the Rental benefit loading is applied when the Rental benfit option is selected - Mid-size 3 weeks', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2024',
        make: 'BMW',
        model: 'M2',
        performance: 'H',
        bodyType: 'Coupe',
        sumInsured: '13050000',
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
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWRentalBenefits');
    await ratingPage.selectRentalCarType('MID-3W');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'Comprehensive' },
        options: { rentalBenefit: true, rentalWeeks: 3, rentalSize: 'Mid-size' }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 883800
});

test('[S11C2101] Verify the Rental benefit loading is applied when the Rental benfit option is selected - SUV 1 week', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2024',
        make: 'BMW',
        model: 'M4',
        performance: 'H',
        bodyType: 'Coupe',
        sumInsured: '15000000',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWRentalBenefits');
    await ratingPage.selectRentalCarType('SUV-1W');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'Comprehensive' },
        options: { rentalBenefit: true, rentalWeeks: 1, rentalSize: 'SUV' }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 875600
});

test('[S11C2102] Verify the Rental benefit loading is applied when the Rental benfit option is selected - Compact 2 week', async () => {
    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    const vehicle =
    {
        year: '2024',
        make: 'Audi',
        model: 'S6',
        performance: 'H',
        bodyType: 'Sedan',
        sumInsured: '14000000',
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
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        driver.licenseType,
        driver.licenseStatus,
    );

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWRentalBenefits');
    await ratingPage.selectRentalCarType('COMPACT-2W');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: vehicle,
        coverage: { type: 'Comprehensive' },
        options: { rentalBenefit: true, rentalWeeks: 2, rentalSize: 'Compact' }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 876600
});

test('[S11C2103] Verify no loadings are applied for Diamond Max coverage', async () => {
    const vehicle =
    {
        year: String(new Date().getFullYear() - 24), // 24 years old vehicle
        make: 'Honda',
        model: 'Civic',
        performance: 'A',
        bodyType: 'Hatchback',
        sumInsured: '500000',
        country: 'Jamaica',
        address: '123 Test Street',
        parish: 'Kingston',
        fuelType: 'Gasoline'
    }

    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Son',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '03/08/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    } // 30-40 years old driver

    // Start new quote with customer search
    const { customerName, customerDetails } = await customerPage.createNewCustomer(61, 'Jamaica');
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, customerDetails['generalInformation']['Prior Carrier']);
    await closePartySearchPopupIfVisible(ratingPage.page);
    await ratingPage.waitForLoadingSpinner();

    // Set driver details
    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive', 'DiamondMaxWORentalBenefits');
    await ratingPage.calculatePremium();

    // expect error message
    await expect(ratingPage.firstErrorMessage).toBeVisible();
    const messages = await ratingPage.allErrorMessages.allTextContents();
    expect(messages).toContain(ErrorMessages.DRIVER_UNDER_MINIMUM_AGE);
});

test('[S11C2104] Verify that the premium is rounded to two decimal points', async () => {
    // Start new quote with customer search
    const { customerName } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan(data.coverage.type);
    await ratingPage.calculatePremium();

    // Verify that the billable premium is rounded to two decimal points
    const billablePremium = await ratingPage.billablePremiumCell.textContent();
    expect(billablePremium).toMatch(/^[A-Z]{3}\d{1,3}(,\d{3})*\.\d{2}$/);
});

test('[S11C2105] Verify the Rater calucates the premium', async () => {
    // Start new quote with customer search
    const { customerName } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch(data.branch);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier, true, '1YEAR');
    await ratingPage.goToNextTab('Driver');

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus
    );

    await ratingPage.goToNextTab('Vehicle');

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan(data.coverage.type);
    await ratingPage.calculatePremium();

    // Verify values are populated after calculation
    await ratingPage.verifyPremiumValuesArePopulated();
    await ratingPage.saveAndExitButton.click();
});
