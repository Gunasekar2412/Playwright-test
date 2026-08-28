import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export type RenewalPolicyDetails = {
    policyNumber: string;
    productName: string;
    status: string;
    effectiveDate: string;
    transEffectiveDate: string;
};

export class RenewalBatchPage extends BasePage {
    readonly adminLink: Locator;
    readonly mainLink: Locator;
    readonly schedulerLink: Locator;
    readonly policyNumberSearchField: Locator;
    readonly policyBatchGroupRow: Locator;
    readonly policyBatchGroupStartLink: Locator;
    readonly policySearchResultLink: Locator;
    readonly renewalButton: Locator;
    readonly renewalMoveToDropdown: Locator;
    readonly renewalMoveToGoButton: Locator;
    readonly policyNumberText: Locator;
    readonly productNameText: Locator;
    readonly policyStatusText: Locator;
    readonly effectiveDateText: Locator;
    readonly transEffectiveDateText: Locator;
    readonly dataGatherBannerItems: Locator;
    readonly calculatePremiumButton: Locator;
    readonly purchaseButton: Locator;
    readonly purchaseConfirmDialog: Locator;
    readonly purchaseConfirmYesButton: Locator;
    readonly finalPolicyStatusText: Locator;

    constructor(page: Page) {
        super(page);

        this.adminLink = page.getByRole('link', { name: 'Admin' });
        this.mainLink = page.getByRole('link', { name: 'Main', exact: true });
        this.schedulerLink = page.getByRole('link', {
            name: 'Scheduler',
            exact: true
        });
        this.policyNumberSearchField = page.locator(
            '#searchForm\\:searchFormME_policyNumber'
        );
        this.policyBatchGroupRow = page.locator('#jobs\\:jobsTable_data tr', {
            has: page.locator(
                'a[id^="jobs:jobsTable:"][id$=":name"][title="Policy Batch Group"]'
            )
        });
        this.policyBatchGroupStartLink = page.locator(
            '//a[@title="Policy Batch Group"]/ancestor::tr[1]//td[contains(@class, "width15proc")]//a[contains(@id, ":start-job") and normalize-space()="Start"]'
        );
        this.policySearchResultLink = page.locator(
            'a[id^="act-policies:act-policyList:"][id$=":act-selectPolicy"]'
        );
        this.renewalButton = page.locator('input[value="Renewals"]');
        this.renewalMoveToDropdown = page.locator(
            '#renewalForm\\:renewals_list_table\\:0\\:moveToDropdown'
        );
        this.renewalMoveToGoButton = page.locator(
            '#renewalForm\\:renewals_list_table\\:0\\:btnMoveTo'
        );
        this.policyNumberText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyNumTxt, #productContextInfoForm\\:title_policyNumTxt'
        );
        this.productNameText = page
            .locator(
                '#productContextInfoForm\\:policyDetail_productCdText, #productContextInfoForm\\:title_productCdTxt'
            )
            .or(page.getByText('Private Motor', { exact: true }).first())
            .or(page.getByText('Commercial (Preconfigured)', { exact: true }).first())
            .or(page.getByText('Home (Preconfigured)', { exact: true }).first());
        this.policyStatusText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        );
        this.effectiveDateText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText_policyEffectiveDate, #productContextInfoForm\\:policyDetail_policyEffectiveDate'
        );
        this.transEffectiveDateText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText_txEffectiveDate'
        );
        this.dataGatherBannerItems = page.locator(
            '.pf-datagather-banner-item'
        );
        this.calculatePremiumButton = page.locator(
            'input[value="Calculate Premium"]'
        );
        this.purchaseButton = page.locator(
            'form[id="headerForm"] input[value="Purchase"][type="submit"]'
        );
        this.purchaseConfirmDialog = page.locator(
            '#policyDataGatherForm\\:ConfirmDialog_container'
        );
        this.purchaseConfirmYesButton = page.getByRole('button', {
            name: 'Yes'
        });
        this.finalPolicyStatusText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        );
    }

    async switchToAdmin(): Promise<void> {
        await this.adminLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async switchToMain(): Promise<void> {
        await this.mainLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openScheduler(): Promise<void> {
        await this.schedulerLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async executePolicyBatchGroup(timeoutMs = 120_000): Promise<string> {
        await this.policyBatchGroupRow.waitFor({
            state: 'visible',
            timeout: 60_000
        });

        const previousRunText = await this.getPolicyBatchGroupLastRunText();
        const previousPassedCount = this.getPassedCount(previousRunText);
        await expect(this.policyBatchGroupStartLink).toHaveCount(1);
        await this.policyBatchGroupStartLink.scrollIntoViewIfNeeded();
        await this.policyBatchGroupStartLink.click();
        await waitForBarbadosLoadingSpinner(this);

        return await this.waitForPolicyBatchGroupPassed(
            previousRunText,
            previousPassedCount,
            timeoutMs
        );
    }

    async searchPolicy(policyNumber: string): Promise<void> {
        await this.quickSearchButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.policyNumberSearchField.waitFor({
            state: 'visible',
            timeout: 30_000
        });
        await this.policyNumberSearchField.clear();
        await this.policyNumberSearchField.fill(policyNumber);
        await this.policyNumberSearchField.press('Tab');
        await this.searchButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openPolicyFromSearchResults(policyNumber: string): Promise<void> {
        const policyLink = this.policySearchResultLink
            .filter({ hasText: policyNumber })
            .first();

        await policyLink.waitFor({ state: 'visible', timeout: 60_000 });
        await policyLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async moveRenewalToDataGather(): Promise<void> {
        await this.renewalButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.renewalMoveToDropdown.selectOption('dataGather');
        await this.renewalMoveToGoButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async getRenewalPolicyDetails(): Promise<RenewalPolicyDetails> {
        const bannerDetails = await this.getDataGatherBannerDetails();
        const policyNumber =
            bannerDetails.policyNumber ||
            await this.firstVisibleTextOrBodyMatch(
                this.policyNumberText,
                /Policy\s*#\s*:\s*([CP]\d+)/,
                'policy number'
            );
        const productName =
            bannerDetails.productName ||
            await this.firstVisibleTextOrBodyMatch(
                this.productNameText,
                /Product Name:\s*([^\n\r]+)/,
                'product name'
            );
        const status =
            bannerDetails.status ||
            await this.firstVisibleTextOrBodyMatch(
                this.policyStatusText,
                /^Status:\s*([^\n\r]+)/m,
                'status'
            );
        const effectiveDate =
            bannerDetails.effectiveDate ||
            await this.firstVisibleTextOrBodyMatch(
                this.effectiveDateText,
                /(?:Eff\. Date|Effective Date):?\s*(\d{2}\/\d{2}\/\d{4})/,
                'effective date'
            );
        const transEffectiveDate =
            bannerDetails.transEffectiveDate ||
            await this.firstVisibleTextOrBodyMatch(
                this.transEffectiveDateText,
                /Trans\. Eff\. Date:?\s*(\d{2}\/\d{2}\/\d{4})/,
                'transaction effective date'
            );     return {
            policyNumber,
            productName,
            status,
            effectiveDate,
            transEffectiveDate
        };
    }

    async verifyRenewalPolicyDetails(
        policyNumber: string,
        expectedProductName: string | RegExp = 'Private Motor'
    ): Promise<RenewalPolicyDetails> {
        const details = await this.getRenewalPolicyDetails();

        expect(details.policyNumber).toContain(policyNumber);
        if (expectedProductName instanceof RegExp) {
            expect(details.productName).toMatch(expectedProductName);
        } else {
            expect(details.productName).toContain(expectedProductName);
        }
        expect(details.status).toMatch(/Policy (Active|Pending)|Quote|Proposed/i);
        expect(details.effectiveDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        expect(details.transEffectiveDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);

        return details;
    }

    async completeRenewalPurchaseAndVerifyPending(): Promise<string> {
        await this.clickPremiumsAndCoveragesTab();
        await this.calculatePremiumButton.click({ timeout: 120_000 });
        await waitForBarbadosLoadingSpinner(this);

        await this.clickFundingSummaryTab();
        await this.purchaseButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.confirmPurchasePolicy();

        await this.finishButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.finalPolicyStatusText).toHaveText('Policy Pending');

        const policyStatus =
            ((await this.finalPolicyStatusText.textContent()) || '').trim();
        return policyStatus;
    }

    private async getPolicyBatchGroupLastRunText(): Promise<string> {
        return (
            (await this.policyBatchGroupRow
                .locator('td')
                .nth(1)
                .innerText()) || ''
        ).trim();
    }

    private async confirmPurchasePolicy(): Promise<void> {
        if (await this.purchaseConfirmDialog.isVisible({ timeout: 10_000 })) {
            await this.purchaseConfirmYesButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    private async waitForPolicyBatchGroupPassed(
        previousRunText: string,
        previousPassedCount: number,
        timeoutMs: number
    ): Promise<string> {
        const today = this.formatTodayForScheduler();
        const startTime = Date.now();
        let lastRunText = '';

        while (Date.now() - startTime < timeoutMs) {
            await this.page.reload();
            await waitForBarbadosLoadingSpinner(this);
            await this.policyBatchGroupRow.waitFor({
                state: 'visible',
                timeout: 60_000
            });

            lastRunText = await this.getPolicyBatchGroupLastRunText();

            if (
                lastRunText.includes('(Passed)') &&
                lastRunText.includes(today) &&
                (lastRunText !== previousRunText ||
                    this.getPassedCount(lastRunText) > previousPassedCount)
            ) {
                return lastRunText;
            }

            await this.page.waitForTimeout(10_000);
        }

        throw new Error(
            `Policy Batch Group did not pass within ${timeoutMs}ms. Last status: ${lastRunText || 'Unknown'}`
        );
    }

    private formatTodayForScheduler(): string {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        return `${day}/${month}/${year}`;
    }

    private getPassedCount(text: string): number {
        const passedMatch = text.match(/(\d+)\s+Passed/);

        return passedMatch ? Number(passedMatch[1]) : 0;
    }

    private async firstVisibleText(locator: Locator): Promise<string> {
        const count = await locator.count();

        for (let index = 0; index < count; index++) {
            const item = locator.nth(index);

            if (await item.isVisible()) {
                return ((await item.textContent()) || '').trim();
            }
        }

        await locator.first().waitFor({ state: 'visible', timeout: 30_000 });
        return ((await locator.first().textContent()) || '').trim();
    }

    private async firstVisibleTextOrBodyMatch(
        locator: Locator,
        fallbackPattern: RegExp,
        fieldName: string
    ): Promise<string> {
        const count = await locator.count();

        for (let index = 0; index < count; index++) {
            const item = locator.nth(index);

            if (await item.isVisible()) {
                const text = ((await item.textContent()) || '').trim();
                const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

                return dateMatch?.[0] ?? text;
            }
        }

        const bodyText = await this.page.locator('body').innerText();
        const fallbackMatch = bodyText.match(fallbackPattern);

        if (fallbackMatch?.[1]) {
            return fallbackMatch[1];
        }

        throw new Error(`Could not find ${fieldName} on the renewal page.`);
    }

    private async getDataGatherBannerDetails(): Promise<
        Partial<RenewalPolicyDetails>
    > {
        const bannerText = await this.dataGatherBannerItems
            .allInnerTexts()
            .catch(() => []);
        const normalizedText = bannerText
            .map((text) => text.replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .join('\n');

        return {
            policyNumber: this.getMatchValue(
                normalizedText,
                /Policy\s*#\s*:\s*([CP]\d+)/
            ),
            productName: this.getMatchValue(
                normalizedText,
                /Product Name:\s*([^\n]+)/
            ),
            status: this.getMatchValue(normalizedText, /^Status:\s*([^\n]+)/m),
            effectiveDate: this.getMatchValue(
                normalizedText,
                /Eff\. Date\s*:\s*(\d{2}\/\d{2}\/\d{4})/
            ),
            transEffectiveDate: this.getMatchValue(
                normalizedText,
                /Trans\. Eff\. Date:\s*(\d{2}\/\d{2}\/\d{4})/
            )
        };
    }

    private getMatchValue(text: string, pattern: RegExp): string {
        return text.match(pattern)?.[1]?.trim() || '';
    }
}
