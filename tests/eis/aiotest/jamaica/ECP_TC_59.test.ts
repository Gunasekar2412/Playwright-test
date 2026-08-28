import { test, expect } from '../../../../lib/aio/aioHooks';
import { getFormattedDate } from '../../../../lib/utils';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { createHomePolicyForBilling } from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { executionContext } from '../../../../lib/aio/executionContext';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';

test.setTimeout(720_000);

function getRenewalDates() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 28);
    const effectiveDate = new Date(expiryDate);
    effectiveDate.setDate(expiryDate.getDate() - 365);
    return {
        effectiveDate: getFormattedDate(effectiveDate),
        expiryDate: getFormattedDate(expiryDate)
    };
}

test('Verify Home automated renewals - Jamaica', { tag: '@ECP-TC-59' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const homePolicyPage = new HomePolicyPage(page);
    const renewalBatchPage = new RenewalBatchPage(page);
    const { effectiveDate, expiryDate } = getRenewalDates();
    executionContext.region = 'Jamaica';

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);

    const policy = await test.step('Create backdated Jamaica Home policy', async () =>
        createHomePolicyForBilling(
            page,
            ratingPage,
            customerPage,
            policyPage,
            homePolicyPage,
            { region: 'Jamaica', effectiveDate }
        )
    );

    executionContext.customerName = policy.customerName;
    executionContext.customerId = policy.customerId;
    executionContext.policyNumber = policy.policyNumber;
    executionContext.customerDetails = `Renewal Expiry Date: ${expiryDate}`;

    await test.step('Run renewal batch and generate quote', async () => {
        await renewalBatchPage.switchToAdmin();
        await renewalBatchPage.openScheduler();
        expect(await renewalBatchPage.executePolicyBatchGroup()).toContain('(Passed)');
        await renewalBatchPage.switchToMain();
        await renewalBatchPage.searchPolicy(policy.policyNumber);
        await renewalBatchPage.openPolicyFromSearchResults(policy.policyNumber);
        await renewalBatchPage.moveRenewalToDataGather();
        await renewalBatchPage.verifyRenewalPolicyDetails(policy.policyNumber, /Home/i);
    });

    await test.step('Rate and purchase renewal', async () => {
        await homePolicyPage.openCoveragesAndPremiumTab();
        await homePolicyPage.calculatePremium();
        const premium = await homePolicyPage.getPremiumSummary();
        expect(Number(premium.billablePremium.replace(/[^\d.-]/g, '') || 0)).toBeGreaterThan(0);
        executionContext.premium = premium.billablePremium;

        await homePolicyPage.openAndPrintFundingSummary();
        await page.locator('#policyDataGatherForm\\:next_footer').click();
        await waitForBarbadosLoadingSpinner(policyPage);
        await page.locator(
            '#policyDataGatherForm\\:purchaseQuote_footer, form[id="headerForm"] input[value="Purchase"][type="submit"]'
        ).first().click();
        await waitForBarbadosLoadingSpinner(policyPage);
        await policyPage.handlePurchasePolicyConfirmation(true);
        await page.locator('#purchaseForm\\:yesButton_footer').click();
        await waitForBarbadosLoadingSpinner(policyPage);

        const status = (await page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        ).textContent())?.trim() || '';
        expect(status).toMatch(/Policy Pending|Policy Active/);
        executionContext.policyStatus = status;
    });
});
