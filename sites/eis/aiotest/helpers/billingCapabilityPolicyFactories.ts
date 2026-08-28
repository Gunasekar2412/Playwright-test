import { expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CustomerPage } from '../../pages/CustomerPage';
import { HomePolicyPage } from '../../pages/HomePolicyPage';
import { PolicyPage } from '../../pages/PolicyPage';
import { RatingPage } from '../../pages/RatingPage';
import { CommercialPolicyPage } from '../../pages/commercialPolicyPage';
import { closePartySearchPopupIfVisible } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    CoverageAddressDetails,
    DriverDetails,
    LiabilityLimitDetails,
    StructureCoverageDetails,
    VehicleDetails
} from '../../data/LobConfig';

export type BillingCapabilityPolicy = {
    customerId: string;
    customerName: string;
    policyNumber: string;
    policyStatus: string;
};

export type CommercialAutoBillingPolicy = BillingCapabilityPolicy & {
    vehicleDetails: VehicleDetails;
};

export type PolicyBillingOptions = {
    effectiveDate?: string;
    region?: 'Barbados' | 'Jamaica';
};

function getRegionConfig(options: PolicyBillingOptions = {}) {
    const region = options.region ?? 'Barbados';
    const isJamaica = region === 'Jamaica';

    return {
        region,
        countryCode: isJamaica ? 'JM' : 'BB',
        currency: isJamaica ? 'JMD' : 'BBD',
        parish: isJamaica ? 'Kingston' : 'St. Michael',
        parishCode: isJamaica ? 'JM-01' : undefined,
        city: isJamaica ? 'Kingston' : 'Test City',
        paymentBranch: isJamaica ? 'HEAD_OFFICE_KINGSTON' : undefined
    } as const;
}

function normalizePolicyNumber(policyNumber: string): string {
    return policyNumber.replace('#', '').trim();
}

async function setPolicyEffectiveDate(
    ratingPage: RatingPage,
    options: PolicyBillingOptions
): Promise<void> {
    if (options.effectiveDate) {
        await ratingPage.setEffectiveDate(options.effectiveDate);
        await expect(ratingPage.effectiveDateField)
            .toHaveValue(options.effectiveDate);
        return;
    }

    await ratingPage.setRegionalEffectiveDate(
        options.region ?? 'Barbados',
        5
    );
}

export async function createHomePolicyForBilling(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    homePolicyPage: HomePolicyPage,
    options: PolicyBillingOptions = {}
): Promise<BillingCapabilityPolicy> {
    const config = getRegionConfig(options);
    const customer = await customerPage.createNewCustomer(40, config.region);

    await ratingPage.startQuote('Personal Lines', 'Home (Preconfigured)');
    await ratingPage.selectPolicyCounty(config.region);
    if (config.region === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await setPolicyEffectiveDate(ratingPage, options);
    await page
        .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
        .selectOption(config.currency);
    await page
        .locator('#policyDataGatherForm\\:sedit_Policy_policyFormCd')
        .selectOption({ label: 'Cover All' });
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await page
        .locator('#policyDataGatherForm\\:sedit_PreconfigInsured_partySelection')
        .selectOption({ label: customer.customerName });
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await closePartySearchPopupIfVisible(ratingPage.page);
    await homePolicyPage.fillRiskAddressSection({
        countryCd: config.countryCode,
        parishCd: config.parishCode,
        addressLine1: `${config.region} Risk Address ${Date.now()}`,
        yearBuilt: '2015'
    });
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await homePolicyPage.fillCoverageAndPremiumSection({
        coverageALimitAmount: faker.number.int({
            min: config.region === 'Jamaica' ? 5000001 : 100001,
            max: config.region === 'Jamaica' ? 7500000 : 250000
        })
            .toString(),
        coverageBLimitAmount: faker.number.int({
            min: config.region === 'Jamaica' ? 5000001 : 50000,
            max: config.region === 'Jamaica' ? 7500000 : 100001
        })
            .toString()
    });
    await homePolicyPage.openAndPrintFundingSummary();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
        billingAccountName: customer.customerName,
        city: config.city,
        paymentBranch: config.paymentBranch
    });

    const policyNumber = normalizePolicyNumber(
        (await policyPage.policyNumberText.textContent()) || ''
    );
    const policyStatus = await ratingPage.expectActivePolicyStatus();

    expect(policyNumber).toMatch(/^P\d+$/);

    return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        policyNumber,
        policyStatus
    };
}

export async function createPrivateMotorPolicyForBilling(
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    options: PolicyBillingOptions = {}
): Promise<BillingCapabilityPolicy & { premiumAmount: number }> {
    const config = getRegionConfig(options);
    const customer = await customerPage.createNewCustomer(40, config.region);

    await ratingPage.startNewQuote();
    await ratingPage.selectPolicyCounty(config.region);
    if (config.region === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await setPolicyEffectiveDate(ratingPage, options);
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.selectInsuredParty(
        customer.customerName,
        config.region === 'Jamaica'
            ? 'Advantage General Insurance Company'
            : 'Trident Insurance Company Limited'
    );
    await ratingPage.goToNextTab('Driver');
    await ratingPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await ratingPage.clickVehicleTab();
    await ratingPage.addNewVehicle({
        year: '2024',
        make: 'Audi',
        model: 'A4',
        performance: config.region === 'Jamaica' ? 'S' : 'A',
        bodyType: 'Sedan',
        sumInsured: config.region === 'Jamaica' ? '14000000' : '100000',
        country: config.countryCode,
        address: `${config.region} Billing Address`,
        parish: config.parish,
        ccRating: config.region === 'Barbados'
            ? faker.number.int({ min: 1000, max: 5000 }).toString()
            : undefined,
        chassisVIN: faker.vehicle.vin()
    });
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    const premiumAmount = await ratingPage.getPremiumValue();
    expect(premiumAmount).toBeGreaterThan(0);
    await ratingPage.clickFundingSummaryTab();
    await ratingPage.selectPaymentPlan('FullPay');
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
        billingAccountName: customer.customerName,
        city: config.city,
        paymentBranch: config.paymentBranch
    });

    const policyNumber = normalizePolicyNumber(
        (await policyPage.policyNumberText.textContent()) || ''
    );
    const policyStatus = await ratingPage.expectActivePolicyStatus();
    expect(policyNumber).toMatch(/^P\d+$/);

    return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        policyNumber,
        policyStatus,
        premiumAmount
    };
}

export async function createCommercialAutoPolicyForBilling(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    commercialPolicyPage: CommercialPolicyPage,
    options: PolicyBillingOptions = {}
): Promise<CommercialAutoBillingPolicy> {
    const config = getRegionConfig(options);
    const driverDetails: DriverDetails = {
        relationshipToApplicant: 'EMP',
        driverType: 'P',
        maritalStatus: 'S',
        licenceType: 'PER',
        ageFirstLicensed: '2',
        licenceNumber: faker.string.alphanumeric(12).toUpperCase(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: 'male',
        dateOfBirth: '20/06/1995',
        country: config.countryCode,
        addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
        parish: config.region === 'Jamaica' ? 'Kingston' : 'BB-02',
        licensedDate: '20/06/2013',
        licenceCountry: config.countryCode
    };
    const coverageAddressDetails: CoverageAddressDetails = {
        country: config.countryCode,
        addressLine1: `${faker.number.int({ min: 1, max: 999 })} ${faker.location.street()}`,
        parish: config.region === 'Jamaica' ? 'Kingston' : 'BB-08'
    };
    const vehicleDetails: VehicleDetails = {
        vinNumber: faker.string.alphanumeric(17).toUpperCase(),
        modelYear: '2026',
        make: 'Acura',
        ccRating: '1800',
        model: 'CL',
        bodyType: 'BDYT147',
        sumInsured: config.region === 'Jamaica' ? '5000000' : '70000',
        sizeClass: 'SETRAIL',
        businessUse: 'OwnGoods',
        writtenOffIndicator: 'No'
    };

    const createdPolicy = await startCommercialPolicyForBilling(
        page,
        ratingPage,
        customerPage,
        policyPage,
        commercialPolicyPage,
        options
    );

    await commercialPolicyPage.selectLOBs({
        commercialAuto: true,
        property: false,
        liability: false,
        businessAuto: true,
        autoDealers: true,
        garageKeepers: true,
        structure: false,
        personalProperty: false,
        businessIncome: false,
        premisesOperations: false,
        productsOperations: false
    });
    await commercialPolicyPage.addRiskLocation(
        config.region,
        '12 Hope Road',
        config.parish
    );


    await commercialPolicyPage.navigateToCommercialAuto();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.addDriver(driverDetails);
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.addCoverageAddress(coverageAddressDetails);
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.addVehicle(vehicleDetails);
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.selectCommercialAutoPlan({
        coverageType: 'Commercial Car Comprehensive'
    });

    const policy = await ratePurchaseAndCollectCommercialPolicy(
        ratingPage,
        policyPage,
        commercialPolicyPage,
        createdPolicy,
        options
    );

    return {
        ...policy,
        vehicleDetails
    };
}

export async function createCommercialPropertyPolicyForBilling(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    commercialPolicyPage: CommercialPolicyPage,
    options: PolicyBillingOptions = {}
): Promise<BillingCapabilityPolicy> {
    const config = getRegionConfig(options);
    const structureCoverageDetails: StructureCoverageDetails = {
        deductible: '0.02',
        addRemoveReason: 'CLIENT_REQUEST',
        limitAmount: config.region === 'Jamaica' ? '8000000' : '8000',
        ratingType: 'Class',
        causeOfLoss: 'CLAR',
        agreedValueOption: 'Yes',
        coinsurance: '100'
    };
    const createdPolicy = await startCommercialPolicyForBilling(
        page,
        ratingPage,
        customerPage,
        policyPage,
        commercialPolicyPage,
        options
    );

    await commercialPolicyPage.selectLOBs({
        commercialAuto: false,
        property: true,
        liability: false,
        businessAuto: false,
        autoDealers: false,
        garageKeepers: false,
        structure: true,
        personalProperty: false,
        businessIncome: false,
        premisesOperations: false,
        productsOperations: false
    });
    await commercialPolicyPage.addRiskLocation(
        config.region,
        '12 Hope Road',
        config.parish
    );
    await commercialPolicyPage.addStructure({
        structureDescription: 'Test Structure',
        constructionType: 'Concrete Block',
        roofType: 'Metal Sheeting'
    });
    await commercialPolicyPage.addOccupancy({
        occupancyDescription: 'Office Operations',
        occupantName: 'John Smith'
    });

    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.addStructureCoverage(structureCoverageDetails);
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    return await ratePurchaseAndCollectCommercialPolicy(
        ratingPage,
        policyPage,
        commercialPolicyPage,
        createdPolicy,
        options
    );
}

export async function createCommercialLiabilityPolicyForBilling(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    commercialPolicyPage: CommercialPolicyPage,
    options: PolicyBillingOptions = {}
): Promise<BillingCapabilityPolicy> {
    const config = getRegionConfig(options);
    const liabilityLimits: LiabilityLimitDetails = {
        generalAggregateLimit: '2000000',
        eachOccurrenceLimit: '1000000'
    };
    const createdPolicy = await startCommercialPolicyForBilling(
        page,
        ratingPage,
        customerPage,
        policyPage,
        commercialPolicyPage,
        options
    );

    await commercialPolicyPage.selectLOBs({
        commercialAuto: false,
        property: false,
        liability: true,
        businessAuto: false,
        autoDealers: false,
        garageKeepers: false,
        structure: false,
        personalProperty: false,
        businessIncome: false,
        premisesOperations: true,
        productsOperations: true
    });
    await commercialPolicyPage.addRiskLocation(
        config.region,
        '12 Hope Road',
        config.parish
    );
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.addLiabilityLimits(liabilityLimits);
    await commercialPolicyPage.addLiabilityClassInformation({
        payrollAmount: '500000'
    });

    return await ratePurchaseAndCollectCommercialPolicy(
        ratingPage,
        policyPage,
        commercialPolicyPage,
        createdPolicy,
        options
    );
}

async function startCommercialPolicyForBilling(
    page: Page,
    ratingPage: RatingPage,
    customerPage: CustomerPage,
    policyPage: PolicyPage,
    commercialPolicyPage: CommercialPolicyPage,
    options: PolicyBillingOptions = {}
): Promise<Pick<BillingCapabilityPolicy, 'customerId' | 'customerName'>> {
    const config = getRegionConfig(options);
    const customer = await customerPage.createNewCustomer(40, config.region);

    await ratingPage.startQuote('Commercial Lines', 'Commercial (Preconfigured)');
    await ratingPage.selectPolicyCounty(config.region);
    if (config.region === 'Jamaica') {
        await ratingPage.selectBranch('Head Office - Kingston');
    }
    await page
        .locator('#policyDataGatherForm\\:sedit_Policy_currencyCd')
        .selectOption(config.currency);
    await setPolicyEffectiveDate(ratingPage, options);
    await policyPage.page.waitForTimeout(5000)
    await policyPage.checkPremiumFincancing('No');
    await ratingPage.headerNextButton.click();
    await closePartySearchPopupIfVisible(ratingPage.page);
    await commercialPolicyPage.fillInsuredDetails(customer.customerName);

    return {
        customerId: customer.customerId,
        customerName: customer.customerName
    };
}

async function ratePurchaseAndCollectCommercialPolicy(
    ratingPage: RatingPage,
    policyPage: PolicyPage,
    commercialPolicyPage: CommercialPolicyPage,
    createdPolicy: Pick<BillingCapabilityPolicy, 'customerId' | 'customerName'>,
    options: PolicyBillingOptions = {}
): Promise<BillingCapabilityPolicy> {
    const config = getRegionConfig(options);
    await commercialPolicyPage.navigateToTab('Premium');
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.clickRateButton();
    await policyPage.waitForLoadingSpinner();
    await expect(await commercialPolicyPage.getOverallPremiumSummary())
        .toBeTruthy();
    await commercialPolicyPage.navigateToFundingSummary();
    await policyPage.waitForLoadingSpinner();
    await commercialPolicyPage.fundingSummary();
    await policyPage.purchaseButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await ratingPage.finishPayment({
        billingAccountName: createdPolicy.customerName,
        city: config.city,
        paymentBranch: config.paymentBranch
    });

    const policyDetails = await commercialPolicyPage.getPolicyDetails();

    expect(policyDetails.policyNumber).toBeTruthy();
    const policyStatus = await ratingPage.expectActivePolicyStatus();

    return {
        customerId: createdPolicy.customerId,
        customerName: createdPolicy.customerName,
        policyNumber: normalizePolicyNumber(policyDetails.policyNumber),
        policyStatus
    };
}
