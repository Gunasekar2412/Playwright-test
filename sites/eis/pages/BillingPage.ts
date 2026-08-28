import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { jamaicaPaymentPlans, interestRateDefaults } from '../data/RatingData';
import { getLicenseDates, setAuthorityLevel } from '../../../lib/utils';
import { jamaicaBanks, getRoutingNumberByBranchCode } from '../data/BillingData';
import { waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export type BillingTransactionRow = {
    transactionDate: string;
    effectiveDate: string;
    policyNumber: string;
    type: string;
    subtypeReason: string;
    reason: string;
    amount: string;
    status: string;
    action: string;
};

export type BillingTransactionExpectation = Partial<BillingTransactionRow>;

export class BillingPage extends BasePage {
    // Navigation elements
    readonly quoteLink: Locator;

    // Billing account list elements
    readonly billingAccountListTable: Locator;
    readonly billingGeneralInfoTable: Locator;

    // Payment elements
    readonly acceptPaymentButton: Locator;
    readonly otherTransactionButton: Locator;
    readonly paymentMethodDropdown: Locator;
    readonly paymentAmountField: Locator;
    readonly paymentOkButton: Locator;
    readonly paymentAndTransactionsTable: Locator;
    readonly pendingTransactionsTable: Locator;

    // Add Payment Method elements
    readonly addPaymentMethodButton: Locator;
    readonly addPaymentPaymentMethodDropdown: Locator;

    // EFT/Direct Debit Payment Method elements
    readonly eftBankNameDropdown: Locator;
    readonly eftBranchNameDropdown: Locator;
    readonly eftRoutingNumberField: Locator;
    readonly eftAccountNumberField: Locator;
    readonly eftBankAccountTypeDropdown: Locator;
    readonly eftPaymentMethodEffectiveDateField: Locator;
    readonly eftPaymentMethodExpirationDateField: Locator;
    readonly eftSaveButton: Locator;
    readonly eftCancelButton: Locator;
    readonly eftViewModeButton: Locator;
    readonly eftEditModeButton: Locator;

    // Payment Method List Table elements
    readonly paymentMethodListTable: Locator;

    // Take action dropdown for billing
    readonly billingTakeActionDropdown: Locator;

    // Inquiry Billing Account elements
    readonly inquiryIdentificationNumberField: Locator;
    readonly inquiryTrnField: Locator;

    // Update Billing Account elements
    readonly updateIdentificationNumberField: Locator;
    readonly updateIdentificationNumberErrorMessage: Locator;
    readonly updateTrnField: Locator;
    readonly updateTrnErrorMessage: Locator;

    // Refund elements
    readonly checkNumberField: Locator;
    readonly checkDateField: Locator;
    readonly refundReasonDropdown: Locator;

    // Confirmation dialog buttons
    readonly confirmOkButton: Locator;
    readonly confirmCancelButton: Locator;
    readonly declinePaymentReasonDropdown: Locator;
    readonly declinePaymentOkButton: Locator;

    // GCT calculation elements
    readonly totalAmountInput: Locator;
    readonly premiumInput: Locator;
    readonly gctInput: Locator;

    // Other Transactions form elements
    readonly otherTxTransactionTypeDropdown: Locator;
    readonly otherTxTransactionSubtypeDropdown: Locator;
    readonly otherTxAmountField: Locator;
    readonly otherTxPolicyAllocationResults: Locator;
    readonly otherTxOkButton: Locator;
    readonly otherTxCancelButton: Locator;

    // update form footer elements
    readonly updateFormSaveButton: Locator;
    readonly updateFormCancelButton: Locator;

    // Billing Task Action elements
    readonly billingTaskActionDropdown: Locator;

    // Billing Account Form Fields
    readonly billTypeField: Locator;
    readonly dueDayTypeField: Locator;
    readonly billingAccountDueDayField: Locator;
    readonly billingAccountNameTypeField: Locator;
    readonly billingContactPrefixField: Locator;
    readonly billingContactFirstNameField: Locator;
    readonly billingContactMiddleNameField: Locator;
    readonly billingContactLastNameField: Locator;
    readonly countryField: Locator;
    readonly zipPostalCodeField: Locator;
    readonly addressLine1Field: Locator;
    readonly addressLine2Field: Locator;
    readonly addressLine3Field: Locator;
    readonly stateProvinceField: Locator;
    readonly parishField: Locator;
    readonly districtField: Locator;
    readonly phoneField: Locator;
    readonly emailField: Locator;
    readonly paymentTypeField: Locator;
    readonly chequeDateField: Locator;
    readonly chequeNumberField: Locator;
    readonly customerIdNumberField: Locator;
    readonly refundReasonField: Locator;
    readonly billingTransactionsTable: Locator;
    readonly okButton: Locator;

    constructor(page: Page) {
        super(page); // Call base class constructor

        // Initialize navigation elements
        this.quoteLink = page.getByRole('link', { name: 'Quote' });

        // Initialize billing account list elements
        this.billingAccountListTable = page.locator('#billingAccountListForm\\:billing_account_list_table');
        this.billingGeneralInfoTable = page.locator('#billingDetailedForm\\:general_info_table');

        // Initialize payment elements
        this.acceptPaymentButton = page.locator('#billingDetailedForm\\:acceptPayment');
        this.otherTransactionButton = page.locator('#billingDetailedForm\\:otherTransactions');
        this.paymentMethodDropdown = page.locator('#paymentForm\\:paymentType');
        this.paymentAmountField = page.locator('#paymentForm\\:paymentAmount');
        // Matches both OK button variants: saveButton_footer and okButton_footer
        this.paymentOkButton = page.locator('#paymentForm\\:saveButton_footer, #paymentForm\\:okButton_footer');
        this.paymentAndTransactionsTable = page.locator('#billingDetailedForm\\:billing_transactions_active');
        this.pendingTransactionsTable = page.locator('#billingDetailedForm\\:billing_transactions_pending');

        // Initialize add payment method elements
        this.addPaymentMethodButton = page.locator('#paymentForm\\:addPaymentMethodButton');
        this.addPaymentPaymentMethodDropdown = page.locator('#paymentMethodTypeFormSwitch\\:paymentMethodType');

        // Initialize EFT/Direct Debit payment method elements
        this.eftBankNameDropdown = page.locator('#paymentMethodEFTForm\\:paymentEFT_bankName');
        this.eftBranchNameDropdown = page.locator('#paymentMethodEFTForm\\:paymentEFT_bankBranchCd');
        this.eftRoutingNumberField = page.locator('#paymentMethodEFTForm\\:paymentEFT_transitNumber');
        this.eftAccountNumberField = page.locator('#paymentMethodEFTForm\\:paymentEFT_accountNumber');
        this.eftBankAccountTypeDropdown = page.locator('#paymentMethodEFTForm\\:paymentEFT_bankAccountType');
        this.eftPaymentMethodEffectiveDateField = page.locator('#paymentMethodEFTForm\\:paymentEFT_paymentMethodEffectiveDateInputDate');
        this.eftPaymentMethodExpirationDateField = page.locator('#paymentMethodEFTForm\\:paymentEFT_paymentMethodExpirationDateInputDate');
        this.eftSaveButton = page.locator('#paymentMethodEFTForm\\:saveBtn');
        this.eftCancelButton = page.locator('#paymentMethodEFTForm\\:cancelButton');
        this.eftViewModeButton = page.locator('#paymentMethodEFTForm\\:viewModeBtn');
        this.eftEditModeButton = page.locator('#paymentMethodEFTForm\\:editModeBtn');

        // Initialize payment method list table
        // The table ID has a dynamic part, so we use a selector that matches the pattern
        this.paymentMethodListTable = page.locator('div[id^="paymentMethodListTable:"] table[role="grid"]');

        // Initialize take action dropdown for billing
        this.billingTakeActionDropdown = page.locator('#billingInfoForm\\:moveToDropdown');

        // Initialize inquiry elements
        this.inquiryIdentificationNumberField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerIdNumber');
        this.inquiryTrnField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerTrn');

        // Initialize update elements
        this.updateIdentificationNumberField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerIdNumber');
        this.updateTrnField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerTrn');
        this.updateIdentificationNumberErrorMessage = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerIdNumber').locator('xpath=ancestor::tr[1]//span[@class="error_message"]');
        this.updateTrnErrorMessage = page.locator('#updateForm\\:billingAccount_billingAccountDetails_customerTrn').locator('xpath=ancestor::tr[1]//span[@class="error_message"]');

        // Initialize refund elements
        this.checkNumberField = page.locator('#paymentForm\\:chequeNumber');
        this.checkDateField = page.locator('#paymentForm\\:chequeDateInputDate');
        this.refundReasonDropdown = page.locator('#paymentForm\\:refundReasonCmb');

        // Initialize confirmation dialog buttons
        this.confirmOkButton = page.locator('#generalConfirmDialogForm\\:okBtn');
        this.confirmCancelButton = page.locator('#generalConfirmDialogForm\\:cancelBtn');
        this.declinePaymentReasonDropdown = page.locator(
            '#declinePaymentReasonForm\\:declineReasonCmb'
        );
        this.declinePaymentOkButton = page.locator(
            '#declinePaymentReasonForm\\:okBtn_footer, #declinePaymentReasonForm\\:okBtn, #declinePaymentReasonForm\\:saveButton_footer, #declinePaymentReasonForm\\:okButton_footer'
        );

        // GCT calculation elements
        this.totalAmountInput = page.locator('#premiumTransactionsForm\\:grossPremium');
        this.premiumInput = page.locator('#premiumTransactionsForm\\:netPremium');
        this.gctInput = page.locator('#premiumTransactionsForm\\:amount0');

        // Other Transactions form elements
        this.otherTxTransactionTypeDropdown = page.locator('#otherTxForm\\:txTypeEnum');
        this.otherTxTransactionSubtypeDropdown = page.locator('#otherTxForm\\:transactionSubtype');
        this.otherTxAmountField = page.locator('#otherTxForm\\:requestedAmount');
        this.otherTxPolicyAllocationResults = page.locator('#otherTxForm\\:policyAllocationResults');
        this.otherTxOkButton = page.locator('#otherTxForm\\:okButton_footer');
        this.otherTxCancelButton = page.locator('#otherTxForm\\:cancelButton');

        // update form footer elements
        this.updateFormSaveButton = page.locator('#updateForm\\:saveButton_footer');
        this.updateFormCancelButton = page.locator('#updateForm\\:cancelButton_footer');

        // Initialize billing task action elements
        this.billingTaskActionDropdown = page.locator('#billingInfoForm\\:moveToDropdown');

        // Initialize billing account form fields
        this.billTypeField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billType');
        this.dueDayTypeField = page.locator('#updateForm\\:accountDueDayComponent_dueDayType');
        this.billingAccountDueDayField = page.locator('#updateForm\\:dueDayList\\:0\\:dueDay');
        this.billingAccountNameTypeField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_nameTypeCd');
        this.billingContactPrefixField = page.locator('#updateForm\\:salutation');
        this.billingContactFirstNameField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_firstName');
        this.billingContactMiddleNameField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_middleName');
        this.billingContactLastNameField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_lastName');
        this.countryField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_countryCd');
        this.zipPostalCodeField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_postalCode');
        this.addressLine1Field = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_addressLine1');
        this.addressLine2Field = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_addressLine2');
        this.addressLine3Field = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_addressLine3');
        this.stateProvinceField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_stateProvCd');
        this.parishField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_parishValue');
        this.districtField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_billingAccountAddress_districtValue');
        this.phoneField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_contactData_phone');
        this.emailField = page.locator('#updateForm\\:billingAccount_billingAccountDetails_contactData_email');
        this.paymentTypeField = page.locator('#paymentForm\\:paymentType');
        this.paymentAmountField = page.locator('#paymentForm\\:paymentAmount');
        this.chequeDateField = page.locator('#paymentForm\\:chequeDateInputDate');
        this.chequeNumberField = page.locator('#paymentForm\\:chequeNumber');
        this.customerIdNumberField = page.locator('#paymentForm\\:customerIdNumber');
        this.refundReasonField = page.locator('#paymentForm\\:refundReasonCmb');
        this.billingTransactionsTable = page.locator('#billingDetailedForm\\:billing_transactions_active');
        this.okButton = page.locator('#paymentForm\\:saveButton_footer');
    }

    async navigateToBilling() {
        await this.billingMenuItem.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyEndorsementUpdateEmlTransaction(
        policyNumber: string
    ): Promise<Record<string, string>> {
        await this.paymentAndTransactionsTable.waitFor({
            state: 'visible',
            timeout: 60_000
        });

        const transactionRow = this.paymentAndTransactionsTable
            .locator('tbody tr')
            .filter({ hasText: policyNumber })
            .filter({ hasText: 'Endorsement - Update EML' })
            .first();

        await expect(transactionRow).toBeVisible({ timeout: 60_000 });

        const cells = transactionRow.locator('td');
        const transactionDetails = {
            transactionDate: ((await cells.nth(0).innerText()) || '').trim(),
            effectiveDate: ((await cells.nth(1).innerText()) || '').trim(),
            policyNumber: ((await cells.nth(2).innerText()) || '').trim(),
            type: ((await cells.nth(3).innerText()) || '').trim(),
            subtypeReason: ((await cells.nth(4).innerText()) || '').trim(),
            reason: ((await cells.nth(5).innerText()) || '').trim(),
            amount: ((await cells.nth(6).innerText()) || '').trim(),
            status: ((await cells.nth(7).innerText()) || '').trim()
        };        expect(transactionDetails.policyNumber).toBe(policyNumber);
        expect(transactionDetails.subtypeReason).toBe(
            'Endorsement - Update EML'
        );

        return transactionDetails;
    }

    async verifyEndorsementTransaction(
        policyNumber: string,
        subtypeReasonPattern: RegExp = /Endorsement/i
    ): Promise<Record<string, string>> {
        await this.paymentAndTransactionsTable.waitFor({
            state: 'visible',
            timeout: 60_000
        });

        const transactionRows = this.paymentAndTransactionsTable
            .locator('tbody tr')
            .filter({ hasText: policyNumber });

        await expect(transactionRows.first()).toBeVisible({ timeout: 60_000 });

        const rowCount = await transactionRows.count();

        for (let index = 0; index < rowCount; index += 1) {
            const row = transactionRows.nth(index);
            const cells = row.locator('td');
            const transactionDetails = {
                transactionDate: ((await cells.nth(0).innerText()) || '').trim(),
                effectiveDate: ((await cells.nth(1).innerText()) || '').trim(),
                policyNumber: ((await cells.nth(2).innerText()) || '').trim(),
                type: ((await cells.nth(3).innerText()) || '').trim(),
                subtypeReason: ((await cells.nth(4).innerText()) || '').trim(),
                reason: ((await cells.nth(5).innerText()) || '').trim(),
                amount: ((await cells.nth(6).innerText()) || '').trim(),
                status: ((await cells.nth(7).innerText()) || '').trim()
            };

            if (subtypeReasonPattern.test(transactionDetails.subtypeReason)) {                expect(transactionDetails.policyNumber).toBe(policyNumber);
                expect(transactionDetails.subtypeReason).toMatch(
                    subtypeReasonPattern
                );

                return transactionDetails;
            }
        }

        throw new Error(
            `No billing endorsement transaction found for policy ${policyNumber}`
        );
    }

    /**
     * Selects a billing account from the billing accounts list
     * If the customer has only one billing account, the system may auto-navigate and the list table won't appear.
     * In that case, this method will detect it and skip selection.
     * @param accountNumber - Optional billing account number. If not provided, selects the first account
     */
    async selectBillingAccount(accountNumber?: string): Promise<void> {
        // Check if the billing account list table is visible
        // If not visible, assume there's only one account and system has auto-navigated
        await this.navigateToBilling();
        await waitForBarbadosLoadingSpinner(this);
        const isBillingAccountTableVisible = await this.billingAccountListTable.isVisible().catch(() => false);


        if (!isBillingAccountTableVisible) {
            // Table and account are not visible - likely only one account, system has auto-navigated
            // Wait for loading spinner to ensure we're on the billing detail page
            await waitForBarbadosLoadingSpinner(this);
            return;
        }

        // Table is visible - wait for it to be fully loaded
        await this.billingAccountListTable.waitFor({ state: 'visible', timeout: 10000 });

        if (accountNumber) {
            // Find and click the link with the specific account number
            const accountLink = this.billingAccountListTable.getByRole('link', { name: accountNumber, exact: true });
            await accountLink.click();
        } else {
            // Click the first billing account link in the table
            const firstAccountLink = this.billingAccountListTable.locator('a[id*=":policyNumber_"]').first();
            await firstAccountLink.click();
        }

        await waitForBarbadosLoadingSpinner(this);
    }

    async setUserAuthorityLevel(username: string, type: 'Billing' | 'Underwriting', level: 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4' | 'Level 5') {
        await setAuthorityLevel(this.page, username, type, level);
    }

    async getActiveBillingTransactions(): Promise<BillingTransactionRow[]> {
        await this.paymentAndTransactionsTable.waitFor({
            state: 'visible',
            timeout: 60_000
        });
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

        return await this.paymentAndTransactionsTable
            .locator('tbody tr')
            .evaluateAll((rows) =>
                rows.map((row) => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    const getCellText = (index: number) =>
                        cells[index]?.textContent?.replace(/\s+/g, ' ').trim() ||
                        '';

                    return {
                        transactionDate: getCellText(0),
                        effectiveDate: getCellText(1),
                        policyNumber: getCellText(2),
                        type: getCellText(3),
                        subtypeReason: getCellText(4),
                        reason: getCellText(5),
                        amount: getCellText(6),
                        status: getCellText(7),
                        action: getCellText(8)
                    };
                })
            );
    }

    async printActiveBillingTransactions(
        title = 'Active billing transactions'
    ): Promise<BillingTransactionRow[]> {
        const transactions = await this.getActiveBillingTransactions();

        return transactions;
    }

    private transactionMatchesExpectation(
        transaction: BillingTransactionRow,
        expectedTransaction: BillingTransactionExpectation
    ): boolean {
        return Object.entries(expectedTransaction).every(
            ([field, expectedValue]) => {
                if (expectedValue === undefined) {
                    return true;
                }

                return transaction[field as keyof BillingTransactionRow] ===
                    expectedValue;
            }
        );
    }

    async verifyActiveBillingTransaction(
        expectedTransaction: BillingTransactionExpectation
    ): Promise<BillingTransactionRow> {
        await expect
            .poll(
                async () => {
                    const transactions =
                        await this.getActiveBillingTransactions();

                    return transactions.some((transaction) =>
                        this.transactionMatchesExpectation(
                            transaction,
                            expectedTransaction
                        )
                    );
                },
                {
                    message: `Expected active billing transaction: ${JSON.stringify(
                        expectedTransaction
                    )}`,
                    timeout: 60_000
                }
            )
            .toBe(true);

        const transactions = await this.getActiveBillingTransactions();
        const matchingTransaction = transactions.find(
            (transaction) =>
                this.transactionMatchesExpectation(
                    transaction,
                    expectedTransaction
                )
        );

        return matchingTransaction!;
    }

    private async getActiveBillingTransactionRow(
        expectedTransaction: BillingTransactionExpectation
    ): Promise<Locator> {
        await this.verifyActiveBillingTransaction(expectedTransaction);

        const rows = this.paymentAndTransactionsTable.locator('tbody tr');
        const rowCount = await rows.count();

        for (let index = 0; index < rowCount; index += 1) {
            const row = rows.nth(index);
            const cells = row.locator('td');
            const transaction: BillingTransactionRow = {
                transactionDate: await cells.nth(0).innerText(),
                effectiveDate: await cells.nth(1).innerText(),
                policyNumber: await cells.nth(2).innerText(),
                type: await cells.nth(3).innerText(),
                subtypeReason: await cells.nth(4).innerText(),
                reason: await cells.nth(5).innerText(),
                amount: await cells.nth(6).innerText(),
                status: await cells.nth(7).innerText(),
                action: await cells.nth(8).innerText()
            };

            const normalizedTransaction = Object.fromEntries(
                Object.entries(transaction).map(([field, value]) => [
                    field,
                    value.replace(/\s+/g, ' ').trim()
                ])
            ) as BillingTransactionRow;

            if (
                this.transactionMatchesExpectation(
                    normalizedTransaction,
                    expectedTransaction
                )
            ) {
                return row;
            }
        }

        throw new Error(
            `Unable to locate active billing transaction row: ${JSON.stringify(
                expectedTransaction
            )}`
        );
    }

    async verifyBillingAccountForPolicy(options: {
        customerName: string;
        policyNumber: string;
        currency?: string;
    }): Promise<BillingTransactionRow> {
        const { customerName, policyNumber, currency = 'BBD' } = options;

        await this.selectBillingAccount();

        await expect(
            this.billingGeneralInfoTable
                .or(this.paymentAndTransactionsTable)
                .first()
        ).toBeVisible({ timeout: 60_000 });

        await expect(this.page.locator('body')).toContainText(customerName, {
            timeout: 60_000
        });
        await expect(this.page.locator('body')).toContainText(policyNumber);

        return await this.verifyPolicyPremiumTransaction(
            policyNumber,
            currency
        );
    }

    async verifyPolicyPremiumTransaction(
        policyNumber: string,
        currency = 'BBD'
    ): Promise<BillingTransactionRow> {
        const transactions = await this.getActiveBillingTransactions();
        const premiumTransaction = transactions.find(
            (transaction) =>
                transaction.policyNumber === policyNumber &&
                transaction.type === 'Premium' &&
                transaction.subtypeReason === 'Policy' &&
                transaction.amount.startsWith(currency) &&
                transaction.status === 'Applied'
        );

        expect(
            premiumTransaction,
            `Expected active premium transaction for policy ${policyNumber}`
        ).toBeTruthy();

        return premiumTransaction!;
    }

    async verifyAcceptedPaymentTransaction(options: {
        amount: string;
        currency?: string;
        subtypeReason?: string;
        status?: string;
    }): Promise<BillingTransactionRow> {
        const currency = options.currency || 'BBD';
        const expectedAmount = `(${this.formatAmountForTable(
            options.amount,
            currency
        )})`;

        return await this.verifyActiveBillingTransaction({
            policyNumber: '',
            type: 'Payment',
            subtypeReason: options.subtypeReason || 'Manual Payment',
            reason: '',
            amount: expectedAmount,
            status: options.status || 'Cleared',
            action: 'Decline Transfer'
        });
    }

    async verifyRefundTransaction(options: {
        amount: string;
        currency?: string;
        reason?: string;
        subtypeReason?: string;
        status?: string;
        action?: string;
    }): Promise<BillingTransactionRow> {
        const currency = options.currency || 'BBD';

        return await this.verifyActiveBillingTransaction({
            policyNumber: '',
            type: 'Refund',
            subtypeReason: options.subtypeReason || 'Manual Refund',
            reason: options.reason || 'Misapplied',
            amount: this.formatAmountForTable(options.amount, currency),
            status: options.status || 'Approved',
            action: options.action || 'Void Issue'
        });
    }

    async issueRefund(options: {
        amount: string;
        currency?: string;
        reason?: string;
    }): Promise<BillingTransactionRow> {
        const {
            amount,
            currency = 'BBD',
            reason = 'Misapplied'
        } = options;
        const formattedAmount = this.formatAmountForTable(amount, currency);
        await this.verifyRefundTransaction({
            amount,
            currency,
            reason,
            status: 'Approved',
            action: 'Void Issue'
        });

        const refundRow = this.paymentAndTransactionsTable
            .locator('tbody tr')
            .filter({ hasText: 'Refund' })
            .filter({ hasText: 'Manual Refund' })
            .filter({ hasText: reason })
            .filter({ hasText: formattedAmount })
            .filter({ hasText: 'Approved' })
            .first();

        const issueLink = refundRow.locator('td').nth(8).locator('a').filter({
            hasText: 'Issue'
        });

        await expect(issueLink).toBeVisible({ timeout: 60_000 });
        await issueLink.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.confirmOkButton.waitFor({
            state: 'visible',
            timeout: 10_000
        });
        await this.confirmOkButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.printActiveBillingTransactions(
            'Active billing transactions after issuing refund:'
        );

        return await this.verifyRefundTransaction({
            amount,
            currency,
            reason,
            status: 'Issued',
            action: 'Void Stop Clear'
        });
    }

    async acceptCashPayment(
        amount: string,
        currency = 'BBD'
    ): Promise<BillingTransactionRow> {
        await this.acceptPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.paymentMethodDropdown.selectOption('cash');
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentAmountField.fill(amount);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);

        await this.paymentOkButton.click();
        await waitForBarbadosLoadingSpinner(this);

        return await this.verifyAcceptedPaymentTransaction({
            amount,
            currency
        });
    }

    async declineAcceptedPayment(options: {
        amount: string;
        currency?: string;
        declineReason?: string;
    }): Promise<void> {
        const {
            amount,
            currency = 'BBD',
            declineReason = 'invalidAccount'
        } = options;
        const acceptedPayment: BillingTransactionExpectation = {
            policyNumber: '',
            type: 'Payment',
            subtypeReason: 'Manual Payment',
            reason: '',
            amount: `(${this.formatAmountForTable(amount, currency)})`,
            status: 'Cleared',
            action: 'Decline Transfer'
        };
        const paymentRow =
            await this.getActiveBillingTransactionRow(acceptedPayment);
        const declineLink = paymentRow
            .locator('td')
            .nth(8)
            .locator('a')
            .filter({ hasText: 'Decline' })
            .first();
        await expect(declineLink).toBeVisible({ timeout: 60_000 });
        await declineLink.click();
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.declinePaymentReasonDropdown).toBeVisible({
            timeout: 60_000
        });
        await this.declinePaymentReasonDropdown.selectOption(declineReason);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.locator('#declinePaymentReasonForm\\:okBtn_footer').click();
        await waitForBarbadosLoadingSpinner(this);

        await expect
            .poll(
                async () => {
                    const transactions =
                        await this.getActiveBillingTransactions();

                    return transactions.some((transaction) =>
                        this.transactionMatchesExpectation(
                            transaction,
                            acceptedPayment
                        )
                    );
                },
                {
                    message:
                        'Expected accepted manual payment to be removed from active cleared transactions after decline',
                    timeout: 60_000
                }
            )
            .toBe(false);
    }

    async createRefund(options: {
        amount: string;
        paymentMethod?: string;
        checkNumber?: string;
        checkDate?: string;
        reason?: 'Misapplied' | 'Other';
        currency?: string;
    }): Promise<void> {
        const {
            amount,
            paymentMethod = 'cheque',
            checkNumber = Array.from({ length: 10 }, () =>
                Math.floor(Math.random() * 10)
            ).join(''),
            checkDate = new Date().toLocaleDateString('en-GB'),
            reason = 'Misapplied',
            currency = 'BBD'
        } = options;
        await this.selectRefundFromTakeAction();
        await this.fillRefundDetails({
            paymentMethod,
            checkNumber,
            checkDate,
            amount,
            reason
        });

        await this.submitRefund();
        await this.printActiveBillingTransactions(
            'Active billing transactions after submitting refund:'
        );
        await this.verifyRefundTransaction({
            amount,
            currency,
            reason
        });
    }

    /**
     * Accepts a payment on a billing account
     * @param amount - The payment amount to be entered
     * @param paymentType - The payment type (default: 'payment')
     * @param paymentSubType - The payment sub type (default: 'manual payment')
     * @returns Promise<boolean> - Returns true if payment was successful
     */
    async acceptPayment(amount: string, paymentMethod: string = 'cash', paymentType: string = 'payment', paymentSubType: string = 'manual payment'): Promise<boolean> {
        try {
            // Step 1: Navigate to billing (assuming we're already on the billing page)
            // This step is handled by the calling test

            // Step 2: Click accept payment button
            await this.acceptPaymentButton.click();
            await waitForBarbadosLoadingSpinner(this);

            // Step 3: Select payment method - cash
            await this.paymentMethodDropdown.selectOption(paymentMethod);
            await waitForBarbadosLoadingSpinner(this);

            // Step 4: Fill in amount
            await this.paymentAmountField.fill(amount);
            await this.page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(this);

            // Step 5: Click OK
            await this.paymentOkButton.click();
            await waitForBarbadosLoadingSpinner(this);

            // Step 6: Validate the payment was successful under the payment and other transactions section
            const isPaymentSuccessful = await this.validatePaymentSuccess({
                amount: amount,
                paymentMethod: paymentMethod,
                paymentType: paymentType,
                paymentSubType: paymentSubType
            });            return await isPaymentSuccessful;
        } catch (error) {
            console.error('Error accepting payment:', error);
            return false;
        }
    }

    /**
     * Formats amount to match the pending transactions table display format
     * Supports both JMD and BBD currencies based on the currency parameter
     * @param amount - The payment amount as a string
     * @param currency - Currency code (default: 'JMD')
     * @returns Formatted amount string
     */
    private formatAmountForTable(amount: string, currency: string = 'JMD'): string {
        const numAmount = parseFloat(amount);
        // Format with commas and 2 decimal places
        const formattedAmount = numAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        // Refunds are displayed as positive amounts: BBD3,274.75 or JMD3,274.75
        return `${currency}${formattedAmount}`;
    }

    /**
     * Validates that the payment was successful by checking the transactions table
     * @param amount - The expected payment amount
     * @param paymentMethod - The expected payment method
     * @param paymentType - The expected payment type
     * @param paymentSubType - The expected payment sub type
     * @returns Promise<boolean> - Returns true if payment is found in transactions
     */
    async validatePaymentSuccess(refundDetails: {
        amount: string;
        paymentMethod: string;
        paymentType: string;
        paymentSubType: string;
        reason?: string;
        status?: string;
        currency?: string;
    }): Promise<boolean> {
        try {
            // Wait for the transactions table to be visible
            await this.paymentAndTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            // Format the amount to match table format (e.g., BBD3,274.75 or JMD3,274.75)
            const currency = refundDetails.currency || 'JMD';
            const formattedAmount = this.formatAmountForTable(refundDetails.amount, currency);

            // Find the row by matching the formatted amount in the Amount column
            // The Amount column is the 7th column (index 6) in the table
            const paymentRow = this.paymentAndTransactionsTable
                .locator('tbody tr')
                .filter({
                    has: this.page.locator(`span[id*="billingTransaction_amountoutputText"]`).filter({
                        hasText: formattedAmount
                    })
                })
                .first();

            // Check if the payment row exists
            const rowCount = await paymentRow.count();
            if (rowCount === 0) {                return false;
            }

            // Verify Type column (4th column, index 3) - contains a link with the type text
            const typeLink = paymentRow.locator('td').nth(3).locator('a');
            const typeText = await typeLink.textContent();
            const isTypeMatch = typeText?.trim().toLowerCase() === refundDetails.paymentType.toLowerCase();

            // Verify Subtype/Reason column (5th column, index 4) - contains the subtype text
            const subtypeCell = paymentRow.locator('td').nth(4);
            const subtypeText = await subtypeCell.textContent();
            const isSubtypeMatch = subtypeText?.trim().toLowerCase() === refundDetails.paymentSubType.toLowerCase();        return isTypeMatch && isSubtypeMatch;
        } catch (error) {
            console.error('Error validating payment success:', error);
            return false;
        }
    }

    /**
     * Validates that a specific fee in the payment table has the correct type, subtype, amount, status, and Waive action
     * @param feeDetails - Object containing fee validation details
     * @param feeDetails.amount - The expected fee amount
     * @param feeDetails.subtype - The expected fee subtype (e.g., 'GCT', 'Cancellation Fee')
     * @param feeDetails.status - Optional expected status (e.g., 'Applied')
     * @param feeDetails.currency - Currency code (default: 'JMD')
     * @returns Promise<boolean> - Returns true if the fee is found and matches all criteria
     */
    async validateTransactionFee(feeDetails: {
        amount: string;
        type?: string;
        subtype: string;
        reason?: string;
        status?: string;
        currency?: string;
    }): Promise<boolean> {
        try {
            // Wait for the transactions table to be visible
            await this.paymentAndTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            // Format the amount to match table format (e.g., BBD3,274.75 or JMD3,274.75)
            const currency = feeDetails.currency || 'JMD';
            const formattedAmount = this.formatAmountForTable(feeDetails.amount, currency);
            const expectedAmount = parseFloat(feeDetails.amount);

            // Wait for spinner again to ensure table data is fully loaded
            await waitForBarbadosLoadingSpinner(this);

            // Find the row - prefer finding by subtype and reason if provided (more reliable for GCT fees)
            // Otherwise, find by amount
            let feeRow: Locator;

            if (feeDetails.reason) {
                // Find row by matching subtype and reason first (more reliable for rounding issues)
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();
                let foundRow: Locator | null = null;

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';
                    const reasonCell = row.locator('td').nth(5).locator('span');
                    const reasonText = (await reasonCell.textContent())?.trim() || '';

                    if (subtypeText.toLowerCase() === feeDetails.subtype.toLowerCase() &&
                        reasonText.toLowerCase() === feeDetails.reason.toLowerCase()) {
                        foundRow = row;
                        break;
                    }
                }

                if (!foundRow) {                    return false;
                }

                feeRow = foundRow;
            } else {
                // Find the row by matching the formatted amount in the Amount column
                // The Amount column is the 7th column (index 6) in the table
                feeRow = this.paymentAndTransactionsTable
                    .locator('tbody tr')
                    .filter({
                        has: this.page.locator(`span[id*="billingTransaction_amountoutputText"]`).filter({
                            hasText: formattedAmount
                        })
                    })
                    .first();

                // Check if the fee row exists
                const rowCount = await feeRow.count();
                if (rowCount === 0) {                    return false;
                }
            }

            // Wait for spinner before reading cell values to ensure data is fully loaded
            await waitForBarbadosLoadingSpinner(this);

            // Verify Type column (4th column, index 3) - should be "Fee"
            const typeLink = feeRow.locator('td').nth(3).locator('a');
            const typeText = await typeLink.textContent();
            const isTypeMatch = typeText?.trim().toLowerCase() === feeDetails.type?.toLowerCase() || 'fee';

            // Verify Subtype column (5th column, index 4) - contains the subtype text
            const subtypeCell = feeRow.locator('td').nth(4);
            const subtypeText = await subtypeCell.textContent();
            const isSubtypeMatch = subtypeText?.trim().toLowerCase() === feeDetails.subtype.toLowerCase();

            let isReasonMatch = true;
            if (feeDetails.reason) {
                // Verify Reason column (6th column, index 5) - contains the reason text
                const reasonCell = feeRow.locator('td').nth(5).locator('span');
                const reasonText = await reasonCell.textContent();
                isReasonMatch = reasonText?.trim().toLowerCase() === feeDetails.reason?.toLowerCase();
            }

            // Verify Amount column (7th column, index 6) - allow small rounding differences
            const amountCell = feeRow.locator('td').nth(6).locator('span[id*="billingTransaction_amountoutputText"]');
            const amountText = await amountCell.textContent();
            const actualAmount = this.parseAmount(amountText?.trim() || '');
            // Allow tolerance of 0.01 for rounding differences
            const tolerance = 0.01;
            const isAmountMatch = Math.abs(actualAmount - expectedAmount) <= tolerance;

            // Verify Status column (8th column, index 7) - if status is provided
            let isStatusMatch = true;
            if (feeDetails.status) {
                const statusCell = feeRow.locator('td').nth(7);
                const statusText = await statusCell.textContent();
                isStatusMatch = statusText?.trim().toLowerCase() === feeDetails.status.toLowerCase();
            }

            // Verify Action column (9th column, index 8) - should have "Waive" action
            const actionCell = feeRow.locator('td').nth(8);
            const waiveLink = actionCell.locator('a').filter({ hasText: 'Waive' });
            const hasWaiveAction = await waiveLink.count() > 0;  if (feeDetails.reason) {
                const reasonCell = feeRow.locator('td').nth(5).locator('span');
                const reasonText = await reasonCell.textContent();            }
            if (feeDetails.status) {
                const statusCell = feeRow.locator('td').nth(7);
                const statusText = await statusCell.textContent();            }
            return isTypeMatch && isSubtypeMatch && isAmountMatch && isStatusMatch && hasWaiveAction && isReasonMatch;
        } catch (error) {
            console.error('Error validating fees have Waive action:', error);
            return false;
        }
    }

    /**
     * Waives a transaction by identifying it using the same parameters as validateTransactionFee,
     * clicking the waive button, confirming the popup, and validating the results
     * @param transactionDetails - Object containing transaction identification details (same as validateTransactionFee)
     * @param transactionDetails.amount - The expected transaction amount
     * @param transactionDetails.type - Optional expected transaction type (e.g., 'fee')
     * @param transactionDetails.subtype - The expected transaction subtype (e.g., 'GCT', 'Cancellation Fee')
     * @param transactionDetails.reason - Optional expected reason (e.g., 'Cancellation Fee')
     * @param transactionDetails.status - Optional expected status (e.g., 'Applied')
     * @param transactionDetails.currency - Currency code (default: 'JMD')
     * @returns Promise<boolean> - Returns true if the transaction was waived successfully
     */
    async waiveTransaction(transactionDetails: {
        amount: string;
        type?: string;
        subtype: string;
        reason?: string;
        waivedReason?: string;
        status?: string;
        currency?: string;
    }): Promise<boolean> {
        try {
            // Wait for the transactions table to be visible
            await this.paymentAndTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            // Format the amount to match table format (e.g., BBD3,274.75 or JMD3,274.75)
            const currency = transactionDetails.currency || 'JMD';
            const formattedAmount = this.formatAmountForTable(transactionDetails.amount, currency);
            const expectedTxAmount = parseFloat(transactionDetails.amount);

            // Wait for spinner again to ensure table data is fully loaded
            await waitForBarbadosLoadingSpinner(this);

            // Find the row - prefer finding by subtype and reason if provided (more reliable for GCT fees)
            // Otherwise, find by amount
            let transactionRow: Locator | null = null;

            if (transactionDetails.reason) {
                // Find row by matching subtype and reason first (more reliable for rounding issues)
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';
                    const reasonCell = row.locator('td').nth(5).locator('span');
                    const reasonText = (await reasonCell.textContent())?.trim() || '';

                    if (subtypeText.toLowerCase() === transactionDetails.subtype.toLowerCase() &&
                        reasonText.toLowerCase() === transactionDetails.reason.toLowerCase()) {
                        transactionRow = row;
                        break;
                    }
                }

                if (!transactionRow) {                    return false;
                }
            } else {
                // Find the row by matching the formatted amount in the Amount column
                // The Amount column is the 7th column (index 6) in the table
                const row = this.paymentAndTransactionsTable
                    .locator('tbody tr')
                    .filter({
                        has: this.page.locator(`span[id*="billingTransaction_amountoutputText"]`).filter({
                            hasText: formattedAmount
                        })
                    })
                    .first();

                // Check if the transaction row exists
                const rowCount = await row.count();
                if (rowCount === 0) {                    return false;
                }

                transactionRow = row;
            }

            // Wait for spinner before reading cell values to ensure data is fully loaded
            await waitForBarbadosLoadingSpinner(this);

            // Verify the row has a waive action before proceeding
            const actionCell = transactionRow.locator('td').nth(8);
            const waiveLink = actionCell.locator('a').filter({ hasText: 'Waive' });
            const hasWaiveAction = await waiveLink.count() > 0;

            if (!hasWaiveAction) {                return false;
            }

            // Step 2: Click the waive button
            await waiveLink.click();
            await waitForBarbadosLoadingSpinner(this);

            // Step 3: Click OK on the confirmation popup
            await this.confirmOkButton.waitFor({ state: 'visible', timeout: 5000 });
            await this.confirmOkButton.click();
            await waitForBarbadosLoadingSpinner(this);

            // Step 4: Validate new row added to table with subtype "GCT Waived"
            // The waived transaction should create a new row with subtype "GCT Waived"
            // Note: The waived amount is displayed as negative (in parentheses)
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            // Wait a bit more for the table to update after the waive action
            await this.page.waitForTimeout(1000);
            await waitForBarbadosLoadingSpinner(this);

            // Find the row by searching for "GCT Waived" text directly in the table
            const waivedRow = this.paymentAndTransactionsTable.locator('tbody tr').filter({
                hasText: 'GCT Waived'
            }).first();

            const waivedRowCount = await waivedRow.count();

            if (waivedRowCount === 0) {                // Log all subtypes for debugging
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';                }
                return false;
            }

            // Verify Subtype column (5th column, index 4) - contains "GCT Waived"
            const subtypeCell = waivedRow.locator('td').nth(4);
            const subtypeText = await subtypeCell.textContent();
            const isSubtypeMatch = subtypeText?.trim().toLowerCase() === 'gct waived';

            if (!isSubtypeMatch) {                return false;
            }

            // Verify Amount column (7th column, index 6) - allow small rounding differences
            // The waived amount is displayed as negative (in parentheses), so we compare absolute values
            const amountCell = waivedRow.locator('td').nth(6).locator('span[id*="billingTransaction_amountoutputText"]');
            const amountText = await amountCell.textContent();
            const actualAmount = Math.abs(this.parseAmount(amountText?.trim() || ''));
            const expectedWaivedAmount = parseFloat(transactionDetails.amount);
            // Allow tolerance of 0.01 for rounding differences
            const tolerance = 0.01;
            const isAmountMatch = Math.abs(actualAmount - expectedWaivedAmount) <= tolerance;        if (!isAmountMatch) {                return false;
            }
            // Step 5: Validate waive action no longer exists on previous GCT row
            // Re-find the original row to check if waive action is gone
            await waitForBarbadosLoadingSpinner(this);
            let originalRowAfterWaive: Locator | null = null;

            if (transactionDetails.waivedReason) {
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';
                    const reasonCell = row.locator('td').nth(5).locator('span');
                    const reasonText = (await reasonCell.textContent())?.trim() || '';

                    if (subtypeText.toLowerCase() === transactionDetails.subtype.toLowerCase() &&
                        reasonText.toLowerCase() === transactionDetails.waivedReason.toLowerCase()) {
                        originalRowAfterWaive = row;
                        break;
                    }
                }
            } else {
                originalRowAfterWaive = this.paymentAndTransactionsTable
                    .locator('tbody tr')
                    .filter({
                        has: this.page.locator(`span[id*="billingTransaction_amountoutputText"]`).filter({
                            hasText: formattedAmount
                        })
                    })
                    .first();
            }

            if (originalRowAfterWaive && (await originalRowAfterWaive.count()) > 0) {
                const actionCellAfterWaive = originalRowAfterWaive.locator('td').nth(8);
                const waiveLinkAfterWaive = actionCellAfterWaive.locator('a').filter({ hasText: 'Waive' });
                const hasWaiveActionAfterWaive = await waiveLinkAfterWaive.count() > 0;

                if (hasWaiveActionAfterWaive) {                    return false;
                }
            }            return true;
        } catch (error) {
            console.error('Error waiving transaction:', error);
            return false;
        }
    }

    /**
     * Validates that a specific transaction is NOT present in the payment table
     * This is the opposite of validateTransactionFee - returns true if the transaction is NOT found
     * @param transactionDetails - Object containing transaction validation details
     * @param transactionDetails.amount - Optional expected transaction amount
     * @param transactionDetails.type - Optional expected transaction type (e.g., 'fee')
     * @param transactionDetails.subtype - The expected transaction subtype (e.g., 'GCT', 'Cancellation Fee')
     * @param transactionDetails.reason - Optional expected reason (e.g., 'Cancellation Fee')
     * @param transactionDetails.status - Optional expected status (e.g., 'Applied')
     * @param transactionDetails.currency - Currency code (default: 'JMD')
     * @returns Promise<boolean> - Returns true if the transaction is NOT found in the table
     */
    async validateTransactionNotPresent(transactionDetails: {
        amount?: string;
        type?: string;
        subtype: string;
        reason?: string;
        status?: string;
        currency?: string;
    }): Promise<boolean> {
        try {
            // Wait for the transactions table to be visible
            await this.paymentAndTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            const currency = transactionDetails.currency || 'JMD';

            // Try to find the row - prefer finding by subtype and reason if provided
            // Otherwise, find by amount if provided, or just by subtype
            let transactionRow: Locator | null = null;

            if (transactionDetails.reason) {
                // Find row by matching subtype and reason first (most reliable)
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';
                    const reasonCell = row.locator('td').nth(5).locator('span');
                    const reasonText = (await reasonCell.textContent())?.trim() || '';

                    if (subtypeText.toLowerCase() === transactionDetails.subtype.toLowerCase() &&
                        reasonText.toLowerCase() === transactionDetails.reason.toLowerCase()) {
                        transactionRow = row;
                        break;
                    }
                }
            } else if (transactionDetails.amount) {
                // Find the row by matching the formatted amount in the Amount column
                // The Amount column is the 7th column (index 6) in the table
                const formattedAmount = this.formatAmountForTable(transactionDetails.amount, currency);
                const row = this.paymentAndTransactionsTable
                    .locator('tbody tr')
                    .filter({
                        has: this.page.locator(`span[id*="billingTransaction_amountoutputText"]`).filter({
                            hasText: formattedAmount
                        })
                    })
                    .first();

                // Check if the transaction row exists
                const rowCount = await row.count();
                if (rowCount > 0) {
                    transactionRow = row;
                }
            } else {
                // Find by subtype only
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const subtypeCell = row.locator('td').nth(4);
                    const subtypeText = (await subtypeCell.textContent())?.trim() || '';

                    if (subtypeText.toLowerCase() === transactionDetails.subtype.toLowerCase()) {
                        transactionRow = row;
                        break;
                    }
                }
            }

            // If no row was found, the transaction is not present - return true
            if (!transactionRow || (await transactionRow.count()) === 0) {
                const amountInfo = transactionDetails.amount ? `, amount: ${this.formatAmountForTable(transactionDetails.amount, currency)}` : '';                return true;
            }

            // Row was found - now verify it matches all criteria
            // If it matches, the transaction IS present, so return false
            // If it doesn't match, the transaction is NOT present, so return true

            // Verify Type column (4th column, index 3) - if type is provided
            let isTypeMatch = true;
            if (transactionDetails.type) {
                const typeLink = transactionRow.locator('td').nth(3).locator('a');
                const typeText = await typeLink.textContent();
                isTypeMatch = typeText?.trim().toLowerCase() === transactionDetails.type.toLowerCase();
            }

            // Verify Subtype column (5th column, index 4) - contains the subtype text
            const subtypeCell = transactionRow.locator('td').nth(4);
            const subtypeText = await subtypeCell.textContent();
            const isSubtypeMatch = subtypeText?.trim().toLowerCase() === transactionDetails.subtype.toLowerCase();

            // Verify Reason column (6th column, index 5) - if reason is provided
            let isReasonMatch = true;
            if (transactionDetails.reason) {
                const reasonCell = transactionRow.locator('td').nth(5).locator('span');
                const reasonText = await reasonCell.textContent();
                isReasonMatch = reasonText?.trim().toLowerCase() === transactionDetails.reason.toLowerCase();
            }

            // Verify Amount column (7th column, index 6) - only if amount is provided
            let isAmountMatch = true;
            if (transactionDetails.amount) {
                const amountCell = transactionRow.locator('td').nth(6).locator('span[id*="billingTransaction_amountoutputText"]');
                const amountText = await amountCell.textContent();
                const actualAmount = this.parseAmount(amountText?.trim() || '');
                const expectedAmount = parseFloat(transactionDetails.amount);
                // Allow tolerance of 0.01 for rounding differences
                const tolerance = 0.01;
                isAmountMatch = Math.abs(actualAmount - expectedAmount) <= tolerance;
            }

            // Verify Status column (8th column, index 7) - if status is provided
            let isStatusMatch = true;
            if (transactionDetails.status) {
                const statusCell = transactionRow.locator('td').nth(7);
                const statusText = await statusCell.textContent();
                isStatusMatch = statusText?.trim().toLowerCase() === transactionDetails.status.toLowerCase();
            }

            // If all criteria match, the transaction IS present, so return false
            const isPresent = isTypeMatch && isSubtypeMatch && isAmountMatch && isStatusMatch && isReasonMatch;            if (transactionDetails.amount) {
                const formattedAmount = this.formatAmountForTable(transactionDetails.amount, currency);
                const expectedAmount = parseFloat(transactionDetails.amount);
                const amountCell = transactionRow.locator('td').nth(6).locator('span[id*="billingTransaction_amountoutputText"]');
                const amountText = await amountCell.textContent();
                const actualAmount = this.parseAmount(amountText?.trim() || '');                if (isPresent) {                }
            }
            if (isPresent) {            } else {            }
            // Return true if transaction is NOT present (opposite of isPresent)
            return !isPresent;
        } catch (error) {
            console.error('Error validating transaction absence:', error);
            // If there's an error, assume transaction is not present (safer for negative tests)
            return true;
        }
    }

    /**
     * Selects "refund" from the take action dropdown
     */
    async selectRefundFromTakeAction(): Promise<void> {
        await this.billingTakeActionDropdown.selectOption({ value: 'refund' });
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
    * Selects an option from the take action dropdown
    * @param option - The option to select: 'inquiry' or 'refund'
    */
    async selectFromTakeAction(option: 'inquiry' | 'refund' | 'update'): Promise<void> {
        await this.billingTakeActionDropdown.selectOption({ value: option });
        await waitForBarbadosLoadingSpinner(this);
    }

    async closeVisibleDialogIfPresent(): Promise<void> {
        const closeButtons = this.page.locator(
            'div.ui-dialog:visible a.ui-dialog-titlebar-close[role="button"], a.ui-dialog-titlebar-close[role="button"]:visible'
        );

        if ((await closeButtons.count()) === 0) {
            await this.page.keyboard.press('Escape');
            await waitForBarbadosLoadingSpinner(this);
            return;
        }

        const closeButton = closeButtons.last();

        try {
            await closeButton.click({ timeout: 5_000 });
        } catch {
            await closeButton.evaluate((element) =>
                (element as HTMLElement).click()
            );
        }

        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Fills in refund details
     * @param refundDetails - Object containing refund details
     * @param refundDetails.paymentMethod - Payment method (default: 'cheque' for Check)
     * @param refundDetails.checkNumber - Check number (required if paymentMethod is 'cheque')
     * @param refundDetails.checkDate - Check date in DD/MM/YYYY format (required if paymentMethod is 'cheque')
     * @param refundDetails.amount - Refund amount (required)
     * @param refundDetails.reason - Reason for refund: 'Misapplied' or 'Other' (required)
     */
    async fillRefundDetails(refundDetails: {
        paymentMethod?: string;
        checkNumber?: string;
        checkDate?: string;
        amount: string;
        reason: 'Misapplied' | 'Other';
    }): Promise<void> {
        const { paymentMethod = 'cheque', checkNumber, checkDate, amount, reason } = refundDetails;

        // Select payment method
        await this.paymentMethodDropdown.selectOption({ value: paymentMethod });
        await waitForBarbadosLoadingSpinner(this);

        // If payment method is cheque, fill in check number and date
        if (paymentMethod === 'cheque') {
            if (checkNumber) {
                await this.checkNumberField.fill(checkNumber);
                await this.page.keyboard.press('Enter');
                await waitForBarbadosLoadingSpinner(this);
            }
            await this.closeVisibleDialogIfPresent();
            if (checkDate) {
                await this.checkDateField.fill(checkDate);
                await this.page.keyboard.press('Enter');
                await waitForBarbadosLoadingSpinner(this);
            }
            await this.closeVisibleDialogIfPresent();
        }

        // Fill in amount
        await this.paymentAmountField.fill(amount);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);

        // Select reason for refund
        await this.refundReasonDropdown.selectOption({ label: reason });
        await waitForBarbadosLoadingSpinner(this);
    }

    async submitRefund() {
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentOkButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async submitOtherTransaction(amount: string, transactionType: string, transactionSubtype: string) {
        await this.selectOtherTransactionType(transactionType);
        await waitForBarbadosLoadingSpinner(this);

        await this.selectOtherTransactionSubtype(transactionSubtype);
        await waitForBarbadosLoadingSpinner(this);

        await this.otherTxAmountField.fill(amount);
        await this.page.keyboard.press('Enter');
        await waitForBarbadosLoadingSpinner(this);

        await this.otherTxOkButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Validates that the refund appears in the pending transactions table
     * @param refundDetails - Object containing refund validation details
     * @param refundDetails.amount - The expected refund amount
     * @param refundDetails.paymentType - The expected payment type (e.g., 'Refund')
     * @param refundDetails.paymentSubType - The expected payment sub type (e.g., 'Manual Refund')
     * @param refundDetails.reason - The expected reason (e.g., 'Misapplied' or 'Other')
     * @param refundDetails.currency - Currency code (default: 'JMD')
     * @returns Promise<boolean> - Returns true if refund is found in pending transactions
     */
    async validatePendingRefund(refundDetails: {
        amount: string;
        paymentType: string;
        paymentSubType: string;
        reason: string;
        currency?: string;
    }): Promise<boolean> {
        try {
            // Wait for the pending transactions table to be visible
            await this.pendingTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);

            // Format the amount to match table format (e.g., BBD3,274.75 or JMD3,274.75)
            const currency = refundDetails.currency || 'JMD';
            const formattedAmount = this.formatAmountForTable(refundDetails.amount, currency);

            // Find the row by matching the formatted amount in the Amount column
            // The Amount column is the 6th column (index 5) in the pending table
            const refundRow = this.pendingTransactionsTable
                .locator('tbody tr')
                .filter({
                    has: this.page.locator(`span[id*="transactionAmount"]`).filter({
                        hasText: formattedAmount
                    })
                })
                .first();

            // Check if the refund row exists
            const rowCount = await refundRow.count();
            if (rowCount === 0) {                return false;
            }

            // Verify Type column (3rd column, index 2) - contains a link with the type text
            const typeLink = refundRow.locator('td').nth(2).locator('a');
            const typeText = await typeLink.textContent();
            const isTypeMatch = typeText?.trim().toLowerCase() === refundDetails.paymentType.toLowerCase();

            // Verify Subtype column (4th column, index 3) - contains the subtype text
            const subtypeCell = refundRow.locator('td').nth(3);
            const subtypeText = await subtypeCell.textContent();
            const isSubtypeMatch = subtypeText?.trim().toLowerCase() === refundDetails.paymentSubType.toLowerCase();

            // Verify Reason column (5th column, index 4) - contains the reason text
            const reasonCell = refundRow.locator('td').nth(4).locator('span');
            const reasonText = await reasonCell.textContent();
            const isReasonMatch = reasonText?.trim().toLowerCase() === refundDetails.reason.toLowerCase();

            // Verify Status column (7th column, index 6) - should be "Pending"
            const statusCell = refundRow.locator('td').nth(6);
            const statusText = await statusCell.textContent();
            const isStatusPending = statusText?.trim().toLowerCase() === 'pending';    return isTypeMatch && isSubtypeMatch && isReasonMatch && isStatusPending;
        } catch (error) {
            console.error('Error validating pending refund:', error);
            return false;
        }
    }

    /**
     * Formats a date to MM/DD/YYYY format
     * @param date - Date object (defaults to today)
     * @returns Formatted date string in MM/DD/YYYY format
     */
    private formatDateForTable(date: Date = new Date()): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    /**
     * Approves or rejects a transaction in the pending transactions table
     * @param amount - The amount of the transaction (used to identify the row)
     * @param action - The action to perform: 'approve' or 'reject'
     * @param transactionDate - The transaction date in MM/DD/YYYY format (defaults to today)
     * @param currency - Currency code (default: 'JMD')
     * @returns Promise<boolean> - Returns true if action was successful
     */
    async approveOrRejectPendingTransaction(
        amount: string,
        action: 'Approve' | 'Reject',
        currency: string = 'JMD'
    ): Promise<boolean> {
        try {            // Wait for the pending transactions table to be visible
            await this.pendingTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);

            // Format the amount to match table format
            const formattedAmount = this.formatAmountForTable(amount, currency);

            // Find the row by matching both transaction date and amount
            // Transaction Date is in the 1st column (index 0)
            // Amount is in the 6th column (index 5)
            const transactionRow = this.pendingTransactionsTable
                .locator('tbody tr')
                .filter({
                    has: this.page.locator(`span[id*="transactionAmount"]`).filter({
                        hasText: formattedAmount
                    })
                })
                .first();

            // Check if the transaction row exists
            const rowCount = await transactionRow.count();
            if (rowCount === 0) {                return false;
            }

            // Find and click the appropriate action link in the Action column (8th column, index 7)
            const actionLink = transactionRow.locator('td').nth(7).locator('a').filter({ hasText: action === 'Approve' ? 'Approve' : 'Reject' }).first();

            // Check if the action link exists
            const linkCount = await actionLink.count();
            if (linkCount === 0) {                return false;
            }

            await actionLink.click();
            await waitForBarbadosLoadingSpinner(this);

            await this.confirmOkButton.click();
            await waitForBarbadosLoadingSpinner(this);

            return true;
        } catch (error) {
            console.error(`Error ${action}ing pending transaction:`, error);
            return false;
        }
    }

    /**
     * Parses a currency-formatted amount string (e.g., "JMD667,000.00" or "(JMD1,155.32)") to a numeric value
     * Handles both positive and negative amounts (negative amounts are in parentheses)
     * @param amountString - The formatted amount string
     * @returns The numeric value (negative if in parentheses)
     */
    private parseAmount(amountString: string): number {
        let cleanedAmount = amountString.trim();

        // Check if amount is negative (in parentheses) - check before removing anything
        const isNegative = cleanedAmount.startsWith('(') && cleanedAmount.endsWith(')');

        // Remove parentheses first (if present)
        cleanedAmount = cleanedAmount.replace(/[()]/g, '');

        // Remove currency prefix (JMD, BBD, etc.) - now it's at the start
        cleanedAmount = cleanedAmount.replace(/^[A-Z]{3}/, '');

        // Remove commas
        cleanedAmount = cleanedAmount.replace(/,/g, '');

        const numericValue = parseFloat(cleanedAmount);

        // Return negative value if it was in parentheses
        return isNegative ? -numericValue : numericValue;
    }

    /**
     * Gets the total amount, premium, and GCT from the Policy Transaction Details section
     * For Jamaica customers: validates that the GCT value is accurate (15% of premium)
     * For Barbados customers: GCT field is not displayed, so GCT will be 0
     * @returns Promise<{totalAmount: number, premium: number, gct: number, isValid: boolean, expectedGCT: number, actualGCT: number, hasGCT: boolean}>
     */
    async getPremiumAmounts(): Promise<{
        totalAmount: number;
        premium: number;
        gct: number;
        isValid: boolean;
        expectedGCT: number;
        actualGCT: number;
        hasGCT: boolean;
    }> {
        try {
            await this.totalAmountInput.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);

            // Get the values from the input fields
            const totalAmountString = await this.totalAmountInput.inputValue();
            const premiumString = await this.premiumInput.inputValue();

            // Parse the amounts to numeric values
            const totalAmount = this.parseAmount(totalAmountString);
            const premium = this.parseAmount(premiumString);

            // Check if GCT field exists (it won't exist for Barbados customers)
            const gctInputExists = await this.gctInput.isVisible().catch(() => false);
            let gct = 0;
            let hasGCT = false;
            let isValid = true;
            let expectedGCT = 0;
            let actualGCT = 0;

            if (gctInputExists) {
                // GCT field exists (Jamaica customers)
                hasGCT = true;
                const gctString = await this.gctInput.inputValue();
                gct = this.parseAmount(gctString);
                actualGCT = gct;

                // Calculate expected GCT (15% of premium)
                expectedGCT = premium * 0.15;

                // Validate GCT is accurate (allow for small rounding differences)
                const tolerance = 0.01; // Allow 1 cent difference for rounding
                isValid = Math.abs(gct - expectedGCT) <= tolerance;} else {
                // GCT field does not exist (Barbados customers)
                hasGCT = false;
                expectedGCT = 0;
                actualGCT = 0;
                // For Barbados, total amount should equal premium (no GCT)
                isValid = Math.abs(totalAmount - premium) < 0.01;    }

            return {
                totalAmount,
                premium,
                gct,
                isValid,
                expectedGCT,
                actualGCT,
                hasGCT
            };
        } catch (error) {
            console.error('Error validating GCT calculation:', error);
            throw error;
        }
    }

    /**
     * Clicks the Premium type link in the Payments & Other Transactions table
     * @param rowIndex - Optional row index (0-based). If not provided, finds the first row with Premium type
     * @returns Promise<boolean> - Returns true if Premium link was found and clicked successfully
     */
    async clickPremiumType(rowIndex?: number): Promise<boolean> {
        try {
            // Wait for the transactions table to be visible
            await this.paymentAndTransactionsTable.waitFor({ state: 'visible', timeout: 10000 });
            await waitForBarbadosLoadingSpinner(this);
            await this.paymentAndTransactionsTable.scrollIntoViewIfNeeded();

            let premiumLink: Locator | null = null;

            if (rowIndex !== undefined) {
                // Click Premium link in the specified row
                const row = this.paymentAndTransactionsTable.locator('tbody tr').nth(rowIndex);
                premiumLink = row.locator('td').nth(3).locator('a').filter({ hasText: 'Premium' });
            } else {
                // Find the first row containing Premium in the Type column (4th column, index 3)
                const rows = this.paymentAndTransactionsTable.locator('tbody tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const typeCell = row.locator('td').nth(3);
                    const link = typeCell.locator('a').filter({ hasText: 'Premium' });
                    const linkExists = await link.count() > 0;

                    if (linkExists) {
                        premiumLink = link;
                        break;
                    }
                }
            }

            // Check if the Premium link exists
            if (!premiumLink || (await premiumLink.count()) === 0) {                return false;
            }

            await premiumLink.click();
            await waitForBarbadosLoadingSpinner(this);

            return true;
        } catch (error) {
            console.error('Error clicking Premium type link:', error);
            return false;
        }
    }

    /**
     * Clicks the "Other Transactions" button to open the Other Transactions form
     */
    async clickOtherTransactions(): Promise<void> {
        await this.otherTransactionButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Selects a transaction type in the Other Transactions form
     * @param transactionType - The transaction type value (e.g., 'fee', 'adjustment', 'retention', 'discount')
     */
    async selectOtherTransactionType(transactionType: string): Promise<void> {
        await this.otherTxTransactionTypeDropdown.selectOption({ value: transactionType });
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Selects a transaction subtype in the Other Transactions form
     * @param subtype - The transaction subtype value (e.g., 'GCT', 'LateFee', etc.)
     */
    async selectOtherTransactionSubtype(subtype: string): Promise<void> {
        await this.otherTxTransactionSubtypeDropdown.selectOption({ value: subtype });
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Checks if a specific transaction subtype is available in the dropdown
     * @param subtype - The transaction subtype value to check (e.g., 'GCT')
     * @returns Promise<boolean> - Returns true if the subtype is available
     */
    async isTransactionSubtypeAvailable(subtype: string): Promise<boolean> {
        try {
            const options = await this.otherTxTransactionSubtypeDropdown.locator('option').all();
            for (const option of options) {
                const value = await option.getAttribute('value');
                if (value === subtype) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error checking if transaction subtype is available:', error);
            return false;
        }
    }

    /**
     * Gets the count of policies displayed in the allocations section
     * @returns Promise<number> - Returns the number of policy rows in the allocations table
     */
    async getPolicyAllocationCount(): Promise<number> {
        try {
            await this.otherTxPolicyAllocationResults.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
            const policyRows = this.otherTxPolicyAllocationResults.locator('table').first().locator('tbody tr');
            const count = await policyRows.count();
            return count;
        } catch (error) {
            // If the allocations section doesn't exist or is empty, return 0
            return 0;
        }
    }

    /**
     * Checks if any policies are displayed in the allocations section
     * @returns Promise<boolean> - Returns true if at least one policy number is displayed
     */
    async hasPolicyAllocations(): Promise<boolean> {
        const policyNumbers = await this.getPolicyNumbersFromAllocations();        return policyNumbers.length > 0;
    }

    /**
     * Gets policy numbers from the allocations section
     * @returns Promise<string[]> - Returns an array of policy numbers
     */
    async getPolicyNumbersFromAllocations(): Promise<string[]> {
        try {
            const policyNumbers: string[] = [];

            // Check if the allocations section exists (using count is safer than isVisible)
            const allocationsCount = await this.otherTxPolicyAllocationResults.count().catch(() => 0);
            if (allocationsCount === 0) {                return [];
            }

            // Get count safely
            const count = await this.getPolicyAllocationCount();
            if (count === 0) {                return [];
            }

            // Iterate through rows safely
            for (let i = 0; i < count; i++) {
                try {
                    const row = this.otherTxPolicyAllocationResults.locator('table').first().locator('tbody tr').nth(i);

                    // Check if row exists using count (safer than isVisible)
                    const rowCount = await row.count().catch(() => 0);
                    if (rowCount === 0) {                        continue;
                    }

                    // Policy # is in the 2nd column (index 1)
                    const policyCell = row.locator('td').nth(1);

                    // Check if cell exists
                    const cellCount = await policyCell.count().catch(() => 0);
                    if (cellCount === 0) {                        continue;
                    }

                    // Get text content safely
                    const policyText = await policyCell.textContent().catch(() => null);
                    if (policyText && policyText.trim()) {
                        policyNumbers.push(policyText.trim());
                    }
                } catch (rowError) {                    continue;
                }
            }

            return policyNumbers;
        } catch (error) {
            console.error('Error getting policy numbers from allocations:', error);
            return [];
        }
    }

    /**
     * Checks if a specific policy number appears in the allocations section
     * @param policyNumber - The policy number to search for (can be with or without 'P' prefix)
     * @returns Promise<boolean> - Returns true if the policy number is found
     */
    async isPolicyInAllocations(policyNumber: string): Promise<boolean> {
        await waitForBarbadosLoadingSpinner(this);
        let policyNumbers = await this.getPolicyNumbersFromAllocations();
        policyNumbers = policyNumbers.map(pn => pn.trim().toUpperCase());

        if (policyNumbers.length === 0) {            return false;
        }        // Normalize both the search term and the found policy numbers for comparison
        const normalizedSearch = policyNumber.trim().toUpperCase();
        return policyNumbers.some(pn => pn.trim().toUpperCase() === normalizedSearch);
    }

    /**
     * Cancels the Other Transactions form
     */
    async cancelOtherTransaction(): Promise<void> {
        await this.otherTxCancelButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async clickBillingAccount(index: number) {
        await this.page.waitForTimeout(3000); // Add a short wait to ensure the table is fully loaded before clicking
        const billingAccountLink = this.page.locator(`#billingAccountListForm\\:billing_account_list_table\\:${index}\\:policyNumber_`);
        await billingAccountLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openBillingAccountInNewTab(index: number) {
        const billingAccountLink = this.page.locator(`#billingAccountListForm\\:billing_account_list_table\\:${index}\\:policyNumber_`);
        return billingAccountLink.click({ button: 'middle' });
    }

    async selectBillingTaskAction(action: 'inquiry' | 'holdPolicies' | 'update' | 'refund' | 'movePolicies' | 'waiverOfPremium') {
        await this.billingTaskActionDropdown.selectOption({ value: action });
        await waitForBarbadosLoadingSpinner(this);
    }

    private getFieldLocator(fieldLabel: string): Locator {
        // Map field labels to their corresponding locators
        const fieldLocatorMappings: { [key: string]: Locator } = {
            'Billing Account Name': this.billingAccountNameField,
            'Bill Type': this.billTypeField,
            'Due Day Type': this.dueDayTypeField,
            'Billing Account Due Day': this.billingAccountDueDayField,
            'Billing Account Name Type': this.billingAccountNameTypeField,
            'Billing Contact Prefix': this.billingContactPrefixField,
            'Billing Contact First Name': this.billingContactFirstNameField,
            'Billing Contact Middle Name': this.billingContactMiddleNameField,
            'Billing Contact Last Name': this.billingContactLastNameField,
            // Some flows render these on `updateForm` (billing inquiry/update) and others on `purchaseForm`.
            // Use a combined locator to avoid breaking callers across screens.
            'Identification Number': this.page
                .locator(
                    '#updateForm\\:billingAccount_billingAccountDetails_customerIdNumber, #purchaseForm\\:billingAccount_billingAccountDetails_customerIdNumber'
                )
                .first(),
            'TRN': this.page
                .locator(
                    '#updateForm\\:billingAccount_billingAccountDetails_customerTrn, #purchaseForm\\:billingAccount_billingAccountDetails_customerTrn'
                )
                .first(),
            'Country': this.countryField,
            'Zip / Postal Code': this.zipPostalCodeField,
            'Address Line 1': this.addressLine1Field,
            'Address Line 2': this.addressLine2Field,
            'Address Line 3': this.addressLine3Field,
            'City': this.cityField,
            'State / Province': this.stateProvinceField,
            'Parish': this.parishField,
            'District': this.districtField,
            'Phone #': this.phoneField,
            'Email': this.emailField,
            'Branch': this.branchField,
            'Payment Type': this.paymentTypeField,
            'Payment Amount': this.paymentAmountField,
            'Cheque Date': this.chequeDateField,
            'Cheque Number': this.chequeNumberField,
            'Customer ID Number': this.customerIdNumberField,
            'Refund Reason': this.refundReasonField
        };

        return fieldLocatorMappings[fieldLabel] || this.page.locator(`label:has-text("${fieldLabel}")`).first();
    }

    async getFormField(fieldLabel: string): Promise<string> {
        const fieldInput = this.getFieldLocator(fieldLabel);
        return await fieldInput.inputValue();
    }

    async updateFormField(fieldLabel: string, value: string) {
        const fieldInput = this.getFieldLocator(fieldLabel);

        // Check if it's a select field or input field
        const tagName = await fieldInput.evaluate(el => el.tagName.toLowerCase());

        if (tagName === 'select') {
            await fieldInput.selectOption({ label: value });
        } else {
            await fieldInput.clear();
            await fieldInput.fill(value);
        }

        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyFormField(fieldLabel: string, options: {
        isRequired?: boolean;
        expectedValue?: string;
    }) {
        const fieldInput = this.getFieldLocator(fieldLabel);

        if (options.isRequired !== undefined) {
            // Anchor to the specific input's closest row to avoid strict-mode violations
            const fieldRow = fieldInput.locator('xpath=ancestor::tr[1]');

            const ariaRequired = await fieldInput.getAttribute('aria-required');
            const inputHasRequiredClass = (await fieldInput.getAttribute('class'))?.includes('required');
            const rowHasRequiredClasses = (await fieldRow.getAttribute('class'))?.includes('required');

            const isRequired = ariaRequired === 'true' || inputHasRequiredClass || rowHasRequiredClasses;

            if (options.isRequired) {
                expect(isRequired).toBeTruthy();
            } else {
                expect(isRequired).toBeFalsy();
            }
        }

        if (options.expectedValue !== undefined) {
            await expect(fieldInput).toHaveValue(options.expectedValue);
        }
    }

    async setChequeDate(date: string) {
        await this.chequeDateField.clear();
        await this.chequeDateField.fill(date);
        await this.chequeDateField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
    }

    async clickLatestRefundTransaction() {
        const refundRows = this.billingTransactionsTable.locator('tbody tr').filter({
            hasText: 'Refund'
        });

        const latestRefundRow = refundRows.first();
        const refundLink = latestRefundRow.locator('a:has-text("Refund")');

        await refundLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async clickRefundTransactionByIndex(index: number) {
        const refundLink = this.billingTransactionsTable.locator(`tbody tr:nth-child(${index + 1}) a:has-text("Refund")`);
        await refundLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyCustomerId(expectedValue: string, options?: { isRequired?: boolean }) {
        await expect(this.customerIdNumberField).toHaveValue(expectedValue);

        if (options?.isRequired !== undefined) {
            const ariaRequired = await this.customerIdNumberField.getAttribute('aria-required');
            const hasRequiredClass = (await this.customerIdNumberField.getAttribute('class'))?.includes('required');

            const isRequired = ariaRequired === 'true' || hasRequiredClass;

            if (options.isRequired) {
                expect(isRequired).toBeTruthy();
            } else {
                expect(isRequired).toBeFalsy();
            }
        }
    }

    async updateCustomerId(value: string) {
        await this.customerIdNumberField.clear();
        await this.customerIdNumberField.fill(value);
        await waitForBarbadosLoadingSpinner(this);
    }

    async save() {
        await this.saveButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async clickOk() {
        await this.okButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async cancel() {
        // Navigate back to billing accounts list using the billing tab
        await this.billingMenuItem.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Validates that the bank name dropdown contains the expected banks
     * @param expectedBanks - Array of expected bank codes and names
     * @returns Promise<{isValid: boolean, missingBanks: string[], extraBanks: string[]}>
     */
    async validateBankNames(expectedBanks: Array<{ code: string, name: string }>): Promise<{
        isValid: boolean;
        missingBanks: string[];
        extraBanks: string[];
        foundBanks: Array<{ code: string, name: string }>;
    }> {
        await this.eftBankNameDropdown.waitFor({ state: 'visible', timeout: 10000 });

        // Get all options from the dropdown
        const options = await this.eftBankNameDropdown.locator('option').all();
        const foundBanks: Array<{ code: string, name: string }> = [];

        for (const option of options) {
            const value = await option.getAttribute('value');
            const text = await option.textContent();
            if (value && value !== '') {
                foundBanks.push({ code: value, name: text?.trim() || '' });
            }
        }

        // Find missing and extra banks
        const expectedCodes = new Set(expectedBanks.map(b => b.code));
        const foundCodes = new Set(foundBanks.map(b => b.code));

        const missingBanks = expectedBanks
            .filter(b => !foundCodes.has(b.code))
            .map(b => `${b.code} - ${b.name}`);

        const extraBanks = foundBanks
            .filter(b => !expectedCodes.has(b.code))
            .map(b => `${b.code} - ${b.name}`);

        // Validate that each found bank matches the expected name
        let allNamesMatch = true;
        for (const expectedBank of expectedBanks) {
            const foundBank = foundBanks.find(b => b.code === expectedBank.code);
            if (foundBank && foundBank.name !== expectedBank.name) {
                allNamesMatch = false;            }
        }

        const isValid = missingBanks.length === 0 && extraBanks.length === 0 && allNamesMatch;

        return {
            isValid,
            missingBanks,
            extraBanks,
            foundBanks
        };
    }

    /**
     * Validates that the branch name dropdown contains the expected branches for a given bank
     * @param bankCode - The bank code to validate branches for
     * @param expectedBranches - Array of expected branch codes and names
     * @returns Promise<{isValid: boolean, missingBranches: string[], extraBranches: string[]}>
     */
    async validateBranchNames(bankCode: string, expectedBranches: Array<{ code: string, name: string }>): Promise<{
        isValid: boolean;
        missingBranches: string[];
        extraBranches: string[];
        foundBranches: Array<{ code: string, name: string }>;
    }> {
        // First select the bank to populate branches
        await this.eftBankNameDropdown.selectOption({ value: bankCode });
        await waitForBarbadosLoadingSpinner(this);

        await this.eftBranchNameDropdown.waitFor({ state: 'visible', timeout: 10000 });

        // Get all options from the dropdown
        const options = await this.eftBranchNameDropdown.locator('option').all();
        const foundBranches: Array<{ code: string, name: string }> = [];

        for (const option of options) {
            const value = await option.getAttribute('value');
            const text = await option.textContent();
            if (value && value !== '') {
                foundBranches.push({ code: value, name: text?.trim() || '' });
            }
        }

        // Find missing and extra branches
        const expectedCodes = new Set(expectedBranches.map(b => b.code));
        const foundCodes = new Set(foundBranches.map(b => b.code));

        const missingBranches = expectedBranches
            .filter(b => !foundCodes.has(b.code))
            .map(b => `${b.code} - ${b.name}`);

        const extraBranches = foundBranches
            .filter(b => !expectedCodes.has(b.code))
            .map(b => `${b.code} - ${b.name}`);

        // Validate that each found branch matches the expected name
        let allNamesMatch = true;
        for (const expectedBranch of expectedBranches) {
            const foundBranch = foundBranches.find(b => b.code === expectedBranch.code);
            if (foundBranch && foundBranch.name.toUpperCase() !== expectedBranch.name.toUpperCase()) {
                allNamesMatch = false;            }
        }

        const isValid = missingBranches.length === 0 && extraBranches.length === 0 && allNamesMatch;

        return {
            isValid,
            missingBranches,
            extraBranches,
            foundBranches
        };
    }

    /**
     * Gets randomly selected branches that have routing numbers
     * @param count - Number of branches to select (default: 5)
     * @returns Array of branch objects with bankCode, branchCode, and routingNumber
     */
    getRandomBranchesWithRoutingNumbers(count: number = 5): Array<{ bankCode: string; branchCode: string; routingNumber: string }> {
        // Collect all branches that have routing numbers
        const branchesWithRoutingNumbers: Array<{ bankCode: string; branchCode: string; routingNumber: string }> = [];
        for (const bank of jamaicaBanks) {
            for (const branch of bank.branches) {
                if (branch.routingNumber) {
                    branchesWithRoutingNumbers.push({
                        bankCode: bank.code,
                        branchCode: branch.code,
                        routingNumber: branch.routingNumber
                    });
                }
            }
        }

        // Randomly select specified number of branches from those with routing numbers
        const shuffled = branchesWithRoutingNumbers.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, branchesWithRoutingNumbers.length));
    }

    /**
     * Gets the count of payment methods in the payment method list table
     * @returns Promise<number> - Returns the number of payment methods in the table
     */
    async getPaymentMethodCount(): Promise<number> {
        try {
            await this.paymentMethodListTable.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
            const rows = this.paymentMethodListTable.locator('tbody tr');
            const count = await rows.count();
            return count;
        } catch (error) {
            console.error('Error getting payment method count:', error);
            return 0;
        }
    }

    /**
     * Gets the View button locator for a specific payment method row
     * @param rowIndex - The row index (0-based)
     * @returns Locator for the View button
     */
    getPaymentMethodViewButton(rowIndex: number): Locator {
        return this.paymentMethodListTable.locator(`tbody tr[data-ri="${rowIndex}"] a[id$=":paymentMethodViewLink"]`);
    }

    /**
     * Gets the Edit button locator for a specific payment method row
     * @param rowIndex - The row index (0-based)
     * @returns Locator for the Edit button
     */
    getPaymentMethodEditButton(rowIndex: number): Locator {
        return this.paymentMethodListTable.locator(`tbody tr[data-ri="${rowIndex}"] a[id$=":paymentMethodEditLink"]`);
    }

    /**
     * Gets the Delete button locator for a specific payment method row
     * @param rowIndex - The row index (0-based)
     * @returns Locator for the Delete button
     */
    getPaymentMethodDeleteButton(rowIndex: number): Locator {
        return this.paymentMethodListTable.locator(`tbody tr[data-ri="${rowIndex}"] a[id$=":paymentMethodDeleteLink"]`);
    }

    /**
     * Clicks the View button for a specific payment method row
     * @param rowIndex - The row index (0-based)
     */
    async clickPaymentMethodView(rowIndex: number): Promise<void> {
        const viewButton = this.getPaymentMethodViewButton(rowIndex);
        await viewButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Clicks the Edit button for a specific payment method row
     * @param rowIndex - The row index (0-based)
     */
    async clickPaymentMethodEdit(rowIndex: number): Promise<void> {
        const editButton = this.getPaymentMethodEditButton(rowIndex);
        await editButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Clicks the Delete button for a specific payment method row
     * @param rowIndex - The row index (0-based)
     */
    async clickPaymentMethodDelete(rowIndex: number): Promise<void> {
        const deleteButton = this.getPaymentMethodDeleteButton(rowIndex);
        await deleteButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    /**
     * Validates that all payment method fields are not editable in view mode
     * Validates: bank name, branch name, routing number, account number, and bank account type
     */
    async validatePaymentMethodViewMode(): Promise<void> {
        // Validate that bank name dropdown is not editable (disabled)
        const bankNameDisabled = await this.eftBankNameDropdown.isDisabled();
        expect(bankNameDisabled).toBe(true);

        // Validate that branch name dropdown is not editable (disabled)
        const branchNameDisabled = await this.eftBranchNameDropdown.isDisabled();
        expect(branchNameDisabled).toBe(true);

        // Validate that routing number field is not editable
        const routingNumberDisabled = await this.eftRoutingNumberField.isDisabled();
        const routingNumberReadonly = await this.eftRoutingNumberField.getAttribute('readonly');
        const routingNumberNonEditable = routingNumberDisabled || routingNumberReadonly === 'readonly' || routingNumberReadonly === '';
        expect(routingNumberNonEditable).toBe(true);

        // Validate that account number field is not editable
        const accountNumberDisabled = await this.eftAccountNumberField.isDisabled();
        const accountNumberReadonly = await this.eftAccountNumberField.getAttribute('readonly');
        const accountNumberNonEditable = accountNumberDisabled || accountNumberReadonly === 'readonly' || accountNumberReadonly === '';
        expect(accountNumberNonEditable).toBe(true);

        // Validate that bank account type dropdown is not editable (disabled)
        const bankAccountTypeDisabled = await this.eftBankAccountTypeDropdown.isDisabled();
        expect(bankAccountTypeDisabled).toBe(true);
    }

    /**
     * Validates that payment method fields are editable in edit mode
     * Validates: bank name, branch name, account number, and bank account type are editable
     * Validates: routing number remains non-editable (disabled or readonly)
     */
    async validatePaymentMethodEditMode(): Promise<void> {
        // Validate that bank name dropdown is editable (not disabled)
        const bankNameEditable = await this.eftBankNameDropdown.isEnabled();
        expect(bankNameEditable).toBe(true);

        // Validate that branch name dropdown is editable (not disabled)
        const branchNameEditable = await this.eftBranchNameDropdown.isEnabled();
        expect(branchNameEditable).toBe(true);

        // Validate that routing number field is still not editable (disabled or readonly)
        const routingNumberDisabledEdit = await this.eftRoutingNumberField.isDisabled();
        const routingNumberReadonlyEdit = await this.eftRoutingNumberField.getAttribute('readonly');
        // The field should be either disabled or readonly
        const routingNumberNonEditableEdit = routingNumberDisabledEdit || routingNumberReadonlyEdit === 'readonly' || routingNumberReadonlyEdit === '';
        expect(routingNumberNonEditableEdit).toBe(true);

        // Validate that account number field is editable
        const accountNumberEditable = await this.eftAccountNumberField.isEnabled();
        const accountNumberReadonlyEdit = await this.eftAccountNumberField.getAttribute('readonly');
        // Field should be enabled and not readonly
        expect(accountNumberEditable).toBe(true);
        expect(accountNumberReadonlyEdit).toBeNull();

        // Validate that bank account type dropdown is editable (not disabled)
        const bankAccountTypeEditable = await this.eftBankAccountTypeDropdown.isEnabled();
        expect(bankAccountTypeEditable).toBe(true);
    }
}
