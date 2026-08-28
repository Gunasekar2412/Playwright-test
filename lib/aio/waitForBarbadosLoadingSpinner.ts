import { Page } from '@playwright/test';

type PageWithLoadingSpinner = {
    page: Page;
    waitForLoadingSpinner(): Promise<void>;
};

export async function closePartySearchPopupIfVisible(page: Page) {
    const partySearchPopup = page.locator(
        '[id="partySearchForm\\:partySearchPopup_container"]'
    );
    const partySearchPopupCloseButton = page.locator(
        '[id="partySearchForm\\:partySearchPopup_header_controls"] label.icon-close'
    );
    const partySearchPopupShade = page.locator(
        '[id="partySearchForm\\:partySearchPopup_shade"]'
    );

    const isPopupVisible = await partySearchPopup
        .isVisible({ timeout: 3_000 })
        .catch(() => false);

    if (!isPopupVisible) {
        return;
    }

    await partySearchPopupCloseButton.click();
}

export async function waitForBarbadosLoadingSpinner(
    pageObject: PageWithLoadingSpinner
) {
    await pageObject.waitForLoadingSpinner();
    await closePartySearchPopupIfVisible(pageObject.page);
}
