# BCIC Test Automation

This README provides an overview and essential information for the BCIC Test Automation project, which utilizes Playwright for automated web application testing of the Customer Portal and EIS Core Portal.

## Table of Contents

- [Introduction](#introduction)
- [State of automation](#state-of-automation)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [AIO EIS test coverage](#aio-eis-test-coverage)
- [Configuration](#configuration)
- [DXP API](#dxp-api)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project aims to automate testing for two key BCIC applications:

1. **Customer Portal**: A customer-facing portal used for:
   - Policy purchasing
   - Policy management
   - Customer self-service activities

2. **EIS Core Portal**: A backend administrative portal focusing on:
   - Business operations
   - Policy management
   - Customer data management

## State of automation

For a snapshot of suite coverage, maintenance priorities, and program status, see [STATE_OF_AUTOMATION.md](STATE_OF_AUTOMATION.md).

## Prerequisites

Before you get started with this project, ensure you have the following prerequisites in place:

- Node.js (Version 16 or higher)
- npm (Node Package Manager)
- Git for version control
- IDE: Visual Studio Code (recommended) or any preferred code editor

## Project Structure

The project is structured as follows:

```
├── tests/
│   └── eis/
│       ├── aiotest/
│       │   ├── barbados/    # ECP-TC-17 through ECP-TC-40
│       │   └── jamaica/     # ECP-TC-46 through ECP-TC-68
│       └── qualitywatcher/  # EIS regression and reporting tests
├── sites/
│   └── eis/
│       ├── aiotest/helpers/ # Reusable AIO policy workflows
│       ├── data/            # Customer, rating, and LOB test data
│       └── pages/           # EIS page objects
├── lib/aio/                 # AIO hooks, execution context, and utilities
├── reporters/               # Custom reporting integration
├── monocart-report/         # Generated Monocart execution reports
├── test-results/            # Playwright execution artifacts
├── playwright.config.ts     # Projects, environments, and reporters
└── package.json             # Dependencies and npm scripts
```

- **Data:** Files with test data to be used in tests. E.g. [customer personal data, vehicle information, error messages, and any other data that will be used in a test]
- **Pages:** Used to store the page objects. Page objects include element selectors and functions that are used in tests.
- **Tests:** Used to store the tests. Test files which include the actual tests steps.
- **playwright.config.ts:** Contains the configurations for Playwright.

## AIO EIS test coverage

The EIS AIO suite contains **47 regional ECP scenario files**. Each scenario uses
an `@ECP-TC-<number>` tag and is organized by region.

| Region | Test files | Count | Main coverage |
| --- | --- | ---: | --- |
| Barbados | `tests/eis/aiotest/barbados/ECP_TC_17.test.ts` through `ECP_TC_40.test.ts` | 24 | Customer management, Private Motor, Home, Commercial policies, endorsements, renewals, commissions, and billing |
| Jamaica | `tests/eis/aiotest/jamaica/ECP_TC_46.test.ts` through `ECP_TC_68.test.ts` | 23 | Customer management, Private Motor, Home, Commercial policies, endorsements, renewals, Agent/Broker commissions, and JMD billing |

Recent Jamaica coverage includes:

- `ECP-TC-56` to `ECP-TC-59`: Commercial Auto and Home endorsements and renewals.
- `ECP-TC-60` to `ECP-TC-63`: Agent/Broker policy creation and renewal commission validation.
- `ECP-TC-64` to `ECP-TC-68`: JMD billing capabilities for Private Motor, Home, Commercial Auto, Commercial Property, and Commercial Liability policies.

Shared AIO workflows are located in:

- `sites/eis/aiotest/helpers/billingCapabilityPolicyFactories.ts`
- `tests/eis/aiotest/jamaica/privateMotorCommissionTestUtils.ts`
- `tests/eis/aiotest/jamaica/billingCapabilityTestUtils.ts`
- `lib/aio/executionContext.ts`
- `lib/aio/waitForBarbadosLoadingSpinner.ts`

Runtime state such as `commission-group-state.json` is generated during test
execution and should not be committed.

## Configuration

1. Create a `.env` file in the root of your project:
```bash
touch .env
```

2. Add the required environment variables (see .env.example for more information):
```
# Portal URLs and Credentials
CUSTOMER_PORTAL_URL=
CUSTOMER_PORTAL_USERNAME=
CUSTOMER_PORTAL_PASSWORD=

# EIS Core Portal Credentials
EIS_PORTAL_URL=
EIS_PORTAL_USERNAME=
EIS_PORTAL_PASSWORD=

# Test Configuration
HEADLESS=true
BROWSER=chromium
```

## DXP API

The **DXP API** is BCIC’s REST API served under `/dxp-api` on each environment (OpenAPI description: `{host}/dxp-api/swagger.json`). This repo uses it to **create test data significantly faster** customers, issued Jamaica private motor policies so EIS Playwright flows can start from real backend state instead of manual UI setup.

### npm scripts

- `npm run fetch:dxp-swagger` — refresh `specs/dxp-swagger-*.json` (needs network access to BCIC).

### How tests use it

Tests that depend on DXP are named with a **`.dxp-setup`** suffix. They call the helpers above and typically **skip** when `isDxpIssuanceConfigured()` is false (missing base URL or Basic auth).

### Environment variables

Set these in `.env` (see `.env.example` for placeholders):

- **`DXP_API_BASE_URL`** — e.g. `https://env15.test.aws02.bcic.cloud/dxp-api`
- **Guest Basic auth:** `DXP_GUEST_BASIC_USER` / `DXP_GUEST_BASIC_PASSWORD`
- **Agent Basic auth:** `DXP_AGENT_BASIC_USER` / `DXP_AGENT_BASIC_PASSWORD`, or fall back to **`EIS_USERNAME`** / **`EIS_PASSWORD`** if agent-specific vars are unset.

## Running Tests

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests in UI mode
npx playwright test --ui
```

### Test Execution Commands

**_By default all tests are executed in headless mode, meaning the browser UI will not be visible._**

To run specific test suites:

```bash
# Run all tests
npm test

# Run Login tests
npm test -- --project=login

# Run Portal tests
npm test -- --project=portal

# Run EIS tests
npm test -- --project=eis

# Run all Barbados AIO tests
npx playwright test tests/eis/aiotest/barbados --project=eis

# Run all Jamaica AIO tests
npx playwright test tests/eis/aiotest/jamaica --project=eis

# Run a specific ECP test file
npx playwright test tests/eis/aiotest/jamaica/ECP_TC_63.test.ts --project=eis

# Run a test by its ECP tag
npx playwright test --project=eis --grep "@ECP-TC-63"

# List tests without executing them
npx playwright test tests/eis/aiotest/jamaica --project=eis --list

# Run tests in GUI mode to see the test execution
npm test -- --headed
```

## Reporting

Monocart reports are generated under `monocart-report`, while Playwright execution
artifacts are written to `test-results`. When the Playwright HTML reporter is
enabled, its report can be opened with:

```bash
npx playwright show-report
```

### QualityWatcher Integration

This project uses QualityWatcher for enhanced test reporting and analytics. To configure QualityWatcher:

1. Update your `.env` file with the following variables:
```bash
# QualityWatcher Integration
QUALITYWATCHER_API_KEY=
QUALITYWATCHER_PROJECT_ID=
```

QualityWatcher provides:
- Detailed test execution reports
- Test run analytics and trends
- Visual test results with screenshots
- Integration with your CI/CD pipeline

## Common Issues and Solutions

1. **Timeout Issues**
   - Increase timeout settings in `playwright.config.ts`
   - Check network connectivity
   - Verify application response times

## Contributing

We welcome contributions to this project. To contribute:

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the ISC License. See the LICENSE file for details.
