export interface LobConfig {

    commercialAuto: boolean;

    property: boolean;

    liability: boolean;

    businessAuto: boolean;

    autoDealers: boolean;

    garageKeepers: boolean;

    structure: boolean;

    personalProperty: boolean;

    businessIncome: boolean;

    premisesOperations: boolean;

    productsOperations: boolean;
}
export interface PropertyConfig {

    structure: boolean;

    occupancy: boolean;
}
export interface LiabilityLimitInfo {

    eachOccurrenceLimit: string;

    generalAggregateLimit: string;
}
export interface StructureDetails {
    structureDescription: string;
    constructionType: string;
    roofType: string;
}

export interface OccupancyDetails {
    occupancyDescription: string;
    occupantName: string;
}
export interface DriverDetails {
    relationshipToApplicant: string;
    driverType: string;
    maritalStatus: string;
    licenceType: string;
    ageFirstLicensed: string;
    licenceNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    country: string;
    addressLine1: string;
    parish: string;
    licensedDate: string;
    licenceCountry: string;
}
export interface CoverageAddressDetails {
    country: string;
    addressLine1: string;
    parish: string;
}
export interface VehicleDetails {
    vinNumber: string;
    modelYear: string;
    make: string;
    ccRating: string;
    model: string;
    bodyType: string;
    sumInsured: string;
    sizeClass: string;
    businessUse: string;
    writtenOffIndicator: 'Yes' | 'No';
}
export interface PlanSelectionDetails {
    coverageType: string;
}
export interface StructureCoverageDetails {
    deductible: string;
    addRemoveReason: string;
    limitAmount: string;
    ratingType: string;
    causeOfLoss: string;
    agreedValueOption: string;
    coinsurance: string;
}
export interface PersonalPropertyCoverageDetails {
    ratingType: string;
}
export interface BusinessIncomeCoverageDetails {
    riskType: string;
    causeOfLoss: string;
    limitAmount: string;
    riskDescription: string;
    indemnityPeriod: string;
}
export interface LiabilityLimitDetails {
    generalAggregateLimit: string;
    eachOccurrenceLimit: string;
}
export interface LiabilityClassDetails {
    payrollAmount: string;
}
export interface PolicySectionDetails {
    country: string;
    effectiveDate: string;
    premiumFinancing: string;
    currency: string;
}
export interface VehicleOverviewDetails {
    vinNumber: string;
    modelYear: string;
    make: string;
    model: string;
    bodyType: string;
    sumInsured: string;
    sizeClass: string;
    businessUse: string;
    writtenOffIndicator: string;
    claimFreeYears: string;
}
export interface FundingSummaryDetails {
    paymentPlan: string;
    interestRate: string;
    totalFinanceCharge: string;
}