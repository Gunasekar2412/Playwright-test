import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { getLicenseDates, waitForLoadingSpinner } from '../../../lib/utils';
import { PolicyPage } from "./PolicyPage";
import { RatingPage } from "./RatingPage";
import { waitForBarbadosLoadingSpinner, closePartySearchPopupIfVisible } from '../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    getPolicyEffectiveDateTime,
    PolicyEffectiveDateTime,
    PolicyRegion
} from '../../../lib/policyEffectiveDateTime';

export class BasePage {
    readonly page: Page;
    readonly loginPage: LoginPage;

    // Loading elements
    readonly loadingSpinner: Locator;
    readonly loadingShade: Locator;

    // Search elements
    readonly customerNumberField: Locator;
    readonly searchButton: Locator;

    // Popup elements
    readonly partySearchPopup: Locator;
    readonly partySearchPopupShade: Locator;

    // Tab elements
    readonly tabList: Locator;
    readonly headerNextButton: Locator;
    readonly quickSearchButton: Locator;
    readonly overviewNextButton: Locator;

    readonly policyTab: Locator;
    readonly quoteTab: Locator;
    readonly insuredTab: Locator;
    readonly driverTab: Locator;
    readonly vehicleTab: Locator;
    readonly mvrClaimsTab: Locator;
    readonly premiumAndCoveragesTab: Locator;
    readonly fundingSummaryTab: Locator;

    // Quote elements
    readonly addQuoteButton: Locator;
    readonly addNewQuoteButton: Locator;
    readonly lineOfBusinessField: Locator;
    readonly productField: Locator;
    readonly startQuoteNextButton: Locator;

    // Take action dropdown
    readonly takeActionButton: Locator;
    readonly takeActionDropdown: Locator;

    // Policy elements
    readonly policyCountyField: Locator;
    readonly effectiveDateField: Locator;
    readonly policyOverviewStatusText: Locator;

    // Branch elements
    readonly branchField: Locator;

    // Insured Party elements
    readonly addNewInsuredButton: Locator;
    readonly insuredPartySelection: Locator;
    readonly insuredFirstName: Locator;
    readonly insuredLastName: Locator;
    readonly insuredIdentificationType: Locator;
    readonly insuredIdentificationNumber: Locator;
    readonly insuredTRN: Locator;
    readonly insuredGender: Locator;
    readonly insuredEmploymentStatus: Locator;
    readonly insuredEmployer: Locator;
    readonly insuredDateOfBirth: Locator;
    readonly insuredOccupation: Locator;

    readonly insuredCountry: Locator;
    readonly insuredAddressLine1: Locator;
    readonly insuredParish: Locator;
    readonly insuredStateProvince: Locator;

    readonly priorCarrierField: Locator;
    readonly priorClaimField: { yes: Locator; no: Locator };
    readonly claimFreeYearsDropdown: Locator;

    // Driver elements
    readonly driverTypeSelection: Locator;
    readonly driverPartySelection: Locator;
    readonly licenseTypeField: Locator;
    readonly licenseIssueDate: Locator;
    readonly licenseExpirationDate: Locator;
    readonly licenseStatusField: Locator;

    // Vehicle elements
    readonly vehicleChassisVINField: Locator;

    // Top menu bar elements
    readonly topTabsBar: Locator;
    readonly myWorkMenuItem: Locator;
    readonly customerMenuItem: Locator;
    readonly caseMenuItem: Locator;
    readonly billingMenuItem: Locator;
    readonly policyMenuItem: Locator;
    readonly quoteMenuItem: Locator;
    readonly claimMenuItem: Locator;
    readonly reportsMenuItem: Locator;
    readonly doNotRenewFlag: Locator;

    // New customer elements
    readonly createNewCustomerButton: Locator;

    // Error message
    readonly firstErrorMessage: Locator;
    readonly allErrorMessages: Locator;
    readonly notCurrentPolicyVersionMessage: Locator;

    // Payment/Finish elements
    readonly createNewAccountCheckbox: Locator;
    readonly billingAccountNameField: Locator;
    readonly cityField: Locator;
    readonly identificationNumberField: Locator;
    readonly trnField: Locator;
    readonly trnErrorMessage: Locator;
    readonly cashAmountField: Locator;
    readonly totalDueValue: Locator;
    readonly remainingMinRequiredValue: Locator;
    readonly finishButton: Locator;
    readonly excessLimitField: Locator;
    readonly repairBenefitField: Locator;

    // Footer elements
    readonly saveButton: Locator;
    readonly nextFooterButton: Locator;
    readonly saveAndExitButton: Locator;
    readonly footerOkButton: Locator;
    readonly cancelButton: Locator;
    readonly cancelConfirmYesButton: Locator;

    // Endorsement elements
    readonly endorsementDateField: Locator;
    readonly endorsementReasonField: Locator;
    readonly endorsementConfirmationOkButton: Locator;
    readonly endorsementConfirmationCancelButton: Locator;

    // Stamp duty elements
    readonly stampDutyValue: Locator;

    // New locator
    readonly depreciateSumInsuredButton: Locator;

    // Certificate-related locators
    readonly openFolderIcon: Locator;
    readonly closeFolderIcon: Locator;
    readonly certificatesAndCoverNotesFolder: Locator;
    readonly certificateOfInsurance: Locator;

    // Named driver assignment locators
    readonly threeNamedDriversYesRadio: Locator;
    readonly addNewAssignmentButton: Locator;
    readonly removeAssignmentButton: Locator;
    readonly driverAssignmentDropdown: Locator;
    readonly assignmentTypeDropdown: Locator;
    readonly percentOfUseField: Locator;

    // Trans. Eff. Date banner locator
    readonly transEffDateBanner: Locator;

    // Back button
    readonly backButton: Locator;
    readonly logoutLink: Locator;
    readonly logoutConfirmYesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);

        // Initialize common loading elements
        this.loadingSpinner = page.locator('#ajaxLoadingModalBox');
        this.loadingShade = page.locator('[id=ajaxLoadingModalBox_shade]');

        // Search elements
        this.customerNumberField = page.getByRole('textbox', { name: 'Customer #' });
        this.searchButton = page.locator('input#searchForm\\:searchBtn.primaryButton');

        // Initialize common popup elements
        this.partySearchPopup = page.locator('[id="partySearchForm\\:partySearchPopup_container"]');
        this.partySearchPopupShade = page.locator('[id="partySearchForm\\:partySearchPopup_shade"]');
        this.quickSearchButton = page.locator('[id="topQuickSearchForm\\:searchExtendedBtn"]');
        this.logoutLink = page.locator('#logoutForm\\:logout_link');
        this.logoutConfirmYesButton = page.locator(
            '#logoutConfirmDialogDialog_form\\:buttonYes'
        );
        this.notCurrentPolicyVersionMessage = page.getByText(
            'Policy version you are working with is marked as NOT current',
            { exact: false }
        );

        // Initialize common tab elements
        this.tabList = page.locator('#policyDataGatherForm\\:tabListList_1');
        this.headerNextButton = page.locator('[id="policyDataGatherForm\\:next_footer"]');
        this.overviewNextButton = page.locator(
            '#policyDataGatherForm\\:nextInquiry_footer'
        );
        this.quoteTab = page.getByRole('link', { name: 'Quote', exact: true });
        this.policyTab = page.locator('a').filter({ hasText: 'Policy' });
        this.driverTab = page.locator('a').filter({ hasText: 'Driver' });
        this.vehicleTab = page.locator('a').filter({ hasText: 'Vehicle' });
        this.mvrClaimsTab = page.locator('a').filter({ hasText: 'MVR/Claims' });
        this.premiumAndCoveragesTab = page.locator('a').filter({ hasText: 'Premium & Coverages' });
        this.insuredTab = page.locator('a').filter({ hasText: 'Insured' });
        this.fundingSummaryTab = page.locator('a').filter({ hasText: 'Funding Summary' });

        this.addQuoteButton = page.getByText('Add Quote');
        this.addNewQuoteButton = page.getByRole('button', { name: 'Add New Quote' });
        this.lineOfBusinessField = page.locator('#quoteForm\\:quoteCreationPopupMultiEdit_blob');
        this.productField = page.locator('#quoteForm\\:quoteCreationPopupMultiEdit_productCd');
        this.startQuoteNextButton = page.locator('input[id="quoteForm:createQuoteButton"]');

        // Insured Party elements
        this.insuredPartySelection = page.getByLabel('Insured Party Selection');
        this.addNewInsuredButton = page.locator('input#policyDataGatherForm\\:addPreconfigInsured');
        this.insuredFirstName = page.getByLabel('First Name');
        this.insuredLastName = page.getByLabel('Last Name');
        this.insuredIdentificationType = page.getByLabel('Identification Type');
        this.insuredTRN = page.getByLabel('TRN');
        this.insuredGender = page.getByLabel('Gender');
        this.insuredEmploymentStatus = page.locator('select#policyDataGatherForm\\:sedit_PreconfigInsuredPersonInfoProxy_person_employmentStatusCd');
        this.insuredEmployer = page.getByLabel('Employer');
        this.insuredIdentificationNumber = page.getByLabel('Identification Number');
        this.insuredDateOfBirth = page.locator('input#policyDataGatherForm\\:sedit_PreconfigInsuredPersonInfoProxy_person_dateOfBirthInputDate');
        this.insuredOccupation = page.getByLabel('Occupation');
        this.insuredCountry = page.getByLabel('Country');
        this.insuredAddressLine1 = page.getByLabel('Address Line 1');
        this.insuredParish = page.getByLabel('Parish');
        this.insuredStateProvince = page.locator('#policyDataGatherForm\\:sedit_PreconfigInsuredCorporationAddressContactProxy_addressEntity_address_stateProvCd');

        this.priorCarrierField = page.getByLabel('Prior Carrier', { exact: true });
        this.priorClaimField = {
            yes: page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoPolicyPriorClaim_hadPriorClaims\\:0'),
            no: page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoPolicyPriorClaim_hadPriorClaims\\:1')
        };
        this.claimFreeYearsDropdown = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoPolicyPriorClaim_claimFreeYears');

        // Initialize the new locators
        this.branchField = page.getByLabel('Branch');
        this.policyCountyField = page.locator('select#policyDataGatherForm\\:sedit_Policy_countryCd');
        this.effectiveDateField = page.locator('#policyDataGatherForm\\:sedit_Policy_contractTerm_effectiveInputDate');
        this.policyOverviewStatusText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        );
        this.driverPartySelection = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriver_partySelection');
        this.licenseTypeField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_licenceTypeCd');
        this.licenseIssueDate = page.locator('[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_currentLicenseIssueDtInputDate"]');
        this.licenseExpirationDate = page.locator('[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_expirationDtInputDate"]');
        this.licenseStatusField = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_licenseStatusCd');
        this.driverTypeSelection = page.locator('#policyDataGatherForm\\:sedit_PreconfigAutoDriver_driverTypeCd');

        // Vehicle elements
        this.vehicleChassisVINField = page.locator('#policyDataGatherForm\\:sedit_PreconfigVehicle_baseInfo_vehIdentificationNo');

        // Top menu bar and items
        this.topTabsBar = page.locator('#tabForm\\:topTabsBarList');
        this.myWorkMenuItem = page.locator('#tabForm\\:topTabsBarList\\:0\\:link');
        this.customerMenuItem = page.locator('#tabForm\\:topTabsBarList\\:1\\:link');
        this.caseMenuItem = page.locator('#tabForm\\:topTabsBarList\\:2\\:link');
        this.billingMenuItem = page.locator('#tabForm\\:topTabsBarList\\:3\\:link');
        this.policyMenuItem = page.locator('#tabForm\\:topTabsBarList\\:4\\:link');
        this.quoteMenuItem = page.locator('#tabForm\\:topTabsBarList\\:5\\:link');
        this.claimMenuItem = page.locator('#tabForm\\:topTabsBarList\\:6\\:link');
        this.reportsMenuItem = page.locator('#tabForm\\:topTabsBarList\\:7\\:link');
        this.doNotRenewFlag = page.locator('#productContextInfoForm\\:doNotRenewFlag');
        // New customer elements
        this.createNewCustomerButton = page.locator('#searchForm\\:createAccountBtnAlway');

        // Error message
        this.firstErrorMessage = this.page.locator('#errorsForm\\:msgList\\:0\\:messageDescription');
        this.allErrorMessages = this.page.locator('span[id^="errorsForm:msgList:"][id$=":messageDescription"]');

        // Payment/Finish elements
        this.createNewAccountCheckbox = page.locator('#purchaseForm\\:billingAccount_createNewAccount');
        this.billingAccountNameField = page.locator('#purchaseForm\\:billingAccount_billingAccountDetails_billingAccountName');
        this.cityField = page.locator('#purchaseForm\\:billingAccount_billingAccountDetails_billingAccountAddress_city');
        this.trnField = page.locator('#purchaseForm\\:billingAccount_billingAccountDetails_customerTrn');
        this.trnErrorMessage = page.locator('#purchaseForm\\:billingAccount_billingAccountDetails_customerTrn').locator('xpath=ancestor::tr[1]//span[@class="error_message"]');
        this.identificationNumberField = page.locator('#purchaseForm\\:billingAccount_billingAccountDetails_customerIdNumber');
        this.cashAmountField = page.locator('#purchaseForm\\:downpaymentComponent_PaymentDetailsTable\\:0\\:downpaymentComponent_amount');
        this.totalDueValue = page.locator('#purchaseForm\\:totalDue');
        this.remainingMinRequiredValue = page.locator('#purchaseForm\\:downpaymentComponent_remainingBalanceValue');
        this.finishButton = page.locator('#purchaseForm\\:yesButton_footer');
        this.excessLimitField = page.locator('#policyDataGatherForm\\:sedit_BcicExcess_coverLevelCd');
        this.repairBenefitField = page.locator('select#policyDataGatherForm\\:sedit_BcicRepairBenefit_limitAmount');

        // Footer elements
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.saveAndExitButton = page.getByRole('button', { name: 'Save and Exit', exact: true });
        this.nextFooterButton = page.locator('[id="policyDataGatherForm\\:next_footer"]');
        this.footerOkButton = page.locator('#headerForm input[value="OK"][type="submit"]');
        this.cancelButton = page.locator('button#topCancelLink');
        this.cancelConfirmYesButton = page.locator('form#cancelConfirmDialogDialog_form input#cancelConfirmDialogDialog_form\\:buttonYes');

        // Endorsement elements
        this.endorsementDateField = page.locator('#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementDateInputDate');
        this.endorsementReasonField = page.locator('#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementReason');
        this.endorsementConfirmationOkButton = page.locator('#policyDataGatherForm\\:modalConfirmationDialog_PolicyEndorseAction_yesBtn');
        this.endorsementConfirmationCancelButton = page.locator('#policyDataGatherForm\\:actionPopupCancel_PolicyEndorseAction');

        // Take action dropdown
        this.takeActionButton = page.getByText('Take Action');
        this.takeActionDropdown = page.locator('[id="productContextInfoForm\\:moveToBox"]');

        // Stamp duty elements
        this.stampDutyValue = page.locator('#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalStampDuty');

        this.depreciateSumInsuredButton = page.locator('#policyDataGatherForm\\:depreciateSumInsuredButton');

        // Certificate-related locators
        this.openFolderIcon = page.locator('a.ui-commandlink.icon-folder');
        this.closeFolderIcon = page.locator('a#slide_panel_hide_ctrl');
        this.certificatesAndCoverNotesFolder = page.locator(
            '//div[contains(@class,"rf-trn") and contains(@class,"efolder-folder-node-rw") and .//span[text()="Certificates and Cover Notes"]]/span[contains(@class, "rf-trn-hnd-colps rf-trn-hnd")]'
        );
        this.certificateOfInsurance = page.locator('span.rf-trn-lbl span', { hasText: 'Certificate of Insurance' });

        // Named driver assignment locators
        this.threeNamedDriversYesRadio = page.locator('input[id="policyDataGatherForm\\:sedit_VehicleDriverAssignmentComponent_threeNamedDriversInd\\:0"]');
        this.addNewAssignmentButton = page.locator('input[id="policyDataGatherForm\\:addPreconfigAssignment"]');
        this.removeAssignmentButton = page.locator('input[id="policyDataGatherForm\\:eliminatePreconfigAssignment"]');
        this.driverAssignmentDropdown = page.locator('select[id="policyDataGatherForm\\:sedit_PreconfigAssignment_driverOid"]');
        this.assignmentTypeDropdown = page.locator('select[id="policyDataGatherForm\\:sedit_PreconfigAssignment_assignmentType"]');
        this.percentOfUseField = page.locator('input[id="policyDataGatherForm\\:sedit_PreconfigAssignment_percentOfUse"]');

        // Trans. Eff. Date banner locator
        this.transEffDateBanner = page.locator('#policyDataGatherForm\\:bannerGroup3 .pf-datagather-banner-item');

        // Back button
        this.backButton = page.getByRole('button', { name: 'Back', exact: true });
    }

    /**
     * Navigate to the application and login
     */
    async goto() {
        await this.loginPage.goto();
        await this.loginPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
        await this.loginPage.expectCorrectLoginRedirect();
    }

    /**
     * Wait for loading spinner to disappear
     */
    async waitForLoadingSpinner() {
        await waitForLoadingSpinner(this.page, this.loadingSpinner);
    }

    /**
     * Close party search popup if it appears
     */
    async closePartySearchPopupIfVisible() {
        await closePartySearchPopupIfVisible(this.page);
    }

    /**
     * Check if a specific tab is currently selected
     */
    protected async isTabSelected(tabName: string): Promise<boolean> {
        const tabElement = this.tabList.locator(`li:has(span:text-is("${tabName}"))`);
        const className = await tabElement.getAttribute('class') || '';
        return className.includes('selected');
    }

    /**
     * Navigate to the next tab, checking if we're already on the expected tab
     */
    async goToNextTab(expectedNextTab: string) {
        const validTabs = [
            'Insured',
            'Driver',
            'Vehicle',
            'MVR/Claims',
            'Reinsurance',
            'Premium & Coverages',
            'Forms/Addl Info',
            'Funding Summary'
        ];

        if (!validTabs.includes(expectedNextTab)) {
            throw new Error(`Invalid tab name: ${expectedNextTab}. Valid tabs are: ${validTabs.join(', ')}`);
        }

        await waitForBarbadosLoadingSpinner(this);

        // Check if we're already on the expected next tab
        const hasNavigated = await this.isTabSelected(expectedNextTab);

        if (!hasNavigated) {
            await this.headerNextButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    /**
     * Start a new quote
     */
    async startNewQuote() {
        await this.addQuoteButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.addNewQuoteButton.click();
        await waitForBarbadosLoadingSpinner(this);

        // Select Line of business
        await this.lineOfBusinessField.selectOption({ label: 'Personal Lines' });
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(1000);
        // Select product
        await this.productField.selectOption({ label: 'Private Motor' });
        await waitForBarbadosLoadingSpinner(this);

        await this.startQuoteNextButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Start a new quote
     */
    async startQuote(businessField: string, product: string) {
        await this.addQuoteButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.addNewQuoteButton.click();
        await waitForBarbadosLoadingSpinner(this);

        // Select Line of business
        await this.lineOfBusinessField.selectOption({ label: businessField });
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(1000);
        // Select product
        await this.productField.selectOption({ label: product });
        await waitForBarbadosLoadingSpinner(this);

        await this.startQuoteNextButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }
    /**
     * Search for a customer
     */
    async searchCustomer(customerId: string) {
        await this.quickSearchButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.customerNumberField.click();
        await this.customerNumberField.clear();
        await this.customerNumberField.fill(customerId.toString());
        await waitForBarbadosLoadingSpinner(this);
        await this.searchButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async logout() {
        await this.logoutLink.click();
        await this.logoutConfirmYesButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async reopenPolicyIfVersionNotCurrent(
        customerId: string,
        policyNumber: string,
        username = process.env.EIS_USERNAME!,
        password = process.env.EIS_PASSWORD!
    ): Promise<boolean> {
        const isNotCurrent =
            await this.notCurrentPolicyVersionMessage
                .isVisible({ timeout: 3000 })
                .catch(() => false);

        if (!isNotCurrent) {
            return false;
        }

        await this.logout();
        await this.loginPage.login(username, password);
        await waitForBarbadosLoadingSpinner(this);
        await this.searchCustomer(customerId);
        await this.clickPolicyNumberLink(policyNumber);

        return true;
    }

    /**
     * Select a policy county
     */
    async selectPolicyCounty(county: string = "Jamaica") {
        await this.policyCountyField.selectOption({ label: county });
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Set the effective date for the policy
     * @param effectiveDate - Date in dd/MM/yyyy format (e.g., "15/12/2024")
     */
    async setEffectiveDate(effectiveDate: string) {
        await this.effectiveDateField.fill(effectiveDate);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);
    }

    async setRegionalEffectiveDate(
        region: PolicyRegion,
        minutesBefore: number = 5
    ): Promise<PolicyEffectiveDateTime> {
        const dateTime = getPolicyEffectiveDateTime(
            region,
            minutesBefore
        );

        console.log(`${region} Effective Date: ${dateTime.effectiveDate}`);

        await this.effectiveDateField.fill(dateTime.effectiveDate);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.effectiveDateField)
            .toHaveValue(dateTime.effectiveDate);

        return dateTime;
    }

    async expectActivePolicyStatus(): Promise<string> {
        await expect(this.policyOverviewStatusText)
            .toBeVisible({ timeout: 60_000 });
        await expect(this.policyOverviewStatusText).not.toHaveText(
            /Policy Pending/i,
            { timeout: 60_000 }
        );
        await expect(this.policyOverviewStatusText).toHaveText(
            /^(Active|Policy Active|In Force)$/i
        );

        return (await this.policyOverviewStatusText.innerText()).trim();
    }

    /**
     * Select a branch
     */
    async selectBranch(branch: string) {
        await this.branchField.selectOption(branch);
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Select an insured party
     */
    async selectInsuredParty(partyName: string, carrierName: string = 'Advantage General Insurance Company', priorClaim?: boolean, claimFreeYears?: string, gender?: string) {
        if (priorClaim) {
            await this.priorClaimField.yes.scrollIntoViewIfNeeded()
            await this.priorClaimField.yes.check();
        } else {
            await this.priorClaimField.no.scrollIntoViewIfNeeded()
            await this.priorClaimField.no.check();
        }
        await waitForBarbadosLoadingSpinner(this);


        if (claimFreeYears) {
            await this.claimFreeYearsDropdown.selectOption(claimFreeYears);
            await waitForBarbadosLoadingSpinner(this);
        }

        await this.insuredPartySelection.scrollIntoViewIfNeeded()
        await this.insuredPartySelection.selectOption({ label: partyName });
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(500);

        if (gender) {
            await this.insuredGender.selectOption({ label: gender });
        }

        await waitForBarbadosLoadingSpinner(this);
        await this.priorCarrierField.scrollIntoViewIfNeeded()
        await this.priorCarrierField.selectOption({ label: carrierName });
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(500);
        // await closePartySearchPopupIfVisible(this.page);
    }

    /**
     * Add a new insured party
     */
    async addNewInsuredParty(customerDetails: object, priorClaim?: boolean, claimFreeYears?: string, priorCarrier: string = 'Advantage General Insurance Company') {
        await waitForBarbadosLoadingSpinner(this);
        // await closePartySearchPopupIfVisible(this.page);

        // click Add new Insured
        await this.addNewInsuredButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.insuredPartySelection.selectOption({ label: 'New Person' });

        // Enter the new insured party details
        await this.insuredFirstName.fill(customerDetails['generalInformation']['First Name']);
        await waitForBarbadosLoadingSpinner(this);
        await this.insuredLastName.fill(customerDetails['generalInformation']['Last Name']);
        await waitForBarbadosLoadingSpinner(this);

        await this.insuredIdentificationType.selectOption({ label: customerDetails['generalInformation']['Identification Type'] });
        await waitForBarbadosLoadingSpinner(this);
        await this.insuredTRN.fill(customerDetails['generalInformation']['Identification Number']);
        await waitForBarbadosLoadingSpinner(this);

        await this.insuredGender.selectOption({ label: customerDetails['generalInformation']['Gender'] });
        await this.insuredEmploymentStatus.selectOption({ value: customerDetails['additionalInformation']['Employment Status'] });
        await this.insuredEmployer.fill(customerDetails['additionalInformation']['Employer']);
        await waitForBarbadosLoadingSpinner(this);

        await this.insuredDateOfBirth.fill(customerDetails['generalInformation']['Date of Birth']);
        await waitForBarbadosLoadingSpinner(this);
        await this.insuredIdentificationNumber.fill(customerDetails['generalInformation']['Identification Number']);
        await waitForBarbadosLoadingSpinner(this);
        await this.insuredOccupation.selectOption({ label: customerDetails['additionalInformation']['Occupation'] });
        await waitForBarbadosLoadingSpinner(this);

        await this.insuredCountry.selectOption({ label: customerDetails['contactDetails']['Country'] });
        await this.insuredAddressLine1.fill(customerDetails['contactDetails']['Address Line 1']);
        await waitForBarbadosLoadingSpinner(this);
        await this.insuredParish.selectOption({ label: customerDetails['contactDetails']['Parish'] });
        await waitForBarbadosLoadingSpinner(this);

        if (priorClaim) {
            await this.priorClaimField.yes.check();
        } else {
            await this.priorClaimField.no.check();
        }
        await waitForBarbadosLoadingSpinner(this);

        if (claimFreeYears) {
            await this.claimFreeYearsDropdown.selectOption(claimFreeYears);
            await waitForBarbadosLoadingSpinner(this);
        }

        await this.priorCarrierField.selectOption({ label: priorCarrier });
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(500);
        // await closePartySearchPopupIfVisible(this.page);
    }

    /**
     * Select an existing driver which populates all the required details
     */
    async selectExistingDriver(driverOption: string, licenseType: string = 'Permanent', licenseStatus: string = 'Valid', relationship?: string, driverType?: string) {

        // await closePartySearchPopupIfVisible(this.page);
        await this.driverPartySelection.selectOption({ label: driverOption });

        await waitForBarbadosLoadingSpinner(this);

        if (relationship) {
            await this.page.getByLabel('Relationship to Primary').selectOption(relationship);
            await waitForBarbadosLoadingSpinner(this);
        }

        await this.licenseTypeField.scrollIntoViewIfNeeded()
        await this.licenseTypeField.selectOption({ label: licenseType });

        const licenseDates = getLicenseDates();

        // fill in license issue date
        await this.licenseIssueDate.scrollIntoViewIfNeeded()
        await this.licenseIssueDate.fill(licenseDates.issueDate);
        await waitForBarbadosLoadingSpinner(this);

        await this.page.locator("#policyDataGatherForm\\:sedit_PreconfigAutoDriverLicense_license_licensedDtInputDate").fill(licenseDates.issueDate);

        // fill in license expiration date
        await this.licenseExpirationDate.scrollIntoViewIfNeeded()
        await this.licenseExpirationDate.fill(licenseDates.expiryDate);
        await waitForBarbadosLoadingSpinner(this);

        await this.licenseStatusField.scrollIntoViewIfNeeded()
        await this.licenseStatusField.selectOption({ label: licenseStatus });
        await waitForBarbadosLoadingSpinner(this);

        if (driverType) {
            await this.driverTypeSelection.scrollIntoViewIfNeeded()
            await this.driverTypeSelection.selectOption({ label: driverType });
            await waitForBarbadosLoadingSpinner(this);
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Handle customer party search
     */
    async handleCustomerPartySearch() {
        if (await this.page.getByText('Customer Party Search Result').isVisible()) {
            await (this.page.getByText('Get', { exact: true })).click();
            await (this.page.locator('[id="yes_goToCustomerDialog"]')).click();
        }
    }

    /**
     * Handle duplicate customer
     */
    async handleDuplicateCustomer(customerDetails: object) {
        if (await this.page.getByText('DUPLICATE_CUSTOMER').isVisible()) {
            await this.page.getByText('Search+').click();
            await this.page.getByRole('button', { name: 'Yes' }).click();
            await this.page.getByRole('textbox', { name: 'First Name' }).fill(customerDetails['First Name']);
            await this.page.getByRole('textbox', { name: 'Last Name' }).fill(customerDetails['Last Name']);
            await this.page.locator('[id="searchForm\\:searchBtn"]').click();
        }
    }

    /**
     * Click the policy tab
     */
    async clickPolicyTab() {
        await this.policyTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the quote tab
     */
    async clickQuoteTab() {
        await this.quoteTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the insured tab
     */
    async clickInsuredTab() {
        // await closePartySearchPopupIfVisible(this.page);
        await this.insuredTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the driver tab
     */
    async clickDriverTab() {
        await this.driverTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the vehicle tab
     */
    async clickVehicleTab() {
        await this.vehicleTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the MVR/Claims tab
     */
    async clickMVRClaimsTab() {
        await this.mvrClaimsTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the premiums and coverages tab
     */
    async clickPremiumsAndCoveragesTab() {
        await this.premiumAndCoveragesTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Click the funding summary tab
     */
    async clickFundingSummaryTab() {
        await this.fundingSummaryTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async finishPayment({ billingAccountName, city, cashAmount, trn, useExistingAccount = false, paymentBranch }: { billingAccountName: string, city: string, cashAmount?: string, trn?: string, useExistingAccount?: boolean, paymentBranch?: string }) {
        await this.page.waitForTimeout(500);
        if (!useExistingAccount) {
            if (!(await this.createNewAccountCheckbox.isChecked())) {
                await this.createNewAccountCheckbox.check();
                await waitForBarbadosLoadingSpinner(this);
            }

            if (trn) {
                await this.page.waitForTimeout(1000);
                await this.trnField.fill(trn);
                await waitForBarbadosLoadingSpinner(this);
                await this.page.keyboard.press('Enter');
                await waitForBarbadosLoadingSpinner(this);
            }

            await this.page.waitForTimeout(1000);
            await this.billingAccountNameField.click();
            await waitForBarbadosLoadingSpinner(this);
            await this.billingAccountNameField.fill(billingAccountName);
            await waitForBarbadosLoadingSpinner(this);
            await this.page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(this);

            await this.cityField.fill(city);
            await waitForBarbadosLoadingSpinner(this);
            await this.page.waitForTimeout(500);
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(1500);
            await waitForBarbadosLoadingSpinner(this);
            await this.page.waitForTimeout(1500);
        }

        const cashAmountFieldVisible = await this.cashAmountField
            .isVisible({ timeout: 5_000 })
            .catch(() => false);

        if (!cashAmountFieldVisible) {
            await this.finishButton.click();
            await waitForBarbadosLoadingSpinner(this);
            return;
        }

        if (paymentBranch) {
            const paymentBranchField =
                this.page.locator('#purchaseForm\\:displayBranchCd');
            const paymentBranchVisible =
                await paymentBranchField
                    .isVisible({ timeout: 2_000 })
                    .catch(() => false);

            if (paymentBranchVisible) {
                await paymentBranchField.selectOption(paymentBranch);
                await waitForBarbadosLoadingSpinner(this);
            }
        }

        let amountToUse = cashAmount;
        if (!amountToUse) {
            // Extract the value from the total due element
            const totalDueText = await this.totalDueValue.textContent();
            if (!totalDueText) {
                throw new Error('Could not find total due amount on the page.');
            }
            // Remove currency (BBD or JMD) and commas, trim whitespace
            amountToUse = totalDueText.replace(/^(BBD|JMD)/, '').replace(/,/g, '').trim();
        }
        await this.cashAmountField.fill(amountToUse);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForFunction(
            (selector) => document.querySelector(selector)?.textContent?.trim() === 'BBD0.00' || document.querySelector(selector)?.textContent?.trim() === 'JMD0.00',
            '#purchaseForm\\:downpaymentComponent_remainingBalanceValue'
        );
        await this.finishButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Get the stamp duty amount as a string (numeric value, no currency)
     */
    async getStampDutyAmount(): Promise<string> {
        const valueAttr = await this.stampDutyValue.getAttribute('value');
        if (!valueAttr) {
            throw new Error('Could not find stamp duty value on the page.');
        }
        // Remove currency (BBD or JMD) and commas, trim whitespace
        return valueAttr.replace(/^(BBD|JMD)/, '').replace(/,/g, '').trim();
    }

    /**
     * Cancel a renewal
     */
    async cancelRenewal() {
        await waitForBarbadosLoadingSpinner(this);
        await this.cancelButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.cancelConfirmYesButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Start a renewal from a policy
     */
    async startRenewalFromPolicy(ratingPage: RatingPage, policyPage: PolicyPage) {
        await policyPage.takeActionDropdown.selectOption('Renew');
        await waitForBarbadosLoadingSpinner(ratingPage);
        await ratingPage.footerOkButton.click();
        await waitForBarbadosLoadingSpinner(ratingPage);
    }

    /**
     * Start an endorsement from a policy
     */
    async startEndorsementFromPolicy(ratingPage: RatingPage, policyPage: PolicyPage, endorsementReason: string) {
        await policyPage.takeActionDropdown.selectOption('Endorse');
        await waitForBarbadosLoadingSpinner(ratingPage);

        // Extract Trans. Eff. Date from the banner
        const transEffDateText = await ratingPage.transEffDateBanner.textContent();
        if (!transEffDateText) {
            throw new Error('Trans. Eff. Date element not found or has no text content.');
        }
        // Extract the date using regex
        const match = transEffDateText.match(/Trans\. Eff\. Date:\s*(\d{2}\/\d{2}\/\d{4})/);
        if (!match) {
            throw new Error(`Could not extract Trans. Eff. Date from text: ${transEffDateText}`);
        }
        const transEffDate = match[1];

        await ratingPage.endorsementDateField.fill(transEffDate);
        await ratingPage.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(ratingPage);

        await ratingPage.endorsementReasonField.selectOption({ label: endorsementReason });
        await waitForBarbadosLoadingSpinner(ratingPage);
        await ratingPage.page.waitForTimeout(500);

        await ratingPage.footerOkButton.click();
        await waitForBarbadosLoadingSpinner(ratingPage);

        await ratingPage.endorsementConfirmationOkButton.click();
        await waitForBarbadosLoadingSpinner(ratingPage);
    }

    /**
     * Opens the folder icon to access policy documents
     */
    async openFolder() {
        await this.openFolderIcon.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Opens the folder icon to access policy documents
     */
    async closeFolder() {
        await this.closeFolderIcon.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Expands the "Certificates and Cover Notes" folder
     */
    async expandCertificatesAndCoverNotes() {
        await this.certificatesAndCoverNotesFolder.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Downloads the Certificate of Insurance by double-clicking it
     * @returns The path to the downloaded PDF file
     */
    async downloadCertificateOfInsurance(): Promise<string> {
        await this.certificateOfInsurance.dblclick();

        // Wait for the PDF download
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
        ]);

        return await download.path();
    }

    /**
     * Downloads and parses the Certificate of Insurance PDF
     * @returns The text content of the PDF
     */
    async getCertificateOfInsuranceText(): Promise<string> {
        const pdfPath = await this.downloadCertificateOfInsurance();

        // Parse the PDF
        const fs = require('fs');
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);

        return pdfData.text;
    }

    /**
     * Complete workflow to download and verify certificate content with retry logic
     * @returns The text content of the certificate
     */
    async downloadAndVerifyCertificate(): Promise<string> {
        await this.openFolder();
        await this.expandCertificatesAndCoverNotes();

        try {
            // Check if certificate element is visible and download
            if (await this.certificateOfInsurance.isVisible({ timeout: 5000 })) {
                const certificateText = await this.getCertificateOfInsuranceText();                return certificateText;
            }

            throw new Error('Certificate not visible');

        } catch (error) {
            await this.page.waitForTimeout(10000);
            // Refresh folder view and retry once
            await this.closeFolder();
            await this.openFolder();
            await this.expandCertificatesAndCoverNotes();

            if (await this.certificateOfInsurance.isVisible({ timeout: 5000 })) {
                const certificateText = await this.getCertificateOfInsuranceText();                return certificateText;
            }

            throw new Error('Certificate not available after retry');
        }
    }

    /**
     * Clicks on a specific policy number link
     * @param policyNumber The policy number to click on
     */
    async clickPolicyNumberLink(policyNumber: string) {
        await this.page.getByRole('link', { name: policyNumber, exact: true }).click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Assigns named drivers to a vehicle
     * @param driverAssignments Array of driver assignments with name, type, and percentage
     */
    async assignNamedDrivers(driverAssignments: Array<{
        driverName: string;
        assignmentType?: string;
        percentOfUse?: number;
    }>) {

        // Click Yes on "Assign three (3) named drivers?"
        await this.threeNamedDriversYesRadio.check();
        await waitForBarbadosLoadingSpinner(this);

        // Calculate default percentage if not provided
        const defaultPercent = 100 / driverAssignments.length;

        // Assign each driver
        for (const assignment of driverAssignments) {
            // Click the Add New Assignment button
            await this.addNewAssignmentButton.click();
            await waitForBarbadosLoadingSpinner(this);

            // Select driver from dropdown
            await this.driverAssignmentDropdown.selectOption({ label: assignment.driverName });
            await waitForBarbadosLoadingSpinner(this);

            // Select Assignment Type
            await this.page.waitForTimeout(500);
            const assignmentType = assignment.assignmentType || 'Principal';
            await this.assignmentTypeDropdown.selectOption({ label: assignmentType });
            await waitForBarbadosLoadingSpinner(this);

            // Input % of Use
            const percentOfUse = assignment.percentOfUse || defaultPercent;
            await this.percentOfUseField.fill(percentOfUse.toString());
            await this.page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    /** Selected excess limit option value (e.g. TWOMIN1500, TWOMIN15000MAX250KJMD). */
    async getExcessLimit(): Promise<string> {
        const value = (await this.excessLimitField.inputValue()).trim();
        if (!value) {
            throw new Error('Could not find excess limit value on the page.');
        }
        return value;
    }

    /**
     * Get displayed error messages
     * @param expectedMessage - The expected error message text (can be partial match)
     * @param options - Optional parameters for verification
     * @returns Promise<{found: boolean, actualMessages: string[]}> - Object with verification result and actual messages
     */
    async getErrorMessage(expectedMessage: string, options: {
        exactMatch?: boolean;
        caseSensitive?: boolean;
        timeout?: number;
    } = {}): Promise<{ found: boolean, actualMessages: string[] }> {
        const { exactMatch = false, caseSensitive = false, timeout = 10000 } = options;

        try {
            // Wait for error messages to be visible
            await this.allErrorMessages.first().waitFor({ state: 'visible', timeout });

            // Get all error messages
            const errorMessages = await this.allErrorMessages.all();
            const actualMessages: string[] = [];

            for (const errorElement of errorMessages) {
                const messageText = await errorElement.textContent();
                if (!messageText) continue;

                const trimmedMessage = messageText.trim();
                actualMessages.push(trimmedMessage);

                let isMatch = false;
                if (exactMatch) {
                    isMatch = caseSensitive
                        ? trimmedMessage === expectedMessage
                        : trimmedMessage.toLowerCase() === expectedMessage.toLowerCase();
                } else {
                    isMatch = caseSensitive
                        ? trimmedMessage.includes(expectedMessage)
                        : trimmedMessage.toLowerCase().includes(expectedMessage.toLowerCase());
                }

                if (isMatch) {
                    return { found: true, actualMessages };
                }
            }

            return { found: false, actualMessages };
        } catch (error) {
            // If no error messages are found or timeout occurs
            return { found: false, actualMessages: [] };
        }
    }

    /**
     * Verify that an error message with specific error code is displayed
     * @param errorCode - The expected error code (e.g., 'JMVEH002')
     * @param expectedMessage - Optional expected error message text
     * @param options - Optional parameters for verification
     * @returns Promise<boolean> - True if error message with code is found and verified
     */
    async verifyErrorMessageWithCode(errorCode: string, expectedMessage?: string, options: {
        exactMatch?: boolean;
        caseSensitive?: boolean;
        timeout?: number;
    } = {}): Promise<boolean> {
        const { exactMatch = false, caseSensitive = false, timeout = 10000 } = options;

        try {
            // Wait for error messages to be visible
            await this.allErrorMessages.first().waitFor({ state: 'visible', timeout });

            // Get all error message codes
            const errorCodes = this.page.locator('a[id^="errorsForm:msgList:"][id$=":messageCode"]');
            const errorMessages = this.allErrorMessages;

            const codeElements = await errorCodes.all();
            const messageElements = await errorMessages.all();

            // Find matching error code and verify message if provided
            for (let i = 0; i < codeElements.length; i++) {
                const codeText = await codeElements[i].textContent();
                if (codeText?.trim() === errorCode) {
                    if (expectedMessage) {
                        const messageText = await messageElements[i]?.textContent();
                        if (!messageText) continue;

                        let isMatch = false;
                        if (exactMatch) {
                            isMatch = caseSensitive
                                ? messageText.trim() === expectedMessage
                                : messageText.trim().toLowerCase() === expectedMessage.toLowerCase();
                        } else {
                            isMatch = caseSensitive
                                ? messageText.includes(expectedMessage)
                                : messageText.toLowerCase().includes(expectedMessage.toLowerCase());
                        }

                        return isMatch;
                    } else {
                        return true; // Just found the error code, no message verification needed
                    }
                }
            }

            return false;
        } catch (error) {
            // If no error messages are found or timeout occurs
            return false;
        }
    }

    /**
     * Get all error messages currently displayed on the page
     * @returns Promise<string[]> - Array of error message texts
     */
    async getAllErrorMessages(): Promise<string[]> {
        try {
            await this.allErrorMessages.first().waitFor({ state: 'visible', timeout: 5000 });
            const errorElements = await this.allErrorMessages.all();
            const messages: string[] = [];

            for (const element of errorElements) {
                const text = await element.textContent();
                if (text) {
                    messages.push(text.trim());
                }
            }

            return messages;
        } catch (error) {
            return []; // Return empty array if no error messages found
        }
    }

    /**
     * Check if any error messages are currently displayed
     * @returns Promise<boolean> - True if any error messages are visible
     */
    async hasErrorMessages(): Promise<boolean> {
        try {
            await this.allErrorMessages.first().waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Assert that a specific error message is displayed with detailed failure information
     * @param expectedMessage - The expected error message text
     * @param options - Optional parameters for verification
     * @throws Error with detailed information if assertion fails
     */
    async assertErrorMessage(expectedMessage: string, options: {
        exactMatch?: boolean;
        caseSensitive?: boolean;
        timeout?: number;
    } = {}): Promise<void> {
        const result = await this.getErrorMessage(expectedMessage, options);

        if (!result.found) {
            if (result.actualMessages.length === 0) {
                throw new Error(`Expected error message "${expectedMessage}" but no error messages were found on the page.`);
            } else {
                throw new Error(
                    `Expected error message "${expectedMessage}" but found the following error messages instead:\n` +
                    result.actualMessages.map((msg, index) => `${index + 1}. "${msg}"`).join('\n')
                );
            }
        }
    }
}


