import { test as base, expect } from '@playwright/test';
import { addCommentToTestCase } from './aioHelper';
import { executionContext, resetExecutionContext } from './executionContext';

export const test = base;
export { expect };

test.beforeEach(async () => {
    resetExecutionContext();
});

test.afterEach(async ({ page }, testInfo) => {

    const tag = testInfo.tags.find(
        t => t.startsWith('@ECP-TC-')
    );

    if (!tag) {
        return;
    }

    const testCaseKey = tag.replace('@', '');

    // Capture final screen
    const screenshotPath =
        testInfo.outputPath('final-screen.png');

    try {

        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

    } catch (error) {    }

    const executionTime =
        new Date().toLocaleString();

    await updateExecutionContextFromPage(page);

    const executionStatus =
        testInfo.status === 'passed'
            ? '✅ Automation Execution Passed'
            : '❌ Automation Execution Failed';
    const executionDetailsComment =
        testInfo.status === 'passed'
            ? buildPassedExecutionDetailsComment(executionTime)
            : `
            ${buildExecutionContextComment()}

            Error :
            ${testInfo.error?.message || 'Unknown Error'}
            `;

    if (testInfo.status === 'passed') {

        await addCommentToTestCase(
            testCaseKey,
            `
            ${executionStatus}

            ${executionDetailsComment}
            `,
            {
                region: executionContext.region
            }
        );
    }

    if (testInfo.status === 'failed') {

        await addCommentToTestCase(
            testCaseKey,
            `
            ${executionStatus}

            ${executionDetailsComment}

            Execution Time :
            ${executionTime}
            `,
            {
                region: executionContext.region
            }
        );
    }
});

function buildPassedExecutionDetailsComment(executionTime: string): string {
    const contextComment = buildExecutionContextComment();

    if (contextComment) {
        return `
            ${contextComment}

            Execution Status :
            Passed

            Execution Time :
            ${executionTime}
        `;
    }

    return `
            Execution Status :
            Passed

            Execution Time :
            ${executionTime}
    `;
}

function buildExecutionContextComment(): string {
    if (executionContext.policyNumber) {
        return `
            Policy Number :
            ${executionContext.policyNumber}

            Policy Status :
            ${executionContext.policyStatus || 'Passed'}
        `;
    }

    if (
        executionContext.customerName ||
        executionContext.customerId ||
        executionContext.customerDetails
    ) {
        return `
            Customer Name :
            ${executionContext.customerName || 'N/A'}

            Customer ID :
            ${executionContext.customerId || 'N/A'}

            Customer Details :
            ${executionContext.customerDetails || 'N/A'}

            Region :
            ${executionContext.region || 'N/A'}
        `;
    }

    return '';
}

async function updateExecutionContextFromPage(page: any) {
    executionContext.policyNumber ||= await firstVisibleText(page, [
        '#productContextInfoForm\\:policyDetail_policyNumTxt',
        '#productContextInfoForm\\:title_policyNumTxt',
        '#productContextInfoForm\\:policyDetail_policyNumLnk'
    ]);

    executionContext.policyStatus ||= await firstVisibleText(page, [
        '#productContextInfoForm\\:policyDetail_policyStatusCdText'
    ]);

    executionContext.customerId ||= await firstVisibleText(page, [
        '#custInfoForm\\:customerId'
    ]);
}

async function firstVisibleText(
    page: any,
    selectors: string[]
): Promise<string> {
    for (const selector of selectors) {
        const locator = page.locator(selector).first();

        try {
            if (await locator.isVisible({ timeout: 1000 })) {
                return ((await locator.textContent()) || '')
                    .replace('#', '')
                    .trim();
            }
        } catch {
            // Ignore missing selectors from unrelated pages.
        }
    }

    return '';
}
