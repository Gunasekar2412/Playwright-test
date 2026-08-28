import { test } from '../../../../lib/aio/aioHooks';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { createHomePolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { recordBillingPolicy, verifyJamaicaBillingCapabilities } from './billingCapabilityTestUtils';

test.setTimeout(720_000);

test('Verify billing capabilities for a Home Policy - Jamaica', { tag: '@ECP-TC-65' }, async ({ page }) => {
    const billingPage = new BillingPage(page);
    const customerPage = new CustomerPage(page);
    const homePolicyPage = new HomePolicyPage(page);
    const policyPage = new PolicyPage(page);
    const ratingPage = new RatingPage(page);
    executionContext.region = 'Jamaica';
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Purchase a Jamaica Home policy', () =>
        createHomePolicyForBilling(page, ratingPage, customerPage, policyPage, homePolicyPage, { region: 'Jamaica' }));
    recordBillingPolicy(policy);
    await test.step('Verify billing account, payment, and rejection', () =>
        verifyJamaicaBillingCapabilities(billingPage, policy));
});
