import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import fs from 'fs';
import { waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

const commissionGroupStateFile = 'commission-group-state.json';


export type CommissionAgency = {
    code: string;
    name: string;
};

export type CommissionGroupDetails = {
    groupName: string;
    commissionRate: number;
    agencies: CommissionAgency[];
};

export class CommissionPage extends BasePage {
    readonly adminLink: Locator;
    readonly mainLink: Locator;
    readonly commissionTab: Locator;
    readonly commissionGroupMenu: Locator;
    readonly searchButton: Locator;
    readonly commissionGroupRows: Locator;
    readonly groupNameField: Locator;
    readonly agenciesTableRows: Locator;

    constructor(page: Page) {
        super(page);

        this.adminLink = page.getByRole('link', { name: 'Admin' });
        this.mainLink = page.getByRole('link', { name: 'Main' });
        this.commissionTab = page.locator(
            '#adminTabsForm\\:adminTopTabsList\\:7\\:link, a:has(#adminTabsForm\\:adminTopTabsList\\:7\\:linkLabel)'
        );
        this.commissionGroupMenu = page.locator(
            '#left_menu_form\\:left_menu_commissionList\\:2\\:linkLabel'
        );
        this.searchButton = page.locator(
            '#groupSearchForm\\:searchBtn_footer'
        );
        this.commissionGroupRows = page.locator(
            'tbody[id$="_data"] tr'
        );
        this.groupNameField = page.locator(
            '#groupEditForm\\:groupInfoForm_name'
        );
        this.agenciesTableRows = page.locator(
            '#groupEditForm\\:agenciesTable_data tr'
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

    async openCommissionGroup(): Promise<void> {
        await this.commissionTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.commissionGroupMenu.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async searchCommissionGroups(): Promise<void> {
        await this.searchButton.waitFor({ state: 'visible' });
        await this.searchButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async selectBarbadosPrivateMotorCommissionGroup(): Promise<void> {
        const groupLink = this.page
            .locator('a, span, td')
            .filter({ hasText: /^BB PREC-AU\s+(12|13)$/ })
            .first();

        await groupLink.waitFor({ state: 'visible', timeout: 60_000 });
        await groupLink.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async getSelectedCommissionGroupDetails(
        groupNamePattern = /^BB PREC-AU\s+(12|13)$/,
        ratePattern = /BB PREC-AU\s+(\d+(?:\.\d+)?)/,
        expectedGroupMessage = 'Commission rate should be present in group name'
    ): Promise<CommissionGroupDetails> {
        await this.groupNameField.waitFor({ state: 'visible' });

        const groupName = (await this.groupNameField.inputValue()).trim();
        const rateMatch = groupName.match(ratePattern);

        expect(groupName).toMatch(groupNamePattern);
        expect(rateMatch?.[1], expectedGroupMessage)
            .toBeTruthy();

        const agencies = await this.agenciesTableRows.evaluateAll((rows) =>
            rows.map((row) => {
                const cells = Array.from(row.querySelectorAll('td'));

                return {
                    code: cells[0]?.textContent?.trim() || '',
                    name: cells[1]?.textContent?.trim() || ''
                };
            }).filter((agency) => agency.code && agency.name)
        );

        expect(agencies.length).toBeGreaterThan(0);

        const details = {
            groupName,
            commissionRate: Number(rateMatch![1]),
            agencies
        };       return details;
    }

    async getSelectedBarbadosHomeCommissionGroupDetails(): Promise<CommissionGroupDetails> {
        return await this.getSelectedCommissionGroupDetails(
            /^BB PREC-HO\s+(15|15\.5)$/,
            /BB PREC-HO\s+(\d+(?:\.\d+)?)/,
            'Home commission rate should be present in group name'
        );
    }

    async getSelectedJamaicaPrivateMotorCommissionGroupDetails(): Promise<CommissionGroupDetails> {
        return await this.getSelectedCommissionGroupDetails(
            /^JM PREC-AU\s+\d+(?:\.\d+)?$/,
            /JM PREC-AU\s+(\d+(?:\.\d+)?)/,
            'Jamaica Private Motor commission rate should be present in group name'
        );
    }

    async selectJamaicaPrivateMotorCommissionGroup(): Promise<string> {
        const groupLink = this.page
            .locator('a')
            .filter({ hasText: /^JM PREC-AU\s+\d+(?:\.\d+)?$/ })
            .first();

        await expect(groupLink).toBeVisible({ timeout: 60_000 });
        const groupName = (await groupLink.innerText()).trim();
        await groupLink.click();
        await waitForBarbadosLoadingSpinner(this);

        return groupName;
    }

    async selectAlternateBarbadosPrivateMotorCommissionGroup(): Promise<string> {
        const groups: Array<'BB PREC-AU 12' | 'BB PREC-AU 13'> = [
            'BB PREC-AU 12',
            'BB PREC-AU 13'
        ];

        let lastSelectedGroup = '';

        if (fs.existsSync(commissionGroupStateFile)) {
            const state = JSON.parse(
                fs.readFileSync(commissionGroupStateFile, 'utf-8')
            );
            lastSelectedGroup = state.lastSelectedGroup;
        }

        const groupName =
            lastSelectedGroup === 'BB PREC-AU 12'
                ? 'BB PREC-AU 13'
                : 'BB PREC-AU 12';

        const groupLink = this.page.locator(
            `//a[normalize-space()='${groupName}']`
        );

        await expect(groupLink).toBeVisible();

        await groupLink.click();

        const state = fs.existsSync(commissionGroupStateFile)
            ? JSON.parse(fs.readFileSync(commissionGroupStateFile, 'utf-8'))
            : {};

        fs.writeFileSync(
            commissionGroupStateFile,
            JSON.stringify({ ...state, lastSelectedGroup: groupName }, null, 2)
        );

        await this.page.waitForLoadState('networkidle');

        return groupName;
    }

    async selectAlternateBarbadosHomeCommissionGroup(): Promise<string> {
        const groups: Array<'BB PREC-HO 15' | 'BB PREC-HO 15.5'> = [
            'BB PREC-HO 15',
            'BB PREC-HO 15.5'
        ];

        let lastSelectedGroup = '';

        if (fs.existsSync(commissionGroupStateFile)) {
            const state = JSON.parse(
                fs.readFileSync(commissionGroupStateFile, 'utf-8')
            );
            lastSelectedGroup = state.lastSelectedHomeGroup;
        }

        const groupName =
            lastSelectedGroup === groups[0] ? groups[1] : groups[0];

        const groupLink = this.page.locator(
            `//a[normalize-space()='${groupName}']`
        );

        await expect(groupLink).toBeVisible();
        await groupLink.click();

        const state = fs.existsSync(commissionGroupStateFile)
            ? JSON.parse(fs.readFileSync(commissionGroupStateFile, 'utf-8'))
            : {};

        fs.writeFileSync(
            commissionGroupStateFile,
            JSON.stringify(
                { ...state, lastSelectedHomeGroup: groupName },
                null,
                2
            )
        );

        await this.page.waitForLoadState('networkidle');

        return groupName;
    }

    async changeAgencyProducer(agencyName: string): Promise<void> {
        // 1. Click Change Agency
        await this.page
            .locator("//a[@id='policyDataGatherForm:changeAgencyLink_ProducerInfo']")
            .click();

        // 2. Select Agency option
        await this.page
            .locator("//select[@id='brokerSearchFromProducerInfo:brokerSearchCriteria_channelCd']")
            .selectOption('agency');

        // 3. Fill agency name
        await this.page
            .locator("//input[@id='brokerSearchFromProducerInfo:brokerSearchCriteria_name']")
            .fill(agencyName);

        // 4. Click Search
        await this.page
            .locator("//input[@id='brokerSearchFromProducerInfo:searchBtn']")
            .click();

        // 5. Select displayed agency by clicking agency name hyperlink
        const agencyLink = this.page.locator(
            `//tbody[@id='brokerSearchFromProducerInfo:body_brokerSearchResultsProducerInfo:tb']//a[normalize-space()='${agencyName}']`
        );

        await expect(agencyLink).toBeVisible();
        await agencyLink.click();

        // 6. Verify selected agency name is displayed
        const selectedAgency = this.page.locator(
            "//span[@id='policyDataGatherForm:policyProducerCd']"
        );

        await expect
            .poll(
                async () => {
                    const selectedAgencyText =
                        (await selectedAgency.textContent())?.trim() ?? '';

                    return (
                        selectedAgencyText === agencyName ||
                        (selectedAgencyText.endsWith('...') &&
                            agencyName.startsWith(
                                selectedAgencyText.slice(0, -3)
                            ))
                    );
                },
                { timeout: 60000 }
            )
            .toBe(true);
    }
}
