import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export type RiskAddressDetails = {
    addressLine1: string;
    countryCd?: string;
    parishCd?: string;
    numberOfStories?: string;
    yearBuilt: string;
    constructionTypeCd?: string;
    roofType?: string;
    ownership?: string;
    occupancyType?: string;
    renovatedLastFiveYears?: 'Yes' | 'No';
};
export type CoveragePremiumDetails = {
    coverageALimitAmount?: string;
    coverageBLimitAmount?: string;
};
export type PremiumSummary = {
    coverageTermPremium: string;
    formsTermPremium: string;
    actualPremium: string;
    adjustedPremium: string;
    taxes: string;
    fees: string;
    billablePremium: string;
    apRp: string;
    calculatedCommission: string;
};
export type FundingSummaryDetails = Record<string, string>;

export type OverviewFieldAssertions = Record<string, string | RegExp>;

export type MainCoverageLimitAssertions = {
    dwellingLimitAmount: string;
    otherStructuresLimitAmount: string;
};

export type HomeEndorsementDetails = CoveragePremiumDetails & {
    endorsementReason?: string;
    billingAccountName: string;
    city?: string;
};

export class HomePolicyPage extends BasePage {
    readonly riskCountryCd: Locator;
    readonly riskAddressLine1: Locator;
    readonly riskParishCd: Locator;
    readonly numberOfStories: Locator;
    readonly yearBuilt: Locator;
    readonly constructionTypeCd: Locator;
    readonly roofType: Locator;
    readonly owned: Locator;
    readonly occupancyType: Locator;
    readonly renovatedYes: Locator;
    readonly renovatedNo: Locator;

    readonly coveragesPremiumTab: Locator;
    readonly coverageALimitAmount: Locator;
    readonly coverageBLimitAmount: Locator;
    readonly calculatePremiumButton: Locator;
    readonly premiumTotalRow: Locator;


    readonly fundingSummaryTab: Locator;
    readonly fundingSummaryRows: Locator;


    readonly purchaseButton: Locator;
    readonly purchaseConfirmYesButton: Locator;
    readonly endorsementOkButton: Locator;
    readonly policyStatusText: Locator;
    readonly nextFooterButton: Locator;

    readonly policyNumberOverviewLink: Locator;
    readonly componentContextHolder: Locator;
    readonly dwellingLimitAmountOverview: Locator;
    readonly otherStructuresLimitAmountOverview: Locator;

    constructor(page: Page) {
        super(page);

        this.riskCountryCd = page.locator('select[name="policyDataGatherForm:sedit_PreconfigHomeAddress_address_countryCd"]');
        this.riskAddressLine1 = page.locator('input[name="policyDataGatherForm:sedit_PreconfigHomeAddress_address_addressLine1"]');
        this.riskParishCd = page.locator('select[name="policyDataGatherForm:sedit_PreconfigHomeAddress_address_addressExtension_parishCd"]');
        this.numberOfStories = page.locator('select[name="policyDataGatherForm:sedit_PreconfigConstructionInfo_numberOfStories"]');
        this.yearBuilt = page.locator('input[name="policyDataGatherForm:sedit_PreconfigConstructionInfo_yearBuilt"]');
        this.constructionTypeCd = page.locator('select[name="policyDataGatherForm:sedit_PreconfigConstructionInfo_constructionTypeCd"]');
        this.roofType = page.locator('select[name="policyDataGatherForm:sedit_PreconfigConstructionInfo_roofType"]');
        this.owned = page.locator('select[name="policyDataGatherForm:sedit_PreconfigConstructionInfo_owned"]');
        this.occupancyType = page.locator('select[name="policyDataGatherForm:sedit_PreconfigOccupancyTypeQuestionAnswer_otherAnswer"]');
        this.renovatedYes = page.locator('input[name="policyDataGatherForm:sedit_PreconfigFiveYearsPropertyRenovatedQuestionAnswer_yesNoAnswer"][value="true"]');
        this.renovatedNo = page.locator('input[name="policyDataGatherForm:sedit_PreconfigFiveYearsPropertyRenovatedQuestionAnswer_yesNoAnswer"][value="false"]');

        this.coveragesPremiumTab = page.locator('#policyDataGatherForm\\:tabListList_1\\:6\\:link');
        this.coverageALimitAmount = page.locator('input[name="policyDataGatherForm:QuoteVariation_PreconfigPreCovA_limitAmount_attributes_PreconfigPreCovA_limitAmount_limitAmount"]');
        this.coverageBLimitAmount = page.locator('input[name="policyDataGatherForm:QuoteVariation_PreconfigPreCovB_limitAmount_attributes_PreconfigPreCovB_limitAmount_limitAmount"]');
        this.calculatePremiumButton = page.locator('input[name="policyDataGatherForm:processPolicyActionButton_PreconfigPremiumCalculationAction"]');
        this.premiumTotalRow = page
            .locator('#policyDataGatherForm\\:riskItemPremiumInfoTable tfoot tr.rf-dt-ftr')
            .filter({ hasText: 'Total' });



        this.fundingSummaryTab = page.locator(
            '#policyDataGatherForm\\:tabListList_1\\:10\\:link'
        );

        this.fundingSummaryRows = page.locator(
            'tr[id^="policyDataGatherForm:formGrid_PolicyPaymentPlan-"]'
        );

        this.purchaseButton = page.locator(
            '#policyDataGatherForm\\:purchaseQuote_footer'
        );

        this.purchaseConfirmYesButton = page.locator(
            '#policyDataGatherForm\\:okBtn'
        );

        this.endorsementOkButton = page.locator(
            '#policyDataGatherForm\\:yesBtn_PolicyEndorseAction_footer, #headerForm input[value="OK"][type="submit"]'
        );

        this.policyStatusText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        );

        this.nextFooterButton = page.locator(
            '#policyDataGatherForm\\:next_footer'
        );

        this.policyNumberOverviewLink = page.locator(
            'a[id^="productConsolidatedViewForm:scolumn_Policy:"][id$=":policyNumber_navigationLink"]'
        );

        this.componentContextHolder = page.locator(
            '#policyDataGatherForm\\:componentContextHolder'
        );

        this.dwellingLimitAmountOverview = page.locator(
            '#policyDataGatherForm\\:QuoteVariation_PreconfigPreCovA_limitAmount_attributes_PreconfigPreCovA_limitAmount_limitAmount'
        );

        this.otherStructuresLimitAmountOverview = page.locator(
            '#policyDataGatherForm\\:QuoteVariation_PreconfigPreCovB_limitAmount_attributes_PreconfigPreCovB_limitAmount_limitAmount'
        );
    }

    async selectOptionAndWait(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.selectOption(value);
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillInputAndWait(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
        await locator.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillRiskAddressSection(details: RiskAddressDetails): Promise<void> {
        const countryCd = details.countryCd ?? 'BB';
        const parishCd =
            details.parishCd ?? (countryCd === 'JM' ? 'JM-01' : 'BB-08');

        await this.selectOptionAndWait(this.riskCountryCd, countryCd);

        await this.fillInputAndWait(this.riskAddressLine1, details.addressLine1);

        await this.selectOptionAndWait(this.riskParishCd, parishCd);
        await this.selectOptionAndWait(this.numberOfStories, details.numberOfStories ?? '01'); // 1

        await this.fillInputAndWait(this.yearBuilt, details.yearBuilt);

        await this.selectOptionAndWait(this.constructionTypeCd, details.constructionTypeCd ?? 'CONBL'); // Concrete Block
        await this.selectOptionAndWait(this.roofType, details.roofType ?? 'ROOF017'); // Concrete Shingle
        await this.selectOptionAndWait(this.owned, details.ownership ?? 'Owned');
        await this.selectOptionAndWait(this.occupancyType, details.occupancyType ?? 'REG'); // Regular

        if (details.renovatedLastFiveYears === 'Yes') {
            await this.renovatedYes.check();
        } else {
            await this.renovatedNo.check();
        }

        await waitForBarbadosLoadingSpinner(this);
    }

    private async getCellText(row: Locator, index: number): Promise<string> {
        return (await row.locator('td').nth(index).innerText()).trim();
    }

    async openCoveragesAndPremiumTab(): Promise<void> {
        await this.coveragesPremiumTab.waitFor({ state: 'visible' });
        await this.coveragesPremiumTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillCoverageLimits(details: CoveragePremiumDetails): Promise<void> {
        await this.fillInputAndWait(
            this.coverageALimitAmount,
            details.coverageALimitAmount ?? '100000'
        );

        await this.fillInputAndWait(
            this.coverageBLimitAmount,
            details.coverageBLimitAmount ?? '100000'
        );
    }

    async calculatePremium(): Promise<void> {
        await this.calculatePremiumButton.waitFor({ state: 'visible' });
        await this.calculatePremiumButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async getPremiumSummary(): Promise<PremiumSummary> {
        await this.premiumTotalRow.waitFor({ state: 'visible' });

        const premiumSummary: PremiumSummary = {
            coverageTermPremium: await this.getCellText(this.premiumTotalRow, 1),
            formsTermPremium: await this.getCellText(this.premiumTotalRow, 2),
            actualPremium: await this.getCellText(this.premiumTotalRow, 3),
            adjustedPremium: await this.getCellText(this.premiumTotalRow, 4),
            taxes: await this.getCellText(this.premiumTotalRow, 5),
            fees: await this.getCellText(this.premiumTotalRow, 6),
            billablePremium: await this.getCellText(this.premiumTotalRow, 7),
            apRp: await this.getCellText(this.premiumTotalRow, 8),
            calculatedCommission: await this.getCellText(this.premiumTotalRow, 9)
        };        return premiumSummary;
    }

    async fillCoverageAndPremiumSection(
        details: CoveragePremiumDetails = {}
    ): Promise<PremiumSummary> {
        await this.openCoveragesAndPremiumTab();
        await this.fillCoverageLimits(details);
        await this.calculatePremium();

        return await this.getPremiumSummary();
    }

    async openFundingSummaryTab(): Promise<void> {
        await this.fundingSummaryTab.waitFor({ state: 'visible' });
        await this.fundingSummaryTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async getFundingSummaryDetails(): Promise<FundingSummaryDetails> {
        await this.fundingSummaryRows.first().waitFor({ state: 'visible' });

        const fundingSummary = await this.fundingSummaryRows.evaluateAll((rows) => {
            const summary: Record<string, string> = {};

            rows.forEach((row) => {
                if (row.classList.contains('hidden')) {
                    return;
                }

                const label = row
                    .querySelector('td.pfFormLabel label')
                    ?.textContent
                    ?.trim();

                const control = row.querySelector(
                    'td.pfFormControl input, td.pfFormControl select, td.pfFormControl textarea'
                ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

                if (!label || !control) {
                    return;
                }

                let value = '';

                if (control instanceof HTMLSelectElement) {
                    value = control.selectedOptions[0]?.textContent?.trim() ?? control.value;
                } else {
                    value = control.value?.trim() ?? '';
                }

                summary[label] = value;
            });

            return summary;
        });        return fundingSummary;
    }

    async openAndPrintFundingSummary(): Promise<FundingSummaryDetails> {
        await this.openFundingSummaryTab();
        return await this.getFundingSummaryDetails();
    }

    async purchasePolicy(): Promise<void> {
        await this.purchaseButton.waitFor({ state: 'visible' });
        await this.purchaseButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.purchaseConfirmYesButton.waitFor({ state: 'visible' });
        await this.purchaseConfirmYesButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async startHomePolicyEndorsement(
        endorsementReason = 'Increasing risk sum insured/limit'
    ): Promise<void> {
        await this.takeActionDropdown.waitFor({ state: 'visible' });
        await this.takeActionDropdown
            .selectOption('endorseWithWorkspace')
            .catch(async () => {
                await this.takeActionDropdown.selectOption({ label: 'Endorse' });
            });
        await waitForBarbadosLoadingSpinner(this);

        const endorsementDate = new Date().toLocaleDateString('en-GB');
        await this.endorsementDateField.waitFor({ state: 'visible' });
        await this.fillInputAndWait(this.endorsementDateField, endorsementDate);

        await this.endorsementReasonField.waitFor({ state: 'visible' });
        await this.endorsementReasonField
            .selectOption({ label: endorsementReason })
            .catch(async () => {
                await this.endorsementReasonField.selectOption(
                    'PROP_INCREASERISKSUM'
                );
            });
        await waitForBarbadosLoadingSpinner(this);

        await this.endorsementOkButton.first().waitFor({ state: 'visible' });
        await this.endorsementOkButton.first().click();
        await waitForBarbadosLoadingSpinner(this);

        const confirmVisible = await this.endorsementConfirmationOkButton
            .isVisible({ timeout: 10_000 })
            .catch(() => false);

        if (confirmVisible) {
            await this.endorsementConfirmationOkButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    async purchaseAndFinishEndorsement(
        billingAccountName: string,
        city = 'Test City'
    ): Promise<void> {
        void billingAccountName;
        void city;

        await this.purchasePolicy();

        const paymentFormVisible = await this.remainingMinRequiredValue
            .isVisible({ timeout: 15_000 })
            .catch(() => false);

        if (paymentFormVisible) {
            const remainingBalanceText =
                (await this.remainingMinRequiredValue.textContent()) || '';
            const cashAmount = remainingBalanceText
                .replace(/[^\d.-]/g, '')
                .trim() || '0';

            await this.cashAmountField.waitFor({ state: 'visible' });
            await this.cashAmountField.fill(cashAmount);
            await this.page.keyboard.press('Enter');
            await waitForBarbadosLoadingSpinner(this);

            await this.page.waitForFunction(
                (selector) => {
                    const balanceText =
                        document.querySelector(selector)?.textContent || '';
                    const balanceAmount =
                        balanceText.replace(/[^\d.-]/g, '').trim() || '0';

                    return Number(balanceAmount) === 0;
                },
                '#purchaseForm\\:downpaymentComponent_remainingBalanceValue'
            );

            await this.finishButton.click();
            await waitForBarbadosLoadingSpinner(this);
            return;
        }

        const finishVisible = await this.finishButton
            .isVisible({ timeout: 15_000 })
            .catch(() => false);

        if (finishVisible) {
            await this.finishButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    async completeHomePolicyEndorsement(
        details: HomeEndorsementDetails
    ): Promise<PremiumSummary> {
        await this.startHomePolicyEndorsement(details.endorsementReason);

        const premiumSummary = await this.fillCoverageAndPremiumSection({
            coverageALimitAmount: details.coverageALimitAmount,
            coverageBLimitAmount: details.coverageBLimitAmount
        });

        await this.openAndPrintFundingSummary();
        await this.nextFooterButton.waitFor({ state: 'visible' });
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.purchaseAndFinishEndorsement(
            details.billingAccountName,
            details.city
        );

        await expect(this.policyStatusText).toHaveText(/Policy Active|Policy Pending/);

        return premiumSummary;
    }

    async clickPolicyNumber(policyNumber: string): Promise<void> {
        const policyNumberLink = this.policyNumberOverviewLink
            .filter({ hasText: policyNumber })
            .first();

        await policyNumberLink.waitFor({ state: 'visible' });
        await policyNumberLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async getCurrentOverviewFieldValues(): Promise<Record<string, string>> {
        await this.componentContextHolder.waitFor({ state: 'visible' });

        const fieldValues = await this.componentContextHolder
            .locator('tr')
            .evaluateAll((rows) => {
                const isVisible = (element: Element): boolean => {
                    const htmlElement = element as HTMLElement;
                    const style = window.getComputedStyle(htmlElement);

                    return (
                        style.display !== 'none' &&
                        style.visibility !== 'hidden' &&
                        !htmlElement.classList.contains('hidden')
                    );
                };

                const values: Record<string, string> = {};

                rows.forEach((row) => {
                    if (!isVisible(row)) {
                        return;
                    }

                    const label = row
                        .querySelector('td.pfFormLabel label')
                        ?.textContent
                        ?.replace(/\s+/g, ' ')
                        .trim();

                    const control = row.querySelector('td.pfFormControl');

                    if (!label || !control) {
                        return;
                    }

                    let controlElements = Array.from(
                        control.querySelectorAll(
                            'input, select, textarea, span.inquiry-inp, span.output'
                        )
                    ).filter(isVisible);

                    if (controlElements.length === 0) {
                        controlElements = Array.from(
                            control.querySelectorAll('span')
                        ).filter((element) => {
                            const htmlElement = element as HTMLElement;

                            return (
                                isVisible(element) &&
                                !htmlElement.classList.contains('ui-state-disabled') &&
                                !htmlElement.id.includes('changeAgencyLink') &&
                                !htmlElement.id.includes('_error') &&
                                !htmlElement.id.includes('_warning')
                            );
                        });
                    }

                    const controlValue = controlElements
                        .map((element) => {
                            const tagName = element.tagName.toLowerCase();

                            if (tagName === 'select') {
                                const select = element as HTMLSelectElement;
                                return select.selectedOptions[0]?.textContent?.trim() || select.value;
                            }

                            if (tagName === 'input' || tagName === 'textarea') {
                                const input = element as HTMLInputElement | HTMLTextAreaElement;
                                const inputType = (input as HTMLInputElement).type;

                                if (['hidden', 'submit', 'button'].includes(inputType)) {
                                    return '';
                                }

                                return input.value?.trim() ?? '';
                            }

                            return element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
                        })
                        .filter(Boolean)
                        .join(' ')
                        .trim();

                    values[label] = controlValue;
                });

                return values;
            });        return fieldValues;
    }

    async assertCurrentOverviewFieldValues(
        expectedValues: OverviewFieldAssertions
    ): Promise<Record<string, string>> {
        const actualValues = await this.getCurrentOverviewFieldValues();
        
        for (const [label, expectedValue] of Object.entries(expectedValues)) {
            const actualValue = actualValues[label];

            expect.soft(actualValue, `Missing overview field: ${label}`).not.toBeUndefined();

            if (actualValue === undefined) {
                continue;
            }

            if (expectedValue instanceof RegExp) {
                expect.soft(actualValue, `Incorrect value for ${label}`).toMatch(expectedValue);
            } else {
                expect.soft(actualValue, `Incorrect value for ${label}`).toBe(expectedValue);
            }
        }

        return actualValues;
    }

    async assertPremiumSummaryValues(
        expectedValues: Partial<PremiumSummary>
    ): Promise<PremiumSummary> {
        const actualPremiumSummary = await this.getPremiumSummary();

        for (const [key, expectedValue] of Object.entries(expectedValues)) {
            expect
                .soft(
                    actualPremiumSummary[key as keyof PremiumSummary],
                    `Incorrect premium summary value for ${key}`
                )
                .toBe(expectedValue);
        }

        return actualPremiumSummary;
    }

    async assertMainCoverageLimitValues(
        expectedValues: MainCoverageLimitAssertions
    ): Promise<void> {
        await expect(this.dwellingLimitAmountOverview).toHaveText(
            expectedValues.dwellingLimitAmount
        );

        await expect(this.otherStructuresLimitAmountOverview).toHaveText(
            expectedValues.otherStructuresLimitAmount
        );
    }
}
