export const homeClaimCauseOfLossOptions = [
    { value: 'COL001', label: 'Fire' },
    { value: 'COL002', label: 'Explosion' },
    { value: 'COL003', label: 'Lightning' },
    { value: 'COL004', label: 'Flood (Acts of God)' },
    { value: 'COL005', label: 'Hurricane (Acts of God)' },
    { value: 'COL006', label: 'Storm / Strong Winds (Acts of God)' },
    { value: 'COL007', label: 'Earthquake (Acts of God)' },
    { value: 'COL008', label: 'Theft' },
    { value: 'COL009', label: 'Vandalism / Malicious Damage' },
    { value: 'COL010', label: 'Impact Damage (Vehicle, Object, Tree, etc.)' },
    { value: 'COL011', label: 'Escape of Water / Burst Pipe' },
    { value: 'COL012', label: 'Subsidence / Landslip' },
    { value: 'COL013', label: 'Collapse of Building or Structure' },
    { value: 'COL014', label: 'Electrical Surge / Power Failure' }
] as const;

export const homeClaimResultingDamageOptions = [
    { value: 'RDO051', label: 'Roof Damage' },
    { value: 'RDO052', label: 'Wall Damage' },
    { value: 'RDO053', label: 'Fence Damage' },
    { value: 'RDO054', label: 'Window Breakage' },
    { value: 'RDO055', label: 'Structural Impact' }
] as const;

export const homeClaimLossPartyBanks = [
    { value: 'JM_VMBS', label: 'VMBS' },
    { value: 'BOJ', label: 'Bank of Jamaica' },
    { value: 'CBNA', label: 'CitiBank N.A' },
    { value: 'JMMB', label: 'JMMB Bank' },
    { value: 'NCB', label: 'National Commercial Bank' },
    { value: 'JNB', label: 'Jamaica National Bank' },
    { value: 'FGB', label: 'First Global Bank' },
    { value: 'JM_BNS', label: 'Bank Of Nova Scotia' },
    { value: 'JM_SBL', label: 'Sagicor Bank Limited' },
    { value: 'JM_FCIB', label: 'First Caribbean International Bank' }
] as const;

export const homeClaimCoverageOptions = [
    'A. Dwelling Limit',
    'B. Other Structures',
    'C. Personal Property',
    'ClaimsStampDuty',
    'Course of Construction',
    'D. Loss of Use',
    'E. Personal Liability',
    'EmployersLiability',
    'Ex Gratia',
    'F. Medical Payments'
] as const;

export const homeClaimPaymentOfferTypes = [
    { value: 'FINPAYNT', label: 'Final Payment to Insured' },
    { value: 'LOSSOFACCO', label: 'Loss of Accommodation' },
    { value: 'TP_PROPERTY_DMG', label: 'Third Party Property Damage' },
    { value: 'TP_BODILY_INJURY', label: 'Third Party Bodily Injury' },
    { value: 'PROFESSFEES', label: 'Professional Fees' }
] as const;

function getRandomOption<T>(options: readonly T[]): T {
    return options[Math.floor(Math.random() * options.length)];
}

export function getRandomHomeClaimCauseOfLoss() {
    return getRandomOption(homeClaimCauseOfLossOptions);
}

export function getRandomHomeClaimResultingDamage() {
    return getRandomOption(homeClaimResultingDamageOptions);
}

export function getRandomHomeClaimLossPartyBank() {
    return getRandomOption(homeClaimLossPartyBanks);
}

export function getRandomHomeClaimCoverage() {
    return getRandomOption(homeClaimCoverageOptions);
}

export function getRandomHomeClaimPaymentOfferType() {
    return getRandomOption(homeClaimPaymentOfferTypes);
}
