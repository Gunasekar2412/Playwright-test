import { test } from '../../../../lib/aio/aioHooks';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createCommercialLiabilityPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { generateClaimBankAccountNumber } from '../../../../sites/eis/aiotest/helpers/claimPaymentTestData';
import { ClaimPage } from '../../../../sites/eis/pages/ClaimPage';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';

test.setTimeout(720_000);

let claimPage: ClaimPage;
let commercialPolicyPage: CommercialPolicyPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

test.beforeEach(async ({ page }) => {
    claimPage = new ClaimPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    ratingPage = new RatingPage(page);
    commercialPolicyPage = new CommercialPolicyPage(
        page,
        ratingPage,
        policyPage
    );
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify claim core functions for a Commercial Liability Policy - Jamaica',
    { tag: '@ECP-TC-70' },
    async ({ page }) => {
        const lossDescription = `Jamaica commercial liability claim loss ${Date.now()}`;
        const injuryDescription = `Bodily injury ${Date.now()}`;
        const injuredPartyAddress = `Injured Party Address ${Date.now()}`;
        const riskLocationText = '12 Hope Road, Jamaica';
        const indemnityReserve = String(Math.floor(Math.random() * 9000) + 1);
        const expenseReserve = String(Math.floor(Math.random() * 9000) + 1);
        const recoveryReserve = String(Math.floor(Math.random() * 9000) + 1);
        const bankAccountNumber = generateClaimBankAccountNumber();
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        let causeOfLossText = '';

        const createdPolicy: BillingCapabilityPolicy = await test.step(
            'Test setup - Create an active Jamaica Commercial Liability policy',
            async () => createCommercialLiabilityPolicyForBilling(
                page,
                ratingPage,
                customerPage,
                policyPage,
                commercialPolicyPage,
                { region: 'Jamaica' }
            )
        );

        executionContext.customerId = createdPolicy.customerId;
        executionContext.customerName = createdPolicy.customerName;
        executionContext.policyNumber = createdPolicy.policyNumber;
        executionContext.policyStatus = createdPolicy.policyStatus;

        await test.step('Step 1 - Search for an existing Policy', async () => {
            await ratingPage.searchCustomer(createdPolicy.customerId);
            await ratingPage.clickPolicyNumberLink(createdPolicy.policyNumber);
        });

        await test.step('Step 2 - Select Claim on the navigation bar', async () => {
            await claimPage.claimMenuItem.click();
        });

        await test.step('Step 3 - Create a new Claim', async () => {
            await claimPage.newClaimButton.click();
        });

        await test.step('Step 4 - Fill mandatory Claim fields', async () => {
            await claimPage.fillLossEvent(lossDescription);
            await claimPage.startNewClaimFromLossContext();
            await claimPage.fillFnolReportingParty(createdPolicy.customerName);
            causeOfLossText = await claimPage.fillFnolLossEvent(
                lossDescription,
                riskLocationText
            );
        });

        await test.step('Step 5 - Add Bodily Injury damage', async () => {
            await claimPage.addBodilyInjuryDamage();
        });

        await test.step('Step 6 - Fill Bodily Injury details', async () => {
            await claimPage.fillBodilyInjuryDetails(injuryDescription);
        });

        await test.step('Step 7 - Fill Injured Party details', async () => {
            await claimPage.fillInjuredPartyDetails(
                createdPolicy.customerName,
                injuredPartyAddress
            );
        });

        await test.step('Step 8 - Open Claim and verify notification details', async () => {
            await claimPage.openClaimFromCompleteNotification();
            await claimPage.verifyEventDetails(
                lossDescription,
                causeOfLossText
            );
            await claimPage.verifyClaimPartyDetails(
                createdPolicy.customerName,
                injuredPartyAddress
            );
        });

        await test.step('Step 9 - Complete Adjudication details', async () => {
            await claimPage.fillCommercialLiabilityAdjudicationFeature({
                associatedRiskText: riskLocationText,
                indemnityReserve,
                expenseReserve,
                recoveryReserve
            });
        });

        await test.step('Step 10 - Verify Total Incurred under Payments', async () => {
            
            await claimPage.openPaymentsAndVerifyTotalIncurred(
                Number(indemnityReserve),
                Number(expenseReserve)
            );
        });

        await test.step('Step 11 - Fill Claim Payment details', async () => {
            await claimPage.fillClaimPaymentDetails({
                referenceNumber: paymentReferenceNumber,
                grossAmount: indemnityReserve,
                customerName: createdPolicy.customerName,
                paymentMemo: `Jamaica commercial liability payment ${Date.now()}`,
                accountNumber: bankAccountNumber
            });
        });

        await test.step('Step 12 - Fill Payment Allocation details', async () => {
            await claimPage.fillPaymentAllocationDetails(indemnityReserve);
        });

        await test.step('Step 13 - Verify posted Payment details', async () => {
            await claimPage.verifyPostedPaymentDetails({
                referenceNumber: paymentReferenceNumber,
                paidTo: createdPolicy.customerName,
                totalPaymentAmount: Number(indemnityReserve),
                transactionStatus: 'Pending'
            });
        });

        await test.step('Logout after posting the Payment', async () => {
            await ratingPage.logout();
        });

        await test.step('Step 14 - Login as QA and verify Claim details', async () => {
            await ratingPage.login('JegadeeshwaranM', 'Mani_pwd');
            await ratingPage.searchCustomer(createdPolicy.customerId);
            await ratingPage.clickPolicyNumberLink(createdPolicy.policyNumber);
            await claimPage.claimMenuItem.click();
            await claimPage.verifyClaimDetailsInClaimList(lossDescription);
        });

        await test.step('Step 15 - Approve the Claim Payment', async () => {
            await claimPage.openClaimFromClaimList(lossDescription);
            await claimPage.openPaymentsTab();
            await claimPage.openPaymentByReference(paymentReferenceNumber);
            await claimPage.approvePayment(`Approved by QA ${Date.now()}`);
            await claimPage.verifyPaymentTransactionStatus(
                paymentReferenceNumber,
                'Approved'
            );
        });

        await test.step('Step 16 - Issue the Claim Payment', async () => {
            await claimPage.openPaymentByReference(paymentReferenceNumber);
            await claimPage.issuePayment(`Issued by QA ${Date.now()}`);
            await claimPage.verifyPaymentTransactionStatus(
                paymentReferenceNumber,
                'Issued'
            );
        });
    }
);
