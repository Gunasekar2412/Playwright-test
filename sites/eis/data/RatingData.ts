const customer = {
    customerId: '511006',
    name: 'Polly Mathew',
    age: 45,
    // customerId: '510021',
    // name: 'Melissa James'
};

// Payment Plan Types
const paymentPlanTypes = {
    financing: {
        code: 'PF',
        description: 'Payment Financing',
    },
    nonFinancing: {
        code: '100%',
        description: 'Full Payment',
    },
};

// Interest Rate defaults
const interestRateDefaults = {
    financing: {
        minRate: 0.00,
        maxRate: 100,
    },
    nonFinancing: {
        rate: 0,
        minInterest: 0,
    },
};

// Jamaica Payment Plans
const jamaicaPaymentPlans = [
    {
        code: 'PF_25_75',
        description: '25% Down Payment with 75% Financing',
        isFinancing: true,
    },
    {
        code: 'PF_50_50',
        description: '50% Down Payment with 50% Financing',
        isFinancing: true,
    },
    {
        code: '100%',
        description: '100% Full Payment',
        isFinancing: false,
    },
];

// Test Data
const testData = {
    interestRateTest: {
        customerId: customer.customerId,
        branch: 'HEAD_OFFICE_KINGSTON',
        insuredParty: {
            name: customer.name,
            priorCarrier: 'Insurance Company of The West Indies'
        },
        driver: {
            name: customer.name,
            licenseType: 'Permanent',
            licenseStatus: 'Valid'
        },
        vehicle: {
            year: '2024',
            make: 'Audi',
            model: 'A4',
            performance: 'S',
            bodyType: 'Sedan',
            sumInsured: '14000000',
            country: 'JM',
            address: 'Old harbour 120',
            parish: 'Kingston',
            fuelType: 'Gasoline'
        },
        coverage: {
            type: 'Comprehensive'
        },
        paymentPlan: 'PFPartial4Pay'
    },
    premiumCalculationTest: {
        customerId: customer.customerId,
        branch: 'HEAD_OFFICE_KINGSTON',
        insuredParty: {
            name: customer.name,
            priorCarrier: 'Advantage General Insurance Company'
        },
        driver: {
            firstName: 'Meldon',
            lastName: 'James',
            relationship: 'Husband',
            type: 'Main Driver',
            trn: '1234567890',
            dob: '01/01/1990',
            gender: 'Male',
            address: '123 Test Street',
            parish: 'Kingston',
            country: 'JM',
            license: {
                type: 'Permanent',
                dateFirstLicensed: '01/01/2010',
                number: '1234567890',
                country: 'JM',
                status: 'Valid',
            }
        },
        vehicle: {
            year: '2023',
            make: 'Tesla',
            model: '3',
            performance: 'A',
            bodyType: 'U/K',
            sumInsured: '5000000',
            country: 'Jamaica',
            address: '123 Test Street',
            parish: 'Kingston',
            fuelType: 'ELECTRIC'
        },
        coverage: {
            type: 'Comprehensive',
            excess: '10% of Sum Insured'
        }
    }
};

// JMD Finance Contracts - Standard Rates
const jmdFinanceContractsStandardRates = {
    periods: [4, 5, 6, 7, 8, 9, 10, 11],
    minimumInterest: {
        4: 3500,
        5: 4250,
        6: 5000,
        7: 6250,
        8: 6500,
        9: 7250,
        10: 8500,
        11: 10000,
    },
    rates: [
        {
            sumInsuredRange: "$23,300 - $250,000",
            values: {
                4: 3.70,
                5: 4.60,
                6: 5.50,
                7: 6.40,
                8: 7.30,
                9: 8.30,
                10: 9.20,
                11: 10.10,
            }
        },
        {
            sumInsuredRange: "$250,001 - $500,000",
            values: {
                4: 3.30,
                5: 4.20,
                6: 5.00,
                7: 5.80,
                8: 6.70,
                9: 7.50,
                10: 8.30,
                11: 9.20,
            }
        },
        {
            sumInsuredRange: "$500,001 - $1,000,000",
            values: {
                4: 3.00,
                5: 3.80,
                6: 4.50,
                7: 5.30,
                8: 6.00,
                9: 6.80,
                10: 7.50,
                11: 8.30,
            }
        },
        {
            sumInsuredRange: ">$1,000,001",
            values: {
                4: 2.70,
                5: 3.30,
                6: 4.00,
                7: 4.70,
                8: 5.30,
                9: 6.00,
                10: 6.70,
                11: 7.30,
            }
        }
    ]
};

/**
 * Get the interest rate and minimum interest for a given period and premium value.
 * @param period number (e.g. 4, 5, 6, ...)
 * @param premium number (sum insured)
 * @returns { interestRate: number, minimumInterest: number }
 */
function getJmdFinanceInterest(period: number, premium: number) {
    // Define the ranges as numbers for easy comparison
    const ranges = [
        { min: 23300, max: 250000 },
        { min: 250001, max: 500000 },
        { min: 500001, max: 1000000 },
        { min: 1000001, max: Infinity }
    ];

    // Find the correct range index
    let rangeIndex = -1;
    for (let i = 0; i < ranges.length; i++) {
        if (premium >= ranges[i].min && premium <= ranges[i].max) {
            rangeIndex = i;
            break;
        }
    }

    // If not found, return null or throw error
    if (rangeIndex === -1) {
        return null;
    }

    // Get the interest rate from the rates array
    const rateObj = jmdFinanceContractsStandardRates.rates[rangeIndex];
    const interestRate = rateObj.values[period].toFixed(2);

    // Get the minimum interest for the period
    const minimumInterest = jmdFinanceContractsStandardRates.minimumInterest[period];

    return {
        interestRate,
        minimumInterest
    };
}

const paymentPlans = [
    { value: "FullPay", label: "Full Pay", period: null },
    { value: "2Pay", label: "2 Pay Plan", period: null },
    { value: "PFPartial4Pay", label: "Partial PF 4 Pay", period: 4 },
    { value: "PFFull4Pay", label: "100% PF 4 Pay", period: 4 },
    { value: "PFPartial5Pay", label: "Partial PF 5 Pay", period: 5 },
    { value: "PFFull5Pay", label: "100% PF 5 Pay", period: 5 },
    { value: "PFPartial6Pay", label: "Partial PF 6 Pay", period: 6 },
    { value: "PFFull6Pay", label: "100% PF 6 Pay", period: 6 },
    { value: "PFPartial7Pay", label: "Partial PF 7 Pay", period: 7 },
    { value: "PFFull7Pay", label: "100% PF 7 Pay", period: 7 },
    { value: "PFPartial8Pay", label: "Partial PF 8 Pay", period: 8 },
    { value: "PFFull8Pay", label: "100% PF 8 Pay", period: 8 },
    { value: "PFPartial9Pay", label: "Partial PF 9 Pay", period: 9 },
    { value: "PFFull9Pay", label: "100% PF 9 Pay", period: 9 },
    { value: "PFPartial10Pay", label: "Partial PF 10 Pay", period: 10 },
    { value: "PFFull10Pay", label: "100% PF 10 Pay", period: 10 },
    { value: "PFPartial11Pay", label: "Partial PF 11 Pay", period: 11 },
    { value: "PFFull11Pay", label: "100% PF 11 Pay", period: 11 },
];

/** Bcic excess cover level — Barbados (`policyDataGatherForm:sedit_BcicExcess_coverLevelCd`). */
export const excessLimitOptions = {
    "1pct_min750_bbd": {
        value: "ONEMIN750",
        label: "1% of the Sum Insured minimum BBD750",
        percent: 1,
        min: 750,
        max: null,
        currency: "BBD",
    },
    "2_5pct_min1500_bbd": {
        value: "TWOMIN1500",
        label: "2.5% of the Sum Insured minimum BBD1,500",
        percent: 2.5,
        min: 1500,
        max: null,
        currency: "BBD",
    },
    "5pct_min2000_bbd": {
        value: "FIVEMIN2000",
        label: "5% of the Sum Insured minimum BBD2,000",
        percent: 5,
        min: 2000,
        max: null,
        currency: "BBD",
    },


    /** Jamaica — same field id pattern per country. */
    "2_5pct_min15k_max250k": {
        value: "TWOMIN15000MAX250KJMD",
        label: "2.5% of the Sum Insured minimum JMD15,000, maximum JMD250,000",
        percent: 2.5,
        min: 15000,
        max: 250000,
        currency: "JMD",
    },
    // These options looks like they were removed from the UI
    "5pct_min15k_max250k": {
        value: "FIVEMIN15000MAX250KJMD",
        label: "5% of the Sum Insured minimum JMD15,000, maximum JMD250,000",
        percent: 5,
        min: 15000,
        max: 250000,
        currency: "JMD"
    },
    "5pct_min15k_max350k": {
        value: "FIVEMIN15000MAX350KJMD",
        label: "5% of the Sum Insured minimum JMD15,000, maximum JMD350,000",
        percent: 5,
        min: 15000,
        max: 350000,
        currency: "JMD"
    },
    "10pct": {
        value: "TENMIN0",
        label: "10% of the Sum Insured",
        percent: 10,
        min: 0,
        max: null,
        currency: null,
    },
};

const repairBenefitOptions = {
    "50k": {
        value: "50000.00",
        label: "JMD50,000.00",
        amount: 50000,
    },
    "100k": {
        value: "100000.00",
        label: "JMD100,000.00",
        amount: 100000,
    },
    "150k": {
        value: "150000.00",
        label: "JMD150,000.00",
        amount: 150000,
    }
};

/** Option values for Additional Interest Name (Jamaica auto) — matches `policyDataGatherForm:sedit_PreconfigAutoAdditionalInterest_name`. */
const jamaicaAdditionalInterestNames = [
    { value: 'BJSTAFFCREDU', label: 'BJ Staff Co-Operative Credit Union Limited' },
    { value: 'BROADALLYSERV', label: 'Broadcast & Allied Services Co-Operative Credit Union Limited' },
    { value: 'CWWJCOOPCREDU', label: 'C&WJ Co-Operative Credit Union Limited' },
    { value: 'COKSOD', label: 'COK Sodality Co-Operative Credit Union Limited' },
    { value: 'EDUCOMCOOP', label: 'EduCom Co-Operative Credit Union Limited' },
    { value: 'ESSENTEMGSPART', label: 'Essential and Emergency Services & Partners Co-Operative Credit Union Limited' },
    { value: 'FIRSTHERT', label: 'First Heritage Co-Operative Credit Union Limited' },
    { value: 'FRSTREGCOOP', label: 'First Regional Co-Operative Credit Union Limited' },
    { value: 'GWCOCREDU', label: 'Gateway Co-Operative Credit Union Limited' },
    { value: 'GRACECOOP', label: 'Grace Co-Operative Credit Union Limited' },
    { value: 'INSEMP', label: 'Insurance Employees Co-Operative Credit Union Limited' },
    { value: 'JAMPOCOOP', label: 'Jamaica Police Co-Operative Credit Union Limited' },
    { value: 'JAMTEACHASSC', label: 'Jamaica Teachers Association Co-Operative Credit Union Limited' },
    { value: 'JDFCOOPUNION', label: 'JDF Co-Operative Credit Union Limited' },
    { value: 'JPSPARTNLTD', label: 'JPS & Partners Co-Operative Credit Union Limited' },
    { value: 'LASCELLES', label: 'Lascelles Employees & Partners Co-Operative Credit Union Limited' },
    { value: 'MACHCOOPLTD', label: 'Manchester Co-Operative Credit Union Limited' },
    { value: 'NAJHLTHSERV', label: 'NAJ & Health Services Co-Operative Credit Union Limited' },
    { value: 'NATIONALCOMM', label: 'National & Community Co-Operative Credit Union Limited' },
    { value: 'PALCOOPLTD', label: 'Palisadoes Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-01', label: 'Portland Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-02', label: 'Postal & Partners Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-03', label: 'Public Sector Employees Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-04', label: 'PWD Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-05', label: 'Trelawny Co-Operative Credit Union Limited' },
    { value: 'JM-MORT-06', label: 'National Export-Import Bank of Jamaica Ltd' },
    { value: 'JM-MORT-07', label: "Accountant General's Department" },
    { value: 'JM-MORT-08', label: 'Capital & Credit Merchant Bank Limited' },
    { value: 'JM-MORT-09', label: 'Development Bank of Jamaica' },
    { value: 'JM-MORT-10', label: 'Jamaica Mortgage Bank' },
    { value: 'JM-MORT-11', label: 'National Housing Trust' },
    { value: 'JM-MORT-12', label: 'Pan Caribbean Merchant Bank Ltd' },
    { value: 'JM-MORT-13', label: 'Sagicor Life Jamaica Limited' },
    { value: 'JM-MORT-14', label: 'First Global Bank Limited' },
    { value: 'JM-MORT-15', label: 'Firstcaribbean International Bank (Jamaica) Limited' },
    { value: 'JM-MORT-16', label: 'JMMB Bank (Jamaica) Limited' },
    { value: 'JM-MORT-17', label: 'JN Bank Limited' },
    { value: 'JM-MORT-18', label: 'National Commercial Bank Jamaica Limited' },
    { value: 'JM-MORT-19', label: 'Sagicor Bank Jamaica Limited' },
    { value: 'JM-MORT-20', label: 'The Bank Of Nova Scotia Jamaica Limited' },
    { value: 'JM-MORT-21', label: 'The Victoria Mutual Building Society' },
    { value: 'JM-MORT-22', label: 'Citibank N.A.' },
    { value: 'JM-MORT-23', label: 'Scotia Jamaica Building Society' },
    { value: 'JM-MORT-24', label: 'Cornerstone Trust & Merchant Bank Limited' },
] as const;

function getRandomAdditionalInterestNameValue(): string {
    const idx = Math.floor(Math.random() * jamaicaAdditionalInterestNames.length);
    return jamaicaAdditionalInterestNames[idx].value;
}

export {
    paymentPlanTypes,
    interestRateDefaults,
    jamaicaPaymentPlans,
    testData,
    jmdFinanceContractsStandardRates,
    getJmdFinanceInterest,
    paymentPlans,
    customer,
    repairBenefitOptions,
    jamaicaAdditionalInterestNames,
    getRandomAdditionalInterestNameValue
};
