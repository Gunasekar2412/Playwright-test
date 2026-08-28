import { test } from '../../../../lib/aio/aioHooks';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    BillingCapabilityPolicy,
    createPrivateMotorPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import {
    generateClaimBankAccountNumber,
    getRandomBarbadosClaimPaymentBank,
    getRandomPrivateMotorPaymentOfferType
} from '../../../../sites/eis/aiotest/helpers/claimPaymentTestData';
import { ClaimPage } from '../../../../sites/eis/pages/ClaimPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';

test.setTimeout(720_000);

let claimPage: ClaimPage;
let customerPage: CustomerPage;
let policyPage: PolicyPage;
let ratingPage: RatingPage;

test.beforeEach(async ({ page }) => {
    claimPage = new ClaimPage(page);
    customerPage = new CustomerPage(page);
    policyPage = new PolicyPage(page);
    ratingPage = new RatingPage(page);
    executionContext.region = 'Barbados';

    await ratingPage.login(
        process.env.EIS_USERNAME!,
        process.env.EIS_PASSWORD!
    );
});

test(
    'Verify claim core functionalities for a Private Motor Policy - Barbados',
    { tag: '@ECP-TC-42' },
    async ({ page }) => {
        const lossDescription = `Private motor claim loss ${Date.now()}`;
        const evaluationOfLiabilityDescription =
            `Clear liability evaluation ${Date.now()}`;
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        const paymentBank = getRandomBarbadosClaimPaymentBank();
        const paymentOfferType = getRandomPrivateMotorPaymentOfferType();
        const bankAccountNumber = generateClaimBankAccountNumber();
        const indemnityReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const expenseReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const recoveryReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        let grossAmount = '';
        let paymentNumber = '';

        const createdPolicy: BillingCapabilityPolicy = await test.step(
            'Test setup - Create an active Private Motor policy',
            async () => createPrivateMotorPolicyForBilling(
                ratingPage,
                customerPage,
                policyPage
            )
        );

        executionContext.customerId = createdPolicy.customerId;
        executionContext.customerName = createdPolicy.customerName;
        executionContext.policyNumber = createdPolicy.policyNumber;
        executionContext.policyStatus = createdPolicy.policyStatus;
        await test.step(
            'Step 1 - Create a new claim and fill Loss Event details',
            async () => {
                await claimPage.openNewClaim();
                await claimPage.fillLossEvent(lossDescription);
            }
        );

        await test.step(
            'Step 2 - Start a new claim from Loss Context',
            async () => {
                await claimPage.startNewClaimFromLossContext('privateMotor');
            }
        );

        await test.step('Step 3 - Fill Reporting Party details', async () => {
            await claimPage.fillPrivateMotorReportingParty(
                createdPolicy.customerName
            );
        });
        await page.waitForTimeout(15000)
        await test.step('Step 5 - Fill Loss Event details', async () => {
            await claimPage.fillPrivateMotorLossEvent(lossDescription);
        });
        await page.locator(
            '//i[starts-with(@data-tab,"Reporting Party and Claim Contact_")]/parent::span'
        ).click();

        await test.step('Step 4 - Fill Reporting Party address', async () => {
            await claimPage.fillPrivateMotorReportingPartyAddress();
        });

        await test.step('Step 6 - Navigate to Damage section', async () => {
            await claimPage.navigateToPrivateMotorDamageSection();
            await claimPage.addPrivateMotorVehicleDamage();
        });

        await test.step('Step 7 - Fill Vehicle details', async () => {
            await claimPage.fillPrivateMotorVehicleDamageDetails();
        });
        await page.locator(
            '#policyDataGatherForm\\:addAutoOccupant'
        ).click();
        await test.step('Step 8 - Fill Vehicle Party details', async () => {
            await claimPage.fillPrivateMotorVehiclePartyDetails(
                createdPolicy.customerName
            );
        });
        await test.step(
            'Step 9 - Navigate to Claim Notification and open Claim',
            async () => {
                await claimPage.openClaimFromCompleteNotification();
            }
        );
        await test.step(
            'Step 10 - Verify Claim Parties and Loss Event details',
            async () => {
                await claimPage.verifyPrivateMotorClaimNotification(
                    createdPolicy.customerName,
                    lossDescription
                );
            }
        );

        await test.step('Step 11 - Add Feature details', async () => {
            await claimPage.addPrivateMotorAdjudicationFeature({
                indemnityReserve,
                expenseReserve,
                recoveryReserve,
                evaluationOfLiabilityDescription
            });
        });

        await test.step('Step 12 - Verify New Feature details', async () => {
            await claimPage.verifyPrivateMotorAdjudicationFeature(
                createdPolicy.customerName,
                Number(indemnityReserve),
                Number(expenseReserve)
            );
        });
        await test.step(
            'Step 13 - Verify adjudication totals and fill Claim Payment details',
            async () => {
                const totalIncurred =
                    await claimPage.openPaymentsAndVerifyTotalIncurred(
                        Number(indemnityReserve),
                        Number(expenseReserve)
                    );
                grossAmount = totalIncurred.toFixed(2);
                await claimPage.fillClaimPaymentDetails({
                    referenceNumber: paymentReferenceNumber,
                    grossAmount,
                    customerName: createdPolicy.customerName,
                    paymentMemo: `Private motor claim payment ${Date.now()}`,
                    bankCode: paymentBank.value,
                    accountNumber: bankAccountNumber
                });
            }
        );
        await test.step('Step 14 - Fill Payment Allocation details', async () => {
            await claimPage.fillPrivateMotorPaymentAllocationDetails({
                offerType: paymentOfferType.value,
                grossAmount,
                allocationTab: true,
                paymentDetailsTab: true
            });
            paymentNumber = await claimPage.verifyPostedPaymentDetails({
                paidTo: createdPolicy.customerName,
                totalPaymentAmount: Number(grossAmount),
                transactionStatus: 'Pending',
                note: 'Final'
            });
        });

        await test.step('Logout the application after Step 14', async () => {
            await ratingPage.logout();
        });

        await test.step('Step 15 - Login with QA credentials and verify Claim details', async () => {
            await ratingPage.login('JegadeeshwaranM', 'Mani_pwd');
            await ratingPage.searchCustomer(createdPolicy.customerId);
            await ratingPage.clickPolicyNumberLink(
                createdPolicy.policyNumber
            );
            await claimPage.claimMenuItem.click();
            await claimPage.verifyClaimDetailsInClaimList(
                lossDescription,
                'Private Motor'
            );
        });

        await test.step('Step 16 - Approve the Claim payment', async () => {
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

        await test.step('Step 17 - Issue the Claim payment', async () => {
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
