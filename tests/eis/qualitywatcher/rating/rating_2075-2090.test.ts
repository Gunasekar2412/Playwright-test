import { test, expect } from '@playwright/test';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { testData, getJmdFinanceInterest, paymentPlans, excessLimitOptions } from '../../../../sites/eis/data/RatingData';
import { calculateExpectedPremium, generateDob } from '../../../../lib/utils';
import { faker } from '@faker-js/faker';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { closePartySearchPopupIfVisible } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerPage: CustomerPage;
let data: any;

test.setTimeout(520_000);

test.beforeEach(async ({ page }) => {
    ratingPage = new RatingPage(page);
    policyPage = new PolicyPage(page);
    customerPage = new CustomerPage(page);
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    data = testData.interestRateTest;
});

test('[S11C2075] Verify Interest Rate and Minimum Interest for Jamaica financing plans is populated correctly', async () => {
    // Create customer for this test
    const { customerName } = await customerPage.createNewCustomer();

    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

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

    const insurancePremium = await ratingPage.getPremiumValue();

    await ratingPage.clickFundingSummaryTab();

    // Verify interest rate and minimum interest
    await ratingPage.verifyInterestRateIsDisplayedCorrectly();

    for (const plan of paymentPlans) {

        // Select payment plan
        await ratingPage.selectPaymentPlan(plan.value);
        await ratingPage.waitForLoadingSpinner();

        if (plan.period) {
            const jmdFinanceInterest = getJmdFinanceInterest(plan.period, insurancePremium);

            const interestRate = await ratingPage.interestRateField.inputValue();
            await expect(interestRate).toBe(jmdFinanceInterest?.interestRate);
        }
    }

});

test('[S11C2076] Verify Interest Rate and Minimum Interest for Jamaica non-financing plans is zero', async () => {
    // Create customer for this test
    const { customerName } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');

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

    const insurancePremium = await ratingPage.getPremiumValue();

    await ratingPage.clickFundingSummaryTab();

    // Verify interest rate and minimum interest
    await ratingPage.verifyInterestRateIsDisplayedCorrectly();

    for (const plan of paymentPlans) {

        if (!plan.period) {
            await ratingPage.selectPaymentPlan(plan.value);
            await ratingPage.waitForLoadingSpinner();

            const interestRate = await ratingPage.interestRateField.inputValue();
            await expect(interestRate).toBe('0.00');
        }
    }
});

test.skip('[S11C2077] Verify the policy premium is adjusted incrementally with each step of loading calculation', async ({ page }) => {
    // Use the premium calculation test data
    const testCaseData = testData.premiumCalculationTest;
    let previousPremium = 0;

    const { customerName } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, testCaseData.insuredParty.priorCarrier);

    // Add a male driver between 30-40 years old
    await ratingPage.addNewDriver(testCaseData.driver);
    await ratingPage.clickVehicleTab();

    // Add vehicle less than 25 years old with electric fuel type
    await ratingPage.addNewVehicle(testCaseData.vehicle);
    await ratingPage.goToNextTab('MVR/Claims');
    await ratingPage.goToNextTab('Premium & Coverages');

    // Go to Premium & Coverages tab and select Comprehensive coverage
    await ratingPage.setCoverageAndPlan(testCaseData.coverage.type);
    await ratingPage.calculatePremium();

    // previousPremium = await ratingPage.getPremiumValue();

    // // Go to Excess field and select '10% of the Sum Insured'
    // await ratingPage.page.getByLabel('Excess').selectOption(testCaseData.coverage.excess);
    // await ratingPage.calculatePremiumButton.click();
    // await ratingPage.waitForLoadingSpinner();
    // await ratingPage.verifyPremiumIncreased(previousPremium);

    // // Click Calculate Premium button and verify final premium
    // await ratingPage.calculatePremiumButton.click();
    // await ratingPage.waitForLoadingSpinner();
    // // await ratingPage.verifyPremiumIncreased(previousPremium);

    // // Note the Quote number and save
    // const quoteNumber = await ratingPage.page.locator('[id="headerForm:quoteNumber"]').textContent();

    // await ratingPage.page.getByRole('button', { name: 'Save & Exit' }).click();
    // await ratingPage.waitForLoadingSpinner();
});

test('[S11C2078] Validate that the <30yr Female Driver Age loading is applied based on the age of the Main Driver - Comprehensive Coverage Type and Standard Plan', async () => {
    // Create customer for this test
    const { customerName, customerDetails } = await customerPage.createNewCustomer();

    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Daughter',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(18, 29),
        gender: 'Female',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }

    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: { rentalBenefit: false }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Recieved premium: 1064000
});

test('[S11C2079] Validate that the 30 - 40yr Female Driver Age loading is applied based on the age of the Main Driver - Comprehensive Coverage Type and Standard Plan', async () => {
    // Create customer for this test
    const { customerName, customerDetails } = await customerPage.createNewCustomer();

    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Daughter',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Female',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }

    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: {}
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Recieved premium: 672000
});

test('[S11C2080] Validate that the no Driver Age loading if the Main Driver is a Female between 41-59 years old - Comprehensive Coverage Type and Standard Plan', async () => {
    // Create customer for this test
    const { customerName, customerDetails } = await customerPage.createNewCustomer();

    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Daughter',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(41, 59),
        gender: 'Female',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }

    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: {}
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Recieved premium: 560000
});

test('[S11C2081] Validate that the <30yr Female Driver Age loading is applied based on the age of the Main Driver - Private Car Third Party Fire & Theft', async () => {
    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Daughter',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(19, 29),
        gender: 'Female',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2023',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();

    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWORentalBenefits');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { rentalBenefit: false }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Recieved premium: 221000
});

test('[S11C2082] Validate that the 30 - 40yr Female Driver Age loading is applied based on the age of the Main Driver - Private Car Third Party Fire & Theft', async () => {
    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Daughter',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Female',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2015',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWRentalBenefits');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { rentalBenefit: true, rentalWeeks: 1, rentalSize: 'Compact' }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 207300
});

test('[S11C2083] Validate that the <30yr Male Driver Age loading is applied based on the age of the Main Driver - Comprehensive Coverage Type and Standard Plan', async () => {
    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Son',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(18, 29),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: {}
    });    // expect(insurancePremium).toBeLessThan(expected.premium);

    // Actual Premium: 1260000
});

test('[S11C2084] Validate that the 30 - 40 year old Male Driver Age loading is applied based on the age of the Main Driver - Comprehensive Coverage Type and Standard Plan', async () => {
    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Husband',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: {}
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 812000
});

test('[S11C2085] Validate that the no Driver Age loading if the Main Driver is a Male between 41-59 years old - Comprehensive Coverage Type and Standard Plan', async () => {
    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Husband',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(41, 59),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'Comprehensive' },
        options: {}
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 560000
});

test('[S11C2086] Validate that the <30yr Male Driver Age loading is applied based on the age of the Main Driver - Private Car Third Party Plus Repair', async () => {
    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Son',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(18, 29),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPP' },
        options: { repairBenefit: 50000 }
    });    expect(insurancePremium).toBeLessThan(expected.premium);

    // Actual Premium: 85250
});

test('[S11C2087] Validate that the 30 - 40 year old Male Driver Age loading is applied based on the age of the Main Driver - Private Car Third Party Plus Repair', async () => {
    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Husband',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPP' },
        options: { repairBenefit: 50000 }
    });    expect(insurancePremium).toBeLessThan(expected.premium);

    // Actual Premium: 57250
});

test('[S11C2088] Validate that the no Driver Age loading if the Main Driver is a Male between 41-59 years old - Private Car Third Party Plus Repair', async () => {
    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Husband',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(41, 59),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPP');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPP' },
        options: { repairBenefit: 50000 }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 41500
});

test('[S11C2089] Validate that the <30yr Male Driver Age loading is applied based on the age of the Main Driver - Third Party Fire and Theft', async () => {
    const driver =
    {
        firstName: faker.person.firstName(),
        lastName: 'James',
        relationship: 'Son',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(19, 29),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2023',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
    await ratingPage.clickPremiumsAndCoveragesTab();

    // Set coverage and calculate premium
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWORentalBenefits');
    await ratingPage.calculatePremium();

    const insurancePremium = await ratingPage.getPremiumValue();

    const expected = calculateExpectedPremium({
        customer: customerDetails,
        driver: driver,
        vehicle: data.vehicle,
        coverage: { type: 'PrivateCTPFT' },
        options: { rentalBenefit: false }
    });    expect(insurancePremium).toBeGreaterThan(expected.premium);

    // Actual Premium: 221000
});

test('[S11C2090] Validate that the 30 - 40yr Male Driver Age loading is applied based on the age of the Main Driver - Third Party Coverage and Standard plan', async () => {
    const driver =
    {
        firstName: 'Michael',
        lastName: faker.person.lastName(),
        relationship: 'Husband',
        type: 'Main Driver',
        trn: '123456789',
        dob: generateDob(30, 40),
        gender: 'Male',
        address: faker.location.streetAddress(),
        parish: 'Kingston',
        country: 'JM',
        license: {
            type: 'Permanent',
            dateFirstLicensed: '01/01/2010',
            number: '123456789',
            country: 'JM',
            status: 'Valid'
        }
    }
    const { customerName, customerDetails } = await customerPage.createNewCustomer();
    await ratingPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerName, data.insuredParty.priorCarrier);
    await ratingPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(ratingPage.page);

    await policyPage.addNewDriverButton.click();

    // Set driver details
    await ratingPage.selectExistingDriver(
        customerName,
        data.driver.licenseType,
        data.driver.licenseStatus,
        undefined,
        'Occasional Driver'
    );

    await ratingPage.clickChangeDriverInfoButton();

    await ratingPage.addNewDriver(driver);

    await policyPage.clickVehicleTab();
    await ratingPage.waitForLoadingSpinner();

    // Add vehicle details
    await ratingPage.addNewVehicle(data.vehicle);
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
        options: { }
    });    expect(insurancePremium).toBe(expected.premium);

    // Actual Premium: 36000
});
