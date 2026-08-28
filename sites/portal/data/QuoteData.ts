// Helper functions
const calculateDateOfBirth = (
    yearsAgo: number,
    daysOffset: number = 0
): string => {
    const today = new Date();
    const dob = new Date(
        today.getFullYear() - yearsAgo,
        today.getMonth(),
        today.getDate() + daysOffset
    );
    return dob.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Customer data
export const customerData = {
    standard: {
        email: 'test@example.com',
        firstName: 'QW',
        lastName: 'Test',
        phoneNumber: '(876) 543-2102',
        dateOfBirth: '01/01/1994',
        idNumber: 'DL123456789',
        claimFreeYears: '1 year',
        idType: 'Driver Licence',
    },
    seniorCustomer: {
        email: 'senior@example.com',
        firstName: 'Senior',
        lastName: 'Customer',
        phoneNumber: '(876) 543-2103',
        dateOfBirth: '01/01/1970', // Over 50 years old
        idNumber: 'DL987654321',
        claimFreeYears: '5+ years',
        idType: 'Driver Licence',
    },
    belowDiamondMaxAge: {
        email: 'belowDiamondMaxAge@example.com',
        firstName: 'Below',
        lastName: 'Diamond Max Age',
        phoneNumber: '(876) 543-2104',
        dateOfBirth: calculateDateOfBirth(50, 1), // 49 years and 364 days old (1 day before turning 50)
        idNumber: 'DL456789123',
        claimFreeYears: '5 years or more',
        idType: 'Driver Licence',
    },
};

// Vehicle data
export const vehicleData = {
    standard: {
        make: 'Acura',
        model: '17 EL',
        year: '2002',
        cc: '1500',
        value: '25000',
    },
    highValue: {
        make: 'BMW',
        model: 'X5',
        year: '2023',
        cc: '3000',
        value: '250001', // Just over the threshold
    },
    veryHighValue: {
        make: 'Mercedes-Benz',
        model: 'S-Class',
        year: '2023',
        cc: '4000',
        value: '500000',
    },
};

// Thresholds and limits
export const thresholds = {
    maxSumInsured: 250000,
    minAgeForDiamondMax: 50,
};

// Expected UI messages and text content
export const uiMessages = {
    highValuePopup: {
        title: 'Thank you for requesting a quotation from BCIC',
        message: `Because your vehicle is valued over BBD 250,000.00, we need to contact you for additional information`,
        okButton: 'OK',
    },
    // You can add other messages for different popups or UI elements here
    errorMessages: {
        // Add error messages here
    },
    successMessages: {
        // Add success messages here
    },
};
