import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { AnyCustomerInformation, generateCustomerInformation } from '../../../../sites/eis/data/CustomerData';
import { test, expect } from '../../../../lib/aio/aioHooks';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(300_000);

// =====================================================
// Page Objects
// =====================================================

let customerPage: CustomerPage;

// =====================================================
// Before Each
// =====================================================

test.beforeEach(async ({ page }) => {

    customerPage = new CustomerPage(page);
    customerData = generateCustomerInformation(undefined, 'Jamaica');
    executionContext.region = 'Jamaica';

    await customerPage.goto();
    await customerPage.clickCustomerTabButton();
    await customerPage.clickCreateCustomerButton();
});


// =====================================================
// ECP-TC-17
// Add Individual Customer
// =====================================================
let customerData: AnyCustomerInformation;


test(
    'Add an Individual customer - Barbados',
    { tag: '@ECP-TC-17' },
    async ({ page }) => {
        await test.step('Create customer successfully', async () => {
            await customerPage.customerCreationTypeModal('Individual');
            await customerPage.fillRequiredInformation(customerData);
            await customerPage.page.waitForTimeout(500);
            await customerPage.trnField.fill(
                customerData.generalInformation['Identification Number']
            );
            await customerPage.clickNext();
            await customerPage.clickDone();
            await customerPage.verifyCustomerCreated();
        });

        await test.step('Validate duplicate customer detection', async () => {
            const duplicateTRN =
                customerData.generalInformation['Identification Number'];

            await customerPage.quickSearchButton.click();
            await waitForBarbadosLoadingSpinner(customerPage);
            await customerPage.clickCreateCustomerButton();
            await customerPage.customerCreationTypeModal('Individual');
            await customerPage.fillRequiredInformation(customerData);
            await customerPage.trnField.fill(duplicateTRN);
            await customerPage.clickNext();
            await expect(
                page.getByText('Customer Party Search Result')
            ).toBeVisible();

            await customerPage.closePartySearchPopupIfVisible();
            await customerPage.logout();
        });

        await test.step('Validate mandatory field validation', async () => {
            await customerPage.login(
                process.env.EIS_USERNAME!,
                process.env.EIS_PASSWORD!
            );
            await customerPage.clickCustomerTabButton();
            await customerPage.clickCreateCustomerButton();
            await customerPage.customerCreationTypeModal('Individual');
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
            ).toBeVisible();
        });
    }
);
