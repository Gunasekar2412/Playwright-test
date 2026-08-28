export const barbadosClaimPaymentBanks = [
    { value: 'BNS', label: 'Bank Of Nova Scotia' },
    { value: 'CBB', label: 'Central Bank of Barbados' },
    { value: 'FCBBL', label: 'First Citizens Bank Barbados Limited' },
    { value: 'FCMF', label: 'First Caribbean Mortgage Finance' },
    { value: 'RRBC', label: 'RBC Royal Bank of Canada' },
    {
        value: 'RRBCFC',
        label: 'RBC Royal Bank of Canada Financial Corporation'
    },
    { value: 'RBL', label: 'Republic Bank Ltd' },
    { value: 'SBL', label: 'Sagicor Bank Limited' },
    { value: 'BB_CIBC', label: 'CIBC Caribbean Bank (Barbados) Limited' }
] as const;

export function getRandomBarbadosClaimPaymentBank() {
    return barbadosClaimPaymentBanks[
        Math.floor(Math.random() * barbadosClaimPaymentBanks.length)
    ];
}

export const privateMotorPaymentOfferTypes = [
    { value: 'CASH_IN_LIEU', label: 'Cash in Lieu' },
    { value: 'FINAL_BILL', label: 'Final Bill' },
    { value: 'TOTAL_LOSS', label: 'Total Loss' },
    { value: 'ASSESSOR_SURVEYOR_FEE', label: 'Assessor/Surveyor Fee' },
    { value: 'INVESTIGATOR_FEE', label: 'Investigator Fee' },
    { value: 'TOWING_FEE', label: 'Towing Fee' },
    { value: 'LOSS_ADJUSTER_FEE', label: 'Loss Adjuster Fee' },
    { value: 'RENTAL_BILL', label: 'Rental Bill' },
    { value: 'GARAGE_FEE', label: 'Garage Fee' },
    { value: 'TP_PROPERTY_DMG', label: 'Third Party Property Damage' },
    { value: 'TP_BODILY_INJURY', label: 'Third Party Bodily Injury' }
] as const;

export function getRandomPrivateMotorPaymentOfferType() {
    return privateMotorPaymentOfferTypes[
        Math.floor(Math.random() * privateMotorPaymentOfferTypes.length)
    ];
}

export const commercialPropertyPaymentOfferTypes = [
    {
        value: 'BNS_INTS_COST_WORK',
        label: 'Business Interruption – Increased Cost of Working'
    },
    {
        value: 'BNS_INTS_LOSS_GP',
        label: 'Business Interruption – Loss of Gross Profit'
    },
    {
        value: 'CLAIM_PREP_COST',
        label: 'Claims Preparation Costs'
    },
    {
        value: 'MD_BUILDING',
        label: 'Material Damage – Building'
    },
    {
        value: 'MD_CONTN_STOCK',
        label: 'Material Damage – Contents / Stock'
    },
    {
        value: 'PROFESSFEES',
        label: 'Professional Fees'
    }
] as const;

export function getRandomCommercialPropertyPaymentOfferType() {
    return commercialPropertyPaymentOfferTypes[
        Math.floor(
            Math.random() * commercialPropertyPaymentOfferTypes.length
        )
    ];
}

export function generateClaimBankAccountNumber(): string {
    return Array.from(
        { length: 16 },
        () => Math.floor(Math.random() * 10)
    ).join('');
}
