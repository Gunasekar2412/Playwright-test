import { expect, Locator, test as base } from "@playwright/test";
import { PolicyPage } from "../../../sites/eis/pages/PolicyPage";
import { CustomerPage } from "../../../sites/eis/pages/CustomerPage";
import { RatingPage } from "../../../sites/eis/pages/RatingPage";
import { closePartySearchPopupIfVisible } from '../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
  generateCustomerInformation,
  gender,
} from "../../../sites/eis/data/CustomerData";
import { coverageType, planSelection, VehicleRequiredInformation, existingDriver } from "../../../sites/eis/data/PolicyData";
import { faker } from '@faker-js/faker';
import { isDxpIssuanceConfigured } from "../../../lib/dxp/config";
import { createJamaicaCustomerViaDxp } from "../../../lib/dxp/createJamaicaCustomer";

base.setTimeout(320_000);

/** Insured/driver/party pickers and billing labels use the CRM display name without the `-Automation` first-name suffix. */
function eisCustomerDisplayName(fullName: string): string {
  return fullName.replace(/-Automation/g, "");
}

// Create alternate customer data by modifying the base
const alternateCustomerRequiredInformation = {
  ...generateCustomerInformation(),
  generalInformation: {
    "Identification Type": "Passport",
    "Identification Number": Math.floor(100000000 + Math.random() * 900000000).toString(),
    "First Name": faker.person.firstName(),
    "Last Name": faker.person.lastName(),
    "Date of Birth": '20/01/1985',
    "Gender": gender[1], // Female
    "Nationality": 'Jamaica'
  }
};

const vehicleRequiredInformation: VehicleRequiredInformation = {
  generalInformation: {
    chassisVIN: 'JA4MR41H5SJ007388',
    modelYear: '2007',
    make: 'Mitsubishi',
    model: 'Lancer Cedia Tour',
    bodyType: 'Station Wagon',
    performance: 'Standard Performance',
    sumInsured: '1000000',
  },
  vehicleUseDetail: {
    writtenOff: 'No',
  },
  vehicleGaraging: {
    country: 'Jamaica',
    addressLine1: '54 Lower Mall Road',
    parish: 'St. Andrew',
  },
  registeredOwner: {
    firstName: 'Danuel',
    lastName: 'Williams'
  },
};

type Customer = {
  customerId: string;
  customerName: string;
};

type MyFixtures = {
  ratingPage: RatingPage;
  policyPage: PolicyPage;
  customerPage: CustomerPage;
  customer: Customer;
};

const test = base.extend<MyFixtures>({
  ratingPage: async ({ page }, use) => {
    const ratingPage = new RatingPage(page);
    await use(ratingPage);
  },
  policyPage: async ({ page }, use) => {
    const policyPage = new PolicyPage(page);
    await use(policyPage);
  },
  customerPage: async ({ page }, use) => {
    const customerPage = new CustomerPage(page);
    await use(customerPage);
  },
  customer: [async ({ page, ratingPage }, use) => {
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    const { customerName: rawCustomerName, customerId } = await createJamaicaCustomerViaDxp({ age: 40 });

    const customerName = eisCustomerDisplayName(rawCustomerName);
    await ratingPage.searchCustomer(customerId);await ratingPage.waitForLoadingSpinner();
    await ratingPage.waitForLoadingSpinner();
    await use({ customerId, customerName });  },
  {
    timeout: 250_000
  }]
});

test.beforeAll(async () => {
  test.skip(
    !isDxpIssuanceConfigured(),
    "DXP API setup: set DXP_API_BASE_URL, DXP_GUEST_BASIC_*, and DXP_AGENT_BASIC_* (or EIS_USERNAME/PASSWORD)."
  );
});

test("[S11C1968] Verify that a new TRN field is present on the Insured tab",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.verifyTRNisPresentAndEditable();
  })


test("[S11C1969] Verify that a new TRN field is added when an insured is updated",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.verifyTRNisPresentAndEditable();
  })

test("[S11C1970] Verify that the new TRN field on INSURED tab can't be left blank when SAVE button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.clickSave();
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1971] Verify that the new TRN field on INSURED tab can't be left blank when SAVE & EXIT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.clickSaveAndExit();
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1972] Verify that the new TRN field on INSURED tab can't be left blank when NEXT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1973] Verify that a new TRN field is added when a driver is added",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.verifyTRNisPresentAndEditable();
  })

test("[S11C1974] Verify that a new TRN field is added when a DRIVER is updated",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.verifyTRNisPresentAndEditable();
  })

test("[S11C1975] Verify that the new TRN field can't be left blank when a DRIVER is added and SAVE is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.selectOptionForField(policyPage.currencyField, 'JMD');
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.fillField(policyPage.trnField, '');
    await policyPage.clickSave();

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1976] Verify that the new TRN field on DRIVER tab can't be left blank when SAVE & EXIT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.selectOptionForField(policyPage.currencyField, 'JMD');
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.fillField(policyPage.trnField, '');
    await policyPage.clickSaveAndExit();

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1977] Verify that the new TRN field on DRIVER tab can't be left blank when NEXT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.fillField(policyPage.trnField, '');
    await policyPage.clickNext();

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.verifyErrorMessageIsShownWhenTRNIsLeftBlank();
  })

test("[S11C1978] Verify that the Gender field is added on the Insured tab",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection("New Person");
    await policyPage.verifyGenderIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1979] Verify that the Gender field is added when an insured is updated",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection("New Person");
    await policyPage.verifyGenderIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1980] Verify that the Gender field on the Insured tab can't be left blank when SAVE button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection("New Person");
    await policyPage.clickSave();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1981] Verify that the Gender field on the Insured tab can't be left blank when SAVE & EXIT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection("New Person");
    await policyPage.clickSaveAndExit();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1982] Verify that the Gender field on the Insured tab can't be left blank when NEXT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.clickAddNewInsuredButton();
    await policyPage.selectOptionForInsuredPartySelection("New Person");
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1983] Verify that the Gender field is added when a driver is added",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.verifyGenderIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1984] Verify that the Gender field is added when a DRIVER is updated",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.verifyGenderIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1985] Verify that the Gender field on the Driver tab can't be left blank when SAVE button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.clickSave();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1986] Verify that the Gender field on the Driver tab can't be left blank when SAVE & EXIT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.clickSaveAndExit();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1987] Verify that the Gender field on the Driver tab can't be left blank when NEXT button is selected",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.clickAddNewDriverButton();
    await policyPage.selectOptionForDriverPartySelection("Create New Driver");
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsShownWhenGenderIsLeftBlank();
  })

test("[S11C1988] Verify Prior Carrier field is displayed and functional on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.verifyPriorCarrierFieldIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1989] Verify Prior Carrier field dropdown values are correct on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.verifyPriorCarrierFieldHasAppropriateValues();
  })

test("[S11C1990] Verify Prior Carrier field retains values on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForPriorCarrierSelection('British Caribbean Insurance Company');

    await policyPage.clickSave();
    await policyPage.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickInsuredTab();
    await policyPage.verifyPriorCarrierFieldHasGivenValue('British Caribbean Insurance Company');
  })


test("[S11C1991] Verify error message when Prior Carrier field is left blank and Save button is selected on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.fillRequiredInsuredInformation({
      generalInformation: {
        "First Name": alternateCustomerRequiredInformation['generalInformation']['First Name'],
        "Last Name": alternateCustomerRequiredInformation['generalInformation']['Last Name'],
        "Identification Type": alternateCustomerRequiredInformation['generalInformation']['Identification Type'],
        "Identification Number": alternateCustomerRequiredInformation['generalInformation']['Identification Number'],
        "TRN": alternateCustomerRequiredInformation['generalInformation']['Identification Number'].replace('-', '').slice(0, 9),
        "Date of Birth": alternateCustomerRequiredInformation['generalInformation']['Date of Birth'],
        "Gender": alternateCustomerRequiredInformation['generalInformation']['Gender'],
        "Employment Status": "EMP_FT",
        "Occupation": alternateCustomerRequiredInformation['additionalInformation']['Occupation'],
        "Employer": alternateCustomerRequiredInformation['additionalInformation']['Employer'],
        "Address Type": alternateCustomerRequiredInformation['contactDetails']['Address Type'],
        "Country": alternateCustomerRequiredInformation['contactDetails']['Country'],
        "Address Line 1": alternateCustomerRequiredInformation['contactDetails']['Address Line 1'],
        "Parish": alternateCustomerRequiredInformation['contactDetails']['Parish']!,
      }
    });

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.waitForLoadingSpinner();

    await policyPage.clickSave();
    await policyPage.verifyErrorMessageIsShownWhenPriorCarrierIsLeftBlank();
  })

test("[S11C1992] Verify error message when Prior Carrier field is left blank and Save & Exit button is selected on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.fillRequiredInsuredInformation(
      {
        generalInformation: {
          "First Name": alternateCustomerRequiredInformation['generalInformation']['First Name'],
          "Last Name": alternateCustomerRequiredInformation['generalInformation']['Last Name'],
          "Identification Type": alternateCustomerRequiredInformation['generalInformation']['Identification Type'],
          "Identification Number": alternateCustomerRequiredInformation['generalInformation']['Identification Number'],
          "TRN": alternateCustomerRequiredInformation['generalInformation']['Identification Number'],
          "Date of Birth": alternateCustomerRequiredInformation['generalInformation']['Date of Birth'],
          "Gender": alternateCustomerRequiredInformation['generalInformation']['Gender'],
          "Employment Status": 'EMP_FT',
          "Occupation": alternateCustomerRequiredInformation['additionalInformation']['Occupation'],
          "Employer": alternateCustomerRequiredInformation['additionalInformation']['Employer'],
          "Address Type": alternateCustomerRequiredInformation['contactDetails']['Address Type'],
          "Country": alternateCustomerRequiredInformation['contactDetails']['Country'],
          "Address Line 1": alternateCustomerRequiredInformation['contactDetails']['Address Line 1'],
          "Parish": alternateCustomerRequiredInformation['contactDetails']['Parish']!,
        }
      }
    )
    await policyPage.clickNext();
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyErrorMessageIsShownWhenPriorCarrierIsLeftBlank();
  })

test("[S11C1993] Verify error message when Prior Carrier field is left blank and Next button is selected on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection('New Person');
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsShownWhenPriorCarrierIsLeftBlank();
  })

test("[S11C1994] Verify Fuel Type field is displayed and functional on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.verifyFuelTypeFieldIsPresentEditableAndDefaultIsBlank();
  })

test("[S11C1995] Verify Fuel Type field dropdown values are correct on Jamaica policy",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.verifyFuelTypeFieldHasGivenValues();
  })

test("[S11C1996] Verify Amount field is optional on MVR/Claims Payments section",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();

    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.inputClaimDate(claimDate);
    // await policyPage.clickSave();
    await policyPage.clickNext();
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C1997] Verify Type field is optional on MVR/Claims Payments section",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();

    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.inputClaimDate(claimDate);
    // await policyPage.clickSave();
    await policyPage.clickNext();
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C1998] Verify Status field is optional on MVR/Claims Payments section",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.inputClaimDate(claimDate);
    // await policyPage.clickSave();
    await policyPage.clickNext();
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C1999] Verify Reason for Override field is required and dropdown values are correct",
  async ({ policyPage, customer, ratingPage }) => {
    test.slow();
    const selectedCoverageType = coverageType[Math.floor(Math.random() * coverageType.length)];
    const selectedPlanSelection = planSelection[selectedCoverageType][Math.floor(Math.random() * planSelection[selectedCoverageType].length)]

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForPriorCarrierSelection('No prior insurance');
    await policyPage.clickVehicleTab();
    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.clickPremiumsAndCoveragesTab();
    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.selectOptionForCoverageTypeField(selectedCoverageType);
    await policyPage.selectOptionForPlanSelection(selectedPlanSelection);
    await ratingPage.calculatePremium();
    await policyPage.waitForLoadingSpinner();
    await policyPage.click(policyPage.page.locator('[id=policyDataGatherForm\\:componentView_PreconfigAutoPolicyPremiumSummary]').getByText('2007, Mitsubishi, Lancer Cedia Tour, Station Wagon'));
    await policyPage.click(policyPage.overrideCoveragePremiumButton);
    await policyPage.click(policyPage.page.locator('a:right-of(:text(\'Third Party Bodily Injury\'))').getByText('Select').first());
    await policyPage.click(policyPage.addOverrideButton);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.reasonForOverrideField);
    await policyPage.verifyReasonForOverrideFieldHasGivenValues();
  })

test("[S11C2000] Verify error message when Reason for Override is left blank and Save button is selected",
  async ({ policyPage, customer, ratingPage }) => {
    test.setTimeout(240_000);
    const selectedCoverageType = coverageType[Math.floor(Math.random() * coverageType.length)];
    const selectedPlanSelection = planSelection[selectedCoverageType][Math.floor(Math.random() * planSelection[selectedCoverageType].length)]

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForPriorCarrierSelection('No prior insurance');
    await policyPage.clickVehicleTab();
    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForCoverageTypeField(selectedCoverageType);
    await policyPage.selectOptionForPlanSelection(selectedPlanSelection);
    await ratingPage.calculatePremium();
    await policyPage.waitForLoadingSpinner();
    await policyPage.click(policyPage.page.locator('[id=policyDataGatherForm\\:componentView_PreconfigAutoPolicyPremiumSummary]').getByText('2007, Mitsubishi, Lancer Cedia Tour, Station Wagon'));
    await policyPage.click(policyPage.overrideCoveragePremiumButton);
    await policyPage.click(policyPage.page.locator('a:right-of(:text(\'Third Party Bodily Injury\'))').getByText('Select').first());
    await policyPage.click(policyPage.addOverrideButton);
    await policyPage.click(policyPage.okButton);
    await policyPage.verifyErrorMessageIsVisible(policyPage.reasonForOverrideErrorMessage);
  })

test("[S11C2001] Verify error message when Reason for Override is left blank and Save & Exit button is selected",
  async ({ policyPage, customer, ratingPage }) => {
    test.setTimeout(240_000);
    const selectedCoverageType = coverageType[Math.floor(Math.random() * coverageType.length)];
    const selectedPlanSelection = planSelection[selectedCoverageType][Math.floor(Math.random() * planSelection[selectedCoverageType].length)]

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForPriorCarrierSelection('No prior insurance');
    await policyPage.clickVehicleTab();

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForCoverageTypeField(selectedCoverageType);
    await policyPage.selectOptionForPlanSelection(selectedPlanSelection);
    await policyPage.selectOptionForField(policyPage.bcicAssistCoverLevelField, 'Accident');

    await ratingPage.calculatePremium();
    await policyPage.waitForLoadingSpinner();
    await policyPage.click(policyPage.page.locator('[id=policyDataGatherForm\\:componentView_PreconfigAutoPolicyPremiumSummary]').getByText('2007, Mitsubishi, Lancer Cedia Tour, Station Wagon'));
    await policyPage.click(policyPage.overrideCoveragePremiumButton);
    await policyPage.click(policyPage.page.locator('a:right-of(:text(\'Third Party Bodily Injury\'))').getByText('Select').first());
    await policyPage.click(policyPage.addOverrideButton);
    await policyPage.click(policyPage.okButton);
    await policyPage.verifyErrorMessageIsVisible(policyPage.reasonForOverrideErrorMessage);
  })

test("[S11C2002] Verify error message when Reason for Override is left blank and Next button is selected",
  async ({ policyPage, customer, ratingPage }) => {
    test.slow();
    const selectedCoverageType = coverageType[Math.floor(Math.random() * coverageType.length)];
    const selectedPlanSelection = planSelection[selectedCoverageType][Math.floor(Math.random() * planSelection[selectedCoverageType].length)]

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForPriorCarrierSelection('No prior insurance');
    await policyPage.clickVehicleTab();

    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForCoverageTypeField(selectedCoverageType);
    await policyPage.selectOptionForPlanSelection(selectedPlanSelection);
    await ratingPage.calculatePremium();
    await policyPage.waitForLoadingSpinner();
    await policyPage.click(policyPage.page.locator('[id=policyDataGatherForm\\:componentView_PreconfigAutoPolicyPremiumSummary]').getByText('2007, Mitsubishi, Lancer Cedia Tour, Station Wagon'));
    await policyPage.click(policyPage.overrideCoveragePremiumButton);
    await policyPage.click(policyPage.page.locator('a:right-of(:text(\'Third Party Bodily Injury\'))').getByText('Select').first());
    await policyPage.click(policyPage.addOverrideButton);
    await policyPage.click(policyPage.okButton);
    await policyPage.verifyErrorMessageIsVisible(policyPage.reasonForOverrideErrorMessage);
  })

test("[S11C2003] Verify Branch field is visible and required when Policy country is Jamaica",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    if (await policyPage.page.locator('[id=cancelConfirmDialogDialog_container]').isVisible()) {
      await policyPage.page.locator('[id=cancelConfirmDialogDialog_container]').getByRole('button', { name: 'Yes' }).click();
    }
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.branchField);
    await policyPage.verifyBranchFieldHasGivenValues();
  })

test("[S11C2004] Verify error message when Branch is left blank for Jamaica",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickSave();
    await policyPage.verifyErrorMessageIsVisible(policyPage.branchErrorMessage);
  })

test("[S11C2005] Verify \"Licenced to Drive\" field is visible and optional for Jamaica licenses",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.click(policyPage.addNewDriverLicenseButton);
    await closePartySearchPopupIfVisible(policyPage.page);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.licensedToDriveField);
  })

test("[S11C2006] Verify \"Licenced to Drive\" field is visible and optional for Jamaica licenses",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickDriverTab();
    await policyPage.selectOptionForDriverPartySelection(customer.customerName);
    await policyPage.click(policyPage.addNewDriverLicenseButton);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.licensedToDriveField);
  })

test("[S11C2007] Verify addition of Driver section above Vehicle section in Prior Claims",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.verifyDriverSectionIsAboveVehicleSectionInPriorClaims();
  })

test("[S11C2008] Verify Name field in Driver section is optional and defaults to None/blank",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.nameField);
    await policyPage.inputClaimDate(claimDate);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2009] Verify Date of Birth field in Driver section is optional and defaults to None/blank",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.trnField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2010] Verify TRN field in Driver section is optional and defaults to None/blank",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.trnField);
    await policyPage.inputClaimDate(claimDate);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2011] Verify Settlement Type field in Prior Claims section is optional and defaults to None/blank",
  async ({ policyPage, customer }) => {
    const claimDate = new Date();
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.settlementTypeField)
    await policyPage.inputClaimDate(claimDate);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();


  })

test("[S11C2012] Verify the Air Bags field is optional and has no default value in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.airBagsField);
    await policyPage.clickNext()
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2013] Verify Automatic Belts Field is Optional in Vehicle Features Section",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.automaticBeltsYesField)
    await policyPage.verifyFieldIsPresentEditableAndChecked(policyPage.automaticBeltsNoField)
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2014] Verify Recovery Device Field is Optional in Vehicle Features Section",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.recoveryDeviceYesField);
    await policyPage.verifyFieldIsPresentEditableAndChecked(policyPage.recoveryDeviceNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2015] Verify that the Additional Security field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.additionalSecurityField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext()
  })

test("[S11C2016]  Verify the Anti-lock field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.antiLockField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })


test("[S11C2017] Verify the Daytime Running Lamps field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.daytimeRunningLampsYesField);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.daytimeRunningLampsNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2018] Verify the Armored Vehicles field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.armoredVehiclesYesField);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.armoredVehiclesNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2019] Verify the Air Bags field is optional and has no default value in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.airBagsField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2020] Verify Automatic Belts Field is Optional in Vehicle Features Section",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.automaticBeltsYesField);
    await policyPage.verifyFieldIsPresentEditableAndChecked(policyPage.automaticBeltsNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2021] Verify Recovery Device Field is Optional in Vehicle Features Section",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.recoveryDeviceYesField);
    await policyPage.verifyFieldIsPresentEditableAndChecked(policyPage.recoveryDeviceNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2022] Verify that the Additional Security field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.additionalSecurityField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2023] Verify the Anti-lock field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.antiLockField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2024] Verify the Daytime Running Lamps field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.daytimeRunningLampsYesField);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.daytimeRunningLampsNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2025] Verify the Armored Vehicles field is optional in the Vehicle Features section when adding or updating a vehicle.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.armoredVehiclesYesField);
    await policyPage.verifyFieldIsPresentEditableAndUnchecked(policyPage.armoredVehiclesNoField);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test.skip("[S11C2026] Verify that users can upload or download documents to the new 'Correspondence' subfolder under the Miscellaneous folder in the Policy tab.",
  async ({ page }) => {

  })

test("[S11C2027] Verify the Distance Driven for Pleasure per Week field is optional when adding or updating Vehicle use detail information.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.distanceDrivenForPleasurePerWeek);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2028] Verify the Customer Declared Annual Distance field is optional when adding or updating Vehicle use detail information.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.customerDeclaredAnnualDistance);
    await policyPage.clickNext();
    await policyPage.verifyNoErrorOccurredAfterClickingNext();
  })

test("[S11C2029] Verify the Has this vehicle ever been written off? field is required when adding or updating Vehicle use detail information.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    const updatedVehicleRequiredInformation = {
      ...vehicleRequiredInformation,
      vehicleUseDetail: {
        writtenOff: null
      }
    };
    await policyPage.fillRequiredVehicleInformation(updatedVehicleRequiredInformation);
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsVisible(policyPage.vehicleWrittenOffErrorMessage);
  })

test("[S11C2030] Verify that an error message is displayed when the 'Has this vehicle ever been written off?' field is left blank.",
  async ({ policyPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();

    // Select branch
    await policyPage.selectPolicyCounty();
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.waitForLoadingSpinner();
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();

    await policyPage.selectInsuredParty(customer.customerName, 'No prior insurance');

    await policyPage.selectExistingDriver(
      customer.customerName,
      existingDriver.licenseType,
      existingDriver.licenseStatus
    );

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    const updatedVehicleRequiredInformation = {
      ...vehicleRequiredInformation,
      vehicleUseDetail: {
        writtenOff: null
      }
    };
    await policyPage.fillRequiredVehicleInformation(updatedVehicleRequiredInformation);
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.additionalSecurityField);
    await policyPage.clickNext();
    await policyPage.verifyErrorMessageIsVisible(policyPage.vehicleWrittenOffErrorMessage);
  })


test("[S11C2031] Verify that \"Endorsement Reason\" field is displayed with None/Blank and it is a mandatory field when you start an endorsement",
  async ({ policyPage, page, ratingPage, customer }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    // Start endorsement
    await page.locator('[id="productContextInfoForm\\:moveToBox"]').selectOption('endorseWithWorkspace');
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.endorsementReasonField);
    await policyPage.verifyEndorsementFieldHasGivenValues();
  });

test("[S11C2032] Verify that an error message is thrown when the \"Endorsement Reason\" field is left blank and the user tries to continue",
  async ({ policyPage, ratingPage, page, customer }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    // Start endorsement
    await page.locator('[id="productContextInfoForm\\:moveToBox"]').selectOption('endorseWithWorkspace');
    await page.locator('[id="policyDataGatherForm\\:yesBtn_PolicyEndorseAction_footer"]').click();
    await policyPage.verifyErrorMessageIsVisible(policyPage.endorsementDateErrorMessage);
  });

test.skip("[S11C2033] Verify that Field lookups are updated for Coverages ",
  async ({ policyPage, page, customer }) => {
    const lossOfUseField = 'BcicLossOfUse';
    const excessLimitField = 'BcicExcessLimit';
    await policyPage.click(policyPage.adminLink);
    await policyPage.fillField(policyPage.lookupListNameSearchField, lossOfUseField);
    await page.getByRole('button', { name: 'Search' }).click();
    await policyPage.verifyLookupRowExistsForSearchItem(lossOfUseField);
    await policyPage.fillField(policyPage.lookupListNameSearchField, excessLimitField);
    await page.getByRole('button', { name: 'Search' }).click();
    await policyPage.verifyLookupRowExistsForSearchItem(excessLimitField);
    // Should we also be checking the lookup Codes that are present under the DB Lookup item.
  }) // Fails because nothing shows up on screen

test.skip("[S11C2034] Verify that additional Field lookups are updated for Coverages ",
  async ({ policyPage, page, customer }) => {
    const coverageTypeField = 'PrecCoverageType'
    await policyPage.click(policyPage.adminLink);
    await policyPage.fillField(policyPage.lookupListNameSearchField, coverageTypeField);
    await page.getByRole('button', { name: 'Search' }).click();
    await policyPage.verifyLookupRowExistsForSearchItem(coverageTypeField);
  }) // Fails because nothing shows up on screen

test.skip("[S11C2035] If a quote is created with a date other than today, When the quote retrieve the system should automatically set the quote status to Data Gather Mode, claims history is updated  upon calculate premium",
  async ({ page }) => {
    // Will need to have previously created quotes a day prior
    // Not Automatable
  })

test("[S11C2036] Verify that the \"Smallz\" plan is included in the Plan Selection drop-down when Private Car Third Party coverage type is selected for new business quote",
  async ({ policyPage, page, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party');
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Smallz');
  })

test("[S11C2037] Verify that the \"Smallz\" plan is included in the Plan Selection drop-down when Private Car Third Party coverage type is selected for an endorsement quote",
  async ({ policyPage, page, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party');
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Smallz');
  })

test("[S11C2038] Verify that the \"Smallz\" plan is included in the Plan Selection drop-down when Private Car Third Party coverage type is selected for manual renewal quote",
  async ({ policyPage, page, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party');
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Smallz');
  })

test("[S11C2039] Verify that the Customer Interests field defaults to None/Blank when initiating the quote creation.",
  async ({ customerPage, customer }) => {
    await customerPage.page.getByText('Search+').click();
    await customerPage.clickCreateCustomerButton();
    await customerPage.customerCreationTypeModal('Individual');
    await expect(customerPage.page.locator('[id="crmForm\:additionalInfo_interests_list"]')).toBeEmpty();
  })

test("[S11C2040] Verify that the Customer Interests field allow for one or multiple selection",
  async ({ policyPage, page, customer }) => {
    await page.getByRole('button', { name: 'Search+' }).click();
    await policyPage.waitForLoadingSpinner();
    await page.getByText('Create Customer').click();
    await page.getByText('Individual', { exact: true }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('row', { name: 'Customer Interests Select... ', exact: true }).locator('a').click();
    await page.getByRole('listitem').filter({ hasText: 'Watching Television' }).locator('div').nth(1).click();
    await page.getByRole('listitem').filter({ hasText: 'Playing a musical instrument' }).locator('div').nth(1).click();
    await page.getByRole('cell', { name: 'Customer Interests', exact: true }).click();
    // Look at this field to see what exists in it after we've clicked
    await expect(page.locator('[id="crmForm\:additionalInfo_interests_list"]')).toContainText('Watching Television');
    await expect(page.locator('[id="crmForm\:additionalInfo_interests_list"]')).toContainText('Playing a musical instrument');
  })

// FIX: More information needed to trigger the precondition for this test.
test.skip("[S11C2041] Verify that the Override field is visible if the prior claims information is populated from ClaimsVault and it defaults to 'No' for Underwriting Level 2 and Level 3 users.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await expect(policyPage.page.getByRole('combobox', { name: 'Override' })).toBeVisible();
  })

test("[S11C2042] Verify that the Override field is not visiable if the prior claims information is populated from ClaimsVault for Underwriting Level 1 users.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await expect(policyPage.page.getByRole('combobox', { name: 'Override' })).not.toBeVisible();
  })

test("[S11C2043] Verify that all fields in Prior Claims, Driver, Vehicle, and Payments sections are editable when a record is manually added via 'Add New Claim' button.",
  async ({ policyPage, page, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    let fieldLocators: Locator[] = [
      policyPage.page.getByRole('radio', { name: 'Yes' }),
      policyPage.page.getByRole('radio', { name: 'No' }),
      page.locator('[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverRecordClaims_claimDtInputDate"]'),
      page.getByRole('textbox', { name: 'Company' }),
      page.getByRole('textbox', { name: 'Claim #' }),
      page.getByRole('textbox', { name: 'Policy #' }),
      page.getByRole('textbox', { name: 'Policy Type' }),
      page.getByRole('textbox', { name: 'Description Of Loss' }),
      page.getByLabel('Claim Association'),
      page.getByLabel('Fault Indicator'),
      page.getByRole('textbox', { name: 'Claim Type' }),
      page.getByRole('textbox', { name: 'Claim Amount' }),
      page.getByRole('textbox', { name: 'Settlement Type' }),
      page.getByRole('textbox', { name: 'Name' }),
      page.locator('[id="policyDataGatherForm\\:sedit_BcicPreconfigAutoDriverRecordClaimDriver_driverDobInputDate"]'),
      page.getByRole('textbox', { name: 'TRN' }),
      page.getByRole('textbox', { name: 'Make' }),
      page.getByRole('textbox', { name: 'Year' }),
      page.getByRole('textbox', { name: 'Chassis/VIN' }),
      page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:0\\:filter"]'),
      page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:1\\:filter"]'),
      page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:2\\:filter"]')
    ];

    for (const fieldLocator of fieldLocators) {
      await expect(fieldLocator).toBeVisible();
      await expect(fieldLocator).toBeEditable();
    }
  })

test("[S11C2044] Verify all the fields in Prior Claims section are editable when Override is set to 'Yes'.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    let fieldLocators: Locator[] = [
      policyPage.page.getByRole('radio', { name: 'Yes' }),
      policyPage.page.getByRole('radio', { name: 'No' }),
      policyPage.page.locator('[id="policyDataGatherForm\\:sedit_PreconfigAutoDriverRecordClaims_claimDtInputDate"]'),
      policyPage.page.getByRole('textbox', { name: 'Company' }),
      policyPage.page.getByRole('textbox', { name: 'Claim #' }),
      policyPage.page.getByRole('textbox', { name: 'Policy #' }),
      policyPage.page.getByRole('textbox', { name: 'Policy Type' }),
      policyPage.page.getByRole('textbox', { name: 'Description Of Loss' }),
      policyPage.page.getByLabel('Claim Association'),
      policyPage.page.getByLabel('Fault Indicator'),
      policyPage.page.getByRole('textbox', { name: 'Claim Type' }),
      policyPage.page.getByRole('textbox', { name: 'Claim Amount' }),
      policyPage.page.getByRole('textbox', { name: 'Settlement Type' }),
      policyPage.page.getByRole('textbox', { name: 'Name' }),
      policyPage.page.locator('[id="policyDataGatherForm\\:sedit_BcicPreconfigAutoDriverRecordClaimDriver_driverDobInputDate"]'),
      policyPage.page.getByRole('textbox', { name: 'TRN' }),
      policyPage.page.getByRole('textbox', { name: 'Make' }),
      policyPage.page.getByRole('textbox', { name: 'Year' }),
      policyPage.page.getByRole('textbox', { name: 'Chassis/VIN' }),
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:0\\:filter"]'),
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:1\\:filter"]'),
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:2\\:filter"]')
    ];

    for (const fieldLocator of fieldLocators) {
      await expect(fieldLocator).toBeVisible();
      await expect(fieldLocator).toBeEditable();
    }
  })

test("[S11C2045] Verify all the fields in Driver section are editable when Override is set to 'Yes'.",
  async ({ policyPage, page, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    let fieldLocators: Locator[] = [
      page.getByRole('textbox', { name: 'Name' }),
      page.locator('[id="policyDataGatherForm\\:sedit_BcicPreconfigAutoDriverRecordClaimDriver_driverDobInputDate"]'),
      page.getByRole('textbox', { name: 'TRN' }),
    ];

    for (const fieldLocator of fieldLocators) {
      await expect(fieldLocator).toBeVisible();
      await expect(fieldLocator).toBeEditable();
    }
  })

test("[S11C2046] Verify all the fields in Vehicle section are editable when Override is set to 'Yes'.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    let fieldLocators: Locator[] = [
      policyPage.page.getByRole('textbox', { name: 'Make' }),
      policyPage.page.getByRole('textbox', { name: 'Year' }),
      policyPage.page.getByRole('textbox', { name: 'Chassis/VIN' }),
    ];

    for (const fieldLocator of fieldLocators) {
      await expect(fieldLocator).toBeVisible();
      await expect(fieldLocator).toBeEditable();
    }
  })

test("[S11C2047] Verify all the fields in Payments section are editable when Override is set to 'Yes'.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.clickMVRClaimsTab();
    await policyPage.clickAddNewClaimButton();
    let fieldLocators: Locator[] = [
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:0\\:filter"]'),
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:1\\:filter"]'),
      policyPage.page.locator('[id="policyDataGatherForm\\:dataGatherView_ListPreconfigAutoDriverRecordClaimPayments\\:c\\:2\\:filter"]')
    ];

    for (const fieldLocator of fieldLocators) {
      await expect(fieldLocator).toBeVisible();
      await expect(fieldLocator).toBeEditable();
    }
  })

test("[S11C2048] Verify that 'Standard w Rental Benefits' is included in the Plan Selection dropdown when 'Private Car Comprehensive' is selected as the coverage type.",
  async ({ policyPage, customer }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Comprehensive');
    await policyPage.page.waitForTimeout(500);
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Standard w Rental Benefits');
  })

test("[S11C2049] Verify that selecting 'Standard w Rental Benefits' displays the correct vehicle coverages and limits.",
  async ({ policyPage, customer, ratingPage }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWRentalBenefits');
    await ratingPage.calculatePremium();

    await expect(policyPage.page.getByRole('combobox', { name: 'Glass Damage Limit' })).toHaveValue('UNLIMITED');
    await expect(policyPage.page.getByRole('combobox', { name: 'Legal Defence Costs for Manslaughter Limit' })).toHaveValue('500000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Bodily Injury Limit' })).toHaveValue('5000000/5000000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Property Damage Limit' })).toHaveValue('5000000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Protection and Removal (Wrecker Fee) Limit' })).toHaveValue('50000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Personal Effects Limit' })).toHaveValue('5000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Personal Accident Cover Limit' })).toHaveValue('250000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Excess Limit' })).toHaveValue('FIVEMIN15000MAX250KJMD');
    await expect(policyPage.page.getByRole('combobox', { name: 'Medical Expenses (including passengers) Limit' })).toHaveValue('10000/30000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Rental Car Type' })).toHaveValue('COMPACT-1W');
    await expect(policyPage.page.getByRole('combobox', { name: 'BCIC ASSIST Level' })).toHaveValue('ACCIDENTBREAKDOWN');
  })

test("[S11C2050] Verify that 'Standard' is included in the Plan Selection dropdown when 'Private Car Third Party' is selected as the coverage type.",
  async ({ policyPage, customer }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Comprehensive');
    await policyPage.page.waitForTimeout(500);
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Standard w Rental Benefits');
  })

test("[S11C2051] Verify that selecting 'Standard' displays the correct vehicle coverages and limits.",
  async ({ policyPage, customer, ratingPage }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP', 'Standard');
    await ratingPage.calculatePremium();

    await expect(policyPage.page.getByRole('combobox', { name: 'Legal Defence Costs for Manslaughter Limit' })).toHaveValue('500000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Bodily Injury Limit' })).toHaveValue('5000000/5000000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Property Damage Limit' })).toHaveValue('5000000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'BCIC ASSIST Level' })).toHaveValue('ACCIDENTBREAKDOWN');
  })

test("[S11C2052] Verify that 'Standard' is included in the Plan Selection dropdown when 'Private Car Third Party plus Repair' is selected as the coverage type.",
  async ({ policyPage, customer }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party plus Repair');
    await policyPage.page.waitForTimeout(500);
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Standard');

  })

test("[S11C2053] Verify that selecting 'Standard' displays the correct vehicle coverages and limits.",
  async ({ policyPage, customer, ratingPage }) => {
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.waitForLoadingSpinner();

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    if (await policyPage.page.locator('[id="partySearchForm\\:partySearchPopup_container"]').isVisible()) {
      await policyPage.page.locator('[id="partySearchForm\\:partySearchPopup_container"]')
        .getByRole('button', { name: 'Cancel' })
        .click()
    }

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);


    await policyPage.clickVehicleTab();
    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await closePartySearchPopupIfVisible(policyPage.page);

    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPP', 'Standard');
    await ratingPage.calculatePremium();

    await expect(policyPage.page.getByRole('combobox', { name: 'Glass Damage Limit' })).toHaveValue('UNLIMITED');
    await expect(policyPage.page.getByRole('combobox', { name: 'Legal Defence Costs for Manslaughter Limit' })).toHaveValue('500000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Bodily Injury Limit' })).toHaveValue('5000000/5000000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Property Damage Limit' })).toHaveValue('5000000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Repair Benefit Limit' })).toHaveValue('50000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'BCIC ASSIST Level' })).toHaveValue('ACCIDENTBREAKDOWN');
  })

test("[S11C2054] Verify that 'Standard w/o Rental Benefits' is included in the Plan Selection dropdown when 'Private Car Third Party, Fire & Theft' is selected as the coverage type.",
  async ({ policyPage, customer }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party, Fire, and Theft');
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Standard w/o Rental Benefits');
  })

test("[S11C2055] Verify that selecting 'Standard w/o Rental Benefits' displays the correct vehicle coverages and limits.",
  async ({ policyPage, customer, ratingPage }) => {


    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();

    if (await policyPage.partySearchPopup.isVisible()) {
      await policyPage.partySearchPopup.getByRole('button', { name: 'Cancel' }).click()
    }

    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWORentalBenefits');
    await ratingPage.calculatePremium();

    await expect(policyPage.page.getByRole('combobox', { name: 'Legal Defence Costs for Manslaughter Limit' })).toHaveValue('500000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Bodily Injury Limit' })).toHaveValue('5000000/5000000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Property Damage Limit' })).toHaveValue('5000000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Protection and Removal (Wrecker Fee) Limit' })).toHaveValue('50000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Personal Effects Limit' })).toHaveValue('5000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Contribution to \'Loss of Use\' Limit' })).toHaveValue('MAX5D1500JMD');
    await expect(policyPage.page.getByRole('combobox', { name: 'Excess Limit' })).toHaveValue('FIVEMIN15000MAX250KJMD');
    await expect(policyPage.page.getByRole('combobox', { name: 'BCIC ASSIST Level' })).toHaveValue('ACCIDENTBREAKDOWN');
  })

test("[S11C2056] Verify that 'Standard w Rental Benefits' is included in the Plan Selection dropdown when 'Private Car Third Party, Fire & Theft' is selected as the coverage type.",
  async ({ policyPage, customer }) => {

    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();
    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await policyPage.selectOptionForField(policyPage.coverageTypeField, 'Private Car Third Party, Fire, and Theft');
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyValueInSelectField(policyPage.planSelectionField, 'Standard w Rental Benefits');
  })

test("[S11C2057] Verify that selecting 'Standard w Rental Benefits' displays the correct vehicle coverages and limits.",
  async ({ policyPage, ratingPage, customer }) => {
    test.setTimeout(240_000);
    await policyPage.startNewQuote();
    await policyPage.selectOptionForField(policyPage.branchField, 'Head Office - Kingston');

    await policyPage.clickInsuredTab();
    await policyPage.selectOptionForInsuredPartySelection(customer.customerName);
    await policyPage.selectOptionForField(policyPage.priorCarrierField, 'No prior insurance');

    await policyPage.clickDriverTab();
    await policyPage.selectExistingDriver(customer.customerName);

    await policyPage.clickVehicleTab();
    await policyPage.clickAddNewVehicleButton();

    if (await policyPage.partySearchPopup.isVisible()) {
      await policyPage.partySearchPopup.getByRole('button', { name: 'Cancel' }).click();
    }

    await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTPFT', 'StandardWRentalBenefits');
    await ratingPage.calculatePremium();

    await expect(policyPage.page.getByRole('combobox', { name: 'Legal Defence Costs for Manslaughter Limit' })).toHaveValue('500000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Bodily Injury Limit' })).toHaveValue('5000000/5000000');
    await expect(policyPage.page.getByRole('combobox', { name: 'Third Party Property Damage Limit' })).toHaveValue('5000000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Protection and Removal (Wrecker Fee) Limit' })).toHaveValue('50000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Personal Effects Limit' })).toHaveValue('5000.00');
    await expect(policyPage.page.getByRole('combobox', { name: 'Contribution to \'Loss of Use\' Limit' })).not.toBeVisible();
    await expect(policyPage.page.getByRole('combobox', { name: 'Excess Limit' })).toHaveValue('FIVEMIN15000MAX250KJMD');
    await expect(policyPage.page.getByRole('combobox', { name: 'Rental Car Type' })).toHaveValue('COMPACT-1W');
    await expect(policyPage.page.getByRole('combobox', { name: 'BCIC ASSIST Level' })).toHaveValue('ACCIDENTBREAKDOWN');
  })

test("[S11C2058] Verify that the Jamaica technical agency (Tech-Agency-JM) is assigned to a customer with a Jamaica address.",
  async ({ policyPage, ratingPage }) => {
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    const { customerId } = await createJamaicaCustomerViaDxp({ age: 40 });
    await ratingPage.searchCustomer(customerId);
    await ratingPage.waitForLoadingSpinner();

    await policyPage.startNewQuote();
    await expect(policyPage.page.locator(':text(\'Technical Agency - JM\'):right-of(:text(\'Agency/Producer\'))')).toBeVisible();
  })

test("[S11C2059] Verify that the Barbados technical agency (Tech-Agency-BB) is assigned to a customer with a Barbados address.",
  async ({ policyPage, ratingPage, customerPage }) => {
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    await customerPage.createNewCustomer(40, 'Barbados');

    await policyPage.startNewQuote();
    await policyPage.page.locator(':text(\'Technical Agency - BB\'):right-of(:text(\'Agency/Producer\'))').waitFor({ state: 'visible', timeout: 10000 });
    // await expect(policyPage.page.locator(':text(\'Technical Agency - BB\'):right-of(:text(\'Agency/Producer\'))')).toBeVisible();
  })

test("[S11C2060] Verify that both Jamaica (Tech-Agency-JM) and Barbados (Tech-Agency-BB) technical agencies are assigned to a customer with an address outside Jamaica or Barbados.",
  async ({ policyPage, ratingPage, customerPage }) => {
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    await customerPage.createNewCustomer(40, 'Canada');

    await policyPage.startNewQuote();
    await policyPage.page.locator(':text(\'Technical Agency - BB\'):right-of(:text(\'Agency/Producer\'))').waitFor({ state: 'visible', timeout: 10000 });
    await policyPage.page.locator(':text(\'Technical Agency - JM\'):right-of(:text(\'Agency/Producer\'))').waitFor({ state: 'visible', timeout: 10000 });
    // await expect(policyPage.page.locator(':text(\'Technical Agency - BB\'):right-of(:text(\'Agency/Producer\'))')).toBeVisible();
    // await expect(policyPage.page.locator(':text(\'Technical Agency - JM\'):right-of(:text(\'Agency/Producer\'))')).toBeVisible();
  })

test("[S11C2061] Verify that a task is created when the tax-exempt field in Customer is checked",
  async ({ customerPage, customer }) => {
    test.setTimeout(240_000);
    await customerPage.click(customerPage.takeActionButton);
    await customerPage.selectOptionForField(customerPage.page.locator('[id="custInfoForm\\:actionsForCustomerHeaderId"]'), 'Update');
    await customerPage.click(customerPage.taxExemptField);
    await customerPage.clickNext();
    await customerPage.clickDone();
    await customerPage.page.getByText('Tasks').click();
    await customerPage.verifyTaxExemptReviewTaskExists();
    await customerPage.verifyTaskInCorrectQueue('Underwriting');
  })

test("[S11C2062] Verify that a task is created when the tax-exempt field in Customer is unchecked",
  async ({ customerPage, customer }) => {
    test.setTimeout(240_000);
    await customerPage.click(customerPage.takeActionButton);
    await customerPage.selectOptionForField(customerPage.page.locator('[id="custInfoForm\\:actionsForCustomerHeaderId"]'), 'Update');
    await customerPage.click(customerPage.taxExemptField);
    await customerPage.clickNext();
    await customerPage.clickDone();
    await customerPage.page.getByText('Tasks').click();
    await customerPage.verifyTaxExemptReviewTaskExists();
    await customerPage.verifyTaskInCorrectQueue('Underwriting');
  })

test("[S11C2063] Verify that a task is created when the tax-exempt field in Customer is unchecked",
  async ({ customerPage, customer }) => {
    test.setTimeout(240_000);
    await customerPage.click(customerPage.takeActionButton);
    await customerPage.selectOptionForField(customerPage.page.locator('[id="custInfoForm\\:actionsForCustomerHeaderId"]'), 'Update');
    await customerPage.click(customerPage.taxExemptField);
    await customerPage.clickNext();
    await customerPage.clickDone();
    await customerPage.page.getByText('Tasks').click();
    await customerPage.verifyTaxExemptReviewTaskExists();
    await customerPage.verifyTaskInCorrectQueue('Underwriting');
  })

test.describe.serial("Duplicate VIN Rule", async () => {

  let policyCreated = false;

  test.beforeEach(async ({ ratingPage }) => {
    test.setTimeout(480_000);

    // Login
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    // Check if VIN already exists using environment variable
    const vinAlreadyExists = process.env.VIN_ALREADY_EXIST === 'true' ? true : false;

    // Only create policy once if VIN doesn't exist
    if (!vinAlreadyExists && !policyCreated) {      const { customerName: rawCustomerName, customerId } = await createJamaicaCustomerViaDxp({ age: 40 });
      const customerName = eisCustomerDisplayName(rawCustomerName);
      await ratingPage.searchCustomer(customerId);
      await ratingPage.waitForLoadingSpinner();

      const policyPage = new PolicyPage(ratingPage.page);
      await policyPage.startNewQuote();
      await policyPage.selectPolicyCounty('Jamaica');
      await policyPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await policyPage.headerNextButton.click();
      await policyPage.waitForLoadingSpinner();
      await policyPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
      await policyPage.goToNextTab('Driver');
      await policyPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
      await policyPage.goToNextTab('Vehicle');

      await policyPage.clickAddNewVehicleButton();
      await policyPage.waitForLoadingSpinner();

      await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

      await policyPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWORentalBenefits');
      await ratingPage.calculatePremium();
      await ratingPage.clickFundingSummaryTab();
      await policyPage.purchaseButton.click();
      await policyPage.handlePurchasePolicyConfirmation(true);
      await policyPage.finishPayment({
        billingAccountName: customerName,
        city: 'Test City'
      });

      // Wait for policy creation to complete
      await policyPage.waitForLoadingSpinner();      policyCreated = true;
    } else if (vinAlreadyExists) {    } else {    }
  })

  test("[S11C2064] Rule is triggered when clicking 'Next'",
    async ({ policyPage, ratingPage }) => {
      const { customerName: rawCustomerName, customerId } = await createJamaicaCustomerViaDxp({ age: 40 });
      const customerName = eisCustomerDisplayName(rawCustomerName);
      await ratingPage.searchCustomer(customerId);
      await ratingPage.waitForLoadingSpinner();

      // Start a new quote to test duplicate VIN rule
      await policyPage.startNewQuote();
      await policyPage.selectPolicyCounty('Jamaica');
      await policyPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await policyPage.headerNextButton.click();
      await policyPage.waitForLoadingSpinner();
      await policyPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
      await policyPage.goToNextTab('Driver');
      await policyPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
      await policyPage.goToNextTab('Vehicle');

      await policyPage.waitForLoadingSpinner();
      await policyPage.clickAddNewVehicleButton();
      await policyPage.waitForLoadingSpinner();

      await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
      await policyPage.clickPremiumsAndCoveragesTab();
      await ratingPage.setCoverageAndPlan('Comprehensive', 'StandardWORentalBenefits');
      await ratingPage.calculatePremium();
      await ratingPage.clickFundingSummaryTab();
      await policyPage.purchaseButton.click();
      await policyPage.handlePurchasePolicyConfirmation(true);

      await expect(policyPage.overrideRulesButton).toBeVisible();
      await ratingPage.assertErrorMessage('This Chassis/VIN is already in use and cannot be added.');
    });

  test("[S11C2065] Verify error page opens when clicking 'Override Rules'",
    async ({ policyPage, ratingPage }) => {
      const { customerName: rawCustomerName, customerId } = await createJamaicaCustomerViaDxp({ age: 40 });
      const customerName = eisCustomerDisplayName(rawCustomerName);
      await ratingPage.searchCustomer(customerId);
      await ratingPage.waitForLoadingSpinner();

      // Start a new quote to test duplicate VIN rule
      await policyPage.startNewQuote();
      await policyPage.selectPolicyCounty('Jamaica');
      await policyPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await policyPage.headerNextButton.click();
      await policyPage.waitForLoadingSpinner();
      await policyPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
      await policyPage.goToNextTab('Driver');
      await policyPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
      await policyPage.goToNextTab('Vehicle');

      await policyPage.waitForLoadingSpinner();
      await policyPage.clickAddNewVehicleButton();
      await policyPage.waitForLoadingSpinner();

      await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);
      await policyPage.clickNext();
      await policyPage.waitForLoadingSpinner();

      await policyPage.headerOverrideRulesButton.click()
      await expect(policyPage.page.locator(':text-matches("Error")').first()).toBeVisible();
      await expect(policyPage.page.locator(':text-matches("This Chassis/VIN is already in use and cannot be added.", "i")').first()).toBeVisible();
    })

  test("[S11C2066] Rule is triggered at the 'Purchase' step",
    async ({ policyPage, ratingPage }) => {
      const { customerName: rawCustomerName, customerId } = await createJamaicaCustomerViaDxp({ age: 40 });
      const customerName = eisCustomerDisplayName(rawCustomerName);
      await ratingPage.searchCustomer(customerId);
      await ratingPage.waitForLoadingSpinner();

      // Start a new quote to test duplicate VIN rule
      await policyPage.startNewQuote();
      await policyPage.selectPolicyCounty('Jamaica');
      await policyPage.selectBranch('Head Office - Kingston');
      await policyPage.checkPremiumFincancing('No');
      await policyPage.headerNextButton.click();
      await policyPage.waitForLoadingSpinner();
      await policyPage.selectInsuredParty(customerName, 'Advantage General Insurance Company');
      await policyPage.goToNextTab('Driver');
      await policyPage.selectExistingDriver(customerName, 'Permanent', 'Valid');
      await policyPage.goToNextTab('Vehicle');

      await policyPage.waitForLoadingSpinner();

      await policyPage.clickAddNewVehicleButton();
      await policyPage.waitForLoadingSpinner();

      await policyPage.fillRequiredVehicleInformation(vehicleRequiredInformation);

      await policyPage.clickPremiumsAndCoveragesTab();
      await policyPage.selectOptionForCoverageTypeField("Private Car Comprehensive");
      await policyPage.selectOptionForPlanSelection("Standard w/o Rental Benefits");
      await ratingPage.calculatePremium();
      await policyPage.clickFundingSummaryTab();
      await policyPage.click(policyPage.purchaseButton);
      await policyPage.click(policyPage.purchasePolicyYesButton);
      await policyPage.handlePurchasePolicyConfirmation(true);
      await expect(policyPage.page.locator(':text-matches("Error")').first()).toBeVisible();
      await expect(policyPage.page.locator(':text-matches("This Chassis/VIN is already in use and cannot be added.", "i")').first()).toBeVisible();
    })
});

test.skip("[S11C2067] Rule is triggered at 'Issue' action",
  async ({ policyPage, customer }) => {

    await policyPage.clickQuoteTab();
    await policyPage.page.locator(':text-matches("P\\\\d{10}", "i")').first().click();

    // Incomplete: Issue not present in the Take Action List
    // BUG
  })

test.skip("[S11C2068] Rule cannot be overridden for users with authority level < 3",
  async ({ page }) => {

    // User related test; Only one user assigned
    // Not automatable
  })

test.skip("[S11C2069] User with authority level 3 or higher can override the rule",
  async ({ page }) => {

    // User related test; Only one user assigned
    // Not automatable
  })

test("[S11C2070] Verify the 'Reason' field default display is Blank/none and contains specified dropdown values when Manual Renew is selected.",
  async ({ policyPage, customer, ratingPage }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('manualRenew');
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.reasonField);
    await policyPage.verifyManualReviewReasonHasGivenValues();
  })

test("[S11C2071] Verify the system displays an error message when the 'Reason' field is left blank during Manual Renew.",
  async ({ policyPage, page, customer, ratingPage }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('manualRenew');
    await policyPage.click(policyPage.okFooterButton);
    await expect(page.getByText('\'Reason\' is mandatory')).toBeVisible();
  })

test("[S11C2072] Verify the 'Reason' field default display is Blank/none and contains specified dropdown values when Do Not Renew is selected.",
  async ({ policyPage, customer, ratingPage }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('doNotRenew');
    await policyPage.waitForLoadingSpinner();
    await policyPage.verifyFieldIsPresentEditableAndDefaultIsBlank(policyPage.reasonField);
    await policyPage.verifyDoNotRenewReasonFieldHasGivenValues();
  })

test("[S11C2073] Verify the system displays an error message when the 'Reason' field is left blank during Do Not Renew.",
  async ({ policyPage, page, customer, ratingPage }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('doNotRenew');
    await policyPage.waitForLoadingSpinner();
    await policyPage.click(policyPage.okFooterButton);
    await expect(await page.getByText('\'Reason\' is mandatory')).toBeVisible();
  })

test("[S11C2074] Verify the system displays an error message when the 'Do Not Renew Status' field is left blank during Do Not Renew.",
  async ({ policyPage, page, customer, ratingPage }) => {
    // Create a new policy for endorsement testing
    await policyPage.startNewQuote();
    await policyPage.selectPolicyCounty('Jamaica');
    await policyPage.selectBranch('Head Office - Kingston');
    await policyPage.checkPremiumFincancing('No');
    await policyPage.headerNextButton.click();
    await policyPage.waitForLoadingSpinner();
    await policyPage.selectInsuredParty(customer.customerName, 'Advantage General Insurance Company');
    await policyPage.goToNextTab('Driver');
    await policyPage.selectExistingDriver(customer.customerName, 'Permanent', 'Valid');
    await policyPage.goToNextTab('Vehicle');

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
    await policyPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('Comprehensive');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: customer.customerName,
      city: 'Test City'
    });

    // Store the policy number for use in the next test
    const policyNumberText = await policyPage.policyNumberText.textContent() || '';
    let createdPolicyNumber = policyNumberText.replace('#', '').trim();
    if (!createdPolicyNumber) throw new Error('Policy number not found');  await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('doNotRenew');
    await policyPage.waitForLoadingSpinner();

    await page.getByLabel('Reason', { exact: true }).selectOption('DNR - Loss Experience');
    await policyPage.click(policyPage.okFooterButton);
    await policyPage.waitForLoadingSpinner();

    await expect(policyPage.doNotRenewStatusErrorMessage).toBeVisible();
  })


