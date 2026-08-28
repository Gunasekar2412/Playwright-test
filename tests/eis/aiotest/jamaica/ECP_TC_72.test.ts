import { expect } from '@playwright/test';
import { test } from '../../../../lib/aio/aioHooks';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    CommercialAutoBillingPolicy,
    createCommercialAutoPolicyForBilling
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import {
    generateClaimBankAccountNumber,
    getRandomPrivateMotorPaymentOfferType
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
    'Verify claim core functionalities for a Commercial Auto Policy - Jamaica',
    { tag: '@ECP-TC-72' },
    async ({ page }) => {
        const createdPolicy: CommercialAutoBillingPolicy = await test.step(
            'Test setup - Create an active Jamaica Commercial Auto policy',
            async () => createCommercialAutoPolicyForBilling(
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

        expect(createdPolicy.policyStatus).toBe('Policy Active');

        const lossDescription =
            `Jamaica commercial auto claim loss ${Date.now()}`;
        let damageDescription = '';
        const indemnityReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const expenseReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const recoveryReserve = String(
            Math.floor(Math.random() * 9000) + 1
        );
        const paymentOfferType = getRandomPrivateMotorPaymentOfferType();
        const bankAccountNumber = generateClaimBankAccountNumber();
        const paymentReferenceNumber = `PAY-${Date.now()}`;
        let selectedCoverage = '';
        let paymentNumber = '';

        await test.step(
            'Step 1 - Create a new claim and fill Loss Event details',
            async () => {
                await claimPage.openNewClaim();
                await claimPage.fillLossEvent(lossDescription);
            }
        );

        await test.step(
            'Step 2 - Verify Commercial Auto Loss Context and select New Claim',
            async () => {
                await claimPage.verifyCommercialAutoLossContext({
                    customerId: createdPolicy.customerId,
                    policyNumber: createdPolicy.policyNumber,
                    // startClaim: true
                });
            }
        );

        await test.step(
            'Step 3 - Fill Reporting Party details',
            async () => {
                await claimPage.fillCommercialAutoReportingParty(
                    createdPolicy.customerName
                );
            }
        );

        await test.step('Step 4 - Fill Loss Event details', async () => {
            await claimPage.fillCommercialAutoLossEvent(lossDescription);
        });

        await test.step('Step 5 - Fill Damage details', async () => {
            damageDescription =
                await claimPage.fillCommercialAutoVehicleDamage({
                    modelYear: createdPolicy.vehicleDetails.modelYear,
                    make: createdPolicy.vehicleDetails.make,
                    model: createdPolicy.vehicleDetails.model,
                    vinNumber: createdPolicy.vehicleDetails.vinNumber
                });
        });

        await test.step('Step 6 - Fill Auto Owner details', async () => {
            await claimPage.fillCommercialAutoOwnerDetails(
                createdPolicy.customerName
            );
        });

        await test.step('Step 7 - Complete Claim Notification', async () => {
            await claimPage.openClaimFromCompleteNotification();
        });

        await test.step('Step 8 - Verify Adjudication details', async () => {
            await claimPage.verifyCommercialAutoAdjudicationDamage({
                damageDescription,
                modelYear: createdPolicy.vehicleDetails.modelYear,
                make: createdPolicy.vehicleDetails.make,
                model: createdPolicy.vehicleDetails.model
            });
        });

        await test.step('Step 9 - Fill New Feature details', async () => {
            selectedCoverage =
                await claimPage.addCommercialAutoAdjudicationFeature({
                    associatedRiskText:
                        `${createdPolicy.vehicleDetails.modelYear}, ` +
                        `${createdPolicy.vehicleDetails.make}, ` +
                        createdPolicy.vehicleDetails.model,
                    indemnityReserve,
                    expenseReserve,
                    recoveryReserve
                });
        });

        await test.step(
            'Step 10 - Verify all Claim Damage and Feature details',
            async () => {
                await claimPage.verifyCommercialAutoClaimDamageAndFeature({
                    damageDescription,
                    vehicleText:
                        `${createdPolicy.vehicleDetails.modelYear}, ` +
                        `${createdPolicy.vehicleDetails.make}, ` +
                        createdPolicy.vehicleDetails.model,
                    coverage: selectedCoverage,
                    customerName: createdPolicy.customerName,
                    indemnityReserve: Number(indemnityReserve),
                    expenseReserve: Number(expenseReserve)
                });
            }
        );

        await test.step('Step 11 - Complete Payment details', async () => {
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
                    `Jamaica commercial auto claim payment ${Date.now()}`,
                accountNumber: bankAccountNumber
            });

            await claimPage.fillPrivateMotorPaymentAllocationDetails({
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
            'Step 12 - Login with QA credentials and verify Claim details',
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

        await test.step('Step 13 - Approve the Claim payment', async () => {
            await claimPage.openClaimFromClaimList(lossDescription);
            await claimPage.openPaymentsTab();
            await claimPage.openPaymentByReference(paymentNumber);
            await claimPage.approvePayment(`Approved by QA ${Date.now()}`);
            await claimPage.verifyPaymentTransactionStatus(
                paymentNumber,
                'Approved'
            );
        });

        await test.step('Step 14 - Issue the Claim payment', async () => {
            await claimPage.openPaymentByReference(paymentNumber);
            await claimPage.issuePayment(`Issued by QA ${Date.now()}`);
            await claimPage.verifyPaymentTransactionStatus(
                paymentNumber,
                'Issued'
            );
        });
    }
);
