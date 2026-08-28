import { test, expect } from '../../../../lib/aio/aioHooks';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    AnyCustomerInformation,
    generateCustomerInformation
} from '../../../../sites/eis/data/CustomerData';

test.setTimeout(360_000);

let customerPage: CustomerPage;

function buildBarbadosNonIndividualCustomer(): AnyCustomerInformation {

    const customerData =
        generateCustomerInformation(
            undefined,
            'Barbados',
            {
                customerType: 'Non-Individual'
            }
        ) as any;

    customerData.businessInformation[
        'Company Number/Taxpayer Registration Number'
    ] = Math.floor(
        100000000 + Math.random() * 900000000
    ).toString();

    customerData.additionalInformation[
        'Prominent Person Question'
    ] = 'Yes';

    customerData.additionalInformation[
        'Title'
    ] = 'Minister of Finance';

    customerData.additionalInformation[
        'Name of the organization'
    ] = 'Government of Barbados';

    return customerData;


}

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    await customerPage.goto();
});

test(
    'Update a Non-Individual customer - Barbados',
    {
        tag: '@ECP-TC-20'
    },
    async ({ page }) => {


        const customerData =
            buildBarbadosNonIndividualCustomer();

        const legalName =
            (customerData as any).generalInformation[
            'Name - Legal'
            ];

        // =====================================
        // Expected Result 3
        // Mandatory Validation
        // =====================================

        await test.step(
            'Mandatory field validation',
            async () => {

                await customerPage.clickCustomerTabButton();
                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal(
                    'Non-Individual'
                );
                await customerPage.clickNext();
                await expect(
                    page.getByText(/required/i).first()
                ).toBeVisible();
            }
        );

        // =====================================
        // Create Customer
        // =====================================

        await test.step(
            'Create Non-Individual Customer',
            async () => {

                await customerPage.quickSearchButton.click();
                await page.locator(
                    '#cancelConfirmDialogDialog_form\\:buttonYes'
                ).click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal(
                    'Non-Individual'
                );
                
                await customerPage.fillRequiredNonIndividualCustomerInformation(
                    customerData
                );
                await customerPage.clickNext();
                await customerPage.clickDone();
                await customerPage.verifyCustomerCreated();
            }
        );

        const customerId =
            (
                await customerPage.customerId.textContent()
            )?.trim() || '';

        expect(customerId).toBeTruthy();

        // =====================================
        // Search Customer
        // =====================================

        await test.step(
            'Search Customer',
            async () => {

                await customerPage.quickSearchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.customerNumberField.fill(
                    customerId
                );
                await customerPage.searchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
            }
        );

        // =====================================
        // Open Customer
        // =====================================

        await customerPage.customerIdLink.click();
        await waitForBarbadosLoadingSpinner(customerPage);

        // =====================================
        // Update Customer
        // =====================================
        let updatedLegalId = '';
        await test.step(
            'Update Non-Individual Customer',
            async () => {
                await customerPage.nextButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.doneButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.takeActionDropdown.selectOption(
                    'updateCustomerEvent'
                );
                await waitForBarbadosLoadingSpinner(customerPage);
                updatedLegalId =
                    Math.floor(
                        100000000 +
                        Math.random() * 900000000
                    ).toString();
                await page
                    .locator(
                        '#crmForm\\:generalInfoLeft_legalId'
                    )
                    .clear();
                await page
                    .locator(
                        '#crmForm\\:generalInfoLeft_legalId'
                    )
                    .fill(updatedLegalId);
                await customerPage.clickNext();
                await customerPage.clickDone();
                await customerPage.customerIdLink.click();
                await waitForBarbadosLoadingSpinner(customerPage);
            }
        );

        // =====================================
        // Expected Result 4
        // Persisted Data Verification
        // =====================================

        await test.step(
            'Verify updated values persisted',
            async () => {

                const persistedLegalId =
                    await page
                        .locator(
                            '#crmForm\\:generalInfoLeft_legalId'
                        )
                        .inputValue();

                expect(persistedLegalId)
                    .toContain(updatedLegalId.slice(-4));


            }
        );


    }


);
