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
let updatedCompanyNumber = '';

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

test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    customerData = buildJamaicaNonIndividualCustomer();
    customerId = '';
    updatedCompanyNumber = '';
    legalName =
        (customerData as any).generalInformation['Name - Legal'];

    executionContext.region = 'Jamaica';
    executionContext.customerName = legalName;
    executionContext.customerDetails = [
        `Legal Name: ${legalName}`,
        `Country: ${(customerData as any).contactDetails['Country']}`,
        `Original Company Number/TRN: ${(customerData as any)
            .businessInformation[
            'Company Number/Taxpayer Registration Number'
        ]}`
    ].join('\n');

    await customerPage.goto();
});

test(
    'Update a Non-Individual customer - Jamaica',
    { tag: '@ECP-TC-49' },
    async ({ page }) => {
        await test.step(
            'Expected Result 3 - Mandatory field validation',
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

        await test.step(
            'Expected Result 2 - Create Jamaica Non-Individual customer',
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
                await customerPage.fillRequiredNonIndividualCustomerInformation(
                    customerData
                );
                await customerPage.clickNext();
                await customerPage.clickDone();
                await customerPage.verifyCustomerCreated();

                customerId =
                    (await customerPage.customerId.textContent())?.trim() ||
                    '';

                expect(customerId).toBeTruthy();
                executionContext.customerId = customerId;
            }
        );

        await test.step(
            'Expected Result 1 - Search and open created customer',
            async () => {
                await customerPage.quickSearchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.customerNumberField.fill(customerId);
                await customerPage.searchButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.customerIdLink.click();
                await waitForBarbadosLoadingSpinner(customerPage);
            }
        );

        await test.step(
            'Expected Result 4 - Update Jamaica Non-Individual customer',
            async () => {
                await customerPage.nextButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.doneButton.click();
                await waitForBarbadosLoadingSpinner(customerPage);
                await customerPage.takeActionDropdown.selectOption(
                    'updateCustomerEvent'
                );
                await waitForBarbadosLoadingSpinner(customerPage);

                updatedCompanyNumber =
                    Math.floor(
                        100000000 + Math.random() * 900000000
                    ).toString();

                await customerPage.companyNumberField.clear();
                await customerPage.companyNumberField.fill(
                    updatedCompanyNumber
                );
                await customerPage.clickNext();
                await customerPage.clickDone();
                await customerPage.customerIdLink.click();
                await waitForBarbadosLoadingSpinner(customerPage);

                executionContext.customerDetails = [
                    `Legal Name: ${legalName}`,
                    `Customer ID: ${customerId}`,
                    `Updated Company Number/TRN: ${updatedCompanyNumber}`
                ].join('\n');
            }
        );

        await test.step(
            'Expected Result 5 - Verify updated value persisted',
            async () => {
                const persistedCompanyNumber =
                    await customerPage.companyNumberField.inputValue();

                expect(persistedCompanyNumber).toContain(
                    updatedCompanyNumber.slice(-4)
                );
            }
        );
    }
);
