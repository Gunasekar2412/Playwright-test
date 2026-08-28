import { test, expect } from '../../../../lib/aio/aioHooks';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    AnyCustomerInformation,
    generateCustomerInformation
} from '../../../../sites/eis/data/CustomerData';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(360_000);

let customerPage: CustomerPage;
let customerData: AnyCustomerInformation;
let customerId = '';
let customerName = '';

function buildJamaicaIndividualCustomer(): AnyCustomerInformation {
    const customer =
        generateCustomerInformation(
            40,
            'Jamaica',
            {
                customerType: 'Individual'
            }
        ) as any;

    customer.additionalInformation['Prominent Person'] = 'Yes';
    customer.additionalInformation['Title'] = 'Minister of Finance';
    customer.additionalInformation['Organization'] = 'Government of Jamaica';

    return customer;
}

async function openCreateIndividualCustomer(): Promise<void> {
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();
    await customerPage.customerCreationTypeModal('Individual');
}

async function fillAndSubmitIndividualCustomer(
    customer: AnyCustomerInformation
): Promise<void> {
    await customerPage.fillRequiredInformation(customer);
    await customerPage.trnField.fill(
        (customer as any).generalInformation['Identification Number']
    );
    await customerPage.clickNext();
    await customerPage.clickDone();
}

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    customerData = buildJamaicaIndividualCustomer();
    customerId = '';
    customerName = '';
    executionContext.region = 'Jamaica';

    await customerPage.goto();
});

test.describe.serial('ECP-TC-46 Jamaica Individual Customer Validation', () => {
    test(
        'Add an Individual customer - Jamaica',
        { tag: '@ECP-TC-46' },
        async ({ page }) => {
            await test.step('Expected Result 3 - Mandatory field validation', async () => {
                await openCreateIndividualCustomer();
                await customerPage.clickNext();

                await expect(
                    page.getByText(/required/i).first()
                ).toBeVisible();
                await expect(
                    page.getByText(/first name.*required/i)
                ).toBeVisible();
                await expect(
                    page.getByText(/last name.*required/i)
                ).toBeVisible();
                await expect(
                    page.getByText(/identification.*required/i)
                ).toBeVisible();            });

            await test.step('Expected Result 2 - Create Jamaica Individual customer with PEP details', async () => {
                await customerPage.quickSearchButton.click();
                await page
                    .locator('#cancelConfirmDialogDialog_form\\:buttonYes')
                    .click()
                    .catch(() => undefined);
                await waitForBarbadosLoadingSpinner(customerPage);

                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal('Individual');
                await fillAndSubmitIndividualCustomer(customerData);
                await customerPage.verifyCustomerCreated();

                customerId =
                    (await customerPage.customerId.textContent())?.trim() || '';
                customerName = [
                    (customerData as any).generalInformation['First Name'],
                    (customerData as any).generalInformation['Last Name']
                ].join(' ');

                expect(customerId).toBeTruthy();               executionContext.customerId = customerId;
                executionContext.customerName = customerName;
            });

            await test.step('Expected Result 1 - Duplicate customer detection', async () => {
                await customerPage.quickSearchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal('Individual');
                await customerPage.fillRequiredInformation(customerData);
                await customerPage.trnField.fill(
                    (customerData as any).generalInformation[
                        'Identification Number'
                    ]
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
                ).toBeVisible();            });
        }
    );
});
