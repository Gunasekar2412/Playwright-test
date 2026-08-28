import { expect, test } from "@playwright/test";
import { CustomerPage } from "../../../sites/eis/pages/CustomerPage";
import { RatingPage } from "../../../sites/eis/pages/RatingPage";
import { faker } from '@faker-js/faker';
import {
  errorMessages,
  generateCustomerInformation,
  nonIndividualRequired,
  CustomerInformation,
  AnyCustomerInformation
} from "../../../sites/eis/data/CustomerData";
import { generateDriverDetails } from "../../../lib/utils";
import { PolicyPage } from "../../../sites/eis/pages/PolicyPage";

let customerPage: CustomerPage;
let ratingPage: RatingPage;
let policyPage: PolicyPage;
let customerData: AnyCustomerInformation;

test.beforeEach('Setup', async ({ page }) => {
  customerPage = new CustomerPage(page);
  ratingPage = new RatingPage(page);
  policyPage = new PolicyPage(page);
  customerData = generateCustomerInformation();

  await customerPage.goto();
  await customerPage.clickCustomerTabButton();
  await customerPage.clickCreateCustomerButton();
});

//Individual tests
test("[S11C2195] Verify that the TRN field is present", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.trnFieldIsPresent();
})

test("[S11C2196] Verify that the TRN is not a required field", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.clickNext();
  await customerPage.verifyTRNFieldIsNotRequired();
})

test("[S11C2197] Verify that the TRN is required, if country = Jamaica", async ({ page }) => {
  test.setTimeout(150_000);
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.fillRequiredInformation(customerData);
  await customerPage.clickNext();
  await ratingPage.waitForLoadingSpinner();
  await customerPage.clickDone();
  await customerPage.verifyTRNisRequriedWhenFormCompleted();
})

test("[S11C2198] Verify TRN field is required and accepted, if country = Jamaica", async ({ page }) => {
  test.setTimeout(150_000);
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.fillRequiredInformation(customerData);
  await customerPage.page.waitForTimeout(500);
  await customerPage.trnField.fill(customerData.generalInformation['Identification Number']);
  await customerPage.clickNext()
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2199] Verify that the TRN field has no default value assigned", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.verifyTRNFieldEmpty();
})

test("[S11C2200] Verify that the TRN field is editable", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.verifyTRNFieldisEditable('000000');
})

test("[S11C2201] Verify that the TRN field accepts 9 digits", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.trnField.fill('999999999'); // 9 digits
  await customerPage.clickNext();
  await expect(customerPage.trnErrorContainer).not.toBeVisible();
})

test("[S11C2202] Verify that the TRN field does not accept less than 9 digits", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.trnField.fill('0000000');
  await customerPage.clickNext();
  await expect(customerPage.trnErrorContainer).toHaveText(errorMessages.trn['< 9 digits']);
})

test("[S11C2203] Verify that the TRN field does not accept more than 9 digits", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.trnField.fill('99999999999');
  await customerPage.clickNext();
  await expect(customerPage.trnErrorContainer).toHaveText(errorMessages.trn['> 9 digits']);
})

test("[S11C2204] Verify that when an new quote is added the TRN field is pre-populated on the Insured tab", async ({ page }) => {
  test.setTimeout(150_000);
  await customerPage.customerCreationTypeModal('Individual');
  await customerPage.fillRequiredInformation(customerData);
  await customerPage.page.waitForTimeout(500);
  await customerPage.trnField.fill(customerData.generalInformation['Identification Number']);

  await customerPage.clickNext();
  await customerPage.clickDone();

  await ratingPage.startNewQuote();
  await customerPage.clickInsuredTabButton();
  await customerPage.selectInsured(customerData);

  await customerPage.verifyTRNFieldIsPrePopulated(customerData.generalInformation['Identification Number']);
})

//Non-Individual tests
test("[S11C2205] Verify the 'Name - DBA' field is relabeled as 'Trading As", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.tradingAsField).toBeVisible();
  await expect(customerPage.tradingAsField).toHaveText('Trading As');
})

test("[S11C2206] Verify the 'Underwriter Review' field is visible, enabled, and functional", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.underwriterReviewField).toBeVisible();
  await expect(customerPage.underwriterReviewField).toBeEnabled();

  await expect(customerPage.underwriterReviewLabel).toBeVisible();
  await expect(customerPage.underwriterReviewLabel).toHaveText('Underwriter Review');

  // Verify default empty option is selected
  await expect(customerPage.underwriterReviewField).toHaveValue('');

  // Verify selection functionality
  await customerPage.underwriterReviewField.selectOption('FC/AH');
  await expect(customerPage.underwriterReviewField).toHaveValue('FC/AH');
})

test("[S11C2207] Verify the 'Underwriter Review' field is visible, enabled, and functional", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });

  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.underwriterReviewField).toBeVisible();
  await customerPage.underwriterReviewField.selectOption('FC/AH');

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2208] Verify the 'Underwriter Review' field is visible, enabled, and functional", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
  await customerPage.customerCreationTypeModal('Non-Individual');

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.underwriterReviewField.selectOption('Suspicious Activity');

  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();

  await customerPage.addQuoteButton.click();
  await customerPage.waitForLoadingSpinner();

  await expect(customerPage.addNewQuoteButton).toBeVisible();
  await expect(customerPage.addNewQuoteButton).toBeDisabled();
})

test.describe.serial('Underwriter Review', () => {
  let customerId: string;
  let policyNumber: string;

  test("[S11C2209] Verify the 'Underwriter Review' field is visible, enabled, and functional", async ({ page }) => {
    test.slow();

    customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
    customerData.contactDetails['City'] = 'Liguanea';

    await customerPage.customerCreationTypeModal('Non-Individual');

    // Fill required information
    await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
    await customerPage.einField.fill('120828892829292929292');

    await customerPage.clickNext();
    await customerPage.clickDone();
    await customerPage.verifyCustomerCreated();

    // Get customer id
    customerId = (await customerPage.customerId.textContent())?.trim() || '';

    // Generate driver & vehicle details
    const driver = generateDriverDetails({
      country: 'JM',
      relationship: 'Other',
      driverType: 'Main Driver',
      age: 30
    });

    const vehicle = {
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

    await customerPage.startNewQuote();

    // Select branch
    await ratingPage.selectPolicyCounty('Jamaica');
    await ratingPage.selectBranch('Head Office - Kingston');
    await policyPage.waitForLoadingSpinner();
    await policyPage.premiumFinancingNoRadioField.check();
    await policyPage.waitForLoadingSpinner();
    await ratingPage.headerNextButton.click();
    await ratingPage.waitForLoadingSpinner();

    // Set insured party details
    await ratingPage.selectInsuredParty(customerData.generalInformation['Name'], 'Advantage General Insurance Company');

    // Set driver & vehicle details
    await ratingPage.addNewDriver(driver);
    await ratingPage.goToNextTab('Vehicle');
    await ratingPage.addNewVehicle(vehicle);

    // Set registered owner details
    await customerPage.registeredOwnerNameLegal.fill(customerData.generalInformation['Name - Legal']);

    // Set coverage and calculate premium
    await ratingPage.clickPremiumsAndCoveragesTab();
    await ratingPage.setCoverageAndPlan('PrivateCTP');
    await ratingPage.calculatePremium();
    await ratingPage.clickFundingSummaryTab();

    // Validate purchase button is visible and enabled
    await policyPage.purchaseButton.isVisible();
    await expect(policyPage.purchaseButton).toBeEnabled();

    // Save and exit policy
    await policyPage.saveAndExitButton.click();
    await policyPage.waitForLoadingSpinner();
    policyNumber = ((await policyPage.policyNumberText.textContent())?.trim() || '').replace('#', '');    // Update customer with underwriter review reason
    await customerPage.clickCustomerTabButton();
    await customerPage.takeActionDropdown.selectOption('Update');
    await customerPage.waitForLoadingSpinner();
    await customerPage.updateUnderwriterReviewField.selectOption('Suspicious Activity');
    await customerPage.saveAndExitButton.click();
    await customerPage.waitForLoadingSpinner();

    // Navigate to policy previously created
    await policyPage.clickPolicyNumberLink(policyNumber);
    await policyPage.waitForLoadingSpinner();
    await policyPage.takeActionDropdown.selectOption('Data Gather');
    await policyPage.waitForLoadingSpinner();
    await ratingPage.clickFundingSummaryTab();

    // Validate purchase button is visible and disabled
    await policyPage.purchaseButton.isVisible();
    await expect(policyPage.purchaseButton).toBeDisabled();
  })

  test("[S11C2210] Verify the 'Underwriter Review' field is visible, enabled, and functional", async ({ page }) => {
    await customerPage.cancelButton.click();
    await customerPage.waitForLoadingSpinner();

    // Find previously created customer
    await ratingPage.searchCustomer(customerId);

    // Update customer to remove underwriter review reason
    await customerPage.takeActionDropdown.selectOption('Update');
    await customerPage.waitForLoadingSpinner();
    await customerPage.updateUnderwriterReviewField.selectOption('');
    await customerPage.saveAndExitButton.click();
    await customerPage.waitForLoadingSpinner();

    // Navigate to policy previously created
    await policyPage.clickPolicyNumberLink(policyNumber);
    await policyPage.waitForLoadingSpinner();

    await policyPage.takeActionDropdown.selectOption('Data Gather');
    await policyPage.waitForLoadingSpinner();
    await ratingPage.clickFundingSummaryTab();

    // Purchase policy
    await policyPage.purchaseButton.isVisible();
    await policyPage.purchaseButton.click();
    await policyPage.handlePurchasePolicyConfirmation(true);
    await policyPage.finishPayment({
      billingAccountName: 'Test Account',
      city: 'Test City',
      trn: '123456789'
    });

    // Ensure take action dropdown has a renew option
    await expect(policyPage.takeActionDropdown).toContainText('Renew');

    // Update customer with underwriter review reason
    await customerPage.clickCustomerTabButton();
    await customerPage.takeActionDropdown.selectOption('Update');
    await customerPage.waitForLoadingSpinner();
    await customerPage.updateUnderwriterReviewField.selectOption('Suspicious Activity');
    await customerPage.saveAndExitButton.click();
    await customerPage.waitForLoadingSpinner();

    // Navigate to policy previously created
    await policyPage.clickPolicyNumberLink(policyNumber);
    await policyPage.waitForLoadingSpinner();

    // Do not renew flag is visible and says 'Do Not Renew'
    await expect(customerPage.doNotRenewFlag).toBeVisible();
    await expect(customerPage.doNotRenewFlag).toHaveText('Do Not Renew');
  })
})

// Skipped: Because required message is incorrect, it should be 'Company Number/Taxpayer Registration Number' is required.
test("[S11C2211] Verify the EIN field is relabled to 'Company Number/Taxpayer Registration Number' and accepts up to 20 characters", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.einField).toBeVisible();
  await expect(customerPage.einField).toHaveText('Company Number/Taxpayer Registration Number');
  await customerPage.clickNext();
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(3000);
  await expect(customerPage.einErrorMessage).toHaveText("Company Number/Taxpayer Registration number is required");
})

test("[S11C2212] Verify the EIN field is relabled to 'Company Number/Taxpayer Registration Number' and accepts up to 20 characters", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });

  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.einField).toBeVisible();
  await expect(customerPage.einField).toHaveText('Company Number/Taxpayer Registration Number');

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2213] Verify the 'Date business started' field is optional", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });

  await customerPage.customerCreationTypeModal('Non-Individual');
  await expect(customerPage.dateBusinessStartedField).toBeVisible();
  await expect(customerPage.dateBusinessStartedField).toBeEnabled();
  await expect(customerPage.dateBusinessStartedLabel).toHaveText('Date business started');

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.dateBusinessStartedField.fill('');
  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2214] Verify the SIC/NACIS Classification section is not displayed by default and is optional to add", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
  await customerPage.customerCreationTypeModal('Non-Individual');

  // Option to add SIC/NACIS Classification is displayed but the section is not by default
  await expect(customerPage.sicClassificationSection).toBeVisible()
  await expect(customerPage.sicClassificationHeader).toBeVisible({ visible: false })
  await expect(customerPage.sicClassificationBody).toBeVisible({ visible: false })

  await expect(customerPage.naicsClassificationSection).toBeVisible()
  await expect(customerPage.naicsClassificationHeader).toBeVisible({ visible: false })
  await expect(customerPage.naicsClassificationBody).toBeVisible({ visible: false })

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2215] Verify the PEP question requires a Yes/No response and prompts error messages when applicable", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = null;

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.clickNext();

  await expect(customerPage.pepQuestionErrorMessage).toBeVisible();
})

test("[S11C2216] Verify the PEP question requires a Yes/NO response and prompts error messages when applicable", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = null;

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.clickNext();

  await expect(customerPage.pepQuestionErrorMessage).toBeVisible();
})

test("[S11C2217] Verify the PEP question requires a Yes/NO response and prompts error messages when applicable", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'United States', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'Yes';

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');
  await customerPage.clickNext();
  await customerPage.clickDone();

  await expect(customerPage.usPepQuestionErrorMessage).toBeVisible();
})

test("[S11C2218] Verify the 'Title & Organization' field requires information, accepts up to 200 characters and functions and prompt error message when applicable", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'Yes';

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyErrorMessage('Title is required');
  await customerPage.verifyErrorMessage('Name of the organization is required');

  await customerPage.backButton.click();

  // Fill required information
  await customerPage.pepTitle.fill('A'.repeat(200));
  await customerPage.pepOrganization.fill('B'.repeat(200));
  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyCustomerCreated();
})

test("[S11C2219] Verify the 'Title & Organization' field requires information, accepts up to 200 characters and functions adn prompt error message when applicable", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'Yes';

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyErrorMessage('Title is required');
  await customerPage.verifyErrorMessage('Name of the organization is required');

  await customerPage.backButton.click();

  // Fill required information
  await customerPage.pepTitle.fill('A'.repeat(200));
  await customerPage.pepOrganization.fill('B'.repeat(200));
  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyCustomerCreated();
})

test("[S11C2220] Verify the 'Title & Organization' field does not require information", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Jamaica', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'No';

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.pepTitle.fill('Minister of National Security');
  await customerPage.pepOrganization.fill('JLP');

  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyErrorMessage('Title is not required, please remove');
  await customerPage.verifyErrorMessage('Name of the organization is not required, please remove');
})

test("[S11C2221] Verify the 'Title & Organization' field does not require information", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'No';

  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.pepTitle.fill('Minister of National Security');
  await customerPage.pepOrganization.fill('BLP');

  await customerPage.clickNext();
  await customerPage.clickDone();

  await customerPage.verifyErrorMessage('Title is not required, please remove');
  await customerPage.verifyErrorMessage('Name of the organization is not required, please remove');
})

// Skipped: Because the test is not working as expected, when PEP is Yes, the customer risk category is not being populated in the form.
test.skip("[S11C2222] Verify the 'Customer Risk Category' field displays High, Low, and Medium options and functions as per logic", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'Yes';

  await customerPage.customerCreationTypeModal('Non-Individual');
  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);

  await customerPage.einField.fill('120828892829292929292');
  await customerPage.pepTitle.fill('Minister of National Security');
  await customerPage.pepOrganization.fill('BLP');

  await expect(customerPage.customerRiskCategoryField).toHaveValue('High');

  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

// Skipped: Because the test is not working as expected, when PEP is No, the customer risk category is not being populated in the form.
test.skip("[S11C2223] Verify the 'Customer Risk Category' field displays High, Low, and Medium options and functions as per logic", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  customerData.additionalInformation['Prominent Person Question'] = 'Yes';

  await customerPage.customerCreationTypeModal('Non-Individual');
  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);

  await customerPage.einField.fill('120828892829292929292');
  await customerPage.pepTitle.fill('Minister of National Security');
  await customerPage.pepOrganization.fill('BLP');

  await expect(customerPage.customerRiskCategoryField).toHaveValue('Low');

  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

// Skipped: Because there is no Identification Type field in the form.
test.skip("[S11C2224] Verify the Identification Type field is required and defaults to Driver Licence when adding or updating customer information", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
})

// Skipped: Because there is no Identification Type field in the form.
test.skip("[S11C2225] Verify the Identification Type dropdown includes Driver Licence, Passport, NID, and Voter ID.", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
})

// Skipped: Because there is no Identification Type field in the form under Reporting Party when creating a claim.
test.skip("[S11C2226] Verify the Identification TYpe field is required and defaults to Driver Licence when completing FNOL", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
})

// Skipped: Because there is no Identification Type field in the form under Reporting Party when creating a claim.
test.skip("[S11C2227] Verify the Identification Type field is required and defaults to Driver Licence when completing FNOL", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
})

test("[S11C2228] Verify the Segment(s) field is optional and defaults to None when adding or updating a customer", async ({ page }) => {
  customerData = generateCustomerInformation(undefined, 'Barbados', { customerType: 'Non-Individual' });
  await customerPage.customerCreationTypeModal('Non-Individual');

  // Verify the correct segments are selected
  await expect(customerPage.segmentSelectedOptions).toHaveCount(0);

  // Fill required information
  await customerPage.fillRequiredNonIndividualCustomerInformation(customerData);
  await customerPage.einField.fill('120828892829292929292');

  await customerPage.clickNext();
  await customerPage.clickDone();
  await customerPage.verifyCustomerCreated();
})

test("[S11C2229] Verify the Segment(s) dropdown includes VIP, Employee, Sanctioned, and BCIC Director", async ({ page }) => {
  await customerPage.customerCreationTypeModal('Non-Individual');
  await customerPage.selectSegments(['VIP', 'Employee', 'Sanctioned', 'BCIC Director']);

  // Verify the correct segments are selected
  await expect(customerPage.segmentSelectedOptions).toHaveCount(4);
  await expect(customerPage.segmentSelectedList).toContainText('VIP');
  await expect(customerPage.segmentSelectedList).toContainText('Employee');
  await expect(customerPage.segmentSelectedList).toContainText('Sanctioned');
  await expect(customerPage.segmentSelectedList).toContainText('BCIC Director');
})

















