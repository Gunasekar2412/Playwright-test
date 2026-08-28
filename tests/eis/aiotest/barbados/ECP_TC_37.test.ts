import { test } from '../../../../lib/aio/aioHooks';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createCommercialAutoPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';

test.setTimeout(720_000);

let billingPage: BillingPage;
let commercialPolicyPage: CommercialPolicyPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    ratingPage = new RatingPage(page);
    commercialPolicyPage = new CommercialPolicyPage(
        page,
        ratingPage,
        policyPage
    );
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify billing capabilities for a Commercial Auto Policy - Barbados',
    { tag: '@ECP-TC-37' },
    async ({ page }) => {
        let createdPolicy!: BillingCapabilityPolicy;

        await test.step('Step 1 - Purchase a Commercial Auto policy', async () => {
            createdPolicy = await createCommercialAutoPolicyForBilling(
                page,
                ratingPage,
                customerPage,
                policyPage,
                commercialPolicyPage
            );

            executionContext.customerId = createdPolicy.customerId;
            executionContext.customerName = createdPolicy.customerName;
            executionContext.policyNumber = createdPolicy.policyNumber;
            executionContext.policyStatus = createdPolicy.policyStatus;
        });

        await test.step('Step 2 - Select billing tab and verify billing account', async () => {
            await billingPage.verifyBillingAccountForPolicy({
                customerName: createdPolicy.customerName,
                policyNumber: createdPolicy.policyNumber,
                currency: 'BBD'
            });
        });

        await test.step('Step 3 - Accept a payment', async () => {
            await billingPage.acceptCashPayment('50.00', 'BBD');
        });

        await test.step('Step 4 - Reject a payment', async () => {
            await billingPage.declineAcceptedPayment({
                amount: '50.00',
                currency: 'BBD'
            });
        });

        // await test.step('Step 5 - Issue a refund', async () => {
        //     await billingPage.createRefund({ amount: '10.00' });
        //     await billingPage.issueRefund({
        //         amount: '10.00',
        //         currency: 'BBD'
        //     });
        // });
    }
);
