import { test, expect } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommissionPage } from '../../../../sites/eis/pages/CommissionPage';
import { RenewalBatchPage } from '../../../../sites/eis/pages/RenewalBatchPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import { waitForBarbadosLoadingSpinner } from '../../../../lib/aio/waitForBarbadosLoadingSpinner';
import {
    createJamaicaPrivateMotorPolicy,
    getRenewalDates,
    selectJamaicaCommissionProducer
} from './privateMotorCommissionTestUtils';

test.setTimeout(720_000);

test('Validate commission for renewal of a Private Motor Agent policy - Jamaica', { tag: '@ECP-TC-61' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const commissionPage = new CommissionPage(page);
    const renewalBatchPage = new RenewalBatchPage(page);
    const { effectiveDate, expiryDate } = getRenewalDates();
    executionContext.region = 'Jamaica';

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    const { group, producer } = await test.step('Select Jamaica Agent commission group', () =>
        selectJamaicaCommissionProducer(commissionPage));
    const policy = await test.step('Create backdated Jamaica Agent policy', () =>
        createJamaicaPrivateMotorPolicy(
            page, ratingPage, customerPage, policyPage, commissionPage,
            producer, group.commissionRate, effectiveDate
        ));

    executionContext.customerName = policy.customerName;
    executionContext.customerId = policy.customerId;
    executionContext.policyNumber = policy.policyNumber;
    executionContext.premium = policy.premium.toString();
    executionContext.customerDetails = `Agency/Producer: ${producer.name}; Renewal Expiry Date: ${expiryDate}`;

    await test.step('Run renewal and open Data Gather', async () => {
        await renewalBatchPage.switchToAdmin();
        await renewalBatchPage.openScheduler();
        expect(await renewalBatchPage.executePolicyBatchGroup()).toContain('(Passed)');
        await renewalBatchPage.switchToMain();
        await renewalBatchPage.searchPolicy(policy.policyNumber);
        await renewalBatchPage.openPolicyFromSearchResults(policy.policyNumber);
        await renewalBatchPage.moveRenewalToDataGather();
        await renewalBatchPage.verifyRenewalPolicyDetails(policy.policyNumber, /Private Motor/i);
    });

    await test.step('Verify renewal Agent commission and purchase', async () => {
        await ratingPage.clickPremiumsAndCoveragesTab();
        await ratingPage.calculatePremium({
            excessLimitOption: 'FIVEMIN15000MAX450KJMD'
        });
        const premium = await ratingPage.getPremiumValue();
        await ratingPage.verifyCommissionCalculation({
            premiumAmount: premium,
            commissionRate: group.commissionRate
        });
        executionContext.premium = premium.toString();
        await ratingPage.clickFundingSummaryTab();
        await renewalBatchPage.purchaseButton.click();
        await waitForBarbadosLoadingSpinner(renewalBatchPage);
        await policyPage.handlePurchasePolicyConfirmation(true);
        await renewalBatchPage.finishButton.click();
        await waitForBarbadosLoadingSpinner(renewalBatchPage);
        const status = (await page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        ).textContent())?.trim() || '';
        expect(status).toMatch(/Policy Pending|Policy Active/);
        executionContext.policyStatus = status;
    });
});
