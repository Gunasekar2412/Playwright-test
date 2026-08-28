import { Page, Locator } from '@playwright/test';

export class QuotePage {
    readonly page: Page;

    // Selectors
    readonly getNewQuoteLink: Locator;
    readonly privateMotorLink: Locator;

    // Personal Details Section
    readonly claimFreeYearsDropdown: Locator;
    readonly emailAddressField: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly phoneNumberField: Locator;
    readonly dateOfBirthField: Locator;
    readonly idTypeDropdown: Locator;
    readonly driverLicenceOption: Locator;
    readonly idNumberField: Locator;

    // Vehicle Details Section
    readonly vehicleHeader: Locator;
    readonly vehicleMakeDropdown: Locator;
    readonly vehicleModelDropdown: Locator;
    readonly yearOfManufactureField: Locator;
    readonly ccField: Locator;
    readonly valueOfVehicleField: Locator;
    readonly vehicleWrittenOffNoOption: Locator;

    // Discount Section
    readonly discountHeader: Locator;
    readonly discountText: Locator;

    // Get Quote Button
    readonly getQuoteButton: Locator;
    readonly privacyCheckbox: Locator;

    // Quote Summary Section
    readonly emailAllButton: Locator;
    readonly modifyButton: Locator;

    // Update these locators to be more generic
    readonly highValuePopupTitle: Locator;
    readonly highValuePopupMessage: Locator;
    readonly highValuePopupOkButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize selectors with more specific and reliable selectors
        this.getNewQuoteLink = page.getByRole('link', {
            name: ' Get New Quote',
        });
        this.privateMotorLink = page.getByRole('link', {
            name: 'Private Motor',
        });
        this.claimFreeYearsDropdown = page.locator('select#claim_years');

        this.emailAddressField = page.locator('input#customerEmailAddress');
        this.firstNameField = page.locator('input#customerFirstName');
        this.lastNameField = page.locator('input#customerLastName');
        this.phoneNumberField = page.locator('input#customerPhoneNumber');
        this.dateOfBirthField = page.locator('input#date_of_birth');
        this.idTypeDropdown = page.locator(
            '#select2-insnationalIdType-container'
        );
        this.driverLicenceOption = page.locator(
            'select#insnationalIdType > option',
            { hasText: 'Driver Licence' }
        );
        this.idNumberField = page.locator('input#insIdNum');
        this.vehicleHeader = page.locator('#vehicleHeader');
        this.vehicleMakeDropdown = page.locator(
            '#select2-vehicle_make-container'
        );
        this.vehicleModelDropdown = page.locator(
            '#select2-vehicle_model-container'
        );
        this.yearOfManufactureField = page.locator(
            'input[id="year_of_vehicle"]'
        );
        this.ccField = page.locator('input[id="cc_rating"]');
        this.valueOfVehicleField = page.locator('input[id="value_of_vehicle"]');
        this.vehicleWrittenOffNoOption = page.locator(
            '#vehicleWrittenOff label[for="writeOffNo"]'
        );
        this.discountHeader = page.locator('#discountHeader');
        this.discountText = page.getByText('Get a premium discount by');
        this.privacyCheckbox = page.locator('input#chkAcceptPrivacy');

        this.getQuoteButton = page.getByRole('button', { name: 'Get Quote' });
        this.emailAllButton = page.locator('.btnEmailQuoteToUser', {
            hasText: 'Email All',
        });
        this.modifyButton = page.locator('.btnBeginAdjustment', {
            hasText: 'Modify',
        });

        // Update these locators to be more generic
        this.highValuePopupTitle = page.locator('.sweet-alert h2');
        this.highValuePopupMessage = page.locator('.sweet-alert h2 + p');
        this.highValuePopupOkButton = page.locator(
            '.sweet-alert button.confirm'
        );
    }

    // Navigation
    async navigateToQuotePage() {
        await this.page.goto('https://prodbbd.redmanlabs.net/');
        await this.getNewQuoteLink.click();
    }

    // Quote Type Selection
    async selectPrivateMotor() {
        await this.page.waitForLoadState('networkidle');
        await this.privateMotorLink.waitFor({ state: 'visible' });
        await this.privateMotorLink.click();
    }

    // Personal Details Section
    async selectClaimFreeYears(option: string) {
        // Click on the Select2 container to open the dropdown
        await this.page.locator('#select2-claim_years-container').click();

        // Click on the option with the specified text
        await this.page
            .locator('.select2-results__option', {
                hasText: new RegExp(`^${option}$`),
            })
            .click();
    }

    async selectIdType(idType: string) {
        // Click on the Select2 container to open the dropdown
        await this.idTypeDropdown.click();

        // Click on the option with the specified text
        await this.page
            .locator('.select2-results__option', { hasText: idType })
            .click();
    }

    async fillPersonalDetails(
        email: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        dateOfBirth: string,
        idNumber: string,
        claimFreeYears: string = '1 year', // Default value
        idType: string = 'Driver Licence' // Default value
    ) {
        // Select claim free years
        await this.selectClaimFreeYears(claimFreeYears);

        // Fill email, name, phone, DOB as before
        await this.emailAddressField.fill(email);
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.phoneNumberField.fill(phoneNumber);
        await this.dateOfBirthField.fill(dateOfBirth);

        // Select ID type using the new method
        await this.selectIdType(idType);

        // Fill ID number
        await this.idNumberField.fill(idNumber);
    }

    // Vehicle Details Section
    async selectVehicleMake(make: string) {
        // Click on the Select2 container to open the dropdown
        await this.vehicleMakeDropdown.click();

        // Click on the option with the specified text
        await this.page
            .locator('.select2-results__option', { hasText: make })
            .click();
    }

    async selectVehicleModel(model: string) {
        // Wait for the vehicle model dropdown to be visible
        await this.vehicleModelDropdown.waitFor({ state: 'visible' });

        // Click on the Select2 container to open the dropdown
        await this.vehicleModelDropdown.click();

        // Click on the option with the exact specified text using regex with ^ and $ anchors
        await this.page
            .locator('.select2-results__option', {
                hasText: new RegExp(`^${model}$`),
            })
            .click();
    }

    async fillVehicleDetails(
        make: string,
        model: string,
        year: string,
        cc: string,
        value: string
    ) {
        await this.vehicleHeader.click();

        // Select vehicle make using the dedicated method
        await this.selectVehicleMake(make);

        // Wait a moment for the model dropdown to populate based on the selected make
        await this.page.waitForTimeout(500);

        // Select vehicle model using the dedicated method
        await this.selectVehicleModel(model);

        // Enter year of manufacture
        await this.yearOfManufactureField.fill(year);

        // Enter CC
        await this.ccField.fill(cc);

        // Enter value of vehicle
        await this.valueOfVehicleField.fill(value);

        // Select "No" for written off
        await this.vehicleWrittenOffNoOption.click();
    }

    // Discount Section
    async openDiscountSection() {
        await this.discountText.click();
    }

    // Privacy Section
    async acceptPrivacy() {
        await this.privacyCheckbox.waitFor({ state: 'visible' });

        const privacyLabel = this.page.locator('label[for="chkAcceptPrivacy"]');
        await privacyLabel.click();
    }

    // Get Quote Button
    async clickGetQuoteButton() {
        await this.getQuoteButton.waitFor({ state: 'visible' });
        await this.getQuoteButton.isEnabled();
        await this.getQuoteButton.click();
    }

    // Add these new validation methods
    async validateEmailAllButtonPresent() {
        await this.emailAllButton.waitFor({ state: 'visible' });
        return this.emailAllButton.isVisible();
    }

    async validateModifyButtonPresent() {
        await this.modifyButton.waitFor({ state: 'visible' });
        return this.modifyButton.isVisible();
    }

    // Add a method to wait for the API call to complete
    async waitForApiResponse(urlPattern: string, method: string = 'POST') {
        // Wait for the network request to complete
        await this.page.waitForResponse(
            (response) =>
                response.url().includes(urlPattern) &&
                response.request().method() === method,
            { timeout: 30000 }
        );
    }

    // Update the validateHighValuePopup method
    async validateHighValuePopup() {
        // First wait for the API call to complete
        await this.waitForApiResponse('/MotorQuote/v2');

        // Then wait for the popup to be visible
        await this.highValuePopupTitle.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        // Check if elements are visible
        const titleVisible = await this.highValuePopupTitle.isVisible();
        const messageVisible = await this.highValuePopupMessage.isVisible();
        const okButtonVisible = await this.highValuePopupOkButton.isVisible();

        // Get the text content
        const titleText = (await this.highValuePopupTitle.textContent()) || '';
        const messageText =
            (await this.highValuePopupMessage.textContent()) || '';
        const okButtonText =
            (await this.highValuePopupOkButton.textContent()) || '';

        return {
            titleVisible,
            messageVisible,
            okButtonVisible,
            titleText,
            messageText,
            okButtonText,
        };
    }

    async dismissHighValuePopup() {
        await this.highValuePopupOkButton.click();
    }

    // Add this method to check if Diamond Max plan is present
    async isDiamondMaxPlanPresent() {
        // Wait for quote results to load
        await this.page.waitForLoadState('networkidle');

        // Look for the Diamond Max plan by its ID or title
        const diamondMaxPlanLocator = this.page.locator('.card', {
            hasText: 'Diamond Max-',
        });

        // Check if the element exists and is visible
        try {
            await diamondMaxPlanLocator.waitFor({
                state: 'visible',
                timeout: 5000,
            });
            return true;
        } catch (error) {
            // If timeout occurs, the element is not visible
            return false;
        }
    }
}
