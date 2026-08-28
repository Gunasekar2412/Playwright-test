import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { createCommercialAutoPolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { executionContext } from '../../../../lib/aio/executionContext';

test.setTimeout(720_000);

test('Verify Commercial Auto endorsements - Jamaica', { tag: '@ECP-TC-56' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const commercialPolicyPage = new CommercialPolicyPage(page, ratingPage, policyPage);
    const billingPage = new BillingPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Create Jamaica Commercial Auto policy', async () =>
        createCommercialAutoPolicyForBilling(
            page,
            ratingPage,
            customerPage,
            policyPage,
            commercialPolicyPage,
            { region: 'Jamaica' }
        )
    );

    executionContext.customerName = policy.customerName;
    executionContext.customerId = policy.customerId;
    executionContext.policyNumber = policy.policyNumber;

    await test.step('Endorse policy and update EML', async () => {
        await commercialPolicyPage.completeUpdateEmlEndorsement('10000000');
    });

    await test.step('Verify endorsement transaction in billing', async () => {
        await billingPage.navigateToBilling();
        const transaction = await billingPage.verifyEndorsementUpdateEmlTransaction(
            policy.policyNumber
        );
        expect(transaction.policyNumber).toBe(policy.policyNumber);
    });
});
