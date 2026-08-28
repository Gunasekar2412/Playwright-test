import { expect, Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { BasePage } from "./BasePage";
import { waitForBarbadosLoadingSpinner, closePartySearchPopupIfVisible } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export class PolicyPage extends BasePage {

  readonly adminLink: Locator;
  readonly takeActionDropdown: Locator;
  readonly effectiveDateField: Locator;

  readonly addNewQuoteButton: Locator
  readonly createQuoteModalNextButton: Locator;
  readonly addNewInsuredButton: Locator;
  readonly addNewDriverButton: Locator;
  readonly addNewDriverLicenseButton: Locator;
  readonly addNewVehicleButton: Locator;
  readonly addNewClaimButton: Locator;
  readonly calculatePremiumButton: Locator;
  readonly overrideCoveragePremiumButton: Locator;
  readonly addOverrideButton: Locator;
  readonly headerOverrideRulesButton: Locator;
  readonly overrideRulesButton: Locator;
  readonly okButton: Locator;
  readonly searchButton: Locator;
  readonly tasksButton: Locator;
  readonly purchaseButton: Locator;
  readonly purchasePolicyYesButton: Locator;

  readonly taxExemptField: Locator;
  readonly insuredPartySelection: Locator;
  readonly driverPartySelection: Locator;
  readonly branchField: Locator;
  readonly branchErrorMessage: Locator;
  readonly premiumFinancingYesRadioField: Locator;
  readonly premiumFinancingNoRadioField: Locator;
  readonly currencyField: Locator;
  readonly nameField: Locator;
  readonly trnField: Locator;
  readonly trnErrorMessage: Locator;
  readonly genderField: Locator;
  readonly genderErrorMessage: Locator;
  readonly relationshipToPrimaryInsuredField: Locator;
  readonly priorCarrierField: Locator;
  readonly priorCarrierErrorMessage: Locator;
  readonly fuelTypeField: Locator;
  readonly claimDateField: Locator;
  readonly coverageTypeField: Locator;
  readonly planSelectionField: Locator;
  readonly settlementTypeField: Locator;
  readonly antiLockField: Locator;
  readonly airBagsField: Locator;
  readonly automaticBeltsYesField: Locator
  readonly automaticBeltsNoField: Locator
  readonly daytimeRunningLampsYesField: Locator;
  readonly daytimeRunningLampsNoField: Locator;
  readonly armoredVehiclesYesField: Locator;
  readonly armoredVehiclesNoField: Locator;
  readonly recoveryDeviceYesField: Locator;
  readonly recoveryDeviceNoField: Locator;
  readonly additionalSecurityField: Locator;
  readonly distanceDrivenForPleasurePerWeek: Locator;
  readonly customerDeclaredAnnualDistance: Locator;
  readonly vehicleChassisVINField: Locator;
  readonly vehicleModelYearField: Locator;
  readonly vehicleMakeField: Locator;
  readonly vehicleModelField: Locator;
  readonly vehicleBodyTypeField: Locator;
  readonly vehiclePerformanceField: Locator;
  readonly vehicleSumInsured: Locator;
  readonly vehicleWrittenOffYesRadioField: Locator;
  readonly vehicleWrittenOffNoRadioField: Locator;
  readonly vehicleWrittenOffErrorMessage: Locator;
  readonly vehicleCountryField: Locator;
  readonly vehicleAddressLine1Field: Locator;
  readonly vehicleParishField: Locator;
  readonly vehicleRegisteredOwnerFirstNameField: Locator
  readonly vehicleRegisteredOwnerLastNameField: Locator
  readonly reasonForOverrideField: Locator;
  readonly reasonForOverrideErrorMessage: Locator;
  readonly bcicRentalBenefitsCoverLevelField: Locator;
  readonly bcicAssistCoverLevelField: Locator;
  readonly licensedToDriveField: Locator;

  readonly lookupListNameSearchField: Locator

  readonly licenseTypeField: Locator;
  readonly dateFirstLicensed: Locator;
  readonly currentLicenseIssueDateField: Locator;
  readonly licenseExpirationDateField: Locator;
  readonly licenseStatusField: Locator;
  readonly financialResponsibilityFilingNeededYesField: Locator
  readonly financialResponsibilityFilingNeededNoField: Locator

  readonly endorsementDateField: Locator;
  readonly endorsementDateErrorMessage: Locator;
  readonly endorsementReasonField: Locator;
  readonly endorsementReasonErrorMessage: Locator;

  readonly mvrIncludeInRatingYesField: Locator;
  readonly mvrIncludeInRatingNoField: Locator;
  readonly mvrClaimsClaimDateField: Locator;
  readonly mvrClaimsCompanyField: Locator;
  readonly mvrClaimsClaimNumberField: Locator;
  readonly mvrClaimsPolicyNumberField: Locator;
  readonly mvrClaimsPolicyTypeField: Locator;
  readonly mvrClaimsDescriptionOfLossField: Locator;
  readonly mvrClaimsClaimAssociationField: Locator;
  readonly mvrClaimsFaultIndicatorField: Locator;
  readonly mvrClaimsClaimTypeField: Locator;
  readonly mvrClaimsClaimAmountField: Locator;
  readonly mvrClaimsSettlementTypeField: Locator;

  readonly insuredFirstName: Locator;
  readonly insuredLastName: Locator;
  readonly insuredIdentificationType: Locator;
  readonly insuredIdentificationNumber: Locator;
  readonly insuredTRN: Locator;
  readonly insuredDateOfBirth: Locator;
  readonly insuredGender: Locator;
  readonly insuredEmploymentStatus: Locator;
  readonly insuredOccupation: Locator;
  readonly insuredAddressType: Locator;
  readonly insuredCountry: Locator;
  readonly insuredAddressLine1: Locator;
  readonly insuredParish: Locator;
  readonly insuredEmployer: Locator;

  readonly manualReviewReasonField: Locator;

  readonly driverSection: Locator;
  readonly driverTable: Locator;

  readonly reasonField: Locator;

  readonly firstPolicyNumberLink: Locator;
  readonly policyNumberText: Locator;
  readonly okFooterButton: Locator;

  readonly doNotRenewStatusField: Locator;
  readonly doNotRenewStatusErrorMessage: Locator;

  // Confirmation dialog
  readonly confirmDialog: Locator;
  readonly yesButton: Locator;
  readonly noButton: Locator;
  readonly premiumSummaryVehicleRow: Locator;

  constructor(page: Page) {
    super(page);

    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.takeActionDropdown = page.locator('#productContextInfoForm\\:moveToBox');
    this.effectiveDateField = page.locator('#policyDataGatherForm\\:sedit_CopyPolicyInfo_policyTxInfo_txDateInputDate');

    this.addNewQuoteButton = page.getByRole('button', { name: 'Add New Quote' });
    this.addNewVehicleButton = page.getByRole('button', { name: 'Add New Vehicle' });
    this.createQuoteModalNextButton = page.getByRole('button', { name: 'Next' });
    this.addNewInsuredButton = page.getByRole('button', { name: 'Add New Insured' });
    this.addNewDriverButton = page.getByRole('button', { name: 'Add New Driver', exact: true });
    this.addNewDriverLicenseButton = page.getByRole('button', { name: 'Add New Driver License' });
    this.addNewClaimButton = page.getByRole('button', { name: 'Add New Claim' });
    this.calculatePremiumButton = page.getByRole('button', { name: 'Calculate Premium' });
    this.overrideCoveragePremiumButton = page.getByRole('button', { name: 'Override Coverage Premium' });
    this.addOverrideButton = page.getByRole('button', { name: 'Add Override' });
    this.headerOverrideRulesButton = page.locator('form[id="headerForm"] input[value="Override Rules"]');
    this.overrideRulesButton = page.locator('#errorsForm\\:overrideRules');
    this.okButton = page.getByRole('button', { name: 'OK' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.tasksButton = page.getByText('Tasks');
    this.purchaseButton = page.locator('form[id="headerForm"] input[value="Purchase"][type="submit"]');
    this.purchasePolicyYesButton = page.locator('[id=policyDataGatherForm\\:ConfirmDialog_container]').getByRole('button', { name: 'Yes' });

    this.taxExemptField = page.getByText('Tax Exempt');
    this.insuredPartySelection = page.getByRole('combobox', { name: 'Insured Party Selection' });
    this.driverPartySelection = page.getByRole('combobox', { name: 'Driver Party Selection' });
    this.branchField = page.getByRole('combobox', { name: 'Branch' });
    this.currencyField = page.getByRole('combobox', { name: 'Currency' });
    this.branchErrorMessage = page.getByText('\'Branch\' is required');
    this.premiumFinancingYesRadioField = page.locator('[id="policyDataGatherForm\\:sedit_Policy_premiumFinancing\\:0"]');
    this.premiumFinancingNoRadioField = page.locator('[id="policyDataGatherForm\\:sedit_Policy_premiumFinancing\\:1"]');
    this.nameField = page.getByRole('textbox', { name: 'Name' });
    this.trnField = page.getByRole('textbox', { name: 'TRN' });
    this.trnErrorMessage = page.getByRole('cell', { name: '\'TRN\' is required', exact: true });
    this.genderField = page.getByRole('combobox', { name: 'Gender' });
    this.genderErrorMessage = page.getByRole('cell', { name: '\'Gender\' is required', exact: true });
    this.relationshipToPrimaryInsuredField = page.getByRole('combobox', { name: 'Relationship To Primary Insured' });
    this.priorCarrierField = page.getByRole('combobox', { name: 'Prior Carrier' });
    this.priorCarrierErrorMessage = page.getByRole('cell', { name: '\'Prior Carrier\' is required', exact: true });
    this.fuelTypeField = page.getByRole('combobox', { name: 'Fuel Type' });
    this.claimDateField = page.locator('[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverRecordClaims_claimDtInputDate"]');
    this.coverageTypeField = page.getByRole('combobox', { name: 'Coverage Type' });
    this.planSelectionField = page.getByRole('combobox', { name: 'Plan Selection' });
    this.settlementTypeField = page.getByRole('textbox', { name: 'Settlement Type' });
    this.antiLockField = page.getByRole('combobox', { name: 'Anti-Lock' });
    this.airBagsField = page.getByRole('combobox', { name: 'Air Bags' });
    this.daytimeRunningLampsYesField = page.locator(':text("Yes"):right-of([type=radio]):right-of(:text("Daytime Running Lamps"))').first();
    this.daytimeRunningLampsNoField = page.locator(':text("No"):right-of([type=radio]):right-of(:text("Daytime Running Lamps"))').first();
    this.armoredVehiclesYesField = page.locator(':text("Yes"):right-of([type=radio]):right-of(:text("Armored Vehicle?"))').first();
    this.armoredVehiclesNoField = page.locator(':text("No"):right-of([type=radio]):right-of(:text("Armored Vehicle?"))').first();
    this.automaticBeltsYesField = page.locator(':text("Yes"):right-of([type=radio]):right-of(:text("Automatic Belts"))').first();
    this.automaticBeltsNoField = page.locator(':text("No"):right-of([type=radio]):right-of(:text("Automatic Belts"))').first();
    this.recoveryDeviceYesField = page.locator(':text("Yes"):right-of([type=radio]):right-of(:text("Recovery Device"))').first();
    this.recoveryDeviceNoField = page.locator(':text("No"):right-of([type=radio]):right-of(:text("Recovery Device"))').first();
    this.additionalSecurityField = page.getByRole('combobox', { name: 'Additional Security' });
    this.distanceDrivenForPleasurePerWeek = page.getByRole('textbox', { name: 'Distance Driven for Pleasure per Week' });
    this.customerDeclaredAnnualDistance = page.getByRole('combobox', { name: 'Customer Declared Annual Distance' });
    this.vehicleChassisVINField = page.getByRole('textbox', { name: 'Chassis/VIN' });
    this.vehicleModelYearField = page.getByRole('combobox', { name: 'Model Year' });
    this.vehicleMakeField = page.getByRole('combobox', { name: 'Make' });
    this.vehicleModelField = page.getByRole('combobox', { name: 'Model *', exact: true });
    this.vehicleBodyTypeField = page.getByRole('combobox', { name: 'Body Type *', exact: true });
    this.vehiclePerformanceField = page.getByRole('combobox', { name: 'Performance *', exact: true });
    this.vehicleSumInsured = page.getByRole('textbox', { name: 'Sum Insured *', exact: true });
    this.vehicleWrittenOffYesRadioField = page.locator('[id="policyDataGatherForm\:sedit_VehicleUseDetailComponent_writtenOffInd\:0"]');
    this.vehicleWrittenOffNoRadioField = page.locator('[id="policyDataGatherForm\:sedit_VehicleUseDetailComponent_writtenOffInd\:1"]');
    this.vehicleWrittenOffErrorMessage = page.getByText('\'Has this vehicle ever been written off?\' is required');
    this.vehicleCountryField = page.locator('[id="policyDataGatherForm\\:componentRegion_VehicleGaragingAddressInfo"]').getByRole('combobox', { name: 'Country * ', exact: true });
    this.vehicleAddressLine1Field = page.locator('[id="policyDataGatherForm\\:componentRegion_VehicleGaragingAddressInfo"]').getByRole('textbox', { name: 'Address Line 1 *', exact: true });
    this.vehicleParishField = page.locator('[id="policyDataGatherForm\\:componentRegion_VehicleGaragingAddressInfo"]').getByRole('combobox', { name: 'Parish' });
    this.vehicleRegisteredOwnerFirstNameField = page.getByRole('textbox', { name: 'First Name' });
    this.vehicleRegisteredOwnerLastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.reasonForOverrideField = page.getByRole('combobox', { name: 'Reason For Override' });
    this.reasonForOverrideErrorMessage = page.getByTitle('\'Reason for Override\' is required', { exact: true });
    this.bcicRentalBenefitsCoverLevelField = page.locator('#policyDataGatherForm\\:sedit_BcicRentalBenefits_coverLevelCd');
    this.bcicAssistCoverLevelField = page.locator('#policyDataGatherForm\\:sedit_BcicAssist_coverLevelCd');
    this.licensedToDriveField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_licencedToDrive')

    this.lookupListNameSearchField = page.locator('[id="lookupsListForm\\:searchCriteria"]');

    this.relationshipToPrimaryInsuredField = page.getByRole('combobox', { name: 'Relationship to Primary Insured' });
    this.licenseTypeField = page.getByRole('combobox', { name: 'License Type *' }).first();
    this.dateFirstLicensed = page.locator('input:right-of(:text(\'Date First Licensed\'))').first();
    this.currentLicenseIssueDateField = page.locator('input:right-of(:text(\'Current License Issue Date\'))').first();
    this.licenseExpirationDateField = page.locator('input:right-of(:text(\'License Expiration Date\'))').first();
    this.licenseStatusField = page.getByRole('combobox', { name: 'License Status' });
    this.financialResponsibilityFilingNeededYesField = page.locator(':text(\'Yes\'):right-of([type=radio]):right-of(:text(\'Financial Responsibility Filing Needed?\'))').first();
    this.financialResponsibilityFilingNeededNoField = page.locator(':text(\'No\'):right-of([type=radio]):right-of(:text(\'Financial Responsibility Filing Needed?\'))').first();

    this.endorsementDateField = page.locator('#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementDateInputDate');
    this.endorsementDateErrorMessage = page.getByText('\'Endorsement Reason\' is');
    this.endorsementReasonField = page.getByRole('combobox', { name: 'Endorsement Reason' });
    this.endorsementReasonErrorMessage = page.getByText('\'Endorsement Reason\' is required');

    this.insuredFirstName = page.getByRole('textbox', { name: 'First Name *' });
    this.insuredLastName = page.getByRole('textbox', { name: 'Last Name *' });
    this.insuredIdentificationType = page.getByRole('combobox', { name: 'Identification Type' });
    this.insuredIdentificationNumber = page.getByRole('textbox', { name: 'Identification Number *' });
    this.insuredTRN = page.getByRole('textbox', { name: 'TRN *' });
    this.insuredDateOfBirth = page.locator('[id="policyDataGatherForm\\:sedit_PreconfigInsuredPersonInfoProxy_person_dateOfBirthInputDate"]');
    this.insuredGender = page.getByRole('combobox', { name: 'Gender' });
    this.insuredEmploymentStatus = page.getByRole('combobox', { name: 'Employment Status' });
    this.insuredOccupation = page.getByRole('combobox', { name: 'Occupation' });
    this.insuredAddressType = page.getByRole('combobox', { name: 'Address Type' });
    this.insuredCountry = page.getByRole('combobox', { name: 'Country' });
    this.insuredAddressLine1 = page.getByRole('textbox', { name: 'Address Line 1' });
    this.insuredParish = page.getByRole('combobox', { name: 'Parish' });
    this.insuredEmployer = page.getByRole('textbox', { name: 'Employer' });

    this.manualReviewReasonField = page.getByRole('combobox', { name: 'Reason *', exact: true })

    this.driverSection = page.getByText("Driver", {});
    this.driverTable = page.locator('[id="policyDataGatherForm:dataGatherView_ListPreconfigAutoDriver_data"]');

    this.reasonField = page.getByRole('combobox', { name: 'Reason' })

    this.firstPolicyNumberLink = page.locator('a:below(:text("Policy #"))').first();
    this.policyNumberText = page.locator('#productContextInfoForm\\:title_policyNumTxt');
    this.okFooterButton = page.locator('form[id="headerForm"] input[value="OK"][type="submit"]');

    this.doNotRenewStatusField = page.getByRole('combobox', { name: 'Do Not Renew Status' });
    this.doNotRenewStatusErrorMessage = page.getByText('\'Do Not Renew Status\' is mandatory');

    // Confirmation dialog
    this.confirmDialog = page.locator('#policyDataGatherForm\\:ConfirmDialog_container');
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.noButton = page.getByRole('button', { name: 'No' });
    this.premiumSummaryVehicleRow = this.page.locator(
      '#policyDataGatherForm\\:premiumTable_policyPremiumInfoTable_data tr'
    ).filter({
      hasText: 'Mitsubishi'
    });

  }

  async goto() {
    const loginPOM = new LoginPage(this.page);
    await loginPOM.goto();
    await loginPOM.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
  }

  async click(clickable: Locator) {
    await clickable.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async checkRadioField(radioField: Locator) {
    await radioField.check();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickAddNewQuoteButton() {
    await this.addNewQuoteButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickAddNewVehicleButton() {
    await this.addNewVehicleButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickAddNewInsuredButton() {
    await this.addNewInsuredButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickAddNewDriverButton() {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      // Get the current number of rows before clicking
      const currentRowCount = await this.driverTable.locator('tr[role="row"]').count();

      // Click the add new driver button
      await this.addNewDriverButton.click();
      await waitForBarbadosLoadingSpinner(this);

      // Wait a bit for the new row to appear
      await this.page.waitForTimeout(1000);

      // Check if a new row was added
      const newRowCount = await this.driverTable.locator('tr[role="row"]').count();

      if (newRowCount > currentRowCount) {
        return; // Success - new row was added
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          // Wait a bit before retrying
          await this.page.waitForTimeout(2000);
        }
      }
    }

    // If we get here, we've exhausted all retries
    throw new Error(`Failed to add new driver row after ${maxRetries} attempts`);
  }

  async clickAddNewClaimButton() {
    await this.addNewClaimButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickCalculatePremiumButton() {
    await this.calculatePremiumButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickQuoteModalNext() {
    await this.createQuoteModalNextButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickNext() {
    await this.nextFooterButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickSave() {
    await this.saveButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickSaveAndExit() {
    await this.saveAndExitButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForInsuredPartySelection(insuredPartyName: string) {
    await this.insuredPartySelection.selectOption({ label: insuredPartyName });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForDriverPartySelection(driverPartyName: string) {
    await this.driverPartySelection.selectOption({ label: driverPartyName });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForPriorCarrierSelection(priorCarrierName: string) {
    await this.priorCarrierField.selectOption({ label: priorCarrierName });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForCoverageTypeField(coverageTypeOption: string) {
    await this.coverageTypeField.selectOption({ label: coverageTypeOption });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForPlanSelection(planSelectionOption: string) {
    await this.planSelectionField.selectOption({ label: planSelectionOption });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForModelYear(modelYearOption: number) {
    await this.vehicleModelYearField.selectOption({ label: modelYearOption.toString() });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForVehicleMake(vehicleMakeOption: string) {
    await this.vehicleMakeField.selectOption({ label: vehicleMakeOption });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForVehicleModel(vehicleMakeOption: string) {
    await this.vehicleModelField.selectOption({ label: vehicleMakeOption });
    await waitForBarbadosLoadingSpinner(this);
  }

  async selectOptionForField(field: Locator, value: string) {
    await field.selectOption({ label: value });
    await waitForBarbadosLoadingSpinner(this);
  }

  async inputClaimDate(claimDate: Date) {
    await this.fillField(this.claimDateField, claimDate.toLocaleDateString('en-GB'));
    await waitForBarbadosLoadingSpinner(this);
  }

  async fillField(field: Locator, value: string) {
    await field.fill(value);
  }

  async fillRequiredInsuredInformation(insuredInfo: {
    generalInformation: {
      'First Name': string;
      'Last Name': string;
      'Identification Type': string;
      'Identification Number': string;
      'TRN': string;
      'Date of Birth': string;
      'Gender': string;
      'Employment Status': string;
      'Occupation': string;
      'Employer': string;
      'Address Type': string;
      'Country': string;
      'Address Line 1': string;
      'Parish': string;
    }
  }) {
    const info = insuredInfo.generalInformation;

    // Fill fields in order of appearance
    await this.insuredFirstName.fill(info['First Name']);
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredLastName.fill(info['Last Name']);
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredIdentificationType.selectOption({ label: info['Identification Type'] });
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredIdentificationNumber.fill(info['Identification Number']);
    await waitForBarbadosLoadingSpinner(this);

    await this.trnField.fill(info['TRN']);
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredDateOfBirth.fill(info['Date of Birth']);
    await this.insuredDateOfBirth.press('Tab');
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredGender.selectOption({ label: info['Gender'] });
    await waitForBarbadosLoadingSpinner(this); await this.insuredEmploymentStatus.selectOption({ value: info['Employment Status'] });
    await waitForBarbadosLoadingSpinner(this); await this.insuredOccupation.selectOption({ label: info['Occupation'] });
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredEmployer.fill(info['Employer']);
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredAddressType.selectOption({ label: info['Address Type'] });
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredCountry.selectOption({ label: info['Country'] });
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredAddressLine1.fill(info['Address Line 1']);
    await waitForBarbadosLoadingSpinner(this);

    await this.insuredParish.selectOption({ label: info['Parish'] });
    await waitForBarbadosLoadingSpinner(this);

    // Handle any party search popups using the base class method
    await waitForBarbadosLoadingSpinner(this);
  }

  async fillRequiredVehicleInformation(vehicleInfo: {
    generalInformation: {
      chassisVIN: string;
      modelYear: string;
      make: string;
      model: string;
      bodyType: string;
      performance: string;
      sumInsured: string;
    };
    vehicleUseDetail: {
      writtenOff: 'Yes' | 'No' | null;
    };
    vehicleGaraging: {
      country: string;
      addressLine1: string;
      parish: string;
    };
    registeredOwner: {
      firstName: string;
      lastName: string;
    };
  }) {
    // General Information
    await this.fillField(this.vehicleChassisVINField, vehicleInfo.generalInformation.chassisVIN);
    await waitForBarbadosLoadingSpinner(this);

    await this.selectOptionForField(this.vehicleModelYearField, vehicleInfo.generalInformation.modelYear);
    await waitForBarbadosLoadingSpinner(this);

    await this.selectOptionForField(this.vehicleMakeField, vehicleInfo.generalInformation.make);
    await waitForBarbadosLoadingSpinner(this);

    await this.selectOptionForField(this.vehicleModelField, vehicleInfo.generalInformation.model);
    await waitForBarbadosLoadingSpinner(this);

    await this.selectOptionForField(this.vehicleBodyTypeField, vehicleInfo.generalInformation.bodyType);
    await waitForBarbadosLoadingSpinner(this);

    await this.selectOptionForField(this.vehiclePerformanceField, vehicleInfo.generalInformation.performance);
    await waitForBarbadosLoadingSpinner(this);

    await this.fillField(this.vehicleSumInsured, vehicleInfo.generalInformation.sumInsured);
    await this.page.keyboard.press('Enter');
    await waitForBarbadosLoadingSpinner(this);

    if (vehicleInfo.vehicleUseDetail?.writtenOff === 'Yes' || vehicleInfo.vehicleUseDetail?.writtenOff === 'No') {
      if (vehicleInfo.vehicleUseDetail.writtenOff === 'Yes') {
        await this.vehicleWrittenOffYesRadioField.check();
      } else {
        await this.vehicleWrittenOffNoRadioField.check();
      }
    }

    await waitForBarbadosLoadingSpinner(this);

    // Vehicle Garaging
    await this.selectOptionForField(this.vehicleCountryField, vehicleInfo.vehicleGaraging.country);
    await waitForBarbadosLoadingSpinner(this);
    // await closePartySearchPopupIfVisible(this.page);

    await this.fillField(this.vehicleAddressLine1Field, vehicleInfo.vehicleGaraging.addressLine1);
    await waitForBarbadosLoadingSpinner(this);
    // await closePartySearchPopupIfVisible(this.page);

    await this.selectOptionForField(this.vehicleParishField, vehicleInfo.vehicleGaraging.parish);
    await waitForBarbadosLoadingSpinner(this);

    // Registered Owner
    await this.fillField(this.vehicleRegisteredOwnerFirstNameField, vehicleInfo.registeredOwner.firstName);
    await waitForBarbadosLoadingSpinner(this);
    // await closePartySearchPopupIfVisible(this.page);

    await this.fillField(this.vehicleRegisteredOwnerLastNameField, vehicleInfo.registeredOwner.lastName);
    await this.page.keyboard.press('Enter');
    await waitForBarbadosLoadingSpinner(this);
    // await closePartySearchPopupIfVisible(this.page);

    await this.page.waitForTimeout(1000);
  }

  async fillRequiredDriverInformation(driverInfo: {
    generalInformation: {
      relationshipToPrimaryInsured: string;
      insuredName: string;
    };
    driverLicense: {
      licenseType: string;
      dateFirstLicensed: string;
      currentLicenseIssueDate: string;
      licenseExpirationDate: string;
      licenseStatus: string;
    };
  }) {
    // Handle any party search popups
    // await closePartySearchPopupIfVisible(this.page);
    await waitForBarbadosLoadingSpinner(this);
    await this.selectOptionForDriverPartySelection(driverInfo.generalInformation.insuredName);

    // General Information
    await this.relationshipToPrimaryInsuredField.selectOption({ label: driverInfo.generalInformation.relationshipToPrimaryInsured });
    await waitForBarbadosLoadingSpinner(this);

    // Driver License Information
    await this.licenseTypeField.selectOption({ label: driverInfo.driverLicense.licenseType });
    await waitForBarbadosLoadingSpinner(this);

    await this.dateFirstLicensed.fill(driverInfo.driverLicense.dateFirstLicensed);
    await waitForBarbadosLoadingSpinner(this);

    await this.currentLicenseIssueDateField.fill(driverInfo.driverLicense.currentLicenseIssueDate);
    await waitForBarbadosLoadingSpinner(this);

    await this.licenseExpirationDateField.fill(driverInfo.driverLicense.licenseExpirationDate);
    await waitForBarbadosLoadingSpinner(this);

    await this.licenseStatusField.selectOption({ label: driverInfo.driverLicense.licenseStatus });
    await waitForBarbadosLoadingSpinner(this);

    // Handle any party search popups using the base class method
    // await closePartySearchPopupIfVisible(this.page);
    await waitForBarbadosLoadingSpinner(this);
  }

  async verifyTRNisPresentAndEditable() {
    await expect(this.trnField).toBeVisible();
    await expect(this.trnField).toBeEditable();
  }

  async verifyGenderIsPresentEditableAndDefaultIsBlank() {
    await expect(this.genderField).toBeVisible();
    await expect(this.genderField).toBeEditable();
    await expect(this.genderField).toHaveValue('');
  }

  async verifyPriorCarrierFieldIsPresentEditableAndDefaultIsBlank() {
    await expect(this.priorCarrierField).toBeVisible();
    await expect(this.priorCarrierField).toBeEditable();
    await expect(this.priorCarrierField).toHaveValue('');
  }

  async verifyFuelTypeFieldIsPresentEditableAndDefaultIsBlank() {
    await this.fuelTypeField.waitFor({ state: 'visible', timeout: 20000 });
    await expect(this.fuelTypeField).toBeEditable();
    await expect(this.fuelTypeField).toHaveValue('');
  }

  async verifyFieldIsPresentEditableAndDefaultIsBlank(fieldToVerify: Locator) {
    await fieldToVerify.waitFor({ state: 'visible', timeout: 10000 });
    await expect(fieldToVerify).toBeEditable();
    await expect(fieldToVerify).toHaveValue('');
  }

  async verifyFieldIsPresentEditableAndUnchecked(fieldToVerify: Locator) {
    await expect(fieldToVerify).toBeVisible();
    await expect(fieldToVerify).toBeEditable();
    await expect(fieldToVerify).toBeChecked({ checked: false });
  }

  async verifyFieldIsPresentEditableAndChecked(fieldToVerify: Locator) {
    await expect(fieldToVerify).toBeVisible();
    await expect(fieldToVerify).toBeEditable();
    await expect(fieldToVerify).toBeChecked();
  }

  async verifyPriorCarrierFieldHasAppropriateValues() {
    let allValuesMatch = true;
    const expectedPriorCarrierValues: string[] = [
      '',
      'Advantage General Insurance Company',
      'British Caribbean Insurance Company',
      'General Accident Ins Company Jamaica Limited',
      'GK General Insurance Company Limited',
      'Guardian General Insurance Jamaica Limited',
      'Insurance Company of The West Indies',
      'IronRock Insurance Company Limited',
      'JN General Insurance Company Limited',
      'Key Insurance Company Limited',
      'CG United Insurance',
      'Unknown',
      'No prior insurance'
    ]

    await expect(this.priorCarrierField.locator('option')).toHaveCount(13);
    const optionLabels = await this.priorCarrierField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          field = fields[0];
        }
      } else {
        field = fields;
      }
      for (const option of (field as HTMLSelectElement).options) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(13);
    expectedPriorCarrierValues.forEach((value, index) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1) && allValuesMatch;
    })
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedPriorCarrierValues)
  }

  async verifyPriorCarrierFieldHasGivenValue(expectedPriorCarrierName: string) {
    const selectedPriorCarrierNameOption = this.priorCarrierField.getByText(expectedPriorCarrierName);
    await expect(selectedPriorCarrierNameOption).toHaveText(expectedPriorCarrierName);
  }

  async verifyFuelTypeFieldHasGivenValues() {
    let allValuesMatch = true;
    const expectedFuelTypeValues = [
      '',
      'Flex - gas and ethanol',
      'Gasoline',
      'Ethanol',
      'Diesel',
      'Propane',
      'Hybrid - gas and battery',
      'Hybrid Plug-in',
      'Electric',
      'Other'
    ];
    await expect(this.fuelTypeField.locator('option')).toHaveCount(expectedFuelTypeValues.length);
    const optionLabels = await this.fuelTypeField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          field = fields[0];
        }
      } else {
        field = fields;
      }
      for (const option of Array.prototype.slice.call((field as HTMLSelectElement).options)) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(expectedFuelTypeValues.length);
    expectedFuelTypeValues.forEach((value, index) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1) && allValuesMatch;
    })
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedFuelTypeValues);
  }

  async verifyReasonForOverrideFieldHasGivenValues() {
    let allValuesMatch = true;
    const expectedReasonForOverrideValues: string[] = [
      '',
      'Match Quote',
      'Referral Discount',
      'Operator Error',
      'Multi Policy Discount',
      'Discretionary Discount',
      'Sales Discount',
      'Other'
    ];
    await expect(this.reasonForOverrideField.locator('option'))
      .toHaveCount(expectedReasonForOverrideValues.length);
    const optionLabels = await this.reasonForOverrideField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          if (fields.length == 1) {
            field = fields[0];
          }
        }
      } else {
        field = fields;
      }
      for (const option of Array.prototype.slice.call((field as HTMLSelectElement).options)) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(expectedReasonForOverrideValues.length);
    expectedReasonForOverrideValues.forEach((value) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1) && allValuesMatch;
    });
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedReasonForOverrideValues);
  }

  async verifyBranchFieldHasGivenValues() {
    const expectedBranchValues: string[] = [
      '',
      'Cross Roads',
      'Head Office - Kingston',
      'Mandeville',
      'Montego Bay',
      'New Kingston',
      'Ocho Rios',
      'Online Business',
      'Portmore',
      'Savanna-La-Mar',
      'JN Barbados Avenue',
      'JN Constant Spring',
      'JN Head Office',
      'JN King Street',
      'JN Mandeville',
      'JN Montego Bay',
      'JN Ocho Rios',
      'JN Port Antonio',
      'JN Port Maria',
      'JN Santa Cruz',
      'JN Savanna-La-Mar'
    ];

    // Verify the number of options matches expected
    await expect(this.branchField.locator('option')).toHaveCount(expectedBranchValues.length);

    // Get all option labels from the dropdown
    const optionLabels = await this.branchField.evaluateAll((fields) => {
      const field = Array.isArray(fields) ? fields[0] : fields;
      return Array.from((field as HTMLSelectElement).options).map(option => option.label);
    });

    // Verify we got the expected number of options
    expect(optionLabels).toHaveLength(expectedBranchValues.length);

    // Verify all expected values are present and in the correct order
    expect(optionLabels).toEqual(expectedBranchValues);
  }

  async verifyEndorsementFieldHasGivenValues() {
    let allValuesMatch = true;
    const expectedEndorsementReasonValues: string[] = [
      '',
      'Adding a discount',
      'Adding a driver',
      'Adding a premium financing company interest',
      'Adding an Insured',
      'Adding a mortgagee',
      'Adding restricted driving',
      'Adding a vehicle',
      'Adding vehicle coverage',
      'Allowing No Fault Discount/No Claim Discount',
      'Changing coverage limit amounts',
      'Changing coverage type/plan selection',
      'Changing No Fault Discount/No Claim Discount',
      'Change of vehicle',
      'Decrease policy premium',
      'Decrease vehicle excess',
      'Deleting a driver',
      'Deleting a premium financing company interest',
      'Deleting an Insured',
      'Deleting a mortgagee',
      'Deleting restricted driving',
      'Deleting a total loss vehicle',
      'Deleting a vehicle',
      'Deleting vehicle coverage',
      'Excluding a driver',
      'Increase policy premium',
      'Increase vehicle excess',
      'Increasing vehicle value',
      'Pended renewal is Not Current due to a change on the current term policy',
      'Adding an extension/clause',
      'Adding reinsurance arrangement',
      'Adding a risk',
      'Adding a risk address',
      'Amending deductible',
      'Deleting an extension/clause',
      'Deleting reinsurance arrangement',
      'Deleting a risk',
      'Deleting a risk address',
      'Increasing risk sum insured/limit',
      'Reducing risk sum insured/limit',
      'Update EML',
      'Updating an extension/clause',
      'Updating reinsurance arrangement',
      'Updating a risk address',
      'Updating risk details',
      'Updating risk occupancy/class code',
      'Reducing vehicle value',
      'Removing a discount',
      'Removing No Fault Discount/No Claim Discount',
      'Updating driver details',
      'Updating Insured details',
      'Updating vehicle details',
    ];
    await expect(this.endorsementReasonField.locator('option')).toHaveCount(expectedEndorsementReasonValues.length);
    const optionLabels = await this.endorsementReasonField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          field = fields[0];
        }
      } else {
        field = fields;
      }
      for (const option of Array.prototype.slice.call((field as HTMLSelectElement).options)) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(expectedEndorsementReasonValues.length);
    expectedEndorsementReasonValues.forEach((value, index) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1) && allValuesMatch;
    })
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedEndorsementReasonValues);
  }

  async verifyManualReviewReasonHasGivenValues() {
    let allValuesMatch = true;
    const expectedManualReviewReasonValues: string[] = [
      '',
      'Bad Debt',
      'Breach of Policy Terms',
      'Large Account',
      'Loss Experience',
      'Other'
    ];
    await expect(this.manualReviewReasonField.locator('option')).toHaveCount(expectedManualReviewReasonValues.length);
    const optionLabels = await this.manualReviewReasonField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          field = fields[0];
        }
      } else {
        field = fields;
      }
      for (const option of Array.prototype.slice.call((field as HTMLSelectElement).options)) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(expectedManualReviewReasonValues.length);
    expectedManualReviewReasonValues.forEach((value, index) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1) && allValuesMatch;
    });
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedManualReviewReasonValues);
  }

  async verifyDoNotRenewReasonFieldHasGivenValues() {
    let allValuesMatch = true
    const expectedDoNotRenewReasonValues: string[] = [
      '',
      'DNR - Loss Experience',
      'DNR - Other',
      'DNR - Unacceptable CAT Loss Exp',
      'DNR - Increase in Hazard',
      'Material Misrepresentation',
      'Breach of Policy Terms',
      'SIU'
    ]
    await expect(this.reasonField.locator('option')).toHaveCount(expectedDoNotRenewReasonValues.length);
    const optionLabels = await this.reasonField.evaluateAll((fields) => {
      let field: undefined | HTMLElement | SVGElement = undefined;
      let optionLabels: string[] = [];
      if (Array.isArray(fields)) {
        if (fields.length == 1) {
          field = fields[0];
        }
      } else {
        field = fields;
      }
      for (const option of Array.prototype.slice.call((field as HTMLSelectElement).options)) {
        optionLabels.push(option.label);
      }
      return optionLabels;
    })
    expect(optionLabels).toHaveLength(expectedDoNotRenewReasonValues.length);
    expectedDoNotRenewReasonValues.forEach((value) => {
      allValuesMatch = (optionLabels.indexOf(value) > -1 && allValuesMatch);
    });
    expect(allValuesMatch).toBeTruthy();
    expect(optionLabels).toEqual(expectedDoNotRenewReasonValues);
  }

  async verifyValueInSelectField(selectField: Locator, value: string) {
    let selectFieldOptions = await selectField.evaluate((field) => {
      let optionLabels: string[] = [];
      const options = Array.prototype.slice.call((field as HTMLSelectElement).options); for (const option of options) {
        optionLabels.push(option.label);
      }

      return optionLabels;
    }); expect(selectFieldOptions).toContain(value);
  }

  async verifyErrorMessageIsShownWhenTRNIsLeftBlank() {
    await expect(this.trnErrorMessage).toBeVisible();
  }

  async verifyErrorMessageIsShownWhenGenderIsLeftBlank() {
    await expect(this.genderErrorMessage).toBeVisible();
  }

  async verifyErrorMessageIsShownWhenPriorCarrierIsLeftBlank() {
    await expect(this.priorCarrierField).toBeVisible();
  }

  async verifyErrorMessageIsVisible(errorMessageLocator: Locator) {
    await expect(errorMessageLocator).toBeVisible();
  }

  async verifyDriverSectionIsAboveVehicleSectionInPriorClaims() {
    const driverSectionId = 'policyDataGatherForm\\:componentViewPanelHeaderLabel_BcicPreconfigAutoDriverRecordClaimDriver';
    const driverSectionLocator = `[id="${driverSectionId}"]`;
    const belowDriverLocator = `:below(${driverSectionLocator})`;
    const locator = this.page.locator(belowDriverLocator);
    await expect(locator.filter({ hasText: 'Vehicle' }).getByText('Vehicle')).toBeVisible();
  }

  async verifyNoErrorOccurredAfterClickingNext() {
    const baseURL = process.env.EIS_PORTAL_BASE_URL!
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const quoteMainFlowPath = 'flow\\?_flowId=quote-main-flow&_flowExecutionKey=\\w*&_windowId=W\\d*#noback';
    await expect(this.page).toHaveURL(new RegExp(`${baseURL}/${quoteMainFlowPath}`));
  }

  async verifyLookupRowExistsForSearchItem(rowLabel: string) {

  }

  async createPolicy(
    vehicleRequiredInformation: {
      generalInformation: {
        chassisVIN: string;
        modelYear: string;
        make: string;
        model: string;
        bodyType: string;
        performance: string;
        sumInsured: string;
      };
      vehicleUseDetail: {
        writtenOff: 'Yes' | 'No' | null;
      };
      vehicleGaraging: {
        country: string;
        addressLine1: string;
        parish: string;
      };
      registeredOwner: {
        firstName: string;
        lastName: string;
      };
    },
    driverRequiredInformation: {
      generalInformation: {
        relationshipToPrimaryInsured: string;
        insuredName: string;
      };
      driverLicense: {
        licenseType: string;
        dateFirstLicensed: string;
        currentLicenseIssueDate: string;
        licenseExpirationDate: string;
        licenseStatus: string;
      };
    }
  ) {
    // TODO: Continue this method
    await this.clickQuoteTab();
    await this.clickAddNewQuoteButton();
    await this.clickQuoteModalNext();

    await this.selectOptionForField(this.branchField, 'Head Office - Kingston');

    await this.clickInsuredTab();
    await this.selectOptionForInsuredPartySelection('Danuel Williams');
    await this.selectOptionForPriorCarrierSelection('No prior insurance');

    await this.clickDriverTab();
    await this.selectOptionForDriverPartySelection('Danuel Williams');
    await this.fillRequiredDriverInformation(driverRequiredInformation);

    await this.clickVehicleTab();
    await this.clickAddNewVehicleButton();
    await this.fillRequiredVehicleInformation(vehicleRequiredInformation)
  }

  async selectFirstAvailableInsuredParty() {
    // Get the first option within the "Available Parties" optgroup
    this.page.locator('select[id="policyDataGatherForm:sedit_PreconfigInsured_partySelection"]').click();
    await this.page.waitForTimeout(500);

    const firstAvailableParty = this.page.locator('optgroup[label="Available Parties"] option:not([disabled])').first();
    await firstAvailableParty.click();
  }

  /**
   * Handles the purchase policy confirmation dialog.
   * @param accept If true, clicks "Yes". If false, clicks "No".
   */
  async handlePurchasePolicyConfirmation(accept: boolean = true) {
    if (await this.confirmDialog.isVisible()) {
      if (accept) {
        await this.yesButton.click();
      } else {
        await this.noButton.click();
      }
      await waitForBarbadosLoadingSpinner(this);
    }
  }

  /**
   * Checks the premium financing radio button.
   * @param premiumFinancing The premium financing option to check.
   */
  async checkPremiumFincancing(premiumFinancing: 'Yes' | 'No') {
    await waitForBarbadosLoadingSpinner(this);
    if (premiumFinancing === 'Yes') {
      await this.premiumFinancingYesRadioField.check();
    } else {
      await this.selectPremiumFinancingNo();
    }
    await waitForBarbadosLoadingSpinner(this);
  }

  private async selectPremiumFinancingNo() {
    await this.page.waitForTimeout(3000);
    await this.premiumFinancingNoRadioField.scrollIntoViewIfNeeded();

    if (await this.premiumFinancingNoRadioField.isChecked()) {
      return;
    }

    await this.premiumFinancingNoRadioField.click({ force: true });
    await waitForBarbadosLoadingSpinner(this);

    if (await this.premiumFinancingNoRadioField.isChecked()) {
      return;
    }

    const noLabel = this.page.locator(
      'label[for="policyDataGatherForm:sedit_Policy_premiumFinancing:1"]'
    );

    if (await noLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await noLabel.click({ force: true });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (await this.premiumFinancingNoRadioField.isChecked()) {
      return;
    }

    await this.premiumFinancingNoRadioField.evaluate((element) => {
      const input = element as HTMLInputElement;
      input.click();
      input.checked = true;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitForBarbadosLoadingSpinner(this);

    await expect(this.premiumFinancingNoRadioField)
      .toBeChecked({ timeout: 5_000 });
  }
}
