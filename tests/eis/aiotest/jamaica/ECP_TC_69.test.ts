import { test } from '../../../../lib/aio/aioHooks';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createCommercialPropertyPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import {
    generateClaimBankAccountNumber,
    getRandomCommercialPropertyPaymentOfferType
} from '../../../../sites/eis/aiotest/helpers/claimPaymentTestData';
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

function getOneMonthBeforeToday(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return date.toLocaleDateString('en-GB');
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
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify claim core functions for a Commercial Property Policy - Jamaica',
    { tag: '@ECP-TC-69' },
    async ({ page }) => {
        let createdPolicy!: BillingCapabilityPolicy;
        const effectiveDate = getOneMonthBeforeToday();
        const riskLocationText = '12 Hope Road, Jamaica';
        const lossDescription =
            `Jamaica commercial property claim loss ${Date.now()}`;
        const damageDescription =
            `Jamaica building damage ${Date.now()}`;
        const indemnityReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const expenseReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const recoveryReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const paymentOfferType =
            getRandomCommercialPropertyPaymentOfferType();
        const bankAccountNumber = generateClaimBankAccountNumber();
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        let causeOfLossText = '';
        let selectedCoverage = '';
        let paymentNumber = '';

        await test.step(
            'Step 1 - Create an active Jamaica Commercial Property policy',
            async () => {
                createdPolicy =
                    await createCommercialPropertyPolicyForBilling(
                        page,
                        ratingPage,
                        customerPage,
                        policyPage,
                        commercialPolicyPage,
                        {
                            effectiveDate,
                            region: 'Jamaica'
                        }
                    );

                executionContext.customerId = createdPolicy.customerId;
                executionContext.customerName = createdPolicy.customerName;
                executionContext.policyNumber = createdPolicy.policyNumber;
                executionContext.policyStatus = createdPolicy.policyStatus;
            }
        );

        await test.step('Step 2 - Fill Loss Event details', async () => {
            await claimPage.openNewClaim();
            await claimPage.fillLossEvent(lossDescription);
        });

        await test.step('Step 3 - Complete Loss Context', async () => {
            await claimPage.startNewClaimFromLossContext();
        });

        await test.step('Step 4 - Fill Reporting Party details', async () => {
            await claimPage.fillFnolReportingParty(
                createdPolicy.customerName
            );
        });

        await test.step('Step 5 - Fill FNOL Loss Event details', async () => {
            causeOfLossText = await claimPage.fillFnolLossEvent(
                lossDescription,
                riskLocationText
            );
        });

        await test.step('Step 6 - Fill Damage Summary', async () => {
            await claimPage.fillPropertyDamageSummary(
                damageDescription,
                {
                    addressLine1: '12 Hope Road',
                    country: 'JM',
                    parish: 'Kingston'
                }
            );
        });

        await test.step('Step 7 - Add Property Owner details', async () => {
            await claimPage.addCommercialPropertyOwnerDetails(
                createdPolicy.customerName
            );
        });

        await test.step('Step 8 - Complete Claim Notification', async () => {
            await claimPage.openClaimFromCompleteNotification();
        });

        await test.step('Step 9 - Verify Event details', async () => {
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
            'Step 11 - Verify Claim Damage details',
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
                    `Jamaica commercial property payment ${Date.now()}`,
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
            await claimPage.issuePayment(`Issued by QA ${Date.now()}`);
            await claimPage.verifyPaymentTransactionStatus(
                paymentNumber,
                'Issued'
            );
        });
    }
);
