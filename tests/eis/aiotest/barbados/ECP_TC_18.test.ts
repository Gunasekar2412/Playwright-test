import { test, expect } from '../../../../lib/aio/aioHooks';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    AnyCustomerInformation,
    generateCustomerInformation
} from '../../../../sites/eis/data/CustomerData';

test.setTimeout(300_000);

let customerPage: CustomerPage;
let ratingPage: RatingPage;

let customerData: AnyCustomerInformation;

test.beforeEach(async ({ page }) => {

    customerPage = new CustomerPage(page);
    ratingPage = new RatingPage(page);
    await customerPage.goto();
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();

});

test(
    'Update an Individual customer - Barbados',
    {
        tag: '@ECP-TC-18'
    },
    async ({ page }) => {

        // =====================================
        // Create Individual Customer
        // =====================================

        customerData =
            generateCustomerInformation(
                undefined,
                'Barbados',
                {
                    customerType: 'Individual'
                }
            );

        await customerPage.customerCreationTypeModal('Individual');
        const customerDetails = await customerPage.fillRequiredInformation(customerData);
        await customerPage.clickNext();
        await customerPage.clickDone();
        await customerPage.verifyCustomerCreated();
        await customerData.generalInformation['Identification Number'];

        // =====================================
        // Search Customer
        // =====================================

        await customerPage.quickSearchButton.click();
        await waitForBarbadosLoadingSpinner(customerPage);
        await customerPage.firstNameField.fill(customerDetails.generalInformation['First Name']);
        await customerPage.lastNameField.fill(customerDetails.generalInformation['Last Name']);
        await customerPage.searchButton.click();
        await waitForBarbadosLoadingSpinner(customerPage);

        // =====================================
        // Update Customer
        // =====================================

        await customerPage.takeActionDropdown.selectOption('Update');
        await waitForBarbadosLoadingSpinner(customerPage);
        const randomTaxId = Math.floor(
            100000000 + Math.random() * 900000000
        ).toString();

        await page.locator('#crmForm\\:generalInfo_taxId').clear();
        await page.locator('#crmForm\\:generalInfo_taxId').fill(randomTaxId);        await customerPage.clickNext();
        await customerPage.clickDone();

        // =====================================
        // Verify Updated Value
        // =====================================
        await customerPage.customerIdLink.click();
        await waitForBarbadosLoadingSpinner(customerPage);
        const actualTaxId = await page
            .locator('#crmForm\\:generalInfo_taxId')
            .inputValue();

        expect(actualTaxId).toBe(randomTaxId);

    }
);
