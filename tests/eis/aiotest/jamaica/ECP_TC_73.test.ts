import { expect } from '@playwright/test';
import { test } from '../../../../lib/aio/aioHooks';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createHomePolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import {
    generateClaimBankAccountNumber
} from '../../../../sites/eis/aiotest/helpers/claimPaymentTestData';
import {
    getRandomHomeClaimCauseOfLoss,
    getRandomHomeClaimCoverage,
    getRandomHomeClaimLossPartyBank,
    getRandomHomeClaimPaymentOfferType
} from '../../../../sites/eis/aiotest/helpers/homeClaimTestData';
import { ClaimPage } from '../../../../sites/eis/pages/ClaimPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { HomePolicyPage } from '../../../../sites/eis/pages/HomePolicyPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';

test.setTimeout(720_000);

let claimPage: ClaimPage;
let customerPage: CustomerPage;
let homePolicyPage: HomePolicyPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

test.beforeEach(async ({ page }) => {
    claimPage = new ClaimPage(page);
    customerPage = new CustomerPage(page);
    homePolicyPage = new HomePolicyPage(page);
    policyPage = new PolicyPage(page);
    ratingPage = new RatingPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify claim core functionalities for a Home Policy - Jamaica',
    { tag: '@ECP-TC-73' },
    async ({ page }) => {
        let createdPolicy!: BillingCapabilityPolicy;
        const causeOfLoss = getRandomHomeClaimCauseOfLoss();
        const coverage = getRandomHomeClaimCoverage();
        const lossPartyBank = getRandomHomeClaimLossPartyBank();
        const paymentOfferType = getRandomHomeClaimPaymentOfferType();
        const bankAccountNumber = generateClaimBankAccountNumber();
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        const lossDescription = `Jamaica home claim loss ${Date.now()}`;
        const damageDescription =
            `Jamaica home and contents damage ${Date.now()}`;
        const indemnityReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const expenseReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const recoveryReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        let paymentNumber = '';

        await test.step(
            'Step 1 - Create and purchase an active Jamaica Home policy',
            async () => {
                createdPolicy = await createHomePolicyForBilling(
                    page,
                    ratingPage,
                    customerPage,
                    policyPage,
                    homePolicyPage,
                    { region: 'Jamaica' }
                );

                executionContext.customerId = createdPolicy.customerId;
                executionContext.customerName = createdPolicy.customerName;
                executionContext.policyNumber = createdPolicy.policyNumber;
                executionContext.policyStatus = createdPolicy.policyStatus;
                expect(createdPolicy.customerId).not.toBe('');
                expect(createdPolicy.customerName).not.toBe('');
                expect(createdPolicy.policyNumber).toMatch(/^P\d+$/);
                expect(createdPolicy.policyStatus).toBe('Policy Active');
            }
        );

        await test.step('Step 2 - Create the Claim', async () => {
            await ratingPage.searchCustomer(createdPolicy.customerId);
            await ratingPage.clickPolicyNumberLink(
                createdPolicy.policyNumber
            );
            await claimPage.openNewClaim();
        });

        await test.step(
            'Step 3 - Complete the Loss Event and Loss Context',
            async () => {
                await claimPage.completeHomeLossEventAndContext({
                    customerId: createdPolicy.customerId,
                    policyNumber: createdPolicy.policyNumber
                });
            }
        );

        await test.step('Step 4 - Navigate to the Claim details', async () => {
            await claimPage.verifyCreatedClaimAndOpen();
        });

        await test.step(
            'Step 5 - Navigate to FNOL and fill Reporting Party details',
            async () => {
                await claimPage.fillHomeFnolReportingParty(
                    createdPolicy.customerName,
                    'Jamaica'
                );
            }
        );

        await test.step('Step 6 - Fill Loss Event details', async () => {
            await claimPage.fillHomeLossEventDetails({
                causeOfLoss: causeOfLoss.value,
                lossDescription
            });
        });

        await test.step('Step 7 - Navigate to Damage section', async () => {
            await claimPage.addHomeAndContentsDamage(damageDescription);
        });

        await test.step('Step 8 - Add Property Owner details', async () => {
            await claimPage.addHomePropertyOwnerDetails({
                customerName: createdPolicy.customerName,
                bankCode: lossPartyBank.value
            });
        });

        await test.step('Step 9 - Complete Claim Notification', async () => {
            await claimPage.openClaimFromCompleteNotification();
        });

        await test.step(
            'Step 10 - Verify Loss Event and Claim Parties details',
            async () => {
                await claimPage.verifyHomeClaimNotification({
                    customerName: createdPolicy.customerName,
                    causeOfLoss: causeOfLoss.label,
                    lossDescription,
                    region: 'Jamaica'
                });
            }
        );
        await page.pause();
        await test.step('Step 11 - Fill Adjudication details', async () => {
            await claimPage.addHomeAdjudicationFeature({
                damageDescription,
                coverage,
                indemnityReserve,
                expenseReserve,
                recoveryReserve,
                region: 'Jamaica'
            });
        });

        await test.step('Step 12 - Verify Claim Feature details', async () => {
            await claimPage.verifyHomeClaimFeature({
                customerName: createdPolicy.customerName,
                coverage,
                indemnityReserve: Number(indemnityReserve),
                expenseReserve: Number(expenseReserve),
                region: 'Jamaica'
            });
        });

        await test.step('Step 13 - Complete Payment details', async () => {
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
                paymentMemo: `Jamaica home claim payment ${Date.now()}`,
                accountNumber: bankAccountNumber
            });

            await claimPage.fillHomePaymentAllocationDetails({
                offerType: paymentOfferType.value,
                grossAmount
            });
            paymentNumber = await claimPage.verifyPostedPaymentDetails({
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
                    lossDescription,
                    'Home'
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
