import { test } from '../../../../lib/aio/aioHooks';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { createPrivateMotorPolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { recordBillingPolicy, verifyJamaicaBillingCapabilities } from './billingCapabilityTestUtils';

test.setTimeout(720_000);

test('Verify billing capabilities for a Private Motor Policy - Jamaica', { tag: '@ECP-TC-64' }, async ({ page }) => {
    const billingPage = new BillingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const ratingPage = new RatingPage(page);
    executionContext.region = 'Jamaica';
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Purchase a Jamaica Private Motor policy', () =>
        createPrivateMotorPolicyForBilling(ratingPage, customerPage, policyPage, { region: 'Jamaica' }));
    recordBillingPolicy(policy, policy.premiumAmount.toString());

    await test.step('Verify billing account, payment, and rejection', () =>
        verifyJamaicaBillingCapabilities(billingPage, policy));
});
