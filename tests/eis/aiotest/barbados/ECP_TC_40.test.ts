import { test } from '../../../../lib/aio/aioHooks';
import { CommercialPolicyPage } from '../../../../sites/eis/pages/commercialPolicyPage';
import { ClaimPage } from '../../../../sites/eis/pages/ClaimPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createCommercialPropertyPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import {
    generateClaimBankAccountNumber,
    getRandomBarbadosClaimPaymentBank,
    getRandomCommercialPropertyPaymentOfferType
} from '../../../../sites/eis/aiotest/helpers/claimPaymentTestData';

test.setTimeout(720_000);

let commercialPolicyPage: CommercialPolicyPage;
let claimPage: ClaimPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

function formatDateForEis(date: Date): string {
    return date.toLocaleDateString('en-GB');
}

function getOneMonthBeforeToday(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return formatDateForEis(date);
}

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
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify claim core functionalities for a Commercial Property Policy - Barbados',
    { tag: '@ECP-TC-40' },
    async ({ page }) => {
        let createdPolicy!: BillingCapabilityPolicy;
        const effectiveDate = getOneMonthBeforeToday();
        const riskLocationText = '12 Hope Road, Barbados';
        const lossDescription = `Commercial property claim loss ${Date.now()}`;
        const damageDescription = `Building damage ${Date.now()}`;
        const indemnityReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const expenseReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const recoveryReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const paymentBank = getRandomBarbadosClaimPaymentBank();
        const paymentOfferType =
            getRandomCommercialPropertyPaymentOfferType();
        const bankAccountNumber = generateClaimBankAccountNumber();
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        let causeOfLossText = '';
        let selectedCoverage = '';
        let paymentNumber = '';

        await test.step('Step 1 - Successfully create the Commercial Property policy', async () => {
            createdPolicy = await createCommercialPropertyPolicyForBilling(
                page,
                ratingPage,
                customerPage,
                policyPage,
                commercialPolicyPage,
                { effectiveDate }
            );

            executionContext.customerId = createdPolicy.customerId;
            executionContext.customerName = createdPolicy.customerName;
            executionContext.policyNumber = createdPolicy.policyNumber;
            executionContext.policyStatus = createdPolicy.policyStatus;
        });

        await test.step('Step 2 - Fill Loss Event(Basic)', async () => {
            await claimPage.openNewClaim();
            await claimPage.fillLossEvent(lossDescription);
        });

        await test.step('Step 3 - Loss Context', async () => {
            await claimPage.startNewClaimFromLossContext();
        });

        await test.step('Step 4 - FNOL Details - Event Information filling', async () => {
            await claimPage.fillFnolReportingParty(
                createdPolicy.customerName
            );
        });

        await test.step('Step 5 - Even Information - FNOL Loss Event filling', async () => {
            causeOfLossText = await claimPage.fillFnolLossEvent(
                lossDescription,
                riskLocationText
            );
        });

        await test.step('Step 6 - Damage Summary', async () => {
            await claimPage.fillPropertyDamageSummary(damageDescription);
        });

        await test.step('Step 7 - Add Property Owner Details', async () => {
            await page.waitForTimeout(15000)
            await claimPage.addCommercialPropertyOwnerDetails(
                createdPolicy.customerName
            );
        });

        await test.step('Step 8 - Open Claim from Complete Notification', async () => {
            await claimPage.openClaimFromCompleteNotification();
        });

        await test.step('Step 9 - Verify Event Details in the table', async () => {
            await claimPage.verifyEventDetails(
                lossDescription,
                causeOfLossText
            );
        });

        await test.step('Step 10 - Add Adjudication details', async () => {
            selectedCoverage =
                await claimPage.addCommercialPropertyAdjudicationFeature({
                    indemnityReserve,
                    expenseReserve,
                    recoveryReserve
                });
        });

        await test.step(
            'Step 11 - Verify Claim Damage Details in the Table',
            async () => {
                await claimPage.adjudicationTab.click();
                await claimPage.verifyClaimDamageDetails({
                    damageDescription,
                    damageType: 'Property',
                    partyType: '1st Party',
                    damageText: 'Test Structure'
                });
            }
        );

        await test.step('Step 12 - Complete Payment details', async () => {
            const totalIncurred =
                await claimPage.openPaymentsAndVerifyTotalIncurred(
                    Number(indemnityReserve),
                    Number(expenseReserve),
                    Number(recoveryReserve)
                );
            const grossAmount = totalIncurred.toFixed(2);

            await claimPage.fillClaimPaymentDetails({
                referenceNumber: paymentReferenceNumber,
                grossAmount,
                customerName: createdPolicy.customerName,
                paymentMemo:
                    `Commercial property claim payment ${Date.now()}`,
                bankCode: paymentBank.value,
                accountNumber: bankAccountNumber
            });

            await claimPage.fillCommercialPropertyPaymentAllocationDetails({
                offerType: paymentOfferType.value,
                grossAmount,
                isExGratiaCoverage: selectedCoverage === 'Ex Gratia'
            });
            paymentNumber = await claimPage.verifyPostedPaymentDetails({
                referenceNumber: paymentReferenceNumber,
                paidTo: createdPolicy.customerName,
                totalPaymentAmount: totalIncurred,
                transactionStatus: 'Pending',
                note: 'Final'
            });

            await ratingPage.logout();
        });

        await test.step(
            'Step 14 - Login with QA credentials and verify Claim details',
            async () => {
                await ratingPage.login('JegadeeshwaranM', 'Mani_pwd');
                await ratingPage.searchCustomer(createdPolicy.customerId);
                await ratingPage.clickPolicyNumberLink(
                    createdPolicy.policyNumber
                );
                await claimPage.claimMenuItem.click();
                await claimPage.verifyClaimDetailsInClaimList(
                    lossDescription
                );
            }
        );

        await test.step('Step 15 - Approve the Claim payment', async () => {
            await claimPage.openClaimFromClaimList(lossDescription);
            await claimPage.openPaymentsTab();
            await claimPage.openPaymentByReference(paymentNumber);
            await claimPage.approvePayment(
                `Approved by QA ${Date.now()}`
            );
            await claimPage.verifyPaymentTransactionStatus(
                paymentNumber,
                'Approved'
            );
        });

        await test.step('Step 16 - Issue the Claim payment', async () => {
            await claimPage.openPaymentByReference(paymentNumber);
            await claimPage.issuePayment(
                `Issued by QA ${Date.now()}`
            );
            await claimPage.verifyPaymentTransactionStatus(
                paymentNumber,
                'Issued'
            );
        });
    }
);
