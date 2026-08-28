# State of Automation Report

Date: April 10, 2026

## Executive Summary

The automation program has delivered a 420-test suite across EIS and is already generating significant, repeatable cost savings in each test cycle. In the policy domain alone, automation completes in approximately 1.5 hours work that could take up to 48 hours of manual QA effort.

The program is now entering its stabilization and optimization phase. The foundation is complete and coverage is strong. The next step is to align the suite with recent application changes, improve execution reliability, and accelerate performance through expanded use of DXP, the EIS API, for test setup.

This model also creates a clear opportunity to extend automation across additional products such as Commercial Auto, Home, Commercial Liability, Commercial Property, and agents and commissions, further increasing efficiency and cost savings across the organization.

## Current State

- The project uses Playwright with TypeScript for functional test automation.
- EIS coverage is broad. A current repo count shows 420 EIS tests across policy, customer, rating, billing, and DXP-related suites.
- The suite contains business logic, not just UI checks. This includes the premium calculator in [`lib/utils.ts`](lib/utils.ts).
- DXP adoption is already in progress.
- The suite still provides strong value by reducing manual effort, especially in policy testing and premium validation.

## Maintenance Changes

- Premium Financing is now required.
- The selector used to choose policy coverage and plan has changed.
- Policy coverage and plan can no longer be selected until insured and vehicle details have been entered.
- Rental Car Type, BCIC ASSIST Level, and Excess Limit no longer always have usable default values.
- The automation now has to detect these fields and set values before premium calculation when needed.
- The Excess Limit field has changed. The current Jamaica value tracked in [`sites/eis/data/RatingData.ts`](sites/eis/data/RatingData.ts) is `TWOMIN15000MAX350KJMD`.
- Older Jamaica excess values in the same file are commented as likely removed: `FIVEMIN15000MAX250KJMD` and `FIVEMIN15000MAX350KJMD`.
- Some policy tests still assert the older excess value and older default coverage selections in [`tests/eis/policy.test.ts`](tests/eis/policy.test.ts) and [`tests/eis/policy.dxp-setup.test.ts`](tests/eis/policy.dxp-setup.test.ts). This shows that maintenance changes were not fully applied after the application changed.
- Certificate tests are blocked because certificates are not consistently being returned in EIS.
- There is also a growing sign that premium calculations or premium-related defaults may have changed in the application and need to be realigned with the automation.

## Reliability Blockers

- Intermittent 500 Internal Server Error and 503 Service Temporarily Unavailable responses are the biggest blockers.
- These failures have no reliable workaround and usually require a rerun.
- The application often reloads after each data entry step, which increases run time.
- The loading spinner is no longer a dependable signal in all cases because it does not always reappear after the page finishes loading.
- Some pages can go completely white during navigation, including the Driver tab under Policy.
- The automation also has to handle extra popups and unexpected tab navigation.
- Until these issues are reduced, the suite will continue to lose time to retries, waits, and reruns.

## Expand DXP Use To Reduce Test Execution Time

- DXP is the EIS API.
- It allows customer and policy setup to be done through the API instead of through the UI.
- This significantly reduces setup time and speeds up test execution.
- DXP customer creation is already implemented in [`lib/dxp/createJamaicaCustomer.ts`](lib/dxp/createJamaicaCustomer.ts).
- DXP policy issuance is already implemented in [`lib/dxp/issueJamaicaPrivateMotorPolicy.ts`](lib/dxp/issueJamaicaPrivateMotorPolicy.ts).
- This should now be expanded to more tests.
- Tests, except customer-focused tests, should use DXP for customer setup where possible.
- Tests, except policy-focused tests, should use DXP for policy setup where possible.
- The current DXP approach is useful, but it is not yet streamlined. Some suites have been duplicated into `*.dxp-setup.test.ts` files instead of using shared fixtures, which increases maintenance work.

## What Happens If We Do Nothing

If no focused action is taken, the suite will not stop overnight, but it will continue to lose value. More time will be spent on reruns, long waits, reactive fixes, and manual premium validation. Execution will remain slow, confidence in results will drop, and handover will become harder. If ownership also changes during this period without a proper stabilization runway, the team should expect more ramp-up time and slower recovery because known issues will need to be rediscovered.

## Conclusion

The automation effort has already built a valuable asset. The next need is not more test volume. The next need is stability, maintenance, faster setup through DXP, and continuity of experienced ownership. If those areas are addressed, the suite can continue to deliver strong value and support the product effectively.
