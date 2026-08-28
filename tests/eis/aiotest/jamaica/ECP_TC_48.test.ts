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
let legalName = '';

function buildJamaicaNonIndividualCustomer(): AnyCustomerInformation {
    const customer =
        generateCustomerInformation(
            undefined,
            'Jamaica',
            {
                customerType: 'Non-Individual'
            }
        ) as any;

    customer.businessInformation[
        'Company Number/Taxpayer Registration Number'
    ] = Math.floor(
        100000000 + Math.random() * 900000000
    ).toString();

    customer.additionalInformation[
        'Prominent Person Question'
    ] = 'Yes';
    customer.additionalInformation['Title'] = 'Minister of Finance';
    customer.additionalInformation[
        'Name of the organization'
    ] = 'Government of Jamaica';

    return customer;
}

async function openCreateNonIndividualCustomer(): Promise<void> {
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();
    await customerPage.customerCreationTypeModal('Non-Individual');
}

async function fillAndSubmitNonIndividualCustomer(
    customer: AnyCustomerInformation
): Promise<void> {
    await customerPage.fillRequiredNonIndividualCustomerInformation(customer);
    await customerPage.clickNext();
    await customerPage.clickDone();
}

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    customerData = buildJamaicaNonIndividualCustomer();
    customerId = '';
    legalName =
        (customerData as any).generalInformation['Name - Legal'];

    executionContext.region = 'Jamaica';
    executionContext.customerName = legalName;
    executionContext.customerDetails = [
        `Legal Name: ${legalName}`,
        `Country: ${(customerData as any).contactDetails['Country']}`,
        `Company Number/TRN: ${(customerData as any).businessInformation[
            'Company Number/Taxpayer Registration Number'
        ]}`
    ].join('\n');

    await customerPage.goto();
});

test(
    'Add a Non-Individual customer - Jamaica',
    { tag: '@ECP-TC-48' },
    async ({ page }) => {
        await test.step(
            'Expected Result 3 - Mandatory field validation',
            async () => {
                await openCreateNonIndividualCustomer();
                await customerPage.clickNext();

                await expect(
                    page.getByText(/required/i).first()
                ).toBeVisible();
            }
        );

        await test.step(
            'Expected Result 2 - Create Jamaica Non-Individual customer with PEP details',
            async () => {
                await customerPage.quickSearchButton.click();
                await page
                    .locator('#cancelConfirmDialogDialog_form\\:buttonYes')
                    .click()
                    .catch(() => undefined);
                await waitForBarbadosLoadingSpinner(customerPage);

                await customerPage.clickCreateCustomerButton();
                await customerPage.customerCreationTypeModal(
                    'Non-Individual'
                );
                await fillAndSubmitNonIndividualCustomer(customerData);
                await customerPage.verifyCustomerCreated();

                customerId =
                    (await customerPage.customerId.textContent())?.trim() ||
                    '';

                expect(customerId).toBeTruthy();
                executionContext.customerId = customerId;
            }
        );

        await test.step(
            'Expected Result 1 - Duplicate customer detection',
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
            }
        );
    }
);
