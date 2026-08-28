import { test, expect } from '../../../../lib/aio/aioHooks';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import {
    RatingPage,
    type CreatedPolicyDetails
} from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

let billingPage: BillingPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    ratingPage = new RatingPage(page);
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify billing capabilities for a Private Motor Policy - Barbados',
    { tag: '@ECP-TC-35' },
    async ({ page }) => {
        let createdPolicy!: CreatedPolicyDetails;

        await test.step('Step 1 - Purchase a Barbados Private Motor policy', async () => {
            createdPolicy =
                await ratingPage.createBarbadosPrivateMotorPolicy(
                    customerPage,
                    policyPage
                );

            executionContext.customerId = createdPolicy.customerId;
            executionContext.customerName = createdPolicy.customerName;
            executionContext.policyNumber = createdPolicy.policyNumber;
            executionContext.policyStatus = createdPolicy.policyStatus;
            executionContext.premium =
                createdPolicy.premiumAmount.toString();      });

        await test.step('Step 2 - Open billing account and verify billing details', async () => {
            await billingPage.selectBillingAccount();

            await expect(
                billingPage.billingGeneralInfoTable
                    .or(billingPage.paymentAndTransactionsTable)
                    .first()
            ).toBeVisible({ timeout: 60_000 });

            const bodyText = await page.locator('body').innerText();
            expect(bodyText).toContain(createdPolicy.customerName);
            expect(bodyText).toContain(createdPolicy.policyNumber);

            const premiumTransactionRow =
                billingPage.paymentAndTransactionsTable
                    .locator('tbody tr')
                    .filter({ hasText: createdPolicy.policyNumber })
                    .filter({ hasText: 'Premium' })
                    .first();

            await expect(premiumTransactionRow).toBeVisible({
                timeout: 60_000
            });
            await expect(premiumTransactionRow).toContainText(/BBD/);
        });

        await test.step('Step 3 - Accept a payment and verify transaction', async () => {
            await billingPage.printActiveBillingTransactions(
                'Active billing transactions before accepting payment:'
            );
            await billingPage.verifyPolicyPremiumTransaction(
                createdPolicy.policyNumber
            );

            await billingPage.acceptCashPayment('50.00', 'BBD');

            await billingPage.printActiveBillingTransactions(
                'Active billing transactions after accepting payment:'
            );
            await billingPage.verifyAcceptedPaymentTransaction({
                amount: '50.00',
                currency: 'BBD'
            });
        });

        await test.step('Step 4 - Create and verify a refund transaction', async () => {
            await billingPage.createRefund({ amount: '10.00' });
        });

        await test.step('Step 5 - Issue the refund and verify action availability', async () => {
            await billingPage.issueRefund({
                amount: '10.00',
                currency: 'BBD'
            });
        });
    }
);
