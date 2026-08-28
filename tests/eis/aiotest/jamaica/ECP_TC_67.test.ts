import { test } from '../../../../lib/aio/aioHooks';
import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { createCommercialPropertyPolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { recordBillingPolicy, verifyJamaicaBillingCapabilities } from './billingCapabilityTestUtils';

test.setTimeout(720_000);

test('Verify billing capabilities for a Commercial Property Policy - Jamaica', { tag: '@ECP-TC-67' }, async ({ page }) => {
    const billingPage = new BillingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const ratingPage = new RatingPage(page);
    const commercialPolicyPage = new CommercialPolicyPage(page, ratingPage, policyPage);
    executionContext.region = 'Jamaica';
    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Purchase a Jamaica Commercial Property policy', () =>
        createCommercialPropertyPolicyForBilling(page, ratingPage, customerPage, policyPage, commercialPolicyPage, { region: 'Jamaica' }));
    recordBillingPolicy(policy);
    await test.step('Verify billing account, payment, and rejection', () =>
        verifyJamaicaBillingCapabilities(billingPage, policy));
});
