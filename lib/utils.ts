import { Locator, Page } from '@playwright/test';

import { faker } from '@faker-js/faker';
/**
 * Waits for a loading spinner to be hidden and stable for a specified duration
 * @param page Playwright Page object
 * @param spinnerLocator Locator for the loading spinner element
 * @param options Optional configuration for timeouts and stability duration
 */
export async function waitForLoadingSpinner(
    page: Page,
    spinnerLocator: Locator,
    options = {
        timeout: 35000,
        stabilityDuration: 2000,
        maxWaitTime: 45000
    }
) {
    try {
        // Wait for initial hidden state
        await spinnerLocator.waitFor({ state: 'hidden', timeout: options.timeout });

        // Start a timer
        let stableFor = 0;
        const startTime = Date.now();

        while (stableFor < options.stabilityDuration) {
            // Check if spinner is still hidden
            const isVisible = await spinnerLocator.isVisible();

            if (isVisible) {
                // If spinner reappears, reset the timer
                stableFor = 0;
                await spinnerLocator.waitFor({ state: 'hidden', timeout: options.timeout });
            } else {
                // Update how long it's been stable
                stableFor = Date.now() - startTime;
            }

            // Small delay between checks
            await page.waitForTimeout(150);

            // Safety timeout
            if (Date.now() - startTime > options.maxWaitTime) {
                throw new Error('Timeout waiting for spinner to remain hidden');
            }
        }

    } catch (error) {
        console.warn('Loading spinner error:', error);
        throw error;
    }
}

/**
 * Formats a date into DD/MM/YYYY format
 * @param date Date to format
 * @returns Formatted date string
 */
export function getFormattedDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Calculates license issue and expiry dates
 * @param yearsAgoIssued Years ago the license was issued
 * @param validityYears Number of years the license is valid for
 * @returns Object containing formatted issue and expiry dates
 */

// Driver cannot be less than 15 years old when first lincesed.
export function getLicenseDates(yearsAgoIssued: number = 2, validityYears: number = 3) {
    const today = new Date();

    // Issue date: yearsAgoIssued years ago from today
    const issueDate = new Date(today);
    issueDate.setFullYear(today.getFullYear() - yearsAgoIssued);

    // Expiry date: validityYears from issue date
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + validityYears);

    return {
        issueDate: getFormattedDate(issueDate),
        expiryDate: getFormattedDate(expiryDate)
    };
}

/**
 * Generates a date of birth string (DD/MM/YYYY).
 * If only one age is provided, returns DOB for that age.
 * If minAge and maxAge are provided, returns DOB for a random age in that range.
 * @param minAge Minimum age (or exact age if maxAge is not provided)
 * @param maxAge Maximum age (optional)
 * @returns DOB string in DD/MM/YYYY format
 */
export function generateDob(minAge: number, maxAge?: number): string {
    let age: number;
    if (typeof maxAge === 'number') {
        age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    } else {
        age = minAge;
    }
    const today = new Date();
    const dob = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
    return getFormattedDate(dob);
}

/**
 * Calculates the age from a date of birth string (DD/MM/YYYY)
 * @param dob Date of birth string in DD/MM/YYYY format
 * @returns Age as a number
 */
export function getAgeFromDob(dob: string): number {
    const today = new Date();
    const [day, month, year] = dob.split("/").map(Number);
    const age = today.getFullYear() - year;
    return age;
}

/**
 * Calculates the expected insurance premium based on business rules.
 * @param params Object containing customer, driver, vehicle, coverage, and options
 * @returns Calculated premium (number) and breakdown (object)
 */
export function calculateExpectedPremium(params: {
    customer: any;
    driver: any;
    vehicle: any;
    coverage: {
        type: string; // 'Comprehensive', 'Third Party', etc.
        plan?: string; // Plan code (e.g., 'StandardWORentalBenefits', 'Smallz', etc.)
        excessOption?: string;
    };
    options?: {
        rentalBenefit?: boolean;
        commercialUse?: boolean;
        restrictedDriving?: boolean;
        gpsTracking?: boolean;
        otherPolicyVehicle?: boolean;
        bundleDiscount?: boolean;
        increasedThirdPartyLimits?: 'OptionI' | 'OptionII';
        rentalWeeks?: number;
        rentalSize?: 'Compact' | 'Mid-size' | 'SUV';
        repairBenefit?: number; // Repair benefit amount (50000, 100000, 150000)
        country?: 'Jamaica' | 'Barbados'; // Country for calculation rules
    };
}): { premium: number, breakdown: Record<string, any> } {
    // --- Extract fields from customer, driver, vehicle ---
    // Country: determine calculation rules
    const country = params.options?.country || 'Jamaica'; // Default to Jamaica if not specified

    // Customer: get gender and age from generalInformation
    let customerGender = params.customer?.generalInformation?.["Gender"] || params.customer?.gender;
    let customerDob = params.customer?.generalInformation?.["Date of Birth"] || params.customer?.dob;
    let customerAge = params.customer?.generalInformation?.["Age"] || params.customer?.age;
    if (!customerAge && customerDob) {
        // Parse age from DOB string (DD/MM/YYYY)
        const [day, month, year] = customerDob.split("/").map(Number);
        if (year) {
            const today = new Date();
            let age = today.getFullYear() - year;
            if (
                today.getMonth() + 1 < month ||
                (today.getMonth() + 1 === month && today.getDate() < day)
            ) {
                age--;
            }
            customerAge = age;
        }
    }
    // Driver: get gender, age, claimFreeYears
    let driverGender = params.driver?.gender || params.driver?.generalInformation?.["Gender"];
    let driverDob = params.driver?.dob || params.driver?.generalInformation?.["Date of Birth"];
    let driverAge = params.driver?.age || params.driver?.generalInformation?.["Age"];
    if (!driverAge && driverDob) {
        const [day, month, year] = driverDob.split("/").map(Number);
        if (year) {
            const today = new Date();
            let age = today.getFullYear() - year;
            if (
                today.getMonth() + 1 < month ||
                (today.getMonth() + 1 === month && today.getDate() < day)
            ) {
                age--;
            }
            driverAge = age;
        }
    }
    // NFD: Read from customer (policyholder), not driver
    let claimFreeYears = params.customer?.claimFreeYears || params.customer?.claimFree || 0;

    // Vehicle: get year, make, model, sumInsured, fuelType, performance
    let vehicleYear = Number(params.vehicle?.year);
    let vehicleMake = params.vehicle?.make;
    let vehicleModel = params.vehicle?.model;
    let vehicleSumInsured = Number(params.vehicle?.sumInsured);
    let vehicleFuelType = params.vehicle?.fuelType;
    let vehiclePerformance = params.vehicle?.performance;
    const plan = params.coverage.plan;
    // --- End extraction ---

    // Check for Smallz plan - flat rate with no discounts or loadings
    if (plan === 'Smallz') {
        // Country-specific Smallz rates
        const smallzRates = {
            Jamaica: 18500,
            Barbados: 1400 // $1,400 for Barbados (same as comprehensive minimum)
        };
        const smallzPremium = smallzRates[country as keyof typeof smallzRates] || smallzRates.Jamaica;


        return {
            premium: smallzPremium,
            breakdown: {
                country,
                vehicleGroup: 'N/A',
                isHighPerformance: false,
                sumInsured: vehicleSumInsured,
                coverageType: params.coverage.type,
                driverAge,
                driverGender,
                claimFreeYears,
                plan: 'Smallz',
                ownDamageRate: 0,
                ownDamagePremium: 0,
                thirdPartyPremium: 0,
                basicPremium: smallzPremium,
                increasedLimitsPremium: 0,
                subtotalAfterLimits: smallzPremium,
                loadings: [],
                subtotalAfterLoadings: smallzPremium,
                discounts: [],
                applicableDiscounts: [],
                subtotalAfterDiscounts: smallzPremium,
                rentalBenefitPremium: 0,
                subtotalAfterRental: smallzPremium,
                minPremium: 0,
                finalPremium: smallzPremium,
                roundedPremium: smallzPremium,
                repairBenefitPremium: 0
            }
        };
    }// 1. Determine vehicle group based on make/model
    const make = vehicleMake ? vehicleMake.toLowerCase() : '';
    let vehicleGroup = 'Standard';
    if (make.includes('toyota')) {
        if (['succeed', 'probox', 'belta', 'wish', 'corolla', 'allion', 'voxy', 'mark x', 'axio', 'isis'].some(model => vehicleModel?.toLowerCase().includes(model))) {
            vehicleGroup = 'Group1';
        } else if (['premio', 'yaris'].some(model => vehicleModel?.toLowerCase().includes(model))) {
            vehicleGroup = 'Group2';
        }
    } else if (make.includes('mazda')) {
        if (vehicleModel?.toLowerCase().includes('familia')) {
            vehicleGroup = 'Group1';
        } else if (vehicleModel?.toLowerCase().includes('demio')) {
            vehicleGroup = 'Group2';
        }
    } else if (make.includes('nissan')) {
        if (['ad', 'ad wagon', 'ad expert', 'ad van', 'ad ve', 'tiida', 'latio'].some(model => vehicleModel?.toLowerCase().includes(model))) {
            vehicleGroup = 'Group1';
        }
    } else if (['hyundai tucson', 'honda accord', 'honda stream', 'honda cr-z', 'mitsubishi pajero', 'mitsubishi asx'].some(combo => make.includes(combo.split(' ')[0]) && vehicleModel?.toLowerCase().includes(combo.split(' ')[1]))) {
        vehicleGroup = 'Group2';
    }

    // 2. Determine if vehicle is high performance (50% loading)
    let isHighPerformance = false;
    const highPerformanceCars = [
        // Audi - only R8 and S models (not all Audis)
        { make: 'audi', models: ['r8', 's3', 's4', 's5', 's6', 's7', 's8', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7', 'rs8', 'tt rs'] },
        // BMW - only M series
        { make: 'bmw', models: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm8', 'x1m', 'x3m', 'x4m', 'x5m', 'x6m'] },
        // Mercedes-Benz - specific AMG and performance models
        { make: 'mercedes', models: ['cla', 'clk', 'cls', 'cls 63', 'cls 500', 'cls 550', 'cs 55 amg', 'e63 amg', 'ml63 amg', 's550', 's600', 'sl', 'slk'] },
        // Other high performance cars from Appendix A
        { make: 'ferrari', models: ['*'] }, // All models
        { make: 'maserati', models: ['*'] }, // All models
        { make: 'aston martin', models: ['*'] }, // All models
        { make: 'lamborghini', models: ['*'] }, // All models
        { make: 'mclaren', models: ['*'] }, // All models
        { make: 'chevrolet', models: ['corvette'] },
        { make: 'dodge', models: ['viper', 'charger'] },
        { make: 'volkswagen', models: ['gti'] },
        { make: 'lexus', models: ['fla'] },
        { make: 'kia', models: ['stinger'] },
        { make: 'mazda', models: ['rx7'] },
        { make: 'mitsubishi', models: ['evolution'] },
        { make: 'nissan', models: ['skyline gt-r turbo'] },
        { make: 'subaru', models: ['impreza wrx sti', 'impreza wrx turbo', 'legacy turbo', 'liberty turbo', 'brz'] },
        { make: 'toyota', models: ['86', 'celica turbo', 'mr2 turbo', 'levin', 'trueno supercharger', 'starlet gt turbo', 'supra twin turbo'] }
    ];

    for (const car of highPerformanceCars) {
        if (make.includes(car.make)) {
            if (car.models.includes('*') || car.models.some(model => vehicleModel?.toLowerCase().includes(model))) {
                isHighPerformance = true;
                break;
            }
        }
    }

    // 3. CALCULATION SEQUENCE (following checklist exactly)

    // Step 1: Basic Premium
    const sumInsured = vehicleSumInsured;
    const coverageType = params.coverage.type;
    let basicPremium = 0;
    let ownDamageRate = 0;
    let thirdPartyPremium = 0;

    // Eligibility checks
    if (country === 'Jamaica') {
        if (sumInsured < 500000 && coverageType !== 'PrivateCTP') {
            throw new Error('Sum insured < $500k requires Third Party Only coverage');
        }
        if (sumInsured > 15000000) {
            throw new Error('Sum insured > $15M requires referral');
        }
    } else if (country === 'Barbados') {
        if (sumInsured < 7500 && coverageType.toLowerCase() === 'comprehensive') {
            throw new Error('Sum insured < $7,500 not acceptable for Comprehensive cover in Barbados');
        }
        if (sumInsured > 250000) {
            throw new Error('Sum insured > $250,000 requires referral in Barbados');
        }
    }
    if (coverageType.toLowerCase() === 'comprehensive') {
        // Country-specific comprehensive rates
        const comprehensiveRatesByCountry = {
            Jamaica: {
                Standard: [
                    { min: 500000, max: 749999, rate: 0.20 },
                    { min: 750000, max: 1499999, rate: 0.095 },
                    { min: 1500000, max: 2999999, rate: 0.075 },
                    { min: 3000000, max: 4999999, rate: 0.04 },
                    { min: 5000000, max: 15000000, rate: 0.04 }, // Standard 4% only for $5M-$15M
                ],
                Group1: [
                    { min: 500000, max: 749999, rate: 0.25 },
                    { min: 750000, max: 1499999, rate: 0.25 },
                    { min: 1500000, max: 2999999, rate: 0.25 },
                    { min: 3000000, max: 4999999, rate: 0.15 },
                    { min: 5000000, max: 15000000, rate: 0.04 }, // Use Standard rate for $5M-$15M
                ],
                Group2: [
                    { min: 500000, max: 749999, rate: 0.20 },
                    { min: 750000, max: 1499999, rate: 0.14 },
                    { min: 1500000, max: 2999999, rate: 0.14 },
                    { min: 3000000, max: 4999999, rate: 0.065 },
                    { min: 5000000, max: 15000000, rate: 0.04 }, // Use Standard rate for $5M-$15M
                ]
            },
            Barbados: {
                Standard: [
                    { min: 7500, max: 18749, rate: 0.19 },
                    { min: 18750, max: 37499, rate: 0.12 },
                    { min: 37500, max: 74499, rate: 0.09 },
                    { min: 74500, max: 124999, rate: 0.06 },
                    { min: 125000, max: 250000, rate: 0.055 }
                ],
                Group1: [
                    { min: 7500, max: 18749, rate: 0.19 },
                    { min: 18750, max: 37499, rate: 0.12 },
                    { min: 37500, max: 74499, rate: 0.09 },
                    { min: 74500, max: 124999, rate: 0.06 },
                    { min: 125000, max: 250000, rate: 0.055 }
                ],
                Group2: [
                    { min: 7500, max: 18749, rate: 0.19 },
                    { min: 18750, max: 37499, rate: 0.12 },
                    { min: 37500, max: 74499, rate: 0.09 },
                    { min: 74500, max: 124999, rate: 0.06 },
                    { min: 125000, max: 250000, rate: 0.055 }
                ]
            }
        };

        const comprehensiveRates = comprehensiveRatesByCountry[country as keyof typeof comprehensiveRatesByCountry] || comprehensiveRatesByCountry.Jamaica;

        const rates = comprehensiveRates[vehicleGroup as keyof typeof comprehensiveRates] || comprehensiveRates.Standard;

        for (const row of rates) {
            if (sumInsured >= row.min && sumInsured <= row.max) {
                ownDamageRate = row.rate;
                break;
            }
        }

        const ownDamagePremium = sumInsured * ownDamageRate;

        // Country-specific Third Party premium amounts
        const thirdPartyAmounts = {
            Jamaica: {
                below5M: 50000,
                above5M: 0
            },
            Barbados: {
                below5M: 3000, // Fixed $3,000 for all comprehensive coverage in Barbados
                above5M: 3000
            }
        };

        const tpAmounts = thirdPartyAmounts[country as keyof typeof thirdPartyAmounts] || thirdPartyAmounts.Jamaica;

        if (country === 'Barbados') {
            thirdPartyPremium = tpAmounts.below5M; // Fixed $3,000 for all comprehensive coverage in Barbados
        } else {
            // Jamaica logic
            if (sumInsured >= 5000000 && sumInsured <= 15000000) {
                thirdPartyPremium = tpAmounts.above5M; // No Third Party premium for $5M-$15M range
            } else {
                thirdPartyPremium = tpAmounts.below5M; // Fixed Third Party amount for other ranges
            }
        }

        basicPremium = ownDamagePremium + thirdPartyPremium;

        if (thirdPartyPremium > 0) {
        } else {
        }

    } else if (coverageType === 'PrivateCTPFT') {
        // Country-specific Third Party Fire & Theft rates
        const tpfTtRatesByCountry = {
            Jamaica: {
                Group1: 0.04,
                Group2: 0.025,
                Standard: 0.01,
                thirdPartyAmount: 30000
            },
            Barbados: {
                Group1: 0.015, // 1.5% for all vehicles in Barbados
                Group2: 0.015,
                Standard: 0.015,
                thirdPartyAmount: 1800
            }
        };

        const tpfTtRates = tpfTtRatesByCountry[country as keyof typeof tpfTtRatesByCountry] || tpfTtRatesByCountry.Jamaica;

        if (vehicleGroup === 'Group1') {
            ownDamageRate = tpfTtRates.Group1;
        } else if (vehicleGroup === 'Group2') {
            ownDamageRate = tpfTtRates.Group2;
        } else {
            ownDamageRate = tpfTtRates.Standard;
        }

        const ownDamagePremium = sumInsured * ownDamageRate;
        thirdPartyPremium = tpfTtRates.thirdPartyAmount;
        basicPremium = ownDamagePremium + thirdPartyPremium;


    } else if (coverageType === 'PrivateCTPP') {
        // Country-specific Private Car Third Party Plus Repair rates
        const ctppRatesByCountry = {
            Jamaica: 35000,
            Barbados: 1800 // Same as Third Party Only in Barbados
        };

        thirdPartyPremium = ctppRatesByCountry[country as keyof typeof ctppRatesByCountry] || ctppRatesByCountry.Jamaica;
        basicPremium = thirdPartyPremium;    } else if (coverageType === 'PrivateCTP') {
        // Country-specific Third Party Only rates
        const ctpRatesByCountry = {
            Jamaica: 30000,
            Barbados: 1800 // Fixed $1,800 for Third Party Only in Barbados
        };

        basicPremium = ctpRatesByCountry[country as keyof typeof ctpRatesByCountry] || ctpRatesByCountry.Jamaica;
        thirdPartyPremium = basicPremium;    }
    // PRIVATE CTPP SPECIFIC CALCULATION SEQUENCE
    if (coverageType === 'PrivateCTPP') {
        // Step 1: Apply Third Party Premium (already done above)
        let ctpSubtotal = basicPremium;
        // Step 2: Add Premium for increased Limits of Liability (if chosen)
        const increasedLimitsRatesByCountry = {
            Jamaica: {
                OptionI: 10000, // $10M/$10M/$10M
                OptionII: 15000 // $20M/$20M/$20M
            },
            Barbados: {
                OptionI: 9000, // Slightly lower for Barbados
                OptionII: 13500
            }
        };

        const increasedLimitsRates = increasedLimitsRatesByCountry[country as keyof typeof increasedLimitsRatesByCountry] || increasedLimitsRatesByCountry.Jamaica;

        let increasedLimitsPremium = 0;
        if (params.options?.increasedThirdPartyLimits === 'OptionI') {
            increasedLimitsPremium = increasedLimitsRates.OptionI;        } else if (params.options?.increasedThirdPartyLimits === 'OptionII') {
            increasedLimitsPremium = increasedLimitsRates.OptionII;        }
        ctpSubtotal += increasedLimitsPremium;

        // Step 3: Add Loadings
        const ctpLoadings: Array<{ name: string; rate: number }> = [];

        // Age & Gender Loading for PrivateCTPP (Barbados uses different logic)
        if (country === 'Barbados') {
            // Barbados age loadings for PrivateCTPP
            if (driverAge >= 21 && driverAge <= 25) {
                ctpLoadings.push({ name: 'ageGender', rate: 0.50 }); // 50% loading
            }
        } else {
            // Jamaica age loadings for PrivateCTPP
            if (driverAge < 30) {
                if (driverGender?.toLowerCase() === 'male') {
                    ctpLoadings.push({ name: 'ageGender', rate: 1.25 }); // 125%
                } else {
                    ctpLoadings.push({ name: 'ageGender', rate: 0.90 }); // 90%
                }
            } else if (driverAge >= 30 && driverAge <= 40) {
                if (driverGender?.toLowerCase() === 'male') {
                    ctpLoadings.push({ name: 'ageGender', rate: 0.45 }); // 45%
                } else {
                    ctpLoadings.push({ name: 'ageGender', rate: 0.20 }); // 20%
                }
            }
        }

        // JX1 Commercial Travelling Loading
        if (params.options?.commercialUse) {
            if (country === 'Barbados') {
                ctpLoadings.push({ name: 'commercialUse', rate: 0.25 }); // 25% for Barbados
            } else {
                ctpLoadings.push({ name: 'commercialUse', rate: 0.20 }); // 20% for Jamaica
            }
        }

        // High Performance Loading
        if (isHighPerformance) {
            ctpLoadings.push({ name: 'highPerformance', rate: 0.50 }); // 50%
        }

        // Vehicle Age Loading
        const currentYear = new Date().getFullYear();
        const ageYears = currentYear - vehicleYear;
        if (country === 'Barbados') {
            if (ageYears >= 20 && ageYears <= 25) {
                ctpLoadings.push({ name: 'vehicleAge', rate: 0.15 }); // 15% for Barbados
            }
        } else {
            if (ageYears >= 21 && ageYears <= 25) {
                ctpLoadings.push({ name: 'vehicleAge', rate: 0.25 }); // 25% for Jamaica
            }
        }

        // Apply loadings sequentially
        if (ctpLoadings.length > 0) {            for (const loading of ctpLoadings) {
                const loadingAmount = ctpSubtotal * loading.rate;
                const previousSubtotal = ctpSubtotal;
                ctpSubtotal *= (1 + loading.rate);

                let loadingDesc = '';
                switch (loading.name) {
                    case 'ageGender':
                        loadingDesc = `Age & Gender (${driverAge < 30 ? '<30' : '30-40'} ${driverGender})`;
                        break;
                    case 'commercialUse':
                        loadingDesc = 'JX1 (Commercial travelling)';
                        break;
                    case 'highPerformance':
                        loadingDesc = 'High Performance';
                        break;
                    case 'vehicleAge':
                        loadingDesc = `Vehicle Age (${ageYears} years)`;
                        break;
                    default:
                        loadingDesc = loading.name;
                }        }
        }

        // Step 4: Apply Discounts
        const ctpDiscounts: Array<{ name: string; rate: number }> = [];

        // Age 60+ discount
        if (driverAge >= 60) {
            ctpDiscounts.push({ name: 'age60Plus', rate: 0.20 }); // 20%
        }

        // Restricted driving discount
        if (params.options?.restrictedDriving) {
            ctpDiscounts.push({ name: 'restrictedDriving', rate: 0.10 }); // 10%
        }

        // Other policy/vehicle discount
        if (params.options?.otherPolicyVehicle) {
            ctpDiscounts.push({ name: 'otherPolicyVehicle', rate: 0.05 }); // 5%
        }

        // Bundle discount (Barbados only)
        if (country === 'Barbados' && params.options?.bundleDiscount) {
            ctpDiscounts.push({ name: 'bundle', rate: 0.10 }); // 10%
        }

        // NFD (No Fault Discount) - applies to "THIRD PARTY + Repair Benefit" portion
        if (country === 'Barbados') {
            // Barbados NFD rates
            if (claimFreeYears >= 5) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.50 }); // 50%
            } else if (claimFreeYears === 4) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.40 }); // 40%
            } else if (claimFreeYears === 3) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.30 }); // 30%
            } else if (claimFreeYears === 2) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.25 }); // 25%
            } else if (claimFreeYears === 1) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.15 }); // 15%
            }
        } else {
            // Jamaica NFD rates
            if (claimFreeYears >= 4) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.25 }); // 25%
            } else if (claimFreeYears === 3) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.20 }); // 20%
            } else if (claimFreeYears === 2) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.15 }); // 15%
            } else if (claimFreeYears === 1) {
                ctpDiscounts.push({ name: 'nfd', rate: 0.10 }); // 10%
            }
        }

        // Apply discounts sequentially
        if (ctpDiscounts.length > 0) {            for (const discount of ctpDiscounts) {
                const discountAmount = ctpSubtotal * discount.rate;
                const previousSubtotal = ctpSubtotal;
                ctpSubtotal *= (1 - discount.rate);

                let discountDesc = '';
                switch (discount.name) {
                    case 'age60Plus':
                        discountDesc = `Age 60+ (${driverAge} years)`;
                        break;
                    case 'restrictedDriving':
                        discountDesc = 'Restricted Driving';
                        break;
                    case 'otherPolicyVehicle':
                        discountDesc = 'Other Policy/Vehicle';
                        break;
                    case 'bundle':
                        discountDesc = 'Bundle Discount';
                        break;
                    case 'nfd':
                        discountDesc = `NFD ${claimFreeYears} years`;
                        break;
                    default:
                        discountDesc = discount.name;
                }        }
        }

        // Step 5: Add Repair Benefit Premium (flat charge applicable after discounts/minimum premium)
        let repairBenefitPremium = 0;
        if (params.options?.repairBenefit) {
            const repairBenefitRatesByCountry = {
                Jamaica: {
                    50000: 6500,
                    100000: 11000,
                    150000: 14500
                },
                Barbados: {
                    50000: 6000, // Slightly lower for Barbados
                    100000: 10000,
                    150000: 13000
                }
            };

            const repairBenefitRates = repairBenefitRatesByCountry[country as keyof typeof repairBenefitRatesByCountry] || repairBenefitRatesByCountry.Jamaica;

            const benefitAmount = params.options.repairBenefit;
            if (repairBenefitRates[benefitAmount as keyof typeof repairBenefitRates]) {
                repairBenefitPremium = repairBenefitRates[benefitAmount as keyof typeof repairBenefitRates];          }
        }

        // Check minimum premium before adding repair benefit
        const ctppMinPremiumsByCountry = {
            Jamaica: 25000,
            Barbados: 810 // $810 for Barbados
        };

        let minPremium = ctppMinPremiumsByCountry[country as keyof typeof ctppMinPremiumsByCountry] || ctppMinPremiumsByCountry.Jamaica;
        let finalCtpPremium = Math.max(ctpSubtotal, minPremium);

        if (finalCtpPremium > ctpSubtotal) {    }

        // Add repair benefit to final premium
        finalCtpPremium += repairBenefitPremium;        // Set the final values for the rest of the function
        const finalSubtotal = finalCtpPremium;
        const finalBasicPremium = finalCtpPremium;
        const finalThirdPartyPremium = 35000; // Keep original for breakdown (will be updated to country-specific rate)
        const finalIncreasedLimitsPremium = params.options?.increasedThirdPartyLimits === 'OptionI' ? increasedLimitsRates.OptionI :
            params.options?.increasedThirdPartyLimits === 'OptionII' ? increasedLimitsRates.OptionII : 0;

        // Skip the regular calculation steps for PrivateCTPP
        return {
            premium: Math.round(finalCtpPremium),
            breakdown: {
                country,
                vehicleGroup,
                isHighPerformance,
                sumInsured,
                coverageType,
                driverAge,
                driverGender,
                claimFreeYears,
                ageYears,
                ownDamageRate: 0,
                ownDamagePremium: 0,
                thirdPartyPremium: finalThirdPartyPremium,
                basicPremium: finalBasicPremium,
                increasedLimitsPremium: finalIncreasedLimitsPremium,
                subtotalAfterLimits: ctpSubtotal,
                loadings: ctpLoadings,
                subtotalAfterLoadings: ctpSubtotal,
                discounts: ctpDiscounts,
                applicableDiscounts: ctpDiscounts,
                subtotalAfterDiscounts: ctpSubtotal,
                rentalBenefitPremium: 0,
                subtotalAfterRental: finalCtpPremium,
                minPremium,
                finalPremium: finalCtpPremium,
                roundedPremium: Math.round(finalCtpPremium),
                repairBenefitPremium
            }
        };
    }

    // Step 2: Add premium for increased third-party limits (if chosen)
    const increasedLimitsRatesByCountry = {
        Jamaica: {
            OptionI: 10000, // $10M/$10M/$10M
            OptionII: 15000 // $20M/$20M/$20M
        },
        Barbados: {
            OptionI: 9000, // Slightly lower for Barbados
            OptionII: 13500
        }
    };

    const increasedLimitsRates = increasedLimitsRatesByCountry[country as keyof typeof increasedLimitsRatesByCountry] || increasedLimitsRatesByCountry.Jamaica;

    let increasedLimitsPremium = 0;
    if (params.options?.increasedThirdPartyLimits === 'OptionI') {
        increasedLimitsPremium = increasedLimitsRates.OptionI;  } else if (params.options?.increasedThirdPartyLimits === 'OptionII') {
        increasedLimitsPremium = increasedLimitsRates.OptionII;  }
    let subtotal = basicPremium + increasedLimitsPremium;

    if (increasedLimitsPremium > 0) {    }

    // Step 3: Apply loadings sequentially
    const loadings: Array<{ name: string; rate: number }> = [];

    // Age & Gender Loading
    if (country === 'Barbados') {
        // Barbados age loadings
        if (coverageType.toLowerCase() === 'comprehensive') {
            if (driverAge < 26) {
                loadings.push({ name: 'ageGender', rate: 1.0 }); // 100% loading
            } else if (driverAge >= 26 && driverAge <= 29) {
                loadings.push({ name: 'ageGender', rate: 0.66 }); // 66% loading
            } else if (driverAge >= 30 && driverAge <= 40) {
                loadings.push({ name: 'ageGender', rate: 0.30 }); // 30% loading
            }
        } else {
            // TPF&T and TPO age loading for Barbados
            if (driverAge >= 21 && driverAge <= 25) {
                loadings.push({ name: 'ageGender', rate: 0.50 }); // 50% loading
            }
        }
    } else {
        // Jamaica age loadings (original logic)
        if (coverageType.toLowerCase() === 'comprehensive') {
            if (driverAge < 30) {
                if (driverGender?.toLowerCase() === 'male') {
                    loadings.push({ name: 'ageGender', rate: 1.25 }); // 125%
                } else {
                    loadings.push({ name: 'ageGender', rate: 0.90 }); // 90%
                }
            } else if (driverAge >= 30 && driverAge <= 40) {
                if (driverGender?.toLowerCase() === 'male') {
                    loadings.push({ name: 'ageGender', rate: 0.45 }); // 45%
                } else {
                    loadings.push({ name: 'ageGender', rate: 0.20 }); // 20%
                }
            }
        } else {
            // TPF&T and TPO age loading
            if (driverAge < 30) {
                loadings.push({ name: 'ageGender', rate: 0.30 }); // 30%
            } else if (driverAge >= 30 && driverAge <= 40) {
                loadings.push({ name: 'ageGender', rate: 0.20 }); // 20%
            }
        }
    }

    // JX1 Commercial Travelling Loading
    if (params.options?.commercialUse) {
        if (country === 'Barbados') {
            loadings.push({ name: 'commercialUse', rate: 0.25 }); // 25% for Barbados
        } else {
            loadings.push({ name: 'commercialUse', rate: 0.20 }); // 20% for Jamaica
        }
    }

    // High Performance Loading
    if (isHighPerformance) {
        loadings.push({ name: 'highPerformance', rate: 0.50 }); // 50%
    }

    // Suzuki Swift Loading (Barbados only)
    if (country === 'Barbados' && coverageType.toLowerCase() === 'comprehensive') {
        const make = vehicleMake ? vehicleMake.toLowerCase() : '';
        const model = vehicleModel ? vehicleModel.toLowerCase() : '';
        if (make.includes('suzuki') && model.includes('swift')) {
            loadings.push({ name: 'suzukiSwift', rate: 0.20 }); // 20% loading
        }
    }

    // Vehicle Type Loading (Barbados only) - 25% loading for specific models
    if (country === 'Barbados' && coverageType.toLowerCase() === 'comprehensive') {
        const make = vehicleMake ? vehicleMake.toLowerCase() : '';
        const model = vehicleModel ? vehicleModel.toLowerCase() : '';
        const barbadosVehicleLoadings = [
            { make: 'audi', model: 'a6' },
            { make: 'bmw', model: '520d' },
            { make: 'bmw', model: '320d' },
            { make: 'bmw', model: '335i' },
            { make: 'chevrolet', model: 'colorado' },
            { make: 'isuzu', model: 'dmax' },
            { make: 'kia', model: 'sorento' },
            { make: 'kia', model: 'sportage' },
            { make: 'kia', model: 'cerato' },
            { make: 'mercedes', model: 'e220' },
            { make: 'mg', model: 'zs' }
        ];

        for (const vehicle of barbadosVehicleLoadings) {
            if (make.includes(vehicle.make) && model.includes(vehicle.model)) {
                loadings.push({ name: 'vehicleType', rate: 0.25 }); // 25% loading
                break;
            }
        }
    }

    // Vehicle Age Loading
    const currentYear = new Date().getFullYear();
    const ageYears = currentYear - vehicleYear;
    if (country === 'Barbados') {
        if (ageYears >= 20 && ageYears <= 25) {
            loadings.push({ name: 'vehicleAge', rate: 0.15 }); // 15% for Barbados
        }
    } else {
        // Jamaica vehicle age loading
        if (ageYears >= 21) {
            loadings.push({ name: 'vehicleAge', rate: 0.25 }); // 25% for Jamaica
        }
    }

    // Apply loadings sequentially
    if (loadings.length > 0) {        for (const loading of loadings) {
            const loadingAmount = subtotal * loading.rate;
            const previousSubtotal = subtotal;
            subtotal *= (1 + loading.rate);

            let loadingDesc = '';
            switch (loading.name) {
                case 'ageGender':
                    loadingDesc = `Age & Gender (${driverAge < 30 ? '<30' : '30-40'} ${driverGender})`;
                    break;
                case 'commercialUse':
                    loadingDesc = 'JX1 (Commercial travelling)';
                    break;
                case 'highPerformance':
                    loadingDesc = 'High Performance';
                    break;
                case 'vehicleAge':
                    loadingDesc = `Vehicle Age (${ageYears} years)`;
                    break;
                case 'suzukiSwift':
                    loadingDesc = 'Suzuki Swift Loading';
                    break;
                case 'vehicleType':
                    loadingDesc = 'Vehicle Type Loading';
                    break;
                default:
                    loadingDesc = loading.name;
            }    }
    }

    // Step 4: Apply discounts sequentially
    const discounts: Array<{ name: string; rate: number }> = [];

    // Age 60+ discount
    if (driverAge >= 60) {
        if (country === 'Barbados' && coverageType.toLowerCase() === 'comprehensive') {
            discounts.push({ name: 'age60Plus', rate: 0.30 }); // 30% for Barbados comprehensive only
        } else {
            discounts.push({ name: 'age60Plus', rate: 0.20 }); // 20% for Jamaica or other coverage types
        }
    }

    // Restricted driving discount
    if (params.options?.restrictedDriving) {
        discounts.push({ name: 'restrictedDriving', rate: 0.10 }); // 10%
    }

    // Other policy/vehicle discount
    if (params.options?.otherPolicyVehicle) {
        discounts.push({ name: 'otherPolicyVehicle', rate: 0.05 }); // 5%
    }

    // Bundle discount (Barbados only)
    if (country === 'Barbados' && params.options?.bundleDiscount) {
        discounts.push({ name: 'bundle', rate: 0.10 }); // 10%
    }

    // Bundle discount (Jamaica only)
    if (country === 'Jamaica' && params.options?.bundleDiscount) {
        discounts.push({ name: 'bundle', rate: 0.05 }); // 5%
    }

    // GPS tracking discount - Only allow on Comp/TPF&T (theft cover present) and Groups 1–2
    if (params.options?.gpsTracking &&
        (coverageType.toLowerCase() === 'comprehensive' || coverageType === 'PrivateCTPFT') &&
        (vehicleGroup === 'Group1' || vehicleGroup === 'Group2')) {
        discounts.push({ name: 'gpsTracking', rate: 0.10 }); // 10%
    }

    // NFD (No Fault Discount) - Read from customer (policyholder), not driver
    if (country === 'Barbados') {
        // Barbados NFD rates
        if (claimFreeYears >= 5) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.70 }); // 70%
            } else {
                discounts.push({ name: 'nfd', rate: 0.50 }); // 50%
            }
        } else if (claimFreeYears === 4) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.60 }); // 60%
            } else {
                discounts.push({ name: 'nfd', rate: 0.40 }); // 40%
            }
        } else if (claimFreeYears === 3) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.50 }); // 50%
            } else {
                discounts.push({ name: 'nfd', rate: 0.30 }); // 30%
            }
        } else if (claimFreeYears === 2) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.40 }); // 40%
            } else {
                discounts.push({ name: 'nfd', rate: 0.25 }); // 25%
            }
        } else if (claimFreeYears === 1) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.30 }); // 30%
            } else {
                discounts.push({ name: 'nfd', rate: 0.15 }); // 15%
            }
        }
    } else {
        // Jamaica NFD rates (original logic)
        if (claimFreeYears >= 4) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.60 }); // 60%
            } else {
                discounts.push({ name: 'nfd', rate: 0.25 }); // 25%
            }
        } else if (claimFreeYears === 3) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.40 }); // 40%
            } else {
                discounts.push({ name: 'nfd', rate: 0.20 }); // 20%
            }
        } else if (claimFreeYears === 2) {
            if (coverageType.toLowerCase() === 'comprehensive') {
                discounts.push({ name: 'nfd', rate: 0.20 }); // 20%
            } else {
                discounts.push({ name: 'nfd', rate: 0.15 }); // 15%
            }
        } else if (claimFreeYears === 1) {
            discounts.push({ name: 'nfd', rate: 0.10 }); // 10% for all
        }
    }

    // Excess-based discount
    if (params.coverage.excessOption === 'Higher') {
        if (country === 'Barbados') {
            discounts.push({ name: 'higherExcess', rate: 0.15 }); // 15% for Barbados
        } else {
            discounts.push({ name: 'higherExcess', rate: 0.12 }); // 12% for Jamaica
        }
    }

    // Audi/BMW cap: Keep "max 2 discounts", but apply them sequentially, not as one merged percentage
    let applicableDiscounts = discounts;
    if (make.includes('audi') || make.includes('bmw')) {
        // Sort by rate (highest first) and take top 2
        applicableDiscounts = discounts
            .sort((a, b) => b.rate - a.rate)
            .slice(0, 2);
        if (discounts.length > 2) {        }
    }

    // Apply discounts sequentially
    if (applicableDiscounts.length > 0) {        for (const discount of applicableDiscounts) {
            const discountAmount = subtotal * discount.rate;
            const previousSubtotal = subtotal;
            subtotal *= (1 - discount.rate);

            let discountDesc = '';
            switch (discount.name) {
                case 'age60Plus':
                    discountDesc = `Age 60+ (${driverAge} years)`;
                    break;
                case 'restrictedDriving':
                    discountDesc = 'Restricted Driving';
                    break;
                case 'otherPolicyVehicle':
                    discountDesc = 'Other Policy/Vehicle';
                    break;
                case 'gpsTracking':
                    discountDesc = 'GPS Tracking';
                    break;
                case 'nfd':
                    discountDesc = `NFD ${claimFreeYears} years (${coverageType})`;
                    break;
                case 'higherExcess':
                    discountDesc = country === 'Barbados' ? 'Higher Excess (15%)' : 'Higher Excess (12%)';
                    break;
                case 'bundle':
                    discountDesc = 'Bundle Discount';
                    break;
                default:
                    discountDesc = discount.name;
            }    }
    }

    // Step 5: Add rental benefit (if chosen; Comprehensive only or third party & theft)
    let rentalBenefitPremium = 0;
    if (params.options?.rentalBenefit) {
        const rentalRatesByCountry = {
            Jamaica: {
                Compact: { 1: 3300, 2: 6600, 3: 9900 },
                'Mid-size': { 1: 4600, 2: 9200, 3: 13800 },
                SUV: { 1: 5600, 2: 11200, 3: 16800 }
            },
            Barbados: {
                Compact: { 1: 88, 2: 172, 3: 256 },
                'Mid-size': { 1: 99, 2: 194, 3: 288 },
                SUV: { 1: 113, 2: 221, 3: 328 }
            }
        };

        const rentalRates = rentalRatesByCountry[country as keyof typeof rentalRatesByCountry] || rentalRatesByCountry.Jamaica;

        const weeks = params.options.rentalWeeks || 1;
        const size = params.options.rentalSize || 'Compact';

        if (rentalRates[size] && rentalRates[size][weeks]) {
            rentalBenefitPremium = rentalRates[size][weeks];      }
    }
    subtotal += rentalBenefitPremium;

    if (rentalBenefitPremium > 0) {    }

    // Step 6: Check minimum premium
    const minPremiumsByCountry = {
        Jamaica: {
            comprehensive: 32500,
            PrivateCTPFT: 27500,
            PrivateCTPP: 25000,
            PrivateCTP: 25000
        },
        Barbados: {
            comprehensive: 1400, // $1,400 for Barbados
            PrivateCTPFT: 1000, // $1,000 for Barbados
            PrivateCTPP: 810, // $810 for Barbados
            PrivateCTP: 810 // $810 for Barbados
        }
    };

    const minPremiums = minPremiumsByCountry[country as keyof typeof minPremiumsByCountry] || minPremiumsByCountry.Jamaica;

    let minPremium = 0;
    if (coverageType.toLowerCase() === 'comprehensive') {
        minPremium = minPremiums.comprehensive;
    } else if (coverageType === 'PrivateCTPFT') {
        minPremium = minPremiums.PrivateCTPFT;
    } else if (coverageType === 'PrivateCTPP') {
        minPremium = minPremiums.PrivateCTPP; // PrivateCTPP has its own minimum premium logic handled separately
    } else if (coverageType === 'PrivateCTP') {
        minPremium = minPremiums.PrivateCTP;
    }

    let finalPremium = Math.max(subtotal, minPremium);

    if (finalPremium > subtotal) {}

    // Step 7: Round to nearest dollar
    const roundedPremium = Math.round(finalPremium);

    // Create breakdown for debugging
    const breakdown = {
        // Inputs
        country,
        vehicleGroup,
        isHighPerformance,
        sumInsured,
        coverageType,
        driverAge,
        driverGender,
        claimFreeYears,
        ageYears,

        // Step 1: Basic Premium
        ownDamageRate,
        ownDamagePremium: sumInsured * ownDamageRate,
        thirdPartyPremium,
        basicPremium,

        // Step 2: Increased Limits
        increasedLimitsPremium,
        subtotalAfterLimits: basicPremium + increasedLimitsPremium,

        // Step 3: Loadings
        loadings,
        subtotalAfterLoadings: subtotal,

        // Step 4: Discounts
        discounts,
        applicableDiscounts,
        subtotalAfterDiscounts: subtotal,

        // Step 5: Rental
        rentalBenefitPremium,
        subtotalAfterRental: subtotal,

        // Step 6: Minimum
        minPremium,
        finalPremium,

        // Output
        roundedPremium
    };

    return {
        premium: roundedPremium,
        breakdown
    };
}

/**
 * Generates driver details for use with addNewDriver function
 * @param options Optional parameters for customizing the generated driver
 * @returns Object containing all required driver details
 */
export function generateDriverDetails(options: {
    firstName?: string;
    lastName?: string;
    driverType?: string;
    country?: string;
    age?: number;
    relationship?: string;
    licenseType?: string;
    licenseStatus?: string;
    licenseIssued?: number;
    licenseValidity?: number;
} = {}): {
    firstName: string;
    lastName: string;
    relationship: string;
    type: string;
    trn: string;
    dob: string;
    gender: string;
    address: string;
    parish: string;
    country: string;
    license: {
        type: string;
        dateFirstLicensed: string;
        issueDate: string;
        expiryDate: string;
        number: string;
        country: string;
        status: string;
    };
} {

    // Generate names if not provided
    const firstName = options.firstName || faker.person.firstName();
    const lastName = options.lastName || faker.person.lastName();

    // Set defaults based on country
    const country = options.country || 'Jamaica';
    let parish = 'Kingston';
    if (country.toLowerCase() === 'barbados') {
        parish = 'St. Michael';
    }
    // Generate age and DOB
    const age = options.age || Math.floor(Math.random() * 40) + 25; // 25-64 years old
    const dob = generateDob(age);

    // Generate TRN (9 digits)
    const trn = Math.floor(100000000 + Math.random() * 900000000).toString();

    // Generate license number (9 digits)
    const licenseNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

    // Set defaults for other fields
    const driverType = options.driverType || 'Additional';
    const relationship = options.relationship || 'Other';
    const licenseType = options.licenseType || 'Permanent';
    const licenseStatus = options.licenseStatus || 'Valid';
    const gender = ['Male', 'Female'][Math.floor(Math.random() * 2)];

    // Generate address
    const address = faker.location.streetAddress();

    // Generate license dates
    const licenseDates = getLicenseDates(
        options.licenseIssued || 6,
        options.licenseValidity || 3
    );

    return {
        firstName,
        lastName,
        relationship,
        type: driverType,
        trn,
        dob,
        gender,
        address,
        parish,
        country,
        license: {
            type: licenseType,
            dateFirstLicensed: licenseDates.issueDate,
            issueDate: licenseDates.issueDate,
            expiryDate: licenseDates.expiryDate,
            number: licenseNumber,
            country,
            status: licenseStatus
        }
    };
}

/**
 * Sets authority level for a user in the admin system
 * @param page Playwright Page object
 * @param username Username to search for
 * @param type Authority type ('Billing' or 'Underwriting')
 * @param level Authority level ('Level 1', 'Level 2', 'Level 3', 'Level 4', or 'Level 5')
 */
export async function setAuthorityLevel(
    page: Page,
    username: string,
    type: 'Billing' | 'Underwriting',
    level: 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4' | 'Level 5'
): Promise<void> {
    try {
        // Step 1: Switch to the Admin section
        await page.click('//*[@id="logoutForm:switchToAdmin"]');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // Step 2: Navigate to the security tab
        await page.getByRole('link', { name: 'Security' }).click();
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // Step 3: Fill user login
        await page.fill('#profileSearchForm\\:profileSearch_searchCard_userLogin', username);

        // Step 4: Click search button
        await page.click('#profileSearchForm\\:searchButton');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // Step 5: Click change beside the user details
        await page.click('#profileSearchForm\\:usersSearchResult\\:0\\:edit_profile_');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // Step 6: Navigate to the Authority Levels tab
        await page.click('#userProfileForm\\:profileTopTabsList\\:2\\:linkLabel');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // step New : Add Authority Level if not already added

        // Locator for table body
        const tableBody = page.locator('#userProfileForm\\:authorityLevelsTable\\:tb');

        // Step 1: Check if "No authorities selected" உள்ளது
        const noDataText = tableBody.locator('td.rf-dt-nd-c');

        if (await noDataText.isVisible()) {
            const text = await noDataText.textContent();

            if (text?.trim() === 'No authorities selected') {                await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

                // Add Dropdown Value
                await page.click('//*[@id="userProfileForm:authorityLevelType"]');
                await page.selectOption('#userProfileForm\\:authorityLevelType', 'BILLING');
                await page.click('//*[@id="userProfileForm:authorityLevelAssignedLevel"]');
                await page.selectOption('#userProfileForm\\:authorityLevelAssignedLevel', '3');
                await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

                // 👉 Add New Authority Level button click (update selector based on your app)
                await page.click('//*[@id="userProfileForm:saveAuthority"]');

                // // Example steps (modify as per your UI)
                // await page.selectOption('#typeDropdown', 'SomeType');
                // await page.selectOption('#productDropdown', 'SomeProduct');
                // await page.selectOption('#subTypeDropdown', 'SomeSubType');
                // await page.fill('#levelInput', '1');

                // await page.click('button:has-text("Save")');
            }
        } else {
            // Step 2: Verify existing rows
            const rows = tableBody.locator('tr');

            const rowCount = await rows.count();
            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);

                const type = await row.locator('td').nth(0).textContent();
                const product = await row.locator('td').nth(1).textContent();
                const subType = await row.locator('td').nth(2).textContent();
                const level = await row.locator('td').nth(3).textContent();
                // 👉 Example validation (modify as needed)
                // expect(type).toContain('ExpectedType');
            }
        }


        // Step 7: Click edit beside the correct authority type
        // Find the row for the specific authority type and click edit
        // First, find which row index contains our authority type
        // ✅ Wait for table refresh + row presence
        await page.waitForFunction(
            (type) => {
                const rows = document.querySelectorAll('#userProfileForm\\:authorityLevelsTable\\:tb tr');
                return Array.from(rows).some(row =>
                    row.querySelector('td')?.textContent?.trim() === type
                );
            },
            type
        );

        const authorityRows = await page
            .locator('#userProfileForm\\:authorityLevelsTable\\:tb tr')
            .all();

        let targetRowIndex = -1;

        for (let i = 0; i < authorityRows.length; i++) {
            const typeText = await authorityRows[i]
                .locator('td:first-child')
                .textContent();

            if (typeText?.trim() === type) {
                targetRowIndex = i;
                break;
            }
        }

        if (targetRowIndex === -1) {            throw new Error(`Could not find row for authority type: ${type}`);
        }

        // Click edit
        await page.click(
            `#userProfileForm\\:authorityLevelsTable\\:${targetRowIndex}\\:editAuthority`
        );
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        // Select the authority type if not already selected
        await page.selectOption('#userProfileForm\\:authorityLevelType', type);
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));
        // Select the authority level
        const levelValue = level.replace('Level ', ''); // Convert "Level 1" to "1"
        await page.selectOption('#userProfileForm\\:authorityLevelAssignedLevel', levelValue);
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        await page.click('#userProfileForm\\:updateAuthority');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));
        await page.click('#userProfileForm\\:update_footer');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));

        await page.click('#logoutForm\\:switchToApp');
        await waitForLoadingSpinner(page, page.locator('div.loading-spinner'));
    } catch (error) {
        console.error(`Error setting authority level for user ${username}:`, error);
        throw error;
    }
}
