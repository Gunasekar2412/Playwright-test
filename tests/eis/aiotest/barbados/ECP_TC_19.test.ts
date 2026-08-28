import { test, expect } from '../../../../lib/aio/aioHooks';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    AnyCustomerInformation,
    generateCustomerInformation
} from '../../../../sites/eis/data/CustomerData';

test.setTimeout(360_000);

let customerPage: CustomerPage;
let customerId = '';
let legalName = '';
let validationComments: string[] = [];

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);

    customerId = '';
    legalName = '';
    validationComments = [];

    await customerPage.goto();
});

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

async function openCreateNonIndividualCustomer() {
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();
    await customerPage.customerCreationTypeModal(
        'Non-Individual'
    );
}

async function fillAndSubmitNonIndividualCustomer(
    customerData: AnyCustomerInformation
) {
    await customerPage.fillRequiredNonIndividualCustomerInformation(
        customerData
    );
    await customerPage.clickNext();
    await customerPage.clickDone();
}

test(
    'Add a Non-Individual customer - Barbados',
    {
        tag: '@ECP-TC-19'
    },
    async ({ page }) => {

        const customerData =
            buildBarbadosNonIndividualCustomer();
        legalName =
            (customerData as any).generalInformation[
            'Name - Legal'
            ];

        // ===================================================
        // Expected Result 3
        // Mandatory Validation
        // ===================================================

        await test.step(
            'Expected Result 3 - Mandatory field validation',
            async () => {

                await openCreateNonIndividualCustomer();
                await customerPage.clickNext();
                await expect(
                    page.getByText(/required/i).first()
                ).toBeVisible();
                validationComments.push(
                    'Expected Result 3 passed - Required field validation displayed successfully.'
                );
            }
        );

        // ===================================================
        // Expected Result 2
        // Create Customer
        // ===================================================
        
        await test.step(
            'Expected Result 2 - Create Barbados Non-Individual Customer',
            async () => {
                await fillAndSubmitNonIndividualCustomer(
                    customerData
                );
                await customerPage.verifyCustomerCreated();
                customerId =
                    (
                        await customerPage.customerId.textContent()
                    )?.trim() || '';
                expect(customerId).toBeTruthy();
                validationComments.push(
                    `Expected Result 2 passed - Customer created successfully. Customer Number: ${customerId}`
                );
                validationComments.push(
                    'PEP fields were completed successfully.'
                );
            }
        );

        // ===================================================
        // Expected Result 1
        // Duplicate Validation
        // ===================================================

        await test.step(
            'Expected Result 1 - Duplicate Customer Detection',
            async () => {

                await customerPage.quickSearchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal(
                    'Non-Individual'
                );
                await customerPage.fillRequiredNonIndividualCustomerInformation(
                    customerData
                );
                await customerPage.clickNext();
                const duplicateMessage =
                    page.getByText(
                        /Duplicate Customer detected|DUPLICATE_CUSTOMER/i
                    );
                const matchingRecords =
                    page.getByText(
                        /Customer Party Search Result|matching records/i
                    );
                await expect(
                    duplicateMessage
                        .or(matchingRecords)
                        .first()
                ).toBeVisible();
                validationComments.push(
                    'Expected Result 1 passed - Duplicate customer validation displayed successfully.'
                );
            }
        );
    }
);
