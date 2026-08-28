import { test, expect } from '../../../../lib/aio/aioHooks';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    AnyCustomerInformation,
    generateCustomerInformation
} from '../../../../sites/eis/data/CustomerData';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(300_000);

let customerPage: CustomerPage;
let customerData: AnyCustomerInformation;

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    executionContext.region = 'Jamaica';

    await customerPage.goto();
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();
});

test(
    'Update an Individual customer - Jamaica',
    {
        tag: '@ECP-TC-47'
    },
    async ({ page }) => {
        // =====================================
        // Create Individual Customer
        // =====================================

        customerData =
            generateCustomerInformation(
                undefined,
                'Jamaica',
                {
                    customerType: 'Individual'
                }
            );

        await customerPage.customerCreationTypeModal('Individual');
        const customerDetails =
            await customerPage.fillRequiredInformation(customerData);
        await customerPage.trnField.fill(
            customerData.generalInformation['Identification Number']
        );
        await customerPage.clickNext();
        await customerPage.clickDone();
        await customerPage.verifyCustomerCreated();

        const customerId =
            (await customerPage.customerId.textContent())?.trim() || '';
        const customerName =
            `${customerDetails.generalInformation['First Name']} ${customerDetails.generalInformation['Last Name']}`;

        executionContext.customerId = customerId;
        executionContext.customerName = customerName;

        // =====================================
        // Search Customer
        // =====================================

        await customerPage.quickSearchButton.click();
        await waitForBarbadosLoadingSpinner(customerPage);
        await customerPage.firstNameField.fill(
            customerDetails.generalInformation['First Name']
        );
        await customerPage.lastNameField.fill(
            customerDetails.generalInformation['Last Name']
        );
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
        await page.locator('#crmForm\\:generalInfo_taxId').fill(randomTaxId);
        await customerPage.clickNext();
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
