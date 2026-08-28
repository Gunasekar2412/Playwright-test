import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { resolveAioCycleKey } from './lib/aio/aioHelper';

// ==========================================
// Current Date
// ==========================================
const currentDate = new Date()
    .toLocaleDateString('en-GB')
    .replace(/\//g, '_');

// ==========================================
// Get executed spec file name
// ==========================================
const testPathArgs = process.argv.filter(arg =>
    !arg.startsWith('-') &&
    (
        arg.includes('.test.ts') ||
        /(^|[\\/])aiotest([\\/]|$)/i.test(arg) ||
        /(^|[\\/])(jamaica|barbados)([\\/]|$)/i.test(arg)
    )
);

const specArg = testPathArgs.find(arg =>
    arg.includes('.test.ts')
);

const specName = specArg
    ? path.basename(specArg, '.test.ts')
    : 'full-suite';

type AioRegion = 'Barbados' | 'Jamaica';

const normalizeRegion = (region?: string): AioRegion | '' => {
    const normalizedRegion = (region || '').trim().toLowerCase();

    if (normalizedRegion === 'jamaica') {
        return 'Jamaica';
    }

    if (normalizedRegion === 'barbados') {
        return 'Barbados';
    }

    return '';
};

const detectRegionFromCaseKeys = (): AioRegion | '' => {
    const commandLine = process.argv.join(' ');
    const caseIds = Array.from(
        commandLine.matchAll(/@?ECP-TC-(\d+)/gi),
        match => Number(match[1])
    );

    if (!caseIds.length) {
        return '';
    }

    const hasJamaicaCase = caseIds.some(id => id >= 46 && id <= 73);
    const hasBarbadosCase = caseIds.some(id => id >= 17 && id <= 45);

    if (hasJamaicaCase && !hasBarbadosCase) {
        return 'Jamaica';
    }

    if (hasBarbadosCase && !hasJamaicaCase) {
        return 'Barbados';
    }

    return '';
};

const detectAioRegion = (): AioRegion => {
    const envRegion = normalizeRegion(process.env.AIO_REGION);

    if (envRegion) {
        return envRegion;
    }

    const caseKeyRegion = detectRegionFromCaseKeys();

    if (caseKeyRegion) {
        return caseKeyRegion;
    }

    const hasJamaicaPath = testPathArgs.some(arg =>
        /(^|[\\/])jamaica([\\/]|$)/i.test(arg)
    );
    const hasBarbadosPath = testPathArgs.some(arg =>
        /(^|[\\/])barbados([\\/]|$)/i.test(arg)
    );

    if (hasJamaicaPath && !hasBarbadosPath) {
        return 'Jamaica';
    }

    if (hasBarbadosPath && !hasJamaicaPath) {
        return 'Barbados';
    }

    if (specArg) {
        const specPath = path.resolve(specArg);
        const specContent = fs.existsSync(specPath)
            ? fs.readFileSync(specPath, 'utf-8')
            : '';

        if (/Jamaica/i.test(specContent)) {
            return 'Jamaica';
        }

        if (/Barbados/i.test(specContent)) {
            return 'Barbados';
        }
    }

    return 'Barbados';
};

const aioRegion = detectAioRegion();
const aioCycleKey = resolveAioCycleKey(aioRegion);
const eisPortalBaseUrl = process.env.EIS_PORTAL_BASE_URL || '';
const barbadosCustomerPortalBaseUrl =
    process.env.BARBADOS_CUSTOMER_PORTAL_BASE_URL || '';

// ==========================================
// AIO Reporter Config
// ==========================================
const aioConfigDetails = {

    enableReporting: true,

    cloud: {
        apiKey: process.env.AIO_API_TOKEN || process.env.AIO_API_KEY
    },

    jiraProjectId: process.env.AIO_PROJECT_KEY,

    cycleDetails: {
        cycleKey: aioCycleKey
    },

    addNewRun: false,

    debugMode: true
};

// ==========================================
// Base Results Folder
// ==========================================
const baseResultsFolder = path.join(
    'test-results',
    specName
);

// ==========================================
// Create folder if not exists
// ==========================================
if (!fs.existsSync(baseResultsFolder)) {
    fs.mkdirSync(baseResultsFolder, {
        recursive: true
    });
}


const resultsRoot = 'test-results';

if (!fs.existsSync(resultsRoot)) {
    fs.mkdirSync(resultsRoot, { recursive: true });
}

const existingRuns = fs.readdirSync(resultsRoot);

const todayRuns = existingRuns.filter(folder =>
    folder.startsWith(
        `${specName}_${currentDate}_run_`
    )
);

// ==========================================
// Generate next run number
// ==========================================
const runNumber = todayRuns.length + 1;

// ==========================================
// Final Run Id
// ==========================================
const runFolderName = `${currentDate}_run_${runNumber}`;

const runId = `${specName}_${currentDate}_run_${runNumber}`;

// ==========================================
// Timeout Settings
// ==========================================
const readTimeout = (
    envName: string,
    defaultValue: number
) => {
    const rawValue = process.env[envName];

    if (!rawValue) {
        return defaultValue;
    }

    const parsedValue = Number(rawValue);

    return Number.isFinite(parsedValue) && parsedValue > 0
        ? parsedValue
        : defaultValue;
};

// Global defaults are intentionally higher than Playwright's defaults because
// this suite runs against environments where loaders and network activity can
// delay actions, navigation, and assertions.
const testTimeout = readTimeout('PLAYWRIGHT_TEST_TIMEOUT', 260_000);
const actionTimeout = readTimeout('PLAYWRIGHT_ACTION_TIMEOUT', 60_000);
const navigationTimeout = readTimeout('PLAYWRIGHT_NAVIGATION_TIMEOUT', 60_000);
const expectTimeout = readTimeout('PLAYWRIGHT_EXPECT_TIMEOUT', 60_000);

// ==========================================
// Playwright Config
// ==========================================
export default defineConfig({

    // ==========================================
    // Report Metadata
    // ==========================================
    metadata: {
        'Test URL': eisPortalBaseUrl,
        'Barbados Customer Portal URL': barbadosCustomerPortalBaseUrl,
        'AIO Region': aioRegion,
        'AIO Cycle Key': aioCycleKey,
        'Spec Name': specName,
        'Run ID': runId,
    },

    // ==========================================
    // Test folder
    // ==========================================
    testDir: './tests',

    // ==========================================
    // Parallel execution
    // ==========================================
    fullyParallel: true,

    // ==========================================
    // Retry failed tests
    // ==========================================
    retries: 3,

    // ==========================================
    // Workers
    // ==========================================
    workers: process.env.CI ? 1 : 1,

    // ==========================================
    // Test execution timeout
    // ==========================================
    timeout: testTimeout,

    // ==========================================
    // Assertion timeout
    // ==========================================
    expect: {
        timeout: expectTimeout,
    },

    // ==========================================
    // Separate artifacts for every execution
    // ==========================================
    outputDir: `test-results/${runId}`,

    // ==========================================
    // REPORTERS
    // ==========================================
    reporter: [
        ['list'],
        //====================================
        // AIO Test Reporter
        //====================================
    //  //   [
    //    //     'aiotests-playwright-reporter',
    //         {
    //             aioConfig: aioConfigDetails
    //         }
    //     ],

        // ==========================================
        // QualityWatcher Reporter
        // ==========================================
        // ,
        // [
        //     '@qualitywatcher/playwright-reporter',
        //     {
        //         apiKey:
        //             process.env.QUALITYWATCHER_API_KEY,

        //         projectId: 1,

        //         testRunName:
        //             `EIS Automation - JA ${new Date().toLocaleDateString(
        //                 'en-US'
        //             )} - automated run`,

        //         description:
        //             `Triggered by automated run - ${runFolderName}`,

        //         includeAllCases: false,

        //         complete: false,

        //         includeCaseWithoutId: false,

        //         excludeSkipped: true,
        //     },
        // ]

        // ==========================================
        // Monocart detailed report
        // ==========================================
        // ,
        [
            'monocart-reporter',
            {
                name: 'EIS Automation Execution Report',

                outputFile:
                    `monocart-report/${runId}/index.html`,

                json:
                    `monocart-report/${runId}/report.json`,

                attachmentsDir:
                    `monocart-report/${runId}/attachments`,

                title: 'EIS Test Automation Report',

                columns: [
                    'status',
                    'name',
                    'project',
                    'duration',
                    'retry',
                ],

                charts: true,

                timeline: true,

                open: 'never',
            }
        ]
    ],
    // ==========================================
    // SHARED SETTINGS
    // ==========================================
    use: {

        // ==========================================
        // Browser mode
        // ==========================================
        headless: false,

        // ==========================================
        // Timeouts
        // ==========================================
        // Applies to clicks, fills, checks, and other locator/page actions.
        actionTimeout,

        // Applies to page.goto, waits for URL changes, and navigation triggered by actions.
        navigationTimeout,

        // Trace
        // ==========================================
        trace: 'on',

        // ==========================================
        // Screenshot
        // ==========================================
        screenshot: 'on',

        // ==========================================
        // Video
        video: 'on',

        // Ignore HTTPS issues
        // ==========================================
        ignoreHTTPSErrors: true,
    },

    // ==========================================
    // PROJECTS
    // ==========================================
    projects: [

        // ==========================================
        // LOGIN
        // ==========================================
        {
            name: 'login',

            testMatch: 'login.test.ts',

            use: {
                baseURL:
                    eisPortalBaseUrl,
            }
        },

        // ==========================================
        // EIS
        // ==========================================
        {
            name: 'eis',

            use: {
                ...devices['Desktop Chrome'],
                viewport: null,
                deviceScaleFactor: undefined,
                // launchOptions: {
                //     args: ['--start-maximized']
                // },

                baseURL:
                    eisPortalBaseUrl,
            },

            dependencies: [],

            testMatch:
                /tests\/eis\/.+\.test\.ts$/,

            testIgnore:
                /dxp-setup\.test\.ts$/,
        },

        // ==========================================
        // EIS DXP
        // ==========================================
        {
            name: 'eis-dxp',

            use: {
                ...devices['Desktop Chrome'],

                baseURL:
                    eisPortalBaseUrl,
            },

            dependencies: [],

            testMatch:
                /tests\/eis\/.+\.dxp-setup\.test\.ts$/,
        },

        // ==========================================
        // PORTAL
        // ==========================================
        {
            name: 'portal',

            use: {
                ...devices['Desktop Chrome'],

                baseURL:
                    barbadosCustomerPortalBaseUrl,
            },

            dependencies: [],

            testMatch:
                /.*portal\.test\.ts/,
        }
    ],

});
