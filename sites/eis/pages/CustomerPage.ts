import { expect, Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { BasePage } from "./BasePage";
import { generateCustomerInformation } from "../data/CustomerData";
import { executionContext } from "../../../lib/aio/executionContext";
import { closePartySearchPopupIfVisible, waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

// Type definition for form field names using actual label names for better readability
export type CustomerFormField =
  // General Information Fields
  | 'TRN'
  | 'Customer Risk Category'
  | 'Underwriter Review'
  | 'Date of Birth'
  | 'Gender'
  | 'Marital Status'
  | 'Nationality'
  | 'Tax Exempt'
  | 'Deceased?'
  | 'Death Notification Received'
  | 'Death Date'
  // Identification Fields
  | 'Identification Type'
  | 'Identification Number'
  | 'Salutation'
  | 'First Name'
  | 'Middle Name'
  | 'Last Name'
  | 'Suffix'
  | 'Designation'
  | 'Designation Description'
  | 'Nickname'
  | 'Associate Business Entities'
  | 'Associate Employments'
  | 'Associate Providers';

export class CustomerPage extends BasePage {
  // Field mapping for form interactions using readable label names
  private fieldMapping: Record<CustomerFormField, string> = {
    // General Information Fields
    'TRN': 'crmForm:generalInfo_trn',
    'Customer Risk Category': 'crmForm:generalInfo_customerRiskCategoryCd',
    'Underwriter Review': 'crmForm:generalInfo_underwriterReview',
    'Date of Birth': 'crmForm:generalInfo_birthDateInputDate',
    'Gender': 'crmForm:generalInfo_genderCd',
    'Marital Status': 'crmForm:generalInfo_maritalStatusCd',
    'Nationality': 'crmForm:generalInfo_citizenshipCd',
    'Tax Exempt': 'crmForm:generalInfo_taxExemptInd',
    'Deceased?': 'crmForm:generalInfo_deceased',
    'Death Notification Received': 'crmForm:generalInfo_deathNotificationReceived',
    'Death Date': 'crmForm:generalInfo_deathDateInputDate',
    // Identification Fields
    'Identification Type': 'crmForm:generalInfo_identificationTypeCd',
    'Identification Number': 'crmForm:generalInfo_taxId',
    'Salutation': 'crmForm:generalInfo_salutation',
    'First Name': 'crmForm:generalInfo_firstName',
    'Middle Name': 'crmForm:generalInfo_middleName',
    'Last Name': 'crmForm:generalInfo_lastName',
    'Suffix': 'crmForm:generalInfo_suffix',
    'Designation': 'crmForm:generalInfo_designationCd',
    'Designation Description': 'crmForm:generalInfo_designationDescription',
    'Nickname': 'crmForm:generalInfo_nickname',
    'Associate Business Entities': 'crmForm:generalInfo_associateBusinessEntity',
    'Associate Employments': 'crmForm:generalInfo_associateEmployment',
    'Associate Providers': 'crmForm:generalInfo_associateProvider'
  };

  readonly customerTabButton: Locator;
  readonly insuredTabButton: Locator;
  readonly createCustomerButton: Locator;
  readonly newCustomerTypeNonIndividualRadio: Locator;
  readonly newCustomerTypeIndividualRadio: Locator;
  readonly customerCreationTypeOKButton: Locator;
  readonly nextButton: Locator;
  readonly doneButton: Locator;
  readonly saveButton: Locator;
  readonly saveAndExitButton: Locator;
  readonly addQuoteButton: Locator;
  readonly addNewQuoteButton: Locator;
  readonly createQuoteButton: Locator;
  readonly takeActionButton: Locator;
  readonly customerTakeActionDropdown: Locator
  readonly takeActionDropdown: Locator;

  // INDIVIDUAL CUSTOMER FIELDS
  // CUSTOMER FORM
  // General Information Fields
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly identificationTypeField: Locator;
  readonly identificationNumberField: Locator;
  readonly trnField: Locator;
  readonly trnFieldLabel: Locator;
  readonly trnErrorMessage1: Locator;
  readonly trnErrorMessage2: Locator;
  readonly dateOfBirthField: Locator;
  readonly genderField: Locator;
  readonly nationalityField: Locator;
  readonly taxExemptField: Locator;
  readonly deceasedCheckbox: Locator;

  // Contact Details Fields
  readonly addressTypeField: Locator;
  readonly countryField: Locator;
  readonly zipPostCodeField: Locator;
  readonly parishField: Locator;
  readonly stateProvinceField: Locator;
  readonly addressLine1Field: Locator;
  readonly phoneNumberTypeField: Locator;
  readonly phoneNumberField: Locator;
  readonly emailTypeField: Locator;
  readonly emailField: Locator;

  // Sales Info Fields
  readonly leadSourceField: Locator;
  readonly ratingField: Locator;

  // Additional Information Fields
  readonly occupationField: Locator;
  readonly employmentStatusField: Locator;
  readonly sourceOfFundField: Locator
  readonly prominentPersonYesRadio: Locator;
  readonly prominentPersonNoRadio: Locator;
  readonly employerField: Locator;
  readonly titleField: Locator;
  readonly organizationNameField: Locator;

  // Quote Form
  readonly insuredPartySelectionField: Locator;
  readonly insuredPartyTRNField: Locator;
  readonly insuredPartyIdentificationNumberField: Locator;

  // Non-Individual Create Customer Fields
  readonly naicsClassificationSection: Locator;
  readonly naicsClassificationHeader: Locator;
  readonly naicsClassificationBody: Locator;

  readonly sicClassificationSection: Locator;
  readonly sicClassificationHeader: Locator;
  readonly sicClassificationBody: Locator;

  readonly tradingAsField: Locator;
  readonly underwriterReviewField: Locator;
  readonly underwriterReviewLabel: Locator;
  readonly einField: Locator;
  readonly einErrorMessage: Locator;

  // Non-Individual Update Customer Fields
  readonly updateUnderwriterReviewField: Locator;

  // Additional Non-Individual Customer Fields
  readonly nonIndividualTypeField: Locator;
  readonly legalNameField: Locator;
  readonly associateDivisionsCheckbox: Locator;
  readonly leadStatusField: Locator;
  readonly customerRiskCategoryField: Locator;
  readonly searchPartyButton: Locator;
  readonly addAdditionalNameButton: Locator;
  readonly associateAccountButton: Locator;
  readonly brandNameField: Locator;
  readonly brandTypeField: Locator;
  readonly brandCodeField: Locator;
  readonly addGroupButton: Locator;

  // Business Information Fields
  readonly companyNumberField: Locator;
  readonly dateBusinessStartedLabel: Locator;
  readonly dateBusinessStartedField: Locator;
  readonly yearsInFieldField: Locator;
  readonly numberOfEmployeesField: Locator;
  readonly descriptionField: Locator;
  readonly addSicClassificationButton: Locator;
  readonly addNaicsClassificationButton: Locator;
  readonly taxExemptCheckbox: Locator;
  readonly groupSponsorCheckbox: Locator;
  readonly entityTypeField: Locator;
  readonly primaryContactPreferenceField: Locator;
  readonly addNewContactsButton: Locator;
  readonly inCareOfField: Locator;
  readonly attentionField: Locator;
  readonly nonIndividualZipPostCodeField: Locator;
  readonly cityField: Locator;
  readonly nonIndividualStateProvinceField: Locator;
  readonly countyField: Locator;
  readonly addressLine2Field: Locator;
  readonly addressLine3Field: Locator;
  readonly subdivisionField: Locator;
  readonly addressValidatedField: Locator;
  readonly validateAddressButton: Locator;
  readonly latitudeField: Locator;
  readonly longitudeField: Locator;
  readonly accuracyField: Locator;
  readonly referenceIdField: Locator;
  readonly makePreferredField: Locator;
  readonly commentField: Locator;
  readonly communicationPreferencesField: Locator;
  readonly temporaryCheckbox: Locator;
  readonly removeAddressButton: Locator;
  readonly useAsReferenceField: Locator;
  readonly relatedPartyField: Locator;
  readonly prominentPersonQuestionYesRadio: Locator;
  readonly prominentPersonQuestionNoRadio: Locator;
  readonly usPepQuestionErrorMessage: Locator;
  readonly pepQuestionErrorMessage: Locator;
  readonly pepTitle: Locator;
  readonly pepOrganization: Locator;
  readonly titleErrorMessage: Locator;
  readonly organizationNameErrorMessage: Locator;

  //CUSTOMER SEARCH FORM
  readonly firstNameSearchField: Locator;
  readonly lastNameSearchField: Locator;
  readonly yesButton: Locator;
  readonly cancelButton: Locator;

  //CUSTOMER DETAIL PAGE
  readonly customerId: Locator;

  readonly trnErrorContainer: Locator;
  // Segment field locators
  readonly segmentDropdown: Locator;
  readonly segmentOptionsList: Locator;
  readonly segmentCloseButton: Locator;
  readonly segmentSelectedList: Locator;
  readonly segmentSelectedOptions: Locator;

  // Registered Owner fields
  readonly registeredOwnerFirstName: Locator;
  readonly registeredOwnerLastName: Locator;
  readonly registeredOwnerNameLegal: Locator;
  readonly customerIdLink: Locator;



  constructor(page: Page) {
    super(page);

    this.customerTabButton = page.getByRole('link', { name: 'Customer' });
    this.insuredTabButton = page.locator('#policyDataGatherForm\\:tabListList_1\\:1\\:link:has-text("Insured")');
    this.createCustomerButton = page.getByText("Create Customer");
    this.newCustomerTypeNonIndividualRadio = page.getByRole('radio', { name: 'Non-Individual' });
    this.newCustomerTypeIndividualRadio = page.getByRole('radio', { name: 'Individual', exact: true });
    this.customerCreationTypeOKButton = page.locator("[id='searchForm\:yes']");
    this.nextButton = page.locator("[id='crmForm\:nextBtn_footer']");
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.doneButton = page.locator("[id='crmForm\:doneBtn_footer']");
    this.saveButton = page.locator("#topSaveLink");
    this.saveAndExitButton = page.locator("#topSaveAndExitLink");
    this.addQuoteButton = page.getByText("Add Quote");
    this.addNewQuoteButton = page.getByText("Add New Quote");
    this.createQuoteButton = page.locator("[id='crmForm\:quoteForm:createQuoteButton']");
    this.takeActionButton = page.getByText('Take Action');
    this.customerTakeActionDropdown = page.locator('[id="custInfoForm\\:actionsForCustomerHeaderId"]')


    this.takeActionDropdown = page.locator('#custInfoForm\\:actionsForCustomerHeaderId');

    // INDIVIDUAL CUSTOMER FIELDS
    // CUSTOMER FORM
    // General Information Fields
    this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.identificationNumberField = page.getByRole('textbox', { name: 'Identification Number' });
    this.identificationTypeField = page.getByLabel("Identification Type");
    this.trnField = page.getByRole('textbox', { name: 'TRN' });
    this.trnFieldLabel = page.getByText('TRN');
    this.trnErrorMessage1 = page.getByText("Should not exceed 9 symbols");
    this.trnErrorMessage2 = page.getByText("Only positive integer numbers are allowed in range of 100000000 to 999999999");
    this.dateOfBirthField = page.locator('[id="crmForm\\:generalInfo_birthDateInputDate"]');
    this.genderField = page.getByLabel("Gender");
    this.nationalityField = page.getByLabel("Nationality");
    this.taxExemptField = page.getByRole('checkbox', { name: 'Tax Exempt' });
    this.deceasedCheckbox = page.locator('input#crmForm\\:generalInfo_deceased');

    // Contact Detail fields
    this.addressTypeField = page.locator("[id='crmForm\\:addressTypeInfo_0_addressTypeCd']");
    this.countryField = page.getByLabel('Country');
    this.zipPostCodeField = page.getByLabel('Zip/Post Code');
    this.parishField = page.getByLabel('Parish');
    this.stateProvinceField = page.getByLabel('State/Province');
    this.addressLine1Field = page.getByLabel('Address Line 1');
    this.phoneNumberTypeField = page.getByLabel('Phone Type');
    this.phoneNumberField = page.getByLabel('Phone Number');
    this.emailTypeField = page.getByLabel('Email Type');
    this.emailField = page.getByLabel('Email Address');

    //Additional Information fields
    this.occupationField = page.getByLabel('Occupation');
    this.employmentStatusField = page.getByLabel('Employment Status');
    this.sourceOfFundField = page.getByLabel('Source of fund');
    this.prominentPersonYesRadio = page.locator('input[id="crmForm\\:additionalInfo_seniorPublicOfficeInd\\:0"]');
    this.prominentPersonNoRadio = page.locator('input[id="crmForm\\:additionalInfo_seniorPublicOfficeInd\\:1"]')
    this.employerField = page.getByRole('textbox', { name: 'Employer' });
    this.titleField = page.getByLabel('Title');
    this.organizationNameField = page.getByLabel('Name of the organization');

    // Quote Form
    this.insuredPartySelectionField = page.getByLabel('Insured Party Selection');
    this.insuredPartyTRNField = page.getByLabel('TRN');
    this.insuredPartyIdentificationNumberField = page.getByLabel('Identification Number');

    // Non-Individual Create Customer Fields
    this.sicClassificationSection = page.locator('#crmForm\\:sicClassificationSection')
    this.sicClassificationHeader = page.locator('#crmForm\\:sicClassification_header');
    this.sicClassificationBody = page.locator('#crmForm\\:sicClassification_body');

    this.naicsClassificationSection = page.locator('#crmForm\\:naicsClassificationSection');
    this.naicsClassificationHeader = page.locator('#crmForm\\:naicsClassification_header');
    this.naicsClassificationBody = page.locator('#crmForm\\:naicsClassification_body');

    this.tradingAsField = page.locator('#crmForm\\:label-generalInfoLeft_dbaName');
    this.underwriterReviewField = page.locator('[id="crmForm:generalInfoRight_underwriterReview"]');
    this.underwriterReviewLabel = page.locator('[id="crmForm:label-generalInfoRight_underwriterReview"]');

    // Non-Individual Update Customer Fields
    this.updateUnderwriterReviewField = page.locator('#crmForm\\:_underwriterReview');

    //Business Information
    this.einField = page.locator('#crmForm\\:label-legalId');
    this.einErrorMessage = page.getByText(
      'Company Number/Taxpayer Registration number is required',
      { exact: true }
    );
    // Additional Non-Individual Customer Fields
    this.nonIndividualTypeField = page.locator('#crmForm\\:generalInfoLeft_businessType');
    this.legalNameField = page.locator('#crmForm\\:label-generalInfoLeft_legalName');
    this.associateDivisionsCheckbox = page.locator('#crmForm\\:generalInfoLeft_associateDivisions');
    this.leadStatusField = page.locator('#crmForm\\:label-generalInfoLeft_leadStatusCd');
    this.customerRiskCategoryField = page.locator('#crmForm\\:generalInfoRight_customerRiskCategoryCd');
    this.searchPartyButton = page.locator('#crmForm\\:searchNonindvPartyBtn');

    this.addAdditionalNameButton = page.locator('#crmForm\\:additionalNameMethod\\:addAdditionalNameBtn');
    this.associateAccountButton = page.locator('#crmForm\\:associateAccountLink');
    this.brandNameField = page.locator('#crmForm\\:brandInfoWidget_name');
    this.brandTypeField = page.locator('#crmForm\\:label-generalInfoLeft_brandTypeCd');
    this.brandCodeField = page.locator('#crmForm\\:label-generalInfoLeft_brandCode');
    this.addGroupButton = page.locator('#crmForm\\:label-generalInfoLeft_addGroupButton');

    this.companyNumberField = page.locator('#crmForm\\:generalInfoLeft_legalId');
    this.dateBusinessStartedLabel = page.locator('#crmForm\\:label-generalInfoLeft_dateStarted');
    this.dateBusinessStartedField = page.locator('#crmForm\\:generalInfoLeft_dateStartedInputDate');
    this.yearsInFieldField = page.locator('#crmForm\\:label-generalInfoLeft_yearsInField');
    this.numberOfEmployeesField = page.locator('#crmForm\\:label-generalInfoLeft_numberOfEmployees');
    this.descriptionField = page.locator('#crmForm\\:label-generalInfoLeft_description');
    this.addSicClassificationButton = page.locator('#crmForm\\:label-generalInfoLeft_addSicClassificationButton');
    this.addNaicsClassificationButton = page.locator('#crmForm\\:label-generalInfoLeft_addNaicsClassificationButton');
    this.taxExemptCheckbox = page.locator('#crmForm\\:generalInfo_taxExemptInd');
    this.groupSponsorCheckbox = page.locator('#crmForm\\:label-generalInfoLeft_groupSponsorInd');
    this.entityTypeField = page.locator('#crmForm\\:label-generalInfoLeft_entityTypeCd');

    this.primaryContactPreferenceField = page.locator('#crmForm\\:label-generalInfoLeft_primaryContactPreferenceCd');
    this.addNewContactsButton = page.locator('#crmForm\\:label-generalInfoLeft_addNewContactsButton');
    this.inCareOfField = page.locator('#crmForm\\:label-generalInfoLeft_inCareOf');
    this.attentionField = page.locator('#crmForm\\:label-generalInfoLeft_attention');
    this.nonIndividualZipPostCodeField = page.locator('#crmForm\\:addressInfo_0_postalCode');

    this.cityField = page.locator('#crmForm\\:addressInfo_0_city');
    this.nonIndividualStateProvinceField = page.locator('#crmForm\\:addressInfo_0_stateProvCd');
    this.countyField = page.locator('#crmForm\\:label-generalInfoLeft_county');
    this.addressLine2Field = page.locator('#crmForm\\:label-generalInfoLeft_addressLine2');
    this.addressLine3Field = page.locator('#crmForm\\:label-generalInfoLeft_addressLine3');

    this.subdivisionField = page.locator('#crmForm\\:label-generalInfoLeft_subdivision');
    this.addressValidatedField = page.locator('#crmForm\\:label-generalInfoLeft_addressValidated');
    this.validateAddressButton = page.locator('#crmForm\\:label-generalInfoLeft_validateAddressButton');
    this.latitudeField = page.locator('#crmForm\\:label-generalInfoLeft_latitude');
    this.longitudeField = page.locator('#crmForm\\:label-generalInfoLeft_longitude');
    this.accuracyField = page.locator('#crmForm\\:label-generalInfoLeft_accuracy');
    this.referenceIdField = page.locator('#crmForm\\:label-generalInfoLeft_referenceId');
    this.makePreferredField = page.locator('#crmForm\\:label-generalInfoLeft_makePreferred');
    this.commentField = page.locator('#crmForm\\:label-generalInfoLeft_comment');
    this.communicationPreferencesField = page.locator('#crmForm\\:label-generalInfoLeft_communicationPreferences');
    this.temporaryCheckbox = page.locator('#crmForm\\:label-generalInfoLeft_temporary');
    this.removeAddressButton = page.locator('#crmForm\\:label-generalInfoLeft_removeAddressButton');
    this.useAsReferenceField = page.locator('#crmForm\\:label-generalInfoLeft_useAsReference');
    this.relatedPartyField = page.locator('#crmForm\\:label-generalInfoLeft_relatedParty');
    this.prominentPersonQuestionYesRadio = page.locator('#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:0');
    this.prominentPersonQuestionNoRadio = page.locator('#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:1');

    this.usPepQuestionErrorMessage = page.getByRole('cell', { name: "You cannot select 'Yes' to the politically exposed person question above for countries other than Barbados and Jamaica.", exact: true });
    this.pepQuestionErrorMessage = page.locator('span.rf-msg-det', { hasText: "You need to answer the politically exposed person question." });

    this.pepTitle = page.locator('#crmForm\\:additionalInfo_title');
    this.pepOrganization = page.locator('#crmForm\\:additionalInfo_organizationName');

    this.titleErrorMessage = page.getByRole('cell', { name: "Title is required", exact: true });
    this.organizationNameErrorMessage = page.getByRole('cell', { name: "Name of the organization is required", exact: true });

    //CUSTOMER SEARCH FORM
    this.firstNameSearchField = page.getByRole('textbox', { name: 'First Name' });
    this.customerId = page.locator('#custInfoForm\\:customerId');

    this.trnErrorContainer = page.locator('#crmForm\\:generalInfo_trn_error .rf-msg-det');
    // Segment dropdown and options
    this.segmentDropdown = page.locator('div#crmForm\\:additionalInfo_segments');
    this.segmentOptionsList = page.locator('#crmForm\\:additionalInfo_segments_panel ul.ui-selectcheckboxmenu-items');
    this.segmentCloseButton = page.locator('#crmForm\\:additionalInfo_segments_panel .ui-selectcheckboxmenu-close');
    this.segmentSelectedList = page.locator('#crmForm\\:additionalInfo_segments_list');
    this.segmentSelectedOptions = page.locator('#crmForm\\:additionalInfo_segments_list div.rf-p-b > div');

    // Registered Owner fields
    this.registeredOwnerFirstName = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoRegisteredOwner_nameInfo_firstName');
    this.registeredOwnerLastName = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoRegisteredOwner_nameInfo_lastName');
    this.registeredOwnerNameLegal = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoRegisteredOwner_nameLegal');
    this.customerIdLink = this.page.locator(
      '#custAssociations\\:customersToDisplay\\:0\\:updateCustomerLink'
    );
  }

  /**
   * Verifies the value of a form field
   * @param fieldName - The name of the field to verify (with intellisense support)
   * @param expectedValue - The expected value of the field
   */
  async verifyFormField(fieldName: CustomerFormField, expectedValue: string | boolean) {
    const fieldId = this.fieldMapping[fieldName];
    const field = this.page.locator(`[id="${fieldId}"]`);

    // Handle different field types
    const fieldType = await field.evaluate(el => {
      if (el instanceof HTMLInputElement) {
        return el.type;
      } else if (el instanceof HTMLSelectElement) {
        return 'select';
      }
      return 'unknown';
    });

    switch (fieldType) {
      case 'checkbox':
        const isChecked = await field.isChecked();
        await expect(isChecked).toBe(expectedValue);
        break;
      case 'select':
        const selectedValue = await field.inputValue();
        await expect(selectedValue).toBe(expectedValue);
        break;
      case 'text':
      case 'date':
      default:
        await expect(field).toHaveValue(expectedValue as string);
        break;
    }
  }

  /**
   * Gets the current value of a form field
   * @param fieldName - The name of the field to get the value from (with intellisense support)
   * @returns The current value of the field
   */
  async getFormField(fieldName: CustomerFormField): Promise<string> {
    const fieldId = this.fieldMapping[fieldName];
    const field = this.page.locator(`[id="${fieldId}"]`);
    return await field.inputValue();
  }

  /**
   * Updates the value of a form field
   * @param fieldName - The name of the field to update (with intellisense support)
   * @param value - The value to set in the field
   */
  async updateFormField(fieldName: CustomerFormField, value: string | boolean) {
    const fieldId = this.fieldMapping[fieldName];
    const field = this.page.locator(`[id="${fieldId}"]`);

    // Handle different field types
    const fieldType = await field.evaluate(el => {
      if (el instanceof HTMLInputElement) {
        return el.type;
      } else if (el instanceof HTMLSelectElement) {
        return 'select';
      }
      return 'unknown';
    });

    switch (fieldType) {
      case 'checkbox':
        if (value === true || value === 'true') {
          await field.check();
        } else {
          await field.uncheck();
        }
        break;
      case 'select':
        await field.selectOption({ value: value as string });
        break;
      case 'text':
      case 'date':
      default:
        await field.fill(value as string);
        break;
    }

    // Wait for any loading spinners after field updates
    await waitForBarbadosLoadingSpinner(this);
  }

  async goto() {
    const loginPom = new LoginPage(this.page);
    await loginPom.goto();
    await loginPom.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
  }

  async login(username: string, password: string) {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.expectCorrectLoginRedirect();
    await waitForBarbadosLoadingSpinner(this);
  }

  async click(clickable: Locator) {
    await clickable.click();
  }

  async clickCustomerTabButton() {
    await this.customerTabButton.click();
  }

  async clickInsuredTabButton() {
    await this.insuredTabButton.click();
  }

  async clickCreateCustomerButton() {
    await this.createCustomerButton.click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickDone() {
    await this.doneButton.click();
  }
  async clickSave() {
    
    await this.saveButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickSaveAndExit() {
    await this.saveAndExitButton.click();
    await waitForBarbadosLoadingSpinner(this);
  }

  async clickAddQuote() {
    await this.addQuoteButton.click();
  }

  async clickAddNewQuote() {
    await this.addNewQuoteButton.click();
  }

  async selectOptionForField(field: Locator, value: string) {
    await field.selectOption({ label: value });
  }

  async selectInsured(customerRequiredInformation) {
    const customerName = customerRequiredInformation.generalInformation['First Name'] +
      ' ' +
      customerRequiredInformation.generalInformation['Last Name'];
    await this.insuredPartySelectionField.selectOption({
      label:
        customerName
    });
  }

  async selectTakeActionItem(action: string) {
    await this.takeActionDropdown.selectOption({ label: action });
  }

  async customerCreationTypeModal(customerType: string) {
    switch (customerType) {
      case "Individual":
        await this.newCustomerTypeIndividualRadio.click()
        break;
      case "Non-Individual":
        await this.newCustomerTypeNonIndividualRadio.click()
        break
      default:
        break;
    }
    await this.customerCreationTypeOKButton.click();
  }

  async trnFieldIsPresent() {
    await expect(this.trnField).toBeVisible();
    await expect(this.trnFieldLabel).toBeVisible();
  }

  // Individual Customer Verifications
  async verifyTRNFieldEmpty() {
    await expect(this.trnField).toBeEmpty();
  }

  async verifyTRNFieldisEditable(input) {
    await this.trnField.fill(input);
    await expect(this.trnField).toHaveValue(input);
  }

  async verifyTRNFieldIsNotRequired() {
    const errorMessageContainer = this.page.locator(
      "[id='crmForm\\:generalInfo_trn_errorGrid'] > .rf-msg > *"
    );
    await expect(errorMessageContainer).toHaveCount(0);
  }

  async verifyTRNisRequriedWhenFormCompleted() {
    const requiredTRNError = this.page.getByRole('cell', { name: 'TRN is required', exact: true });
    await expect(requiredTRNError).toBeVisible();
  }

  async verifyCustomerCreated() {
    const urlRegex =  /.+\/eis-app\/flow\?_flowId=crm-customer-detail-flow&customerId=\d*&_windowId=W\d*(#noback)?/;
    await expect(this.page).toHaveURL(
      urlRegex
    );
    await this.updateExecutionContextWithCustomer();
  }

  async verifyTRNFieldIsPrePopulated(trn) {
    await expect(this.insuredPartyTRNField).toHaveValue(trn);
    await expect(this.insuredPartyIdentificationNumberField).toHaveValue(trn);
  }

  //Non-Individual Customer Verifications
  async verifyTradingAsFieldExists() {
    await expect(this.tradingAsField).toBeVisible();
  }

  async verifyUnderwriterReviewFieldExists() {
    await expect(this.underwriterReviewField).toBeVisible();
  }

  async verifyErrorMessageWhenNoEINNumberisInputted() {
    await expect(this.einErrorMessage).toBeVisible();
  }

  async verifyEINFieldIsRelabeled() {
    await expect(this.einField).toHaveCount(1);
  }

  async verifySICSectionNotDisplayedByDefault() {
    await expect(this.sicClassificationSection).toBeVisible({ visible: false })
  }

  async verifyNAISSectionNotDisplayedByDefault() {
    await expect(this.naicsClassificationSection).toBeVisible({ visible: false })
  }

  async verifyTaxExemptReviewTaskExists() {
    await expect(this.page
      .locator('table.table_style.fixed-layout-table')
      .getByText('Tax Exempt Review', { exact: true })
      .last())
      .toBeVisible();
  }

  async verifyTaskInCorrectQueue(expectedQueue: string) {
    await expect(
      this.page
        .locator('table.table_style.fixed-layout-table')
        .locator(':right-of(:text("Tax Exempt Review"))')
        .getByText('Underwriting').first()
    ).toBeVisible();
  }

  async verifyTaskHasCorrectDescription(expectedDescription: string) {
    // Gets list in descending orderf
    await this.page.getByText('Task ID').click();
    await this.page.getByText('Task ID').click();

    await this.page.locator('tr')
      .filter({ has: this.page.locator(':text-matches("Tax Exempt Review")') })
      .first()
      .locator('a:text-matches("^\\\\d{5}$")')
      .first()
      .click();
    await expect(this.page.getByText(expectedDescription, { exact: true })).toBeVisible();
  }

  /**
   * Selects one or more segments from the segment dropdown.
   * @param segments Array of segment names to select (e.g., ['BCIC Director'])
   */
  async selectSegments(segments: string[]) {
    await this.segmentDropdown.click();
    for (const segment of segments) {
      const option = this.segmentOptionsList.locator('li').filter({ hasText: segment });
      const checkbox = option.locator('div.ui-chkbox-box');
      // Only click if not already checked
      if (await option.getAttribute('class').then(cls => !cls?.includes('ui-selectcheckboxmenu-checked'))) {
        await checkbox.click();
      }
    }
    // Close the dropdown by clicking the close button in the segment panel
    if (await this.segmentCloseButton.isVisible()) {
      await this.segmentCloseButton.click();
    } else {
      // Click outside to close dropdown (clicking the dropdown again is usually safe)
      await this.segmentDropdown.click();
    }
  }

  async fillRequiredInformation(customerRequiredInformation: any) {
    const firstName = customerRequiredInformation?.generalInformation?.['First Name'];
    const lastName = customerRequiredInformation?.generalInformation?.['Last Name'];

    if (firstName || lastName) {
      executionContext.customerName = [firstName, lastName].filter(Boolean).join(' ');
      executionContext.customerDetails = this.formatCustomerDetails(customerRequiredInformation);
    }

    const country = customerRequiredInformation?.contactDetails?.['Country'];
    if (country) {
      executionContext.region = country;
    }

    // General Information
    if (customerRequiredInformation?.generalInformation?.['Identification Type'] !== undefined) {
      await this.identificationTypeField.selectOption({ label: customerRequiredInformation.generalInformation['Identification Type'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['Identification Number'] !== undefined) {
      await this.identificationNumberField.fill(customerRequiredInformation.generalInformation['Identification Number']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['First Name'] !== undefined) {
      await this.firstNameField.fill(customerRequiredInformation.generalInformation['First Name']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['Last Name'] !== undefined) {
      await this.lastNameField.fill(customerRequiredInformation.generalInformation['Last Name']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['Date of Birth'] !== undefined) {
      await this.dateOfBirthField.fill(customerRequiredInformation.generalInformation['Date of Birth']);
      await this.dateOfBirthField.press("Tab");
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['Gender'] !== undefined) {
      await this.genderField.selectOption({ label: customerRequiredInformation.generalInformation['Gender'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.generalInformation?.['Nationality'] !== undefined) {
      await this.nationalityField.selectOption({ label: customerRequiredInformation.generalInformation['Nationality'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    // Contact Details
    if (customerRequiredInformation?.contactDetails?.['Address Type'] !== undefined) {
      await this.addressTypeField.scrollIntoViewIfNeeded()
      await this.addressTypeField.selectOption({ label: customerRequiredInformation.contactDetails['Address Type'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.contactDetails?.['Country'] !== undefined) {
      await this.countryField.selectOption({ label: customerRequiredInformation.contactDetails['Country'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.contactDetails?.['ZIP/Post Code'] !== undefined) {
      await this.zipPostCodeField.fill(customerRequiredInformation.contactDetails['ZIP/Post Code']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.contactDetails?.['State/Province']) {
      await this.stateProvinceField.selectOption({ label: customerRequiredInformation.contactDetails['State/Province'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.contactDetails?.['Parish'] !== undefined) {
      await this.parishField.selectOption({ label: customerRequiredInformation.contactDetails['Parish'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.contactDetails?.['Address Line 1'] !== undefined) {
      if (country === 'Barbados') {
        await this.fillBarbadosAddressLine1(
          customerRequiredInformation.contactDetails['Address Line 1']
        );
      } else {
        await this.addressLine1Field.clear();
        await this.addressLine1Field.fill(customerRequiredInformation.contactDetails['Address Line 1']);
        await waitForBarbadosLoadingSpinner(this);
      }
    }

    // Phone Number
    if (customerRequiredInformation?.contactDetails?.['Phone Number'] !== undefined) {
      await this.phoneNumberTypeField.scrollIntoViewIfNeeded()
      await this.phoneNumberTypeField.selectOption({ label: customerRequiredInformation.contactDetails['Phone Type'] || 'Home' });
      await waitForBarbadosLoadingSpinner(this);
      await this.phoneNumberField.fill(customerRequiredInformation.contactDetails['Phone Number']);
      await waitForBarbadosLoadingSpinner(this);
    }

    // Email Address
    if (customerRequiredInformation?.contactDetails?.['Email'] !== undefined) {
      await this.emailTypeField.selectOption({ label: customerRequiredInformation.contactDetails['Email Type'] || 'Personal' });
      await waitForBarbadosLoadingSpinner(this);
      await this.emailField.fill(customerRequiredInformation.contactDetails['Email']);
      await waitForBarbadosLoadingSpinner(this);
    }

    // Additional Information
    if (customerRequiredInformation?.additionalInformation?.['Occupation'] !== undefined) {
      await this.occupationField.scrollIntoViewIfNeeded()
      await this.occupationField.selectOption({ label: customerRequiredInformation.additionalInformation['Occupation'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.additionalInformation?.['Employment Status'] !== undefined) {
      await this.employmentStatusField.selectOption({ value: customerRequiredInformation.additionalInformation['Employment Status'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.additionalInformation?.['Source of fund'] !== undefined) {
      await this.sourceOfFundField.selectOption({ label: customerRequiredInformation.additionalInformation['Source of fund'] });
      await waitForBarbadosLoadingSpinner(this);
    }

    // Prominent Person (radio)
    if (
      customerRequiredInformation.additionalInformation['Prominent Person'] === 'Yes' ||
      customerRequiredInformation.additionalInformation['Prominent Person'] === true
    ) {
      await this.page.evaluate(() => {
        const cb = document.querySelector("#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:0") as HTMLInputElement;
        if (cb && !cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('input', { bubbles: true }));
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          cb.click();
        }
      });
    } else {
      await this.page.evaluate(() => {
        const cb = document.querySelector("#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:1") as HTMLInputElement;
        if (cb && !cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('input', { bubbles: true }));
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          cb.click();
        }
      });
    }
    await waitForBarbadosLoadingSpinner(this);
    await this.page.waitForTimeout(1000);
    await this.employerField.scrollIntoViewIfNeeded()

    if (customerRequiredInformation?.additionalInformation?.['Prominent Person'] !== undefined) {
      await this.selectProminentPerson(customerRequiredInformation.additionalInformation['Prominent Person']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation?.additionalInformation?.['Employer'] !== undefined) {
      await this.employerField.fill(customerRequiredInformation.additionalInformation['Employer']);
      await waitForBarbadosLoadingSpinner(this);
    }

    if (customerRequiredInformation.additionalInformation['Prominent Person'] === 'Yes' ||
      customerRequiredInformation.additionalInformation['Prominent Person'] === true) {
      await this.organizationNameField.fill(customerRequiredInformation.additionalInformation['Organization']);
      await waitForBarbadosLoadingSpinner(this);

      await this.titleField.fill(customerRequiredInformation.additionalInformation['Title']);
      await waitForBarbadosLoadingSpinner(this);
    }

    // Select segments if present
    if (customerRequiredInformation.segments && Array.isArray(customerRequiredInformation.segments) && customerRequiredInformation.segments.length > 0) {
      await this.selectSegments(customerRequiredInformation.segments);
      await waitForBarbadosLoadingSpinner(this);
    }

    return customerRequiredInformation;
  }

  async fillRequiredNonIndividualCustomerInformation(nonIndividualCustomerInformation: any) {
    // General Information
    if (nonIndividualCustomerInformation.generalInformation) {
      const generalInfo = nonIndividualCustomerInformation.generalInformation;

      if (generalInfo['Non-Individual Type']) {
        await this.nonIndividualTypeField.selectOption({ label: generalInfo['Non-Individual Type'] });
        await waitForBarbadosLoadingSpinner(this);
      }

      if (generalInfo['Name - Legal']) {
        await this.legalNameField.fill(generalInfo['Name - Legal']);
        await waitForBarbadosLoadingSpinner(this);
      }
    }

    // Business Information
    if (nonIndividualCustomerInformation.businessInformation) {
      const businessInfo = nonIndividualCustomerInformation.businessInformation;

      await this.nonIndividualTypeField.scrollIntoViewIfNeeded();
      if (businessInfo['Company Number/Taxpayer Registration Number']) {
        await this.companyNumberField.fill(businessInfo['Company Number/Taxpayer Registration Number']);
        await waitForBarbadosLoadingSpinner(this);
      }
    }

    // Address Details
    if (nonIndividualCustomerInformation.contactDetails) {
      const contactInfo = nonIndividualCustomerInformation.contactDetails;

      await this.nonIndividualTypeField.scrollIntoViewIfNeeded();
      if (contactInfo['Address Type']) {
        await this.addressTypeField.selectOption({ label: contactInfo['Address Type'] });
        await waitForBarbadosLoadingSpinner(this);
      }

      if (contactInfo['Country']) {
        await this.countryField.selectOption({ label: contactInfo['Country'] });
        await waitForBarbadosLoadingSpinner(this);
      }

      if (contactInfo['Zip/Post Code']) {
        await this.nonIndividualZipPostCodeField.fill(contactInfo['Zip/Post Code']);
        await waitForBarbadosLoadingSpinner(this);
      }

      if (contactInfo['City']) {
        await this.cityField.fill(contactInfo['City']);
        await waitForBarbadosLoadingSpinner(this);
      }

      if (contactInfo['State/Province']) {
        await this.nonIndividualStateProvinceField.selectOption({ label: contactInfo['State/Province'] });
        await waitForBarbadosLoadingSpinner(this);
      }
      
      if (contactInfo['Parish']) {
        await this.parishField.selectOption({ label: contactInfo['Parish'] });
        await waitForBarbadosLoadingSpinner(this);
      }

      if (contactInfo['Address Line 1']) {
        if (contactInfo['Country'] === 'Barbados') {
          await this.fillBarbadosAddressLine1(
            contactInfo['Address Line 1']
          );
        } else {
          await this.addressLine1Field.scrollIntoViewIfNeeded();
          await this.addressLine1Field.click();
          await waitForBarbadosLoadingSpinner(this);
          await this.addressLine1Field.fill(contactInfo['Address Line 1']);
          await waitForBarbadosLoadingSpinner(this);
        }
      }
    }

    // Phone Number
    if (nonIndividualCustomerInformation?.contactDetails?.['Phone Number'] !== undefined) {
      await this.phoneNumberTypeField.scrollIntoViewIfNeeded()
      await this.phoneNumberTypeField.selectOption({ label: nonIndividualCustomerInformation.contactDetails['Phone Type'] || 'Mobile' });
      await waitForBarbadosLoadingSpinner(this);
      await this.phoneNumberField.fill(nonIndividualCustomerInformation.contactDetails['Phone Number']);
      await waitForBarbadosLoadingSpinner(this);
    }

    // Email Address
    if (nonIndividualCustomerInformation?.contactDetails?.['Email'] !== undefined) {
      await this.emailTypeField.selectOption({ label: nonIndividualCustomerInformation.contactDetails['Email Type'] || 'Common' });
      await waitForBarbadosLoadingSpinner(this);
      await this.emailField.fill(nonIndividualCustomerInformation.contactDetails['Email']);
      await waitForBarbadosLoadingSpinner(this);
    }

    // Sales Info
    if (nonIndividualCustomerInformation.salesInfo) {
      const salesInfo = nonIndividualCustomerInformation.salesInfo;

      if (salesInfo['Lead Source']) {
        await this.leadSourceField.selectOption({ label: salesInfo['Lead Source'] });
        await waitForBarbadosLoadingSpinner(this);
      }

      if (salesInfo['Rating']) {
        await this.ratingField.selectOption({ label: salesInfo['Rating'] });
        await waitForBarbadosLoadingSpinner(this);
      }
    }

    // Additional Information
    if (nonIndividualCustomerInformation.additionalInformation) {
      const additionalInfo = nonIndividualCustomerInformation.additionalInformation;

      if (additionalInfo['Prominent Person Question']) {
        await this.selectProminentPerson(additionalInfo['Prominent Person Question']);
      }

      if (additionalInfo['Title']) {
        await this.titleField.fill(additionalInfo['Title']);
        await waitForBarbadosLoadingSpinner(this);
      }

      if (additionalInfo['Name of the organization']) {
        await this.organizationNameField.fill(additionalInfo['Name of the organization']);
        await waitForBarbadosLoadingSpinner(this);
      }
    }
  }

  /**
     * Enter customer details
     * @param customerDetails - The customer details to enter.
     */
  async enterCustomerDetails(customerDetails: object, options: { taxExempt?: boolean } = {}) {
    // Navigate to the customer menu item
    await this.quickSearchButton.click();
    await waitForBarbadosLoadingSpinner(this);

    await this.createNewCustomerButton.click();
    await waitForBarbadosLoadingSpinner(this);

    await this.customerCreationTypeModal('Individual');

    await this.fillRequiredInformation(customerDetails);

    if (customerDetails['additionalInformation']['Deceased'] === 'Yes') {
      await this.deceasedCheckbox.check();
      await waitForBarbadosLoadingSpinner(this);
    }

    if (options.taxExempt) {
      await this.taxExemptCheckbox.check();
      await waitForBarbadosLoadingSpinner(this);
    }

    await waitForBarbadosLoadingSpinner(this);
    await this.trnField.fill((customerDetails['generalInformation']['Identification Number']));
    await waitForBarbadosLoadingSpinner(this);
    await this.page.keyboard.press('Tab');
    await waitForBarbadosLoadingSpinner(this);
    await this.clickNext();
    
    await this.handleCustomerPartySearch();
    await this.clickDone();

    await this.handleDuplicateCustomer(customerDetails['generalInformation']);
  }


  /**
     * Update customer details to have tax exemption
     * @param customerId - The customer ID to update.
     * @param options - The options for the update.
     * @param options.taxExempt - Whether the customer is tax exempt.
     */
  async updateCustomerDetailsToHaveTaxExemption(customerId: string, options: { taxExempt?: boolean } = {}) {

    await this.clickCustomerTabButton();

    await this.takeActionDropdown.selectOption('Update');
    await waitForBarbadosLoadingSpinner(this);

    const isCurrentlyChecked = await this.taxExemptCheckbox.isChecked();

    if (options.taxExempt && !isCurrentlyChecked) {
      await this.taxExemptCheckbox.check();
      await waitForBarbadosLoadingSpinner(this);
    } else if (!options.taxExempt && isCurrentlyChecked) {
      await this.taxExemptCheckbox.uncheck();
      await waitForBarbadosLoadingSpinner(this);
    }

    await this.clickNext();

    await this.handleCustomerPartySearch();
    await this.clickDone();
  }

  /**
   * Creates a new customer with the given age and country.
   * @param age - The age of the customer.
   * @param country - The country of the customer.
   * @param options - The options for the customer.
   * @param options.deceased - Whether the customer is deceased.
   * @param options.segments - The segments for the customer.
   * @returns The customer name and ID.
   */
  async createNewCustomer(age: number = 40, country: string = 'Jamaica', options: { deceased?: boolean, segments?: string[], taxExempt?: boolean } = {}) {
    const customer = generateCustomerInformation(age, country, options);
    await this.enterCustomerDetails(customer, options);
    const customerName = `${customer.generalInformation['First Name']} ${customer.generalInformation['Last Name']}`;
    const customerId = await this.customerId.textContent() || '';
    if (!customerId.trim()) throw new Error('Customer ID not found');
    executionContext.customerName = customerName;
    executionContext.customerId = customerId.trim();
    executionContext.customerDetails = this.formatCustomerDetails(customer);
    executionContext.region = country;
    return { customerName, customerId: customerId.trim(), customerDetails: customer };
  }

  private async updateExecutionContextWithCustomer() {
    const customerId = (await this.customerId.textContent().catch(() => ''))?.trim() || '';

    if (customerId) {
      executionContext.customerId = customerId;
    }
  }

  private async fillBarbadosAddressLine1(addressLine1: string): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      await closePartySearchPopupIfVisible(this.page);
      await this.addressLine1Field.scrollIntoViewIfNeeded();
      await expect(this.addressLine1Field).toBeVisible();
      await expect(this.addressLine1Field).toBeEnabled();

      await this.addressLine1Field.click();
      await this.addressLine1Field.clear();
      await this.addressLine1Field.fill(addressLine1);
      await expect(this.addressLine1Field).toHaveValue(addressLine1);
      await this.addressLine1Field.press('Tab');
      await waitForBarbadosLoadingSpinner(this);

      const currentValue = await this.addressLine1Field
        .inputValue()
        .catch(() => '');

      if (currentValue === addressLine1) {
        return;
      }
    }

    await expect(this.addressLine1Field).toHaveValue(addressLine1);
  }

  private formatCustomerDetails(customer: any): string {
    const generalInformation = customer?.generalInformation || {};
    const contactDetails = customer?.contactDetails || {};

    return JSON.stringify({
      firstName: generalInformation['First Name'],
      lastName: generalInformation['Last Name'],
      identificationType: generalInformation['Identification Type'],
      identificationNumber: generalInformation['Identification Number'],
      dateOfBirth: generalInformation['Date of Birth'],
      country: contactDetails['Country'],
      addressLine1: contactDetails['Address Line 1']
    });
  }

  /**
   * Selects the prominent person radio button.
   * This radio button doesn't react to click or checked properties, so we need to use evaluate to select it.
   * @param prominentPersonAnswer - The prominent person to select.
   */
  async selectProminentPerson(prominentPersonAnswer: string | boolean) {
    if (
      prominentPersonAnswer === 'Yes' ||
      prominentPersonAnswer === true
    ) {
      await this.page.evaluate(() => {
        const cb = document.querySelector('#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:0') as HTMLInputElement;
        if (cb && !cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('input', { bubbles: true }));
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          cb.click();
        }
      });
    } else {
      await this.page.evaluate(() => {
        const cb = document.querySelector('#crmForm\\:additionalInfo_seniorPublicOfficeInd\\:1') as HTMLInputElement;
        if (cb && !cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('input', { bubbles: true }));
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          cb.click();
        }
      });
    }
    await waitForBarbadosLoadingSpinner(this);
  }

  async verifyErrorMessage(errorMessage: string) {
    await expect(this.page.getByRole('cell', { name: errorMessage, exact: true })).toBeVisible();
  }
  async verifyErrorMessageValidation(errorMessage: string) {
    await this.page.waitForTimeout(5000);
    await expect(this.page.getByText(errorMessage)).toBeVisible();
  }

}

