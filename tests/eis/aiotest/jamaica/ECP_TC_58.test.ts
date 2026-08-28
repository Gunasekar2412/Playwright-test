import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { createHomePolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

test('Verify Home policy endorsements - Jamaica', { tag: '@ECP-TC-58' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const homePolicyPage = new HomePolicyPage(page);
    const billingPage = new BillingPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Create Jamaica Home policy', async () =>
        createHomePolicyForBilling(
            page,
            ratingPage,
            customerPage,
            policyPage,
            homePolicyPage,
            { region: 'Jamaica' }
        )
    );

    executionContext.customerName = policy.customerName;
    executionContext.customerId = policy.customerId;
    executionContext.policyNumber = policy.policyNumber;

    await test.step('Endorse Home policy', async () => {
        await homePolicyPage.completeHomePolicyEndorsement({
            endorsementReason: 'Increasing risk sum insured/limit',
            coverageALimitAmount: '8000000',
            coverageBLimitAmount: '8000000',
            billingAccountName: policy.customerName,
            city: 'Kingston'
        });
    });

    await test.step('Verify endorsement transaction in billing', async () => {
        await billingPage.navigateToBilling();
        const transaction = await billingPage.verifyEndorsementTransaction(policy.policyNumber);
        expect(transaction.policyNumber).toBe(policy.policyNumber);
    });
});
