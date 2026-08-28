import { expect, Locator, Page } from '@playwright/test';
import { faker, th } from '@faker-js/faker';
import { BasePage } from './BasePage';
import { CustomerPage } from './CustomerPage';
import { PolicyPage } from './PolicyPage';
import { jamaicaPaymentPlans, interestRateDefaults, getRandomAdditionalInterestNameValue, excessLimitOptions } from '../data/RatingData';
import { getLicenseDates } from '../../../lib/utils';
import { waitForBarbadosLoadingSpinner, closePartySearchPopupIfVisible } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export type CreatedPolicyDetails = {
    customerName: string;
    customerId: string;
    policyNumber: string;
    policyStatus: string;
    premiumAmount: number;
};

export type BarbadosPrivateMotorPolicyOptions = {
    customerAge?: number;
    insuredCompany?: string;
    coverageType?: string;
    billingCity?: string;
    vehicle?: {
        year: string;
        make: string;
        model: string;
        performance: string;
        bodyType: string;
        sumInsured: string;
        country: string;
        address: string;
        parish: string;
        ccRating: string;
        chassisVIN: string;
    };
};

export class RatingPage extends BasePage {
    // Navigation elements
    readonly quoteLink: Locator;

    // Insured Party elements
    readonly insuredGenderField: Locator;

    // Driver elements
    readonly relationShipSelection: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly trnField: Locator;

    readonly dobField: Locator;
    readonly genderField: Locator;

    readonly driverCountryDropdown: Locator;
    readonly driverAddressLine1Field: Locator;
    readonly driverParishDropdown: Locator;

    readonly licenseNumberField: Locator;
    readonly dateFirstLicensedField: Locator;
    readonly licenseCountryDropdown: Locator;

    // Vehicle elements
    readonly addNewVehicleButton: Locator;
    readonly modelYearField: Locator;
    readonly makeField: Locator;
    readonly modelField: Locator;
    readonly performanceField: Locator;
    readonly bodyTypeField: Locator;
    readonly sumInsuredField: Locator;
    readonly vehicleWrittenOffNoRadio: Locator;
    readonly vehicleWrittenOffYesRadio: Locator;
    readonly vehicleCountryField: Locator;
    readonly vehicleAddressLine1Field: Locator;
    readonly vehicleParishField: Locator;
    readonly vehicleAdditionalSecurityDropdown: Locator;
    readonly ccRatingField: Locator;
    readonly changeDriverInfoButtons: Locator;
    readonly vehiclesDropdown: Locator;
    readonly firstVehicleInList: Locator;
    readonly secondVehicleInList: Locator;

    // Coverage elements
    readonly coverageTypeField: Locator;
    readonly calculatePremiumButton: Locator;
    readonly planSelection: Locator;
    readonly rentalCarTypeDropdown: Locator;
    readonly bcicAssistLevelDropdown: Locator;

    // Add selectors for Bodily Injury and Property Damage limits
    readonly bodilyInjuryLimitDropdown: Locator;
    readonly propertyDamageLimitDropdown: Locator;

    // Payment and funding elements
    readonly paymentPlanField: Locator;
    readonly fundingTab: Locator;
    readonly interestRateField: Locator;
    readonly minInterestField: Locator;
    readonly totalStampDutyField: Locator;
    readonly additionalStampDutyField: Locator;

    // Additional funding summary fields
    readonly netPremiumField: Locator;
    readonly taxPremiumGCTField: Locator;
    readonly totalPremiumField: Locator;
    readonly endorsementApRpField: Locator;
    readonly depositField: Locator;
    readonly financeChargeField: Locator;
    readonly totalDueField: Locator;
    readonly monthlyInstallmentField: Locator;
    readonly addedRemovedFinanceChargeField: Locator;

    // Premium table elements
    readonly termPremiumCell: Locator;
    readonly actualPremiumCell: Locator;
    readonly adjustedPremiumCell: Locator;
    readonly taxesCell: Locator;
    readonly feesCell: Locator;
    readonly billablePremiumCell: Locator;
    readonly apRpCell: Locator;
    readonly calculatedCommissionCell: Locator;
    readonly commissionRateCell: Locator;

    // Business Use Questionnaire
    readonly businessUseQuestionnaireRadio: (yesNoIndex: 0 | 1) => Locator;
    readonly salesOrCommercialTravelingRadio: (yesNoIndex: 0 | 1) => Locator;

    // Memberships & Affiliations
    readonly membershipAddButton: Locator;
    readonly membershipOrgDropdown: Locator;
    readonly membershipNoField: Locator;
    readonly membershipRemoveButton: Locator;

    // Remove Membership Confirmation
    readonly removeMembershipConfirmPopup: Locator;
    readonly removeMembershipConfirmYesButton: Locator;
    readonly removeMembershipConfirmNoButton: Locator;

    // Additional Interest elements
    readonly addNewAdditionalInterestButton: Locator;
    readonly removeAdditionalInterestButton: Locator;
    readonly interestTypeDropdown: Locator;
    readonly additionalInterestNameField: Locator;
    readonly additionalInterestCountryDropdown: Locator;
    readonly additionalInterestAddressLine1Field: Locator;
    readonly additionalInterestParishDropdown: Locator;

    constructor(page: Page) {
        super(page); // Call base class constructor

        // Initialize navigation elements
        this.quoteLink = page.getByRole('link', { name: 'Quote' });

        // Initialize insured party locators
        this.insuredGenderField = page.locator('select#policyDataGatherForm\\:sedit_PreconfigInsuredPersonInfoProxy_person_gender');

        // Initialize driver locators        
        this.changeDriverInfoButtons = page.locator('#policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriver_data td.change_column a');
        this.relationShipSelection = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriver_driverRelToApplicantCd');
        this.firstNameField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonInfoProxy_person_nameInfo_firstName');
        this.lastNameField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonInfoProxy_person_nameInfo_lastName');
        this.trnField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonInfoProxy_person_trn');
        this.dobField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonInfoProxy_person_dateOfBirthInputDate');
        this.genderField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonInfoProxy_person_gender');
        this.driverCountryDropdown = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonAddressContactProxy_addressEntity_address_countryCd');
        this.driverAddressLine1Field = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonAddressContactProxy_addressEntity_address_addressLine1');
        this.driverParishDropdown = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverPersonAddressContactProxy_addressExtension_parishCd');

        this.licenseNumberField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_licensePermitNumber');
        this.dateFirstLicensedField = page.locator('input[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_licensedDtInputDate"]');

        this.licenseCountryDropdown = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_countryCd');

        // Initialize vehicle locators
        this.addNewVehicleButton = page.getByRole('button', { name: 'Add New Vehicle' });
        this.modelYearField = page.getByLabel('Model Year');
        this.makeField = page.getByLabel('Make', { exact: true });
        this.modelField = page.getByLabel('Model', { exact: true });
        this.performanceField = page.getByLabel('Performance');
        this.bodyTypeField = page.locator('#policyDataGatherForm\\:sedit_PreconfigVehicle_baseInfo_vehBodyTypeCd');
        this.sumInsuredField = page.getByRole('textbox', { name: 'Sum Insured *' });
        this.vehicleWrittenOffNoRadio = page.getByRole('row', { name: 'Has this vehicle ever been written off? * Yes No', exact: true }).getByLabel('No');
        this.vehicleWrittenOffYesRadio = page.getByRole('row', { name: 'Has this vehicle ever been written off? * Yes No', exact: true }).getByLabel('Yes');
        this.vehicleCountryField = page.locator('#policyDataGatherForm\\:sedit_VehicleGaragingAddressInfo_address_countryCd');
        this.vehicleAddressLine1Field = page.locator('#policyDataGatherForm\\:sedit_VehicleGaragingAddressInfo_address_addressLine1');
        this.vehicleParishField = page.locator('#policyDataGatherForm\\:sedit_VehicleGaragingAddressInfo_address_addressExtension_parishCd');
        this.vehicleAdditionalSecurityDropdown = page.locator('#policyDataGatherForm\\:sedit_VehicleFeatureComponent_baseInfo_securityOptionsCd');
        this.ccRatingField = page.locator('input[id="policyDataGatherForm\\:sedit_PreconfigVehicle_baseInfo_engineSize"]');
        this.vehiclesDropdown = page.locator('#policyDataGatherForm\\:pathContextElement_PreconfigVehicle0');
        this.firstVehicleInList = page.locator('#policyDataGatherForm\\:items0_0');
        this.secondVehicleInList = page.locator('#policyDataGatherForm\\:items0_1');

        // Initialize coverage locators
        this.coverageTypeField = page.getByLabel('Coverage Type');
        this.calculatePremiumButton = page.locator('input[value="Calculate Premium"]');
        this.planSelection = page.locator('#policyDataGatherForm\\:sedit_BcicPackageManager_packageCd');
        this.rentalCarTypeDropdown = page.locator('#policyDataGatherForm\\:sedit_BcicRentalBenefits_coverLevelCd');
        this.bcicAssistLevelDropdown = page.locator('#policyDataGatherForm\\:sedit_BcicAssist_coverLevelCd');

        // Initialize Bodily Injury and Property Damage limit locators
        this.bodilyInjuryLimitDropdown = page.locator('select#policyDataGatherForm\\:sedit_PreconfigVehicleBICoverage_combinedLimitAmount');
        this.propertyDamageLimitDropdown = page.locator('select#policyDataGatherForm\\:sedit_PreconfigVehiclePDCoverage_limitAmount');

        // Initialize payment and funding locators
        this.paymentPlanField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_paymentPlanCd');
        this.fundingTab = page.getByRole('link', { name: 'Funding Summary' });
        this.interestRateField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_interestRate');
        this.minInterestField = page.getByRole('textbox', { name: 'Minimum Interest' });
        this.totalStampDutyField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalStampDuty');
        this.additionalStampDutyField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_additionalStampDuty');

        // Initialize additional funding summary locators
        this.netPremiumField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_netPremium');
        this.taxPremiumGCTField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_taxPremium');
        this.totalPremiumField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalPremium');
        this.endorsementApRpField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_endorsementApRp');
        this.depositField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_deposit');
        this.financeChargeField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_financeCharge');
        this.totalDueField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalDue');
        this.monthlyInstallmentField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_monthlyInstallment');
        this.addedRemovedFinanceChargeField = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_addedRemovedFinanceCharge');

        // Initialize premium table locators
        this.termPremiumCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(4)');
        this.actualPremiumCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(5)');
        this.adjustedPremiumCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(6)');
        this.taxesCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(7)');
        this.feesCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(8)');
        this.billablePremiumCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(9)');
        this.apRpCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(10)');
        this.calculatedCommissionCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(11)');
        this.commissionRateCell = page.locator('[id="policyDataGatherForm:premiumTable_policyPremiumInfoTable"] tfoot>tr>td:nth-child(12)');

        // Business Use Questionnaire
        this.businessUseQuestionnaireRadio = (yesNoIndex: 0 | 1) =>
            page.locator(`#policyDataGatherForm\\:sedit_PreconfigViewBuzUseQuestQuestionAnswer_yesNoAnswer\\:${yesNoIndex}`);
        this.salesOrCommercialTravelingRadio = (yesNoIndex: 0 | 1) =>
            page.locator(`#policyDataGatherForm\\:sedit_PreconfigBCICSalesQuestionAnswer_yesNoAnswer\\:${yesNoIndex}`);

        // Memberships & Affiliations
        this.membershipAddButton = page.locator('#policyDataGatherForm\\:addPreconfigMembership');
        this.membershipOrgDropdown = page.locator('#policyDataGatherForm\\:sedit_PreconfigMembership_organizationCd');
        this.membershipNoField = page.locator('#policyDataGatherForm\\:sedit_PreconfigMembership_membershipNo');
        this.membershipRemoveButton = page.locator('#policyDataGatherForm\\:eliminatePreconfigMembership');

        // Remove Membership Confirmation
        this.removeMembershipConfirmPopup = page.locator('#confirmEliminateInstance_Dialog_container');
        this.removeMembershipConfirmYesButton = page.locator('#confirmEliminateInstance_Dialog_form\\:buttonYes');
        this.removeMembershipConfirmNoButton = page.locator('#confirmEliminateInstance_Dialog_form\\:buttonNo');

        // Initialize additional interest locators
        this.addNewAdditionalInterestButton = page.locator('input#policyDataGatherForm\\:addPreconfigAutoAdditionalInterest');
        this.removeAdditionalInterestButton = page.locator('input#policyDataGatherForm\\:eliminatePreconfigAutoAdditionalInterest');
        this.interestTypeDropdown = page.locator('select#policyDataGatherForm\\:sedit_PreconfigAutoAdditionalInterest_interestTypeCd');
        this.additionalInterestNameField = page.locator('select#policyDataGatherForm\\:sedit_PreconfigAutoAdditionalInterest_name');
        this.additionalInterestCountryDropdown = page.locator('select#policyDataGatherForm\\:sedit_PreconfigAddressContact_AutoVehicle_address_countryCd');
        this.additionalInterestAddressLine1Field = page.locator('input#policyDataGatherForm\\:sedit_PreconfigAddressContact_AutoVehicle_address_addressLine1');
        this.additionalInterestParishDropdown = page.locator('select#policyDataGatherForm\\:sedit_PreconfigAddressContact_AutoVehicle_address_addressExtension_parishCd');
    }

    async login(username: string, password: string) {
        await this.loginPage.goto();
        await this.loginPage.login(username, password);
        await this.loginPage.expectCorrectLoginRedirect();
        await waitForBarbadosLoadingSpinner(this);
    }

    async addNewDriver(driverDetails: {
        firstName: string,
        lastName: string,
        relationship: string,
        type: string,
        trn: string,
        dob: string,
        gender: string,
        address: string,
        parish: string,
        country: string,
        license: {
            type: string,
            dateFirstLicensed: string,
            issueDate?: string,
            expiryDate?: string,
            number: string,
            country: string,
            status: string
        }
    }) {

        await waitForBarbadosLoadingSpinner(this);
        // fill driver information
        await this.driverPartySelection.selectOption({value: 'NEW_PERSON'});
        await waitForBarbadosLoadingSpinner(this);

        await this.relationShipSelection.selectOption({label: driverDetails.relationship});
        await waitForBarbadosLoadingSpinner(this);

        await this.driverTypeSelection.selectOption({label: driverDetails.type});
        await waitForBarbadosLoadingSpinner(this);

        await this.page.waitForTimeout(500);

        await this.trnField.fill(driverDetails.trn);
        await waitForBarbadosLoadingSpinner(this);

        await this.dobField.fill(driverDetails.dob);
        await waitForBarbadosLoadingSpinner(this);

        await this.genderField.selectOption({label: driverDetails.gender});
        await waitForBarbadosLoadingSpinner(this);

        await this.firstNameField.fill(driverDetails.firstName);
        await waitForBarbadosLoadingSpinner(this);

        await this.lastNameField.fill(driverDetails.lastName);
        await waitForBarbadosLoadingSpinner(this);

        await this.driverCountryDropdown.selectOption({value: driverDetails.country});
        await waitForBarbadosLoadingSpinner(this);
        await closePartySearchPopupIfVisible(this.page);

        await this.driverAddressLine1Field.fill(driverDetails.address);
        await waitForBarbadosLoadingSpinner(this);
        await closePartySearchPopupIfVisible(this.page);

        await this.driverParishDropdown.selectOption({label: driverDetails.parish});
        await waitForBarbadosLoadingSpinner(this);

        // fill in License Information
        await this.licenseCountryDropdown.selectOption({value: driverDetails.license.country});
        await waitForBarbadosLoadingSpinner(this);

        let issueDate: string;
        let expiryDate: string;
        if (driverDetails.license.issueDate && driverDetails.license.expiryDate) {
            issueDate = driverDetails.license.issueDate;
            expiryDate = driverDetails.license.expiryDate;
        } else {
            const licenseDates = getLicenseDates();
            issueDate = licenseDates.issueDate;
            expiryDate = licenseDates.expiryDate;
        }
        await this.licenseIssueDate.fill(issueDate);
        await waitForBarbadosLoadingSpinner(this);

        await this.licenseExpirationDate.fill(expiryDate);
        await waitForBarbadosLoadingSpinner(this);

        await this.licenseStatusField.selectOption({label: driverDetails.license.status});
        await waitForBarbadosLoadingSpinner(this);

        await this.licenseTypeField.selectOption({label: driverDetails.license.type});
        await waitForBarbadosLoadingSpinner(this);

        await this.dateFirstLicensedField.fill(driverDetails.license.dateFirstLicensed);
        await waitForBarbadosLoadingSpinner(this);

        await this.licenseNumberField.fill(driverDetails.license.number);
        await waitForBarbadosLoadingSpinner(this);
    }

    async addNewVehicle(vehicleDetails: {
        year: string,
        make: string,
        model: string,
        performance: string,
        bodyType: string,
        sumInsured: string,
        country: string,
        address: string,
        parish: string,
        ccRating?: string,
        chassisVIN?: string,
        writtenOff?: boolean
    }) {
        
        await this.addNewVehicleButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(5000);
        await this.modelYearField.selectOption(vehicleDetails.year);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(2000);

        const normalizedMake = vehicleDetails.make.trim().toLowerCase();
        const makeOptionValue = await this.makeField.locator('option').evaluateAll(
            (options, expectedMake) => {
                const matchingOption = options.find(option => {
                    const htmlOption = option as HTMLOptionElement;
                    const label = htmlOption.label.trim().toLowerCase();
                    const text = htmlOption.textContent?.trim().toLowerCase();
                    const value = htmlOption.value.trim().toLowerCase();

                    return label === expectedMake ||
                        text === expectedMake ||
                        value === expectedMake;
                }) as HTMLOptionElement | undefined;

                return matchingOption?.value ?? null;
            },
            normalizedMake
        );

        if (!makeOptionValue) {
            throw new Error(
                `Vehicle make "${vehicleDetails.make}" is not available in the dropdown`
            );
        }

        await this.makeField.selectOption(makeOptionValue);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(2000);
        await closePartySearchPopupIfVisible(this.page);
        await this.modelField.selectOption(vehicleDetails.model);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(2000);
        await closePartySearchPopupIfVisible(this.page);
        
        if (vehicleDetails.ccRating) {
            await this.ccRatingField.fill(vehicleDetails.ccRating);
            await this.ccRatingField.press('Tab');
            await waitForBarbadosLoadingSpinner(this);
        }

        await this.page.waitForTimeout(2000);
        await this.performanceField.selectOption(vehicleDetails.performance);
        await waitForBarbadosLoadingSpinner(this);
        await this.bodyTypeField.selectOption(vehicleDetails.bodyType);

        await waitForBarbadosLoadingSpinner(this);        await this.bodyTypeField.selectOption(vehicleDetails.bodyType);
        await waitForBarbadosLoadingSpinner(this);

        if (vehicleDetails.chassisVIN) {
            await this.page.waitForTimeout(1000);
            await this.vehicleChassisVINField.fill(vehicleDetails.chassisVIN);
            await this.page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(this);
        }

        await this.page.waitForTimeout(1000);
        await this.sumInsuredField.fill(vehicleDetails.sumInsured);
        await this.page.keyboard.press('Enter');
        await closePartySearchPopupIfVisible(this.page);
        await waitForBarbadosLoadingSpinner(this);

        if (vehicleDetails.writtenOff ?? false) {
            await this.vehicleWrittenOffYesRadio.check();
        } else {
            await this.vehicleWrittenOffNoRadio.check();
        }

        await waitForBarbadosLoadingSpinner(this);
        await this.vehicleCountryField.scrollIntoViewIfNeeded();
        await this.vehicleCountryField.selectOption(vehicleDetails.country);
        await waitForBarbadosLoadingSpinner(this);
        await closePartySearchPopupIfVisible(this.page);
        await this.vehicleAddressLine1Field.scrollIntoViewIfNeeded();
        await this.vehicleAddressLine1Field.fill(vehicleDetails.address);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);
        await closePartySearchPopupIfVisible(this.page);
        await waitForBarbadosLoadingSpinner(this);
        await closePartySearchPopupIfVisible(this.page);
        await this.vehicleParishField.scrollIntoViewIfNeeded();
        await this.vehicleParishField.selectOption({ label: vehicleDetails.parish });
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyPremiumValuesAreZero() {

        const isPremiumVisible =
            await this.termPremiumCell.isVisible();

        if (!isPremiumVisible) {

            throw new Error(
                'Premium table not visible. Possible navigation to Vehicle page.'
            );
        }

        const termText =
            (await this.termPremiumCell.textContent())
                ?.trim();

        const actualText =
            (await this.actualPremiumCell.textContent())
                ?.trim();
        const billableText =
            (await this.billablePremiumCell.textContent())
                ?.trim();

        expect(['JMD0.00', 'BBD0.00'])
            .toContain(termText);

        expect(['JMD0.00', 'BBD0.00'])
            .toContain(actualText);

        expect(['JMD0.00', 'BBD0.00'])
            .toContain(billableText);
    }

    async verifyPremiumValuesArePopulated() {
        const termText = (await this.termPremiumCell.textContent())?.trim();
        const actualText = (await this.actualPremiumCell.textContent())?.trim();
        const billableText = (await this.billablePremiumCell.textContent())?.trim();
        expect(['JMD0.00', 'BBD0.00']).not.toContain(termText);
        expect(['JMD0.00', 'BBD0.00']).not.toContain(actualText);
        expect(['JMD0.00', 'BBD0.00']).not.toContain(billableText);
    }

    async createBarbadosPrivateMotorPolicy(
        customerPage: CustomerPage,
        policyPage: PolicyPage,
        options: BarbadosPrivateMotorPolicyOptions = {}
    ): Promise<CreatedPolicyDetails> {
        const {
            customerAge = 40,
            insuredCompany = 'Trident Insurance Company Limited',
            coverageType = 'Comprehensive',
            billingCity = 'Test City',
            vehicle = {
                year: '2024',
                make: 'Audi',
                model: 'A4',
                performance: 'A',
                bodyType: 'Sedan',
                sumInsured: '100000',
                country: 'Barbados',
                address: '123 Test Street',
                parish: 'St. Michael',
                ccRating: faker.number.int({
                    min: 1000,
                    max: 5000
                }).toString(),
                chassisVIN: faker.vehicle.vin()
            }
        } = options;

        const customer = await customerPage.createNewCustomer(
            customerAge,
            'Barbados'
        );

        await this.startNewQuote();
        await this.selectPolicyCounty('Barbados');
        await policyPage.checkPremiumFincancing('No');
        await this.headerNextButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectInsuredParty(customer.customerName, insuredCompany);
        await this.goToNextTab('Driver');
        await this.selectExistingDriver(
            customer.customerName,
            'Permanent',
            'Valid'
        );

        await this.clickVehicleTab();
        await this.addNewVehicle(vehicle);

        await this.clickPremiumsAndCoveragesTab();
        await this.setCoverageAndPlan(coverageType);
        await this.calculatePremium();
        const premiumAmount = await this.getPremiumValue();

        await this.clickFundingSummaryTab();
        await policyPage.purchaseButton.click();
        await policyPage.handlePurchasePolicyConfirmation(true);
        await this.finishPayment({
            billingAccountName: customer.customerName,
            city: billingCity
        });

        const policyNumber =
            ((await policyPage.policyNumberText.textContent()) || '')
                .replace('#', '')
                .trim();
        const policyStatus =
            (
                await this.page
                    .locator(
                        '#productContextInfoForm\\:policyDetail_policyStatusCdText'
                    )
                    .textContent()
            )?.trim() || '';

        expect(policyNumber).toMatch(/^P\d+$/);
        expect(policyStatus).toBe('Policy Active');

        return {
            customerName: customer.customerName,
            customerId: customer.customerId,
            policyNumber,
            policyStatus,
            premiumAmount
        };
    }

    async setCoverageAndPlan(
        coverageType: string,
        plan?: string
    ) {

        await this.page.waitForTimeout(1000);

        await this.coverageTypeField.selectOption(
            coverageType
        );

        await waitForBarbadosLoadingSpinner(this);


        if (plan) {

            await waitForBarbadosLoadingSpinner(this);

            await this.planSelection.selectOption(
                plan
            );

            await waitForBarbadosLoadingSpinner(this);

        }

        await this.termPremiumCell.waitFor({
            state: 'visible',
            timeout: 10000
        });

        // Verify values are zero before calculation
        await this.verifyPremiumValuesAreZero();
    }

    async calculatePremium(options: { excessLimitOption?: string } = {}) {
        // 
        await this.page.waitForTimeout(7000);
        await this.addRequiredFieldsForPremiumCalculation(
            options.excessLimitOption
        );
        await this.page.waitForTimeout(1000);
        await waitForBarbadosLoadingSpinner(this);
        await this.ensureBcicAssistLevelIsValid();
        await this.calculatePremiumButton.click({ timeout: 120_000 });
        await waitForBarbadosLoadingSpinner(this);
    }


    async addRequiredFieldsForPremiumCalculation(
        excessLimitOption?: string
    ) {


        // =====================================================
        // EXCESS LIMIT SECTION
        // =====================================================


        const isExcessLimitVisible =
            await this.excessLimitField.isVisible();

        //     `Excess Limit field visible status: ${isExcessLimitVisible}`
        // );

        if (isExcessLimitVisible) {


            // Barbados option value
            const barbados25 =
                excessLimitOptions['2_5pct_min1500_bbd'].value;

            //     `Fetched Barbados Excess Option Value: ${barbados25}`
            // );

            // Jamaica Standard option value
            const jamaicaStandardOption =
                excessLimitOptions['2_5pct_min15k_max250k'].value;

            //     `Fetched Jamaica Standard Excess Option Value: ${jamaicaStandardOption}`
            // );

            //     'Checking whether Barbados option exists in dropdown...'
            // );

            const barbadosOptionLocator =
                this.excessLimitField.locator(
                    `option[value="${barbados25}"]`
                );

            const hasBarbados =
                await barbadosOptionLocator.count();

            //     `Barbados option count found in dropdown: ${hasBarbados}`
            // );

            // =====================================================
            // BARBADOS LOGIC
            // =====================================================

            if (hasBarbados > 0) {

                //     'Barbados policy detected'
                // );

                //     `Selecting Barbados Excess Value: ${barbados25}`
                // );

                await this.excessLimitField.selectOption(
                    barbados25
                );

                //     `Successfully selected Barbados Excess Value: ${barbados25}`
                // );

                //     'Waiting for loading spinner after Barbados Excess selection...'
                // );

                await waitForBarbadosLoadingSpinner(this);

                //     'Loading spinner completed after Barbados Excess selection'
                // );

            } else {

                // =====================================================
                // JAMAICA LOGIC
                // =====================================================

                //     'Jamaica policy detected'
                // );

                const selectedPlanText =
                    await this.page.locator(
                        '#policyDataGatherForm\\:sedit_BcicPackageManager_packageCd'
                    ).locator('option:checked')
                        .textContent();

                //     'Selected Plan Text:',
                //     selectedPlanText
                // );

                // =====================================================
                // DIAMOND PLAN LOGIC
                // =====================================================

                if (
                    selectedPlanText?.includes('Diamond')
                ) {

                    //     'Diamond plan detected'
                    // );

                    //     'Fetching all available excess options for Diamond plan...'
                    // );

                    const availableOptions =
                        await this.excessLimitField
                            .locator('option')
                            .evaluateAll(options =>
                                options.map(option => {

                                    const htmlOption =
                                        option as HTMLOptionElement;

                                    return {
                                        value: htmlOption.value,
                                        text: htmlOption.textContent,
                                        selected: htmlOption.selected
                                    };
                                })
                            )

                    //     'Available Diamond Excess Options:',
                    //     JSON.stringify(
                    //         availableOptions,
                    //         null,
                    //         2
                    //     )
                    // );

                    // Get currently selected option
                    const selectedOption =
                        availableOptions.find(
                            option => option.selected
                        );

                    //     'Currently selected Diamond Excess Option:',
                    //     selectedOption
                    // );

                    // If already selected by application
                    if (selectedOption?.value) {

                        //     `Diamond plan already has selected value: ${selectedOption.value}`
                        // );

                        //     'Skipping manual excess selection for Diamond plan'
                        // );

                    } else {

                        // Fallback
                        const firstValidOption =
                            availableOptions.find(
                                option => option.value !== ''
                            );

                        //     'First Valid Diamond Excess Option:',
                        //     firstValidOption
                        // );

                        const firstOptionValue =
                            firstValidOption?.value;

                        //     `Selecting valid Diamond option: ${firstOptionValue}`
                        // );

                        //     `No selected option found. Selecting first available option: ${firstOptionValue}`
                        // );

                        if (firstOptionValue) {

                            await this.excessLimitField.selectOption(
                                firstOptionValue
                            );

                            //     `Successfully selected Diamond Excess Value: ${firstOptionValue}`
                            // );

                            //     'Waiting for loading spinner after Diamond Excess selection...'
                            // );

                            await waitForBarbadosLoadingSpinner(this);

                            //     'Loading spinner completed after Diamond Excess selection'
                            // );
                        }
                    }

                } else {

                    // =====================================================
                    // STANDARD PLAN LOGIC
                    // =====================================================

                    //     'Standard plan detected'
                    // );

                    //     `Selecting Jamaica Standard Excess Value: ${jamaicaStandardOption}`
                    // );

                    const preferredExcessValue =
                        excessLimitOption ?? jamaicaStandardOption;
                    const excessOptions = await this.excessLimitField
                        .locator('option')
                        .evaluateAll(options => options.map(option => {
                            const htmlOption = option as HTMLOptionElement;

                            return {
                                value: htmlOption.value,
                                selected: htmlOption.selected
                            };
                        }));
                    const preferredOption = excessOptions.find(
                        option => option.value === preferredExcessValue
                    );
                    const selectedOption = excessOptions.find(
                        option => option.selected && option.value
                    );
                    const firstValidOption = excessOptions.find(
                        option => option.value
                    );
                    const excessValueToUse =
                        preferredOption?.value ??
                        selectedOption?.value ??
                        firstValidOption?.value;

                    if (!excessValueToUse) {
                        throw new Error(
                            'No valid Jamaica excess limit option is available.'
                        );
                    }

                    if (excessValueToUse !== selectedOption?.value) {
                        await this.excessLimitField.selectOption(
                            excessValueToUse
                        );

                        await waitForBarbadosLoadingSpinner(this);
                    }

                    //     `Successfully selected Jamaica Standard Excess Value: ${jamaicaStandardOption}`
                    // );

                    //     'Waiting for loading spinner after Standard Excess selection...'
                    // );

                    //     'Loading spinner completed after Standard Excess selection'
                    // );
                }
            }

        } else {

            //     'Skipping Excess Limit handling because field is not visible'
            // );
        }

        // =====================================================
        // RENTAL CAR TYPE SECTION
        // =====================================================

        //     'Checking visibility of Rental Car Type dropdown...'
        // );

        const isRentalDropdownVisible =
            await this.rentalCarTypeDropdown.isVisible();

        //     `Rental Car Type dropdown visible status: ${isRentalDropdownVisible}`
        // );

        if (isRentalDropdownVisible) {

            //     'Entering Rental Car Type handling block'
            // );

            const rentalOption =
                'Compact Car Rental - One Week';

            //     `Rental Car Type value to be selected: ${rentalOption}`
            // );

            //     'Selecting Rental Car Type dropdown option...'
            // );

            await this.rentalCarTypeDropdown.selectOption(
                rentalOption
            );

            //     `Successfully selected Rental Car Type: ${rentalOption}`
            // );

            //     'Waiting for loading spinner after Rental Car selection...'
            // );

            await waitForBarbadosLoadingSpinner(this);

            //     'Loading spinner completed after Rental Car selection'
            // );

        } else {

            //     'Skipping Rental Car Type handling because dropdown is not visible'
            // );
        }

        // =====================================================
        // BCIC ASSIST LEVEL SECTION
        // =====================================================

        //     'Checking visibility of BCIC Assist Level dropdown...'
        // );

        const isAssistDropdownVisible =
            await this.bcicAssistLevelDropdown.isVisible();

        //     `BCIC Assist Level dropdown visible status: ${isAssistDropdownVisible}`
        // );

        if (isAssistDropdownVisible) {

            //     'Entering BCIC Assist Level handling block'
            // );

            const assistLevel = 'Accident';

            //     `BCIC Assist Level value to be selected: ${assistLevel}`
            // );

            //     'Selecting BCIC Assist Level dropdown option...'
            // );

            await this.bcicAssistLevelDropdown.selectOption(
                assistLevel
            );

            //     `Successfully selected BCIC Assist Level: ${assistLevel}`
            // );

            //     'Waiting for loading spinner after BCIC Assist selection...'
            // );

            await waitForBarbadosLoadingSpinner(this);

            //     'Loading spinner completed after BCIC Assist selection'
            // );

        } else {

            //     'Skipping BCIC Assist Level handling because dropdown is not visible'
            // );
        }

    }


    private async ensureBcicAssistLevelIsValid() {
        const bcicAssistVisible = await this.bcicAssistLevelDropdown.isVisible();
        if (!bcicAssistVisible) {
            return;
        }

        await this.bcicAssistLevelDropdown.scrollIntoViewIfNeeded();

        const selectedValue = (await this.bcicAssistLevelDropdown.inputValue()).trim();
        if (selectedValue === '') {
            await this.bcicAssistLevelDropdown.selectOption('ACCIDENTONLY');
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    async selectPaymentPlan(plan: string) {
        await this.paymentPlanField.selectOption(plan);
        await waitForBarbadosLoadingSpinner(this);
    }

    async selectRentalCarType(type: string) {
        await this.rentalCarTypeDropdown.selectOption(type);
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyInterestRateIsDisplayedCorrectly() {
        // Verify Interest Rate field
        await expect(this.interestRateField).toBeVisible();
        await expect(this.interestRateField).not.toBeEditable();
    }

    async verifyInterestRateAndMinInterestAreZero() {
        // Verify Interest Rate field is zero
        await expect(this.interestRateField).toBeVisible();
        await expect(this.interestRateField).toBeEditable();
        await expect(this.interestRateField).toHaveValue(
            interestRateDefaults.nonFinancing.rate.toString()
        );

        // Verify Minimum Interest field is zero
        await expect(this.minInterestField).toBeVisible();
        await expect(this.minInterestField).toBeEditable();
        await expect(this.minInterestField).toHaveValue(
            interestRateDefaults.nonFinancing.minInterest.toString()
        );
    }

    async getPremiumValue() {
        const actualPremiumText = await this.actualPremiumCell.textContent();        return this.parsePremiumValue(actualPremiumText);
    }

    async verifyPremiumIncreased(previousPremium: number) {
        const currentPremium = await this.getPremiumValue();
        expect(currentPremium).toBeGreaterThan(previousPremium);
        return currentPremium;
    }

    /**
     * Clicks the "Change Driver Info" button at the specified index (0-based).
     * @param index 0 for first button, 1 for second, etc.
     */
    async clickChangeDriverInfoButton(index: number = 0) {
        await this.changeDriverInfoButtons.nth(index).click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Selects the Business Use Questionnaire radio button.
     * @param yesNoIndex 0 for "Yes", 1 for "No"
     */
    async selectBusinessUseQuestionnaire(yesNoIndex: 0 | 1) {
        await this.businessUseQuestionnaireRadio(yesNoIndex).check();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Selects the Sales or Commercial Traveling radio button.
     * @param yesNoIndex 0 for "Yes", 1 for "No"
     */
    async selectSalesOrCommercialTraveling(yesNoIndex: 0 | 1) {
        await this.salesOrCommercialTravelingRadio(yesNoIndex).check();
        await waitForBarbadosLoadingSpinner(this);
    }

    async addMembership(orgCode: string, membershipNo: string) {
        await this.page.waitForTimeout(1000);
        await this.membershipAddButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.membershipOrgDropdown.selectOption(orgCode);
        await waitForBarbadosLoadingSpinner(this);
        await this.membershipNoField.fill(membershipNo);
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(500);
    }

    async handleRemoveMembershipConfirmation(yes: boolean = true) {
        // Wait for the confirmation popup to appear
        await this.removeMembershipConfirmPopup.waitFor({ state: 'visible', timeout: 5000 });
        if (yes) {
            await this.removeMembershipConfirmYesButton.click();
        } else {
            await this.removeMembershipConfirmNoButton.click();
        }
        // Wait for the popup to disappear
        await this.removeMembershipConfirmPopup.waitFor({ state: 'hidden', timeout: 5000 });
        await this.page.waitForTimeout(500);
    }

    async removeMembership() {
        await this.membershipRemoveButton.click();
        await this.handleRemoveMembershipConfirmation();
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(500);
    }

    async removeAllMemberships() {
        // Remove all memberships until none remain (all controls not visible), with a hard stop at 10 loops
        let attempts = 0;
        while ((await this.membershipRemoveButton.isVisible() || await this.membershipOrgDropdown.isVisible() || await this.membershipNoField.isVisible()) && attempts < 10) {
            if (await this.membershipRemoveButton.isVisible()) {
                await this.removeMembership();
            } else {
                // If the remove button is not visible but fields are, break to avoid infinite loop
                break;
            }
            attempts++;
        }
    }

    async getTotalStampDutyValue() {
        const value = await this.totalStampDutyField.inputValue();
        // Remove currency and commas, parse as float
        return parseFloat(value.replace(/^[A-Z]{3}/, '').replace(/,/g, '').trim());
    }

    async selectFirstVehicle() {
        await this.vehiclesDropdown.hover();
        await this.firstVehicleInList.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async selectSecondVehicle() {
        await this.vehiclesDropdown.click();
        await this.secondVehicleInList.waitFor({
            state: 'visible'
        });
        await this.secondVehicleInList.click();

        await waitForBarbadosLoadingSpinner(this);
    }

    async selectVehicle(vehicleText: string) {
        await this.vehiclesDropdown.click();

        const vehicleOption =
            this.page.locator(
                '.rf-ddm-itm-lbl'
            ).filter({
                hasText: vehicleText
            });
        await vehicleOption.waitFor({
            state: 'visible'
        });
        await vehicleOption.click();
        await waitForBarbadosLoadingSpinner(this);
    }
    async getVehiclePremiumFromTable(vehicleIndex: number = 0): Promise<number> {
        // Get the actual premium for a specific vehicle from the premium table
        // vehicleIndex: 0 for first vehicle, 1 for second vehicle, etc.
        const vehicleRow = this.page.locator(`#policyDataGatherForm\\:premiumTable_policyPremiumInfoTable_node_${vehicleIndex}`);
        const actualPremiumCell = vehicleRow.locator('td:nth-child(5) span');
        const actualPremiumText = await actualPremiumCell.textContent();

        if (!actualPremiumText) {
            throw new Error(`No premium found for vehicle at index ${vehicleIndex}`);
        }

        // Remove currency code and commas, then parse as float
        const numericText = actualPremiumText.replace(/^[A-Z]{3}/, '').replace(/,/g, '').trim();
        return parseFloat(numericText);
    }

    async getAdditionalStampDutyValue() {
        const value = await this.additionalStampDutyField.inputValue();
        // Remove currency and commas, parse as float
        return parseFloat(value.replace(/^[A-Z]{3}/, '').replace(/,/g, '').trim());
    }

    /**
     * Adds an additional interest to the vehicle.
     * @param details.name Optional option value for the Name dropdown; if omitted, a random Jamaica lender/institution is chosen.
     */
    async addAdditionalInterest(details: {
        name?: string,
        interestType: string,
        country: string,
        address: string,
        parish: string
    }) {
        await this.addNewAdditionalInterestButton.click();
        await waitForBarbadosLoadingSpinner(this);
        const nameValue = details.name ?? getRandomAdditionalInterestNameValue();
        await this.additionalInterestNameField.selectOption({ value: nameValue });
        await waitForBarbadosLoadingSpinner(this);
        await this.interestTypeDropdown.selectOption({ label: details.interestType });
        await waitForBarbadosLoadingSpinner(this);
        await this.additionalInterestCountryDropdown.selectOption({ label: details.country });
        await closePartySearchPopupIfVisible(this.page);
        await waitForBarbadosLoadingSpinner(this);
        await this.additionalInterestAddressLine1Field.fill(details.address);
        await waitForBarbadosLoadingSpinner(this);
        await this.additionalInterestParishDropdown.selectOption({ label: details.parish });
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Sets the Third Party Bodily Injury Limit.
     * @param value The value to select (e.g., '10000000/10000000', '20000000/20000000')
     */
    async setBodilyInjuryLimit(value: string) {
        await this.bodilyInjuryLimitDropdown.selectOption(value);
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Sets the Third Party Property Damage Limit.
     * @param value The value to select (e.g., '5000000.00', '10000000.00', '20000000.00')
     */
    async setPropertyDamageLimit(value: string) {
        await this.propertyDamageLimitDropdown.selectOption(value);
        await waitForBarbadosLoadingSpinner(this);
    }

    // ========== FUNDING SUMMARY METHODS ==========

    /**
     * Navigates to the Funding Summary tab
     */
    async navigateToFundingSummary() {
        await this.fundingTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Gets the value of any funding summary field
     * @param field The field locator to get value from
     * @returns The numeric value (with currency and commas removed)
     */
    private async getFundingFieldValue(field: Locator): Promise<number> {
        const value = await field.inputValue();
        // Remove currency code and commas, then parse as float
        return parseFloat(value.replace(/^[A-Z]{3}/, '').replace(/,/g, '').trim());
    }

    /**
     * Sets the value of any editable funding summary field
     * @param field The field locator to set value on
     * @param value The value to set
     */
    private async setFundingFieldValue(field: Locator, value: string) {
        await field.clear();
        await field.fill(value);
        await field.press('Tab'); // Trigger any field validation
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Gets all funding summary values as an object
     */
    async getAllFundingSummaryValues() {
        return {
            paymentPlan: await this.paymentPlanField.inputValue(),
            netPremium: await this.getFundingFieldValue(this.netPremiumField),
            taxPremiumGCT: await this.getFundingFieldValue(this.taxPremiumGCTField),
            totalPremium: await this.getFundingFieldValue(this.totalPremiumField),
            totalStampDuty: await this.getFundingFieldValue(this.totalStampDutyField),
            additionalStampDuty: await this.getFundingFieldValue(this.additionalStampDutyField),
            endorsementApRp: await this.getFundingFieldValue(this.endorsementApRpField),
            deposit: await this.getFundingFieldValue(this.depositField),
            interestRate: await this.interestRateField.inputValue(),
            financeCharge: await this.getFundingFieldValue(this.financeChargeField),
            totalDue: await this.getFundingFieldValue(this.totalDueField),
            monthlyInstallment: await this.getFundingFieldValue(this.monthlyInstallmentField),
            addedRemovedFinanceCharge: await this.getFundingFieldValue(this.addedRemovedFinanceChargeField)
        };
    }

    /**
     * Sets the deposit amount
     * @param amount The deposit amount to set
     */
    async setDeposit(amount: string) {
        await this.setFundingFieldValue(this.depositField, amount);
    }

    /**
     * Sets the interest rate
     * @param rate The interest rate percentage to set
     */
    async setInterestRate(rate: string) {
        await this.interestRateField.clear();
        await this.interestRateField.fill(rate);
        await this.interestRateField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Gets the net premium value
     */
    async getNetPremium(): Promise<number> {
        return await this.getFundingFieldValue(this.netPremiumField);
    }

    /**
     * Gets the total premium value
     */
    async getTotalPremium(): Promise<number> {
        return await this.getFundingFieldValue(this.totalPremiumField);
    }

    /**
     * Gets the deposit value
     */
    async getDeposit(): Promise<number> {
        return await this.getFundingFieldValue(this.depositField);
    }

    /**
     * Gets the total due value
     */
    async getTotalDue(): Promise<number> {
        return await this.getFundingFieldValue(this.totalDueField);
    }

    /**
     * Gets the monthly installment value
     */
    async getMonthlyInstallment(): Promise<number> {
        return await this.getFundingFieldValue(this.monthlyInstallmentField);
    }

    /**
     * Gets the finance charge value
     */
    async getFinanceCharge(): Promise<number> {
        return await this.getFundingFieldValue(this.financeChargeField);
    }

    /**
     * Gets the GCT (General Consumption Tax) value
     */
    async getGCT(): Promise<number> {
        return await this.getFundingFieldValue(this.taxPremiumGCTField);
    }

    /**
     * Verifies that funding summary fields are properly calculated
     * @param expectedValues Optional object with expected values to verify
     */
    async verifyFundingSummaryCalculations(expectedValues?: {
        netPremium?: number;
        totalPremium?: number;
        deposit?: number;
        totalDue?: number;
        monthlyInstallment?: number;
    }) {
        const values = await this.getAllFundingSummaryValues();

        if (expectedValues) {
            if (expectedValues.netPremium !== undefined) {
                expect(values.netPremium).toBe(expectedValues.netPremium);
            }
            if (expectedValues.totalPremium !== undefined) {
                expect(values.totalPremium).toBe(expectedValues.totalPremium);
            }
            if (expectedValues.deposit !== undefined) {
                expect(values.deposit).toBe(expectedValues.deposit);
            }
            if (expectedValues.totalDue !== undefined) {
                expect(values.totalDue).toBe(expectedValues.totalDue);
            }
            if (expectedValues.monthlyInstallment !== undefined) {
                expect(values.monthlyInstallment).toBe(expectedValues.monthlyInstallment);
            }
        }

        return values;
    }

    /**
     * Updates funding summary with provided values
     * @param fundingData Object containing funding data to update
     */
    async updateFundingSummary(fundingData: {
        paymentPlan?: string;
        deposit?: string;
        interestRate?: string;
    }) {
        if (fundingData.paymentPlan) {
            await this.selectPaymentPlan(fundingData.paymentPlan);
        }

        if (fundingData.deposit) {
            await this.setDeposit(fundingData.deposit);
        }

        if (fundingData.interestRate) {
            await this.setInterestRate(fundingData.interestRate);
        }
    }

    /**
     * Checks if all required funding summary fields are present and enabled
     */
    async verifyFundingSummaryFieldsAvailability() {
        const fields = {
            paymentPlan: { locator: this.paymentPlanField, required: true },
            netPremium: { locator: this.netPremiumField, required: true },
            taxPremiumGCT: { locator: this.taxPremiumGCTField, required: true },
            totalPremium: { locator: this.totalPremiumField, required: true },
            totalStampDuty: { locator: this.totalStampDutyField, required: false },
            additionalStampDuty: { locator: this.additionalStampDutyField, required: false },
            endorsementApRp: { locator: this.endorsementApRpField, required: false },
            deposit: { locator: this.depositField, required: true },
            interestRate: { locator: this.interestRateField, required: true },
            financeCharge: { locator: this.financeChargeField, required: true },
            totalDue: { locator: this.totalDueField, required: false },
            monthlyInstallment: { locator: this.monthlyInstallmentField, required: false }
        };

        const results: { [key: string]: { visible: boolean; enabled: boolean; required: boolean } } = {};

        for (const [fieldName, fieldInfo] of Object.entries(fields)) {
            const visible = await fieldInfo.locator.isVisible();
            const enabled = visible ? await fieldInfo.locator.isEnabled() : false;

            results[fieldName] = {
                visible,
                enabled,
                required: fieldInfo.required
            };
        }

        return results;
    }

    // ========== PREMIUM SUMMARY METHODS ==========

    /**
     * Extracts numeric value from premium cell text (removes currency and commas)
     * @param cellText The text content from a premium cell
     */
    private parsePremiumValue(cellText: string | null): number {
        if (!cellText) return 0;
        // Remove currency code, commas, and trim whitespace
        const numericText = cellText.replace(/^[A-Z]{3}/, '').replace(/,/g, '').trim();
        return parseFloat(numericText) || 0;
    }

    /**
     * Gets all premium summary totals from the footer row
     */
    async getAllPremiumSummaryTotals() {
        const [termText, actualText, adjustedText, taxesText, feesText, billableText, apRpText, commissionText] = await Promise.all([
            this.termPremiumCell.textContent(),
            this.actualPremiumCell.textContent(),
            this.adjustedPremiumCell.textContent(),
            this.taxesCell.textContent(),
            this.feesCell.textContent(),
            this.billablePremiumCell.textContent(),
            this.apRpCell.textContent(),
            this.calculatedCommissionCell.textContent()
        ]);

        return {
            termPremium: this.parsePremiumValue(termText),
            actualPremium: this.parsePremiumValue(actualText),
            adjustedPremium: this.parsePremiumValue(adjustedText),
            taxes: this.parsePremiumValue(taxesText),
            fees: this.parsePremiumValue(feesText),
            billablePremium: this.parsePremiumValue(billableText),
            apRp: this.parsePremiumValue(apRpText),
            calculatedCommission: this.parsePremiumValue(commissionText)
        };
    }

    /**
     * Gets the AP/RP total from the premium summary table
     */
    async getAPRPTotal(): Promise<number> {
        const apRpText = await this.apRpCell.textContent();
        return this.parsePremiumValue(apRpText);
    }

    /**
     * Gets the taxes total from the premium summary table
     */
    async getTaxesTotal(): Promise<number> {
        const taxesText = await this.taxesCell.textContent();
        return this.parsePremiumValue(taxesText);
    }

    /**
     * Gets the fees total from the premium summary table
     */
    async getFeesTotal(): Promise<number> {
        const feesText = await this.feesCell.textContent();
        return this.parsePremiumValue(feesText);
    }

    /**
     * Gets the calculated commission total from the premium summary table
     */
    async getCalculatedCommissionTotal(): Promise<number> {
        const commissionText = await this.calculatedCommissionCell.textContent();
        return this.parsePremiumValue(commissionText);
    }

    /**
     * Gets the commission rate from the premium summary table footer.
     */
    async getCommissionRateTotal(): Promise<number> {
        const commissionRateText = await this.commissionRateCell.textContent();

        if (!commissionRateText) {
            return 0;
        }

        return parseFloat(commissionRateText.replace('%', '').trim()) || 0;
    }

    /**
     * Verifies the premium summary commission amount and commission rate.
     */
    async verifyCommissionCalculation({
        premiumAmount,
        commissionRate
    }: {
        premiumAmount: number;
        commissionRate: number;
    }): Promise<void> {
        const actualCommission =
            await this.getCalculatedCommissionTotal();
        const actualCommissionRate =
            await this.getCommissionRateTotal();
        const expectedCommission =
            Math.round(
                premiumAmount *
                (commissionRate / 100) *
                100
            ) / 100;

        console.log('\n========== Commission Calculation Details ==========');
        console.log(`Total Premium displayed in UI       : ${premiumAmount.toFixed(2)}`);
        console.log(`Commission percentage displayed UI : ${actualCommissionRate.toFixed(2)}%`);
        console.log(`Calculated commission displayed UI : ${actualCommission.toFixed(2)}`);
        console.log(`Expected calculated commission     : ${expectedCommission.toFixed(2)}`);
        console.log('====================================================\n');

        expect(actualCommissionRate.toFixed(2)).toBe(
            commissionRate.toFixed(2)
        );
        expect(actualCommission.toFixed(2)).toBe(
            expectedCommission.toFixed(2)
        );
    }

    /**
     * Gets the term premium total from the premium summary table
     */
    async getTermPremiumTotal(): Promise<number> {
        const termText = await this.termPremiumCell.textContent();
        return this.parsePremiumValue(termText);
    }

    /**
     * Gets the actual premium total from the premium summary table
     */
    async getActualPremiumTotal(): Promise<number> {
        const actualText = await this.actualPremiumCell.textContent();
        return this.parsePremiumValue(actualText);
    }

    /**
     * Gets the adjusted premium total from the premium summary table
     */
    async getAdjustedPremiumTotal(): Promise<number> {
        const adjustedText = await this.adjustedPremiumCell.textContent();
        return this.parsePremiumValue(adjustedText);
    }

    /**
     * Gets the billable premium total from the premium summary table
     */
    async getBillablePremiumTotal(): Promise<number> {
        const billableText = await this.billablePremiumCell.textContent();
        return this.parsePremiumValue(billableText);
    }

    /**
     * Gets premium values for a specific row (vehicle or policy)
     * @param rowIndex 0 for first vehicle, 1 for policy, etc.
     */
    async getPremiumValuesForRow(rowIndex: number) {
        const row = this.page.locator(`#policyDataGatherForm\\:premiumTable_policyPremiumInfoTable_node_${rowIndex}`);

        const [termText, actualText, adjustedText, taxesText, feesText, billableText, apRpText, commissionText] = await Promise.all([
            row.locator('td:nth-child(4) span').textContent(),
            row.locator('td:nth-child(5) span').textContent(),
            row.locator('td:nth-child(6) span').textContent(),
            row.locator('td:nth-child(7) span').textContent(),
            row.locator('td:nth-child(8) span').textContent(),
            row.locator('td:nth-child(9) span').textContent(),
            row.locator('td:nth-child(10) span').textContent(),
            row.locator('td:nth-child(11) span').textContent()
        ]);

        return {
            termPremium: this.parsePremiumValue(termText),
            actualPremium: this.parsePremiumValue(actualText),
            adjustedPremium: this.parsePremiumValue(adjustedText),
            taxes: this.parsePremiumValue(taxesText),
            fees: this.parsePremiumValue(feesText),
            billablePremium: this.parsePremiumValue(billableText),
            apRp: this.parsePremiumValue(apRpText),
            calculatedCommission: this.parsePremiumValue(commissionText)
        };
    }

    /**
     * Gets premium values for the first vehicle row
     */
    async getVehiclePremiumValues() {
        return await this.getPremiumValuesForRow(0);
    }

    /**
     * Gets premium values for the policy row
     */
    async getPolicyPremiumValues() {
        return await this.getPremiumValuesForRow(1);
    }

    /**
     * Verifies that premium calculations are correct
     * @param expectedTotals Optional object with expected total values
     */
    async verifyPremiumSummaryCalculations(expectedTotals?: {
        termPremium?: number;
        actualPremium?: number;
        billablePremium?: number;
        apRp?: number;
        taxes?: number;
        fees?: number;
    }) {
        const totals = await this.getAllPremiumSummaryTotals();

        if (expectedTotals) {
            if (expectedTotals.termPremium !== undefined) {
                expect(totals.termPremium).toBe(expectedTotals.termPremium);
            }
            if (expectedTotals.actualPremium !== undefined) {
                expect(totals.actualPremium).toBe(expectedTotals.actualPremium);
            }
            if (expectedTotals.billablePremium !== undefined) {
                expect(totals.billablePremium).toBe(expectedTotals.billablePremium);
            }
            if (expectedTotals.apRp !== undefined) {
                expect(totals.apRp).toBe(expectedTotals.apRp);
            }
            if (expectedTotals.taxes !== undefined) {
                expect(totals.taxes).toBe(expectedTotals.taxes);
            }
            if (expectedTotals.fees !== undefined) {
                expect(totals.fees).toBe(expectedTotals.fees);
            }
        }

        return totals;
    }

    /**
     * Verifies that AP/RP matches Billable Premium (common validation)
     */
    async verifyAPRPMatchesBillablePremium() {
        const apRp = await this.getAPRPTotal();
        const billablePremium = await this.getBillablePremiumTotal();

        expect(apRp).toBe(billablePremium);
        return { apRp, billablePremium };
    }

    /**
     * Waits for premium calculations to complete and values to be populated
     */
    async waitForPremiumCalculationsToComplete() {
        // Wait for any premium value to be non-zero
        await expect(async () => {
            const totals = await this.getAllPremiumSummaryTotals();
            return totals.actualPremium > 0 || totals.billablePremium > 0;
        }).toBeTruthy();
    }

    /**
     * Recovers from mandatory field errors by detecting them and re-filling the fields
     * @param vehicleData - The original vehicle data to recover
     * @param options - Configuration options
     * @param options.enableRecovery - Whether to attempt recovery (default: true)
     * @param options.expectedErrors - List of expected error codes to recover from
     * @returns true if recovery was attempted, false if no errors found
     */
    async recoverFromMandatoryErrors(
        vehicleData?: any,
        options: {
            enableRecovery?: boolean;
            expectedErrors?: string[];
        } = {}
    ): Promise<boolean> {
        const { enableRecovery = true, expectedErrors = ['PreconfigVehicle.marketValue', 'PreconfigVehicle.modelYear'] } = options;

        if (!enableRecovery) {
            return false;
        }

        // Wait for page to fully load after calculate premium
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

        // Check if the error form is present
        const errorForm = this.page.locator('#errorsForm');
        const isErrorFormVisible = await errorForm.isVisible({ timeout: 3000 }).catch(() => false);

        if (!isErrorFormVisible) {            return false;
        }
        // Get all error rows
        const errorRows = await this.page.locator('#errorsForm tbody tr.whiteRow').all();
        const detectedErrors: Array<{ code: string; severity: string; description: string }> = [];

        for (const row of errorRows) {
            const cells = await row.locator('td').all();
            if (cells.length >= 3) {
                const code = (await cells[0].textContent())?.trim() || '';
                const severity = (await cells[1].textContent())?.trim() || '';
                const description = (await cells[2].textContent())?.trim() || '';
                detectedErrors.push({ code, severity, description });
            }
        }
        // Check if all detected errors are in the expected errors list
        const recoverableErrors = detectedErrors.filter(error => expectedErrors.includes(error.code));

        if (recoverableErrors.length === 0) {            return false;
        }
        // Click the Back button to return to the form
        const backButton = this.page.locator('#errorsForm\\:back');
        await backButton.click();
        await waitForBarbadosLoadingSpinner(this);

        // After clicking Back, we might be on the purchase page
        // Check if we're on the purchase page, if so we need to navigate back to the quote
        const isPurchasePage = await this.page.locator('#purchaseForm').isVisible({ timeout: 2000 }).catch(() => false);

        if (isPurchasePage) {            // We're on the purchase page, need to go back to the quote to edit vehicle
            const cancelButton = this.page.locator('#purchaseForm\\:cancelButton_footer');
            const isCancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
            if (isCancelVisible) {
                await cancelButton.click();
                await waitForBarbadosLoadingSpinner(this);
            }
        }        await this.vehicleTab.click();
        await waitForBarbadosLoadingSpinner(this);

        // Re-fill the mandatory fields based on detected errors
        for (const error of recoverableErrors) {
            if (error.code === 'PreconfigVehicle.modelYear' && vehicleData?.year) {                await this.modelYearField.clear();
                await this.modelYearField.fill(vehicleData.year);
                await this.page.keyboard.press('Tab');
                await waitForBarbadosLoadingSpinner(this);
            }

            if (error.code === 'PreconfigVehicle.marketValue' && vehicleData?.sumInsured) {                await this.sumInsuredField.clear();
                await this.sumInsuredField.fill(vehicleData.sumInsured);
                await this.page.keyboard.press('Tab');
                await waitForBarbadosLoadingSpinner(this);
            }
        }        return true;
    }

    async checkErrorMessage(locator: string): Promise<boolean> {

        const errorMessage = this.page.locator(locator);

        if (await errorMessage.isVisible()) {
            await errorMessage.click();
            return true;
        }
        return false;
    }
}
