import { expect, Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BasePage } from './BasePage';
import { RatingPage } from './RatingPage';
import { PolicyPage } from './PolicyPage';
import {
    BusinessIncomeCoverageDetails,
    CoverageAddressDetails,
    DriverDetails,
    FundingSummaryDetails,
    LiabilityClassDetails,
    LiabilityLimitDetails,
    LobConfig,
    OccupancyDetails,
    PersonalPropertyCoverageDetails,
    PlanSelectionDetails,
    PolicySectionDetails,
    StructureCoverageDetails,
    StructureDetails,
    VehicleDetails,
    VehicleOverviewDetails
} from '../data/LobConfig';
import { getFormattedDate } from '../../../lib/utils';
import {
    closePartySearchPopupIfVisible,
    waitForBarbadosLoadingSpinner
} from '../../../lib/aio/waitForBarbadosLoadingSpinner';

type PolicyDetails = {
    policyNumber: string | null;
    status: string | null;
    effectiveDate: string | null;
};

type PremiumSummary = {
    lob?: string;
    termPremium?: string;
    actualPremium?: string;
    adjustedPremium?: string;
    taxes?: string;
    fees?: string;
    billablePremium?: string;
    aprp?: string;
    calculatedCommission?: string;
};

type PremiumTotals = Omit<PremiumSummary, 'lob'>;

type FundingSummarySnapshot = {
    paymentPlan: string;
    netPremium: string;
    gct: string;
    totalPremium: string;
    totalStampDuty: string;
    additionalStampDuty: string;
    endorsementApRp: string;
    deposit: string;
    interestRate: string;
    financeCharge: string;
    totalDue: string;
    monthlyInstallment: string;
};

export class CommercialPolicyPage extends BasePage {
    private readonly insuredDropdown: Locator;
    private readonly serviceRoleDropdown: Locator;
    private readonly serviceRolePanel: Locator;
    private readonly serviceRoleItems: Locator;
    private readonly serviceRoleCheckboxes: Locator;

    private readonly commercialAutoLobCheckbox: Locator;
    private readonly businessAutoCheckbox: Locator;
    private readonly autoDealersCheckbox: Locator;
    private readonly garageKeepersCheckbox: Locator;
    private readonly propertyLobCheckbox: Locator;
    private readonly structureCheckbox: Locator;
    private readonly personalPropertyCheckbox: Locator;
    private readonly businessIncomeCheckbox: Locator;
    private readonly liabilityLobCheckbox: Locator;
    private readonly premisesOperationsCheckbox: Locator;
    private readonly productsOperationsCheckbox: Locator;

    private readonly riskCountryDropdown: Locator;
    private readonly riskAddressLine1Field: Locator;
    private readonly riskParishDropdown: Locator;

    private readonly addStructureButton: Locator;
    private readonly structureDescriptionField: Locator;
    private readonly structureConstructionTypeDropdown: Locator;
    private readonly structureRoofTypeDropdown: Locator;

    private readonly addOccupancyButton: Locator;
    private readonly occupancyDescriptionField: Locator;
    private readonly occupantNameField: Locator;
    private readonly occupancyClassSearchButton: Locator;
    private readonly firstOccupancyClassButton: Locator;

    private readonly rateButton: Locator;

    private readonly driversTab: Locator;
    private readonly addDriverButton: Locator;
    private readonly driverRelationshipDropdown: Locator;
    private readonly driverTypeDropdown: Locator;
    private readonly driverMaritalStatusDropdown: Locator;
    private readonly driverLicenceTypeDropdown: Locator;
    private readonly driverAgeFirstLicensedField: Locator;
    private readonly driverLicenceNumberField: Locator;
    private readonly driverFirstNameField: Locator;
    private readonly driverLastNameField: Locator;
    private readonly driverTrnField: Locator;
    private readonly driverGenderDropdown: Locator;
    private readonly driverDateOfBirthField: Locator;
    private readonly driverCountryDropdown: Locator;
    private readonly driverAddressLine1Field: Locator;
    private readonly driverParishDropdown: Locator;
    private readonly driverLicensedDateField: Locator;
    private readonly driverLicenceCountryDropdown: Locator;
    private readonly licenceClassDropdown: Locator;
    private readonly firstLicenceClassCheckbox: Locator;

    private readonly coverageAddressCountryDropdown: Locator;
    private readonly coverageAddressLine1Field: Locator;
    private readonly coverageAddressParishDropdown: Locator;

    private readonly commercialAutoNode: Locator;
    private readonly tabLabels: Locator;
    private readonly fundingSummaryNode: Locator;
    private readonly fundingSummaryFields: Record<
        keyof FundingSummarySnapshot,
        Locator
    >;
    private readonly premiumSummaryRow: Locator;
    private readonly premiumTotalsRow: Locator;
    private readonly premiumSummaryCells: Locator;
    private readonly premiumTotalsCells: Locator;
    private readonly policyNumberText: Locator;
    private readonly policyStatusText: Locator;
    private readonly policyEffectiveDateText: Locator;

    private readonly addVehicleButton: Locator;
    private readonly vehicleVinField: Locator;
    private readonly vehicleModelYearDropdown: Locator;
    private readonly vehicleSeatingCapacityField: Locator;
    private readonly vehicleMakeDropdown: Locator;
    private readonly vehicleCcRatingField: Locator;
    private readonly vehicleModelDropdown: Locator;
    private readonly vehicleBodyTypeDropdown: Locator;
    private readonly vehicleSumInsuredField: Locator;
    private readonly vehicleSizeClassDropdown: Locator;
    private readonly vehicleBusinessUseDropdown: Locator;
    private readonly vehicleWrittenOffYesRadio: Locator;
    private readonly vehicleWrittenOffNoRadio: Locator;
    private readonly vehicleWrittenOffIndicator: Locator;
    private readonly vehicleClaimFreeYearsField: Locator;
    private readonly commercialAutoPlanDropdown: Locator;

    private readonly addStructureCoverageButton: Locator;
    private readonly structureClassSearchButton: Locator;
    private readonly firstStructureClassButton: Locator;
    private readonly structureDeductibleDropdown: Locator;
    private readonly structureCoverageCheckbox: Locator;
    private readonly structureAddRemoveReasonDropdown: Locator;
    private readonly structureLimitAmountField: Locator;
    private readonly structureRatingTypeDropdown: Locator;
    private readonly structureCauseOfLossDropdown: Locator;
    private readonly structureAgreedValueDropdown: Locator;
    private readonly structureCoinsuranceDropdown: Locator;

    private readonly addPersonalPropertyCoverageButton: Locator;
    private readonly personalPropertyRatingTypeDropdown: Locator;

    private readonly addBusinessIncomeCoverageButton: Locator;
    private readonly businessIncomeRiskTypeDropdown: Locator;
    private readonly businessIncomeCauseOfLossDropdown: Locator;
    private readonly businessIncomeLimitAmountField: Locator;
    private readonly businessIncomeRiskDescriptionDropdown: Locator;
    private readonly businessIncomeIndemnityPeriodField: Locator;

    private readonly moveToDropdown: Locator;
    private readonly endorsementRequestorDropdown: Locator;
    private readonly endorsementContinueButton: Locator;
    private readonly commercialEndorsementDateField: Locator;
    private readonly endorsementReasonDropdown: Locator;
    private readonly endorsementStartButton: Locator;
    private readonly endorsementConfirmationButton: Locator;
    private readonly reinsuranceEmlField: Locator;
    private readonly purchaseQuoteButton: Locator;
    private readonly purchaseConfirmationButton: Locator;
    private readonly finishPurchaseButton: Locator;

    private readonly liabilityGeneralAggregateLimitField: Locator;
    private readonly liabilityEachOccurrenceLimitField: Locator;
    private readonly addLiabilityClassButton: Locator;
    private readonly liabilityClassSearchButton: Locator;
    private readonly firstLiabilityClassButton: Locator;

    private readonly policyCountryText: Locator;
    private readonly policyEffectiveDateField: Locator;
    private readonly policyPremiumFinancingText: Locator;
    private readonly policyCurrencyText: Locator;

    constructor(
        page: Page,
        private readonly ratingPage: RatingPage,
        private readonly policyPage: PolicyPage
    ) {
        super(page);

        this.insuredDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PreconfigInsured_partySelection'
        );

        this.serviceRoleDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLContactRoles_serviceRole'
        );

        this.serviceRolePanel = page.locator(
            '#policyDataGatherForm\\:sedit_CLContactRoles_serviceRole_panel'
        );
        this.serviceRoleItems = this.serviceRolePanel.locator(
            '.ui-selectcheckboxmenu-item'
        );
        this.serviceRoleCheckboxes = this.serviceRoleItems.locator(
            '.ui-chkbox-box'
        );

        this.commercialAutoLobCheckbox = page.locator(
            '#policyDataGatherForm\\:addOptionalQuestion_CLAutoLobSelection\\:0'
        );
        this.businessAutoCheckbox = page.locator('input.subLob_BusinessAuto');
        this.autoDealersCheckbox = page.locator('input.subLob_AutoDealers');
        this.garageKeepersCheckbox = page.locator('input.subLob_GarageKeepers');
        this.propertyLobCheckbox = page.locator(
            '#policyDataGatherForm\\:addOptionalQuestion_CLPropertyLobSelection\\:0'
        );
        this.structureCheckbox = page.locator('input.subLob_Structure');
        this.personalPropertyCheckbox = page.locator('input.subLob_PersProp');
        this.businessIncomeCheckbox = page.locator('input.subLob_BusInc');
        this.liabilityLobCheckbox = page.locator(
            '#policyDataGatherForm\\:addOptionalQuestion_CLLiabilityLobSelection\\:0'
        );
        this.premisesOperationsCheckbox = page.locator('input.subLob_PremOper');
        this.productsOperationsCheckbox = page.locator('input.subLob_ProdOper');

        this.riskCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLLocationAddress_address_countryCd'
        );
        this.riskAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_CLLocationAddress_address_addressLine1'
        );
        this.riskParishDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLLocationAddress_address_addressExtension_parishCd'
        );

        this.addStructureButton = page.locator(
            '#policyDataGatherForm\\:addCLStructure'
        );
        this.structureDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_CLStructure_structureDescription'
        );
        this.structureConstructionTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLBuildingInfo_constructionType'
        );
        this.structureRoofTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLBuildingInfo_roofType'
        );

        this.addOccupancyButton = page.locator(
            '#policyDataGatherForm\\:addCLOccupancy'
        );
        this.occupancyDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_CLOccupancy_occupancyDescription'
        );
        this.occupantNameField = page.locator(
            '#policyDataGatherForm\\:sedit_CLOccupancy_occupantName'
        );
        this.occupancyClassSearchButton = page.locator(
            '#policyDataGatherForm\\:j_id_1_24_4i_2_l_2_d_6_1_1_8'
        );
        this.firstOccupancyClassButton = page.locator(
            'button[id="occupancyClassSearchForm_CLOccupancy:occupancyClassSearchResult_CLOccupancy:0:occupancyClassSelectButton_CLOccupancy"]'
        );

        this.rateButton = page.locator(
            '#policyDataGatherForm\\:processPolicyActionButton_PremiumSummaryCLRateAction'
        );

        this.driversTab = page.locator(
            '//div[@class="rf-trn" and @title="Drivers"]'
        );
        this.addDriverButton = page.locator(
            '#policyDataGatherForm\\:addCLDriverInfo'
        );
        this.driverRelationshipDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverInfo_driverRelToApplicantCd'
        );
        this.driverTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverInfo_driverTypeCd'
        );
        this.driverMaritalStatusDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_maritalStatusCd'
        );
        this.driverLicenceTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_DrivingLicence_license_licenceTypeCd'
        );
        this.driverAgeFirstLicensedField = page.locator(
            '#policyDataGatherForm\\:sedit_DrivingLicence_ageFirstLicensed'
        );
        this.driverLicenceNumberField = page.locator(
            '#policyDataGatherForm\\:sedit_DrivingLicence_license_licensePermitNumber'
        );
        this.driverFirstNameField = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_nameInfo_firstName'
        );
        this.driverLastNameField = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_nameInfo_lastName'
        );
        this.driverTrnField = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_trn'
        );
        this.driverGenderDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_gender'
        );
        this.driverDateOfBirthField = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverPersonInfo_dateOfBirthInputDate'
        );
        this.driverCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverAddress_address_countryCd'
        );
        this.driverAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverAddress_address_addressLine1'
        );
        this.driverParishDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLDriverAddress_address_addressExtension_parishCd'
        );
        this.driverLicensedDateField = page.locator(
            '#policyDataGatherForm\\:sedit_DrivingLicence_license_licensedDtInputDate'
        );
        this.driverLicenceCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_DrivingLicence_license_countryCd'
        );
        this.licenceClassDropdown = page.locator(
            '.ui-selectcheckboxmenu-label-container'
        ).filter({ hasText: 'License Class' });
        this.firstLicenceClassCheckbox = page.locator(
            '.ui-selectcheckboxmenu-panel .ui-chkbox-box'
        ).first();

        this.coverageAddressCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_BcicCLBACoverageLocationAddressContact_address_countryCd'
        );
        this.coverageAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_BcicCLBACoverageLocationAddressContact_address_addressLine1'
        );
        this.coverageAddressParishDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_BcicCLBACoverageLocationAddressContact_address_addressExtension_parishCd'
        );

        this.commercialAutoNode = page.locator(
            '#policyDataGatherForm\\:tabTree\\:allTabs\\.4\\:tab > .rf-trn .rf-trn-lbl'
        );
        this.tabLabels = page.locator('.rf-trn-lbl');
        this.fundingSummaryNode = page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Funding Summary_"])'
        );
        this.fundingSummaryFields = {
            paymentPlan: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_paymentPlanCd'
            ),
            netPremium: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_netPremium'
            ),
            gct: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_taxPremium'
            ),
            totalPremium: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalPremium'
            ),
            totalStampDuty: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalStampDuty'
            ),
            additionalStampDuty: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_additionalStampDuty'
            ),
            endorsementApRp: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_endorsementApRp'
            ),
            deposit: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_deposit'
            ),
            interestRate: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_interestRate'
            ),
            financeCharge: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_financeCharge'
            ),
            totalDue: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_totalDue'
            ),
            monthlyInstallment: page.locator(
                '#policyDataGatherForm\\:sedit_PolicyPaymentPlan_monthlyInstallment'
            )
        };
        this.premiumSummaryRow = page.locator(
            '#policyDataGatherForm\\:policySummary_ListCLPolicyPremiumSummary\\:tb tr'
        );
        this.premiumTotalsRow = page.locator(
            '#policyDataGatherForm\\:policySummary_ListCLPolicyPremiumSummary\\:cf'
        );
        this.premiumSummaryCells = this.premiumSummaryRow.locator('td');
        this.premiumTotalsCells = this.premiumTotalsRow.locator('td');
        this.policyNumberText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyNumTxt'
        );
        this.policyStatusText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText'
        );
        this.policyEffectiveDateText = page.locator(
            '#productContextInfoForm\\:policyDetail_policyStatusCdText_txEffectiveDate'
        );

        this.addVehicleButton = page.locator(
            '#policyDataGatherForm\\:addCLAutoTTTVehicleInfo'
        );
        this.vehicleVinField = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_baseInfo_vehIdentificationNo'
        );
        this.vehicleModelYearDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_baseInfo_modelYear'
        );
        this.vehicleSeatingCapacityField = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_seatingCapacityTTT'
        );
        this.vehicleMakeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_baseInfo_manufacturer'
        );
        this.vehicleCcRatingField = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_engineccrating'
        );
        this.vehicleModelDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_baseInfo_model'
        );
        this.vehicleBodyTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_baseInfo_vehBodyTypeCd'
        );
        this.vehicleSumInsuredField = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_ratingInfo_marketValue'
        );
        this.vehicleSizeClassDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_sizeclass'
        );
        this.vehicleBusinessUseDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_businessUse'
        );
        this.vehicleWrittenOffYesRadio = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_writtenOffInd\\:0'
        );
        this.vehicleWrittenOffNoRadio = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_writtenOffInd\\:1'
        );
        this.vehicleWrittenOffIndicator = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_writtenOffInd'
        );
        this.vehicleClaimFreeYearsField = page.locator(
            '#policyDataGatherForm\\:sedit_CLAutoTTTVehicleInfo_claimFreeYears'
        );
        this.commercialAutoPlanDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_BcicCLCoverageType_TTTVehicle_coverageType'
        );

        this.addStructureCoverageButton = page.locator(
            '#policyDataGatherForm\\:addCLStructureRiskItem'
        );
        this.structureClassSearchButton = page.locator(
            '#policyDataGatherForm\\:j_id_1_24_4i_2_9_2_d_6_1_1_9'
        );
        this.firstStructureClassButton = page.locator(
            '#occupancyClassSearchForm_CLStructureRiskItem\\:occupancyClassSearchResult_CLStructureRiskItem\\:0\\:occupancyClassSelectButton_CLStructureRiskItem'
        );
        this.structureDeductibleDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLStructureRiskItem_deductibleAmount'
        );
        this.structureCoverageCheckbox = page.locator(
            '#policyDataGatherForm\\:header_CLStructureCoverage\\:0\\:selectCoverage_CLStructureCoverage'
        );
        this.structureAddRemoveReasonDropdown = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureAddRemoveReason_inner_addRemoveReasonCd'
        );
        this.structureLimitAmountField = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureCoverage_inner_limitAmount'
        );
        this.structureRatingTypeDropdown = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureCoverage_inner_ratingType'
        );
        this.structureCauseOfLossDropdown = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureCoverage_inner_causeOfLoss'
        );
        this.structureAgreedValueDropdown = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureCoverage_inner_agreedValueOption'
        );
        this.structureCoinsuranceDropdown = page.locator(
            '#policyDataGatherForm\\:collapsibleData_CLStructureCoverage\\:sedit_CLStructureCoverage_inner_coinsurance'
        );

        this.addPersonalPropertyCoverageButton = page.locator(
            '#policyDataGatherForm\\:addCLPersonalPropertyRiskItem'
        );
        this.personalPropertyRatingTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLPersonalPropertyRiskItem_ratingType'
        );

        this.addBusinessIncomeCoverageButton = page.locator(
            '#policyDataGatherForm\\:addCLBusinessIncome'
        );
        this.businessIncomeRiskTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLBusinessIncomeCoverage_riskType'
        );
        this.businessIncomeCauseOfLossDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLBusinessIncomeCoverage_causeOfLoss'
        );
        this.businessIncomeLimitAmountField = page.locator(
            '#policyDataGatherForm\\:sedit_CLBusinessIncomeCoverage_limitAmount'
        );
        this.businessIncomeRiskDescriptionDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLBusinessIncomeCoverage_riskDescription'
        );
        this.businessIncomeIndemnityPeriodField = page.locator(
            '#policyDataGatherForm\\:sedit_CLBusinessIncomeCoverage_indemnityPeriod'
        );

        this.moveToDropdown = page.locator('#productContextInfoForm\\:moveToBox');
        this.endorsementRequestorDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_CLAuthority_requestor'
        );
        this.endorsementContinueButton = page.locator(
            '#policyDataGatherForm\\:ok_footer'
        );
        this.commercialEndorsementDateField = page.locator(
            '#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementDateInputDate'
        );
        this.endorsementReasonDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PolicyEndorseAction_endorsementReason'
        );
        this.endorsementStartButton = page.locator(
            '#policyDataGatherForm\\:yesBtn_PolicyEndorseAction_footer'
        );
        this.endorsementConfirmationButton = page.locator(
            '#policyDataGatherForm\\:modalConfirmationDialog_PolicyEndorseAction_yesBtn'
        );
        this.reinsuranceEmlField = page.locator(
            '#policyDataGatherForm\\:sedit_CLReinsuranceEstimatedMaxLoss_eml'
        );
        this.purchaseQuoteButton = page.locator(
            '#policyDataGatherForm\\:purchaseQuote_footer'
        );
        this.purchaseConfirmationButton = page.locator(
            '#policyDataGatherForm\\:okBtn'
        );
        this.finishPurchaseButton = page.locator(
            '#purchaseForm\\:yesButton_footer'
        );

        this.liabilityGeneralAggregateLimitField = page.locator(
            '#policyDataGatherForm\\:sedit_CLGLPremOpsProdCoDefaultLimits_generalAggregateLimit'
        );
        this.liabilityEachOccurrenceLimitField = page.locator(
            '#policyDataGatherForm\\:sedit_CLGLPremOpsProdCoDefaultLimits_eachOccurrenceLimit'
        );
        this.addLiabilityClassButton = page.locator(
            '#policyDataGatherForm\\:addCLGLPremOpsProdCoClassRiskItem'
        );
        this.liabilityClassSearchButton = page.locator(
            '#policyDataGatherForm\\:j_id_1_24_4i_2_6_2_d_6_1_1_8'
        );
        this.firstLiabilityClassButton = page.locator(
            'button[id*="GLClassSelectButton_CLGLPremOpsProdCoClassRiskItem"]'
        ).first();

        this.policyCountryText = page.locator(
            '#policyDataGatherForm\\:sedit_Policy_countryCd'
        );
        this.policyEffectiveDateField = page.locator(
            '#policyDataGatherForm\\:sedit_Policy_contractTerm_effectiveInputDate'
        );
        this.policyPremiumFinancingText = page.locator(
            '#policyDataGatherForm\\:sedit_Policy_premiumFinancing'
        );
        this.policyCurrencyText = page.locator(
            '#policyDataGatherForm\\:sedit_Policy_currencyCd'
        );
    }

    // =========================================
    // Fill Insured Details Section
    // =========================================

    async fillInsuredDetails(
        customerName: string
    ): Promise<void> {

        // Select Insured

        await this.insuredDropdown.selectOption({
            label: customerName
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // Open Service Role Dropdown
        await this.serviceRoleDropdown.click();

        await expect(this.serviceRolePanel).toBeVisible();

        const serviceRoleCount = await this.serviceRoleItems.count();

        for (let index = 0; index < serviceRoleCount; index += 1) {
            const serviceRoleItem = this.serviceRoleItems.nth(index);
            const isServiceRoleSelected =
                await serviceRoleItem.evaluate(
                    element => element.classList.contains(
                        'ui-selectcheckboxmenu-checked'
                    )
                );

            if (!isServiceRoleSelected) {
                await this.serviceRoleCheckboxes.nth(index).click();
            }

            await expect(serviceRoleItem)
                .toHaveClass(/ui-selectcheckboxmenu-checked/);
        }

        await this.page.mouse.click(10, 10);
        await expect(this.serviceRolePanel).toBeHidden();

        await this.ratingPage.headerNextButton.click();
        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    async selectLOBs(
        lob: LobConfig
    ): Promise<void> {

        // =====================================
        // Commercial Auto
        // =====================================
        await closePartySearchPopupIfVisible(this.ratingPage.page);
        if (lob.commercialAuto) {

            await this.commercialAutoLobCheckbox.check();

            await waitForBarbadosLoadingSpinner(this.ratingPage);

            if (lob.businessAuto) {

                await this.businessAutoCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }

            if (lob.autoDealers) {

                await this.autoDealersCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }

            if (lob.garageKeepers) {

                await this.garageKeepersCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }
        }

        // =====================================
        // Property
        // =====================================

        if (lob.property) {

            await this.propertyLobCheckbox.check();

            await waitForBarbadosLoadingSpinner(this.ratingPage);

            if (lob.structure) {

                await this.structureCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }

            if (lob.personalProperty) {

                await this.personalPropertyCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }

            if (lob.businessIncome) {

                await this.businessIncomeCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }
        }

        // =====================================
        // Liability
        // =====================================

        if (lob.liability) {

            await this.liabilityLobCheckbox.check();

            await waitForBarbadosLoadingSpinner(this.ratingPage);

            if (lob.premisesOperations) {

                await this.premisesOperationsCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }

            if (lob.productsOperations) {

                await this.productsOperationsCheckbox.check();

                await waitForBarbadosLoadingSpinner(this.ratingPage);
            }
        }

        await this.ratingPage.headerNextButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    // =========================================
    // Add Risk Location
    // =========================================

    async addRiskLocation(
        country: string,
        addressLine1: string,
        parish: string
    ): Promise<void> {

        await this.riskCountryDropdown.selectOption({
            label: country
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.riskAddressLine1Field.fill(addressLine1);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.riskParishDropdown.selectOption({
            label: parish
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    // =========================================
    // Add Structure
    // =========================================

    async addStructure(
        structure: StructureDetails
    ): Promise<void> {

        await this.addStructureButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.structureDescriptionField.fill(
            structure.structureDescription
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.structureConstructionTypeDropdown.selectOption({
            label: structure.constructionType
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.structureRoofTypeDropdown.selectOption({
            label: structure.roofType
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    // =========================================
    // Add Occupancy
    // =========================================

    async addOccupancy(
        occupancy: OccupancyDetails
    ): Promise<void> {

        await this.addOccupancyButton.scrollIntoViewIfNeeded();

        await this.addOccupancyButton.evaluate(
            (element: HTMLInputElement) => element.click()
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await expect(this.occupancyDescriptionField).toBeVisible();

        await this.occupancyDescriptionField.fill(
            occupancy.occupancyDescription
        );

        await this.occupancyDescriptionField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.occupantNameField.fill(
            occupancy.occupantName
        );

        await this.occupantNameField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // Occupancy Class Search
        await this.occupancyClassSearchButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.firstOccupancyClassButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    // =========================================
    // Click Rate Button
    // =========================================

    async clickRateButton(): Promise<void> {

        await this.rateButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addDriver(
        driver: DriverDetails
    ): Promise<void> {
        await this.driversTab.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
        await this.addDriverButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverRelationshipDropdown.selectOption(
            driver.relationshipToApplicant
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverTypeDropdown.selectOption(driver.driverType);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverMaritalStatusDropdown.selectOption(driver.maritalStatus);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverLicenceTypeDropdown.selectOption(driver.licenceType);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverAgeFirstLicensedField.fill(driver.ageFirstLicensed);

        await this.driverLicenceNumberField.fill(driver.licenceNumber);
        await this.driverFirstNameField.fill(driver.firstName);

        await this.driverLastNameField.fill(driver.lastName);

        const isJamaicaDriver = ['JM', 'Jamaica'].includes(driver.country);

        if (isJamaicaDriver) {
            const trn = faker.string.numeric(9);
            await this.driverTrnField.fill(trn);
        }

        await this.driverGenderDropdown.selectOption(driver.gender);

        await this.driverDateOfBirthField.fill(driver.dateOfBirth);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverCountryDropdown.selectOption(driver.country);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await closePartySearchPopupIfVisible(this.policyPage.page);

        await this.driverAddressLine1Field.fill(driver.addressLine1);

        await this.driverParishDropdown.selectOption(driver.parish);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.driverLicensedDateField.fill(driver.licensedDate);

        await this.driverLicenceCountryDropdown.selectOption(
            driver.licenceCountry
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.licenceClassDropdown.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.firstLicenceClassCheckbox.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addCoverageAddress(
        coverageAddress: CoverageAddressDetails
    ): Promise<void> {
        await this.coverageAddressCountryDropdown.selectOption(
            coverageAddress.country
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.coverageAddressLine1Field.fill(
            coverageAddress.addressLine1
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.coverageAddressParishDropdown.selectOption(
            coverageAddress.parish
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addVehicle(
        vehicle: VehicleDetails
    ): Promise<void> {
        await this.addVehicleButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
        await this.vehicleVinField.fill(vehicle.vinNumber);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleModelYearDropdown.selectOption(vehicle.modelYear);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        const seatingCapacity = (Math.floor(Math.random() * 59) + 2).toString();

        await this.vehicleSeatingCapacityField.fill(seatingCapacity);

        await this.vehicleSeatingCapacityField.press('Tab');
        await waitForBarbadosLoadingSpinner(this.ratingPage);
        await this.vehicleMakeDropdown.selectOption(vehicle.make);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleCcRatingField.fill(vehicle.ccRating);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleModelDropdown.selectOption(vehicle.model);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleBodyTypeDropdown.selectOption(vehicle.bodyType);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleSumInsuredField.fill(vehicle.sumInsured);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleSizeClassDropdown.selectOption(vehicle.sizeClass);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.vehicleBusinessUseDropdown.selectOption(vehicle.businessUse);

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        if (vehicle.writtenOffIndicator === 'Yes') {

            await this.vehicleWrittenOffYesRadio.check();

        } else {

            await this.vehicleWrittenOffNoRadio.check();
        }

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async updateCommercialAutoVehicleSumInsured(
        sumInsured: string
    ): Promise<void> {

        await this.navigateToTab(
            'Vehicle'
        );

        await this.vehicleSumInsuredField.scrollIntoViewIfNeeded();

        await this.vehicleSumInsuredField.clear();

        await this.vehicleSumInsuredField.fill(
            sumInsured
        );

        await this.vehicleSumInsuredField.press(
            'Tab'
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async selectCommercialAutoPlan(
        plan: PlanSelectionDetails
    ): Promise<void> {

        await this.commercialAutoPlanDropdown.selectOption({
            label: plan.coverageType
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.ratingPage.headerNextButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.ratingPage.headerNextButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addStructureCoverage(
        coverage: StructureCoverageDetails
    ): Promise<void> {

        // =========================================
        // Add Structure Coverage
        // =========================================

        await this.addStructureCoverageButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Open Class Code Popup
        // =========================================

        await this.structureClassSearchButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Select First Class Code
        // =========================================

        await this.firstStructureClassButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Deductible
        // =========================================

        await this.structureDeductibleDropdown.selectOption(
            coverage.deductible
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Select Coverage
        // =========================================

        await this.structureCoverageCheckbox.check();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Add / Remove Reason
        // =========================================

        await this.structureAddRemoveReasonDropdown.selectOption(
            coverage.addRemoveReason
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Limit Amount
        // =========================================

        await this.structureLimitAmountField.fill(
            coverage.limitAmount
        );

        await this.structureLimitAmountField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Rating Type
        // =========================================

        await this.structureRatingTypeDropdown.selectOption(
            coverage.ratingType
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Cause Of Loss
        // =========================================

        await this.structureCauseOfLossDropdown.selectOption(
            coverage.causeOfLoss
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Agreed Value
        // =========================================

        await this.structureAgreedValueDropdown.selectOption(
            coverage.agreedValueOption
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Coinsurance
        // =========================================

        await this.structureCoinsuranceDropdown.selectOption(
            coverage.coinsurance
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addPersonalPropertyCoverage(
        coverage: PersonalPropertyCoverageDetails
    ): Promise<void> {

        // =========================================
        // Add Personal Property Coverage
        // =========================================

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.addPersonalPropertyCoverageButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Rating Type
        // =========================================

        await this.personalPropertyRatingTypeDropdown.selectOption(
            coverage.ratingType
        );

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async navigateToCommercialAuto(): Promise<void> {
        await this.commercialAutoNode.scrollIntoViewIfNeeded();

        await this.commercialAutoNode.click({ force: true });

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    async addBusinessIncomeCoverage(
        coverage: BusinessIncomeCoverageDetails
    ): Promise<void> {

        // =========================================
        // Add Coverage
        // =========================================

        await this.addBusinessIncomeCoverageButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Risk Type
        // =========================================

        await this.businessIncomeRiskTypeDropdown.selectOption({
            label: coverage.riskType
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Cause Of Loss
        // =========================================

        await this.businessIncomeCauseOfLossDropdown.selectOption({
            label: coverage.causeOfLoss
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Limit Amount
        // =========================================

        await this.businessIncomeLimitAmountField.fill(
            coverage.limitAmount
        );

        await this.businessIncomeLimitAmountField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Risk Description
        // =========================================

        await this.businessIncomeRiskDescriptionDropdown.selectOption({
            label: coverage.riskDescription
        });

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Indemnity Period
        // =========================================

        await this.businessIncomeIndemnityPeriodField.fill(
            coverage.indemnityPeriod
        );

        await this.businessIncomeIndemnityPeriodField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async navigateToTab(
        tabName: string
    ): Promise<void> {
        await this.getTabLocator(tabName).click({ force: true });

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async fundingSummary(): Promise<FundingSummarySnapshot> {
        return {
            paymentPlan: await this.fundingSummaryFields.paymentPlan.inputValue(),
            netPremium: await this.fundingSummaryFields.netPremium.inputValue(),
            gct: await this.fundingSummaryFields.gct.inputValue(),
            totalPremium: await this.fundingSummaryFields.totalPremium.inputValue(),
            totalStampDuty: await this.fundingSummaryFields.totalStampDuty.inputValue(),
            additionalStampDuty:
                await this.fundingSummaryFields.additionalStampDuty.inputValue(),
            endorsementApRp:
                await this.fundingSummaryFields.endorsementApRp.inputValue(),
            deposit: await this.fundingSummaryFields.deposit.inputValue(),
            interestRate: await this.fundingSummaryFields.interestRate.inputValue(),
            financeCharge: await this.fundingSummaryFields.financeCharge.inputValue(),
            totalDue: await this.fundingSummaryFields.totalDue.inputValue(),
            monthlyInstallment:
                await this.fundingSummaryFields.monthlyInstallment.inputValue()
        };
    }

    async getPolicyDetails(): Promise<PolicyDetails> {
        const policyNumber = await this.policyNumberText.textContent();
        const policyStatus = await this.policyStatusText.textContent();
        const effectiveDate = await this.policyEffectiveDateText.textContent();

        return {
            policyNumber,
            status: policyStatus,
            effectiveDate
        };
    }
    async navigateToFundingSummary(): Promise<void> {
        await this.fundingSummaryNode.scrollIntoViewIfNeeded();

        await this.fundingSummaryNode.click({ force: true });

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async getOverallPremiumSummary(): Promise<PremiumSummary> {
        return {
            lob: (
                await this.premiumSummaryCells.nth(0).textContent()
            )?.trim(),

            termPremium: (
                await this.premiumSummaryCells.nth(1).textContent()
            )?.trim(),

            actualPremium: (
                await this.premiumSummaryCells.nth(2).textContent()
            )?.trim(),

            adjustedPremium: (
                await this.premiumSummaryCells.nth(3).textContent()
            )?.trim(),

            taxes: (
                await this.premiumSummaryCells.nth(4).textContent()
            )?.trim(),

            fees: (
                await this.premiumSummaryCells.nth(5).textContent()
            )?.trim(),

            billablePremium: (
                await this.premiumSummaryCells.nth(6).textContent()
            )?.trim(),

            aprp: (
                await this.premiumSummaryCells.nth(7).textContent()
            )?.trim(),

            calculatedCommission: (
                await this.premiumSummaryCells.nth(8).textContent()
            )?.trim()
        };
    }
    async getOverallPremiumTotals(): Promise<PremiumTotals> {
        return {
            termPremium: (
                await this.premiumTotalsCells.nth(1).textContent()
            )?.trim(),

            actualPremium: (
                await this.premiumTotalsCells.nth(2).textContent()
            )?.trim(),

            adjustedPremium: (
                await this.premiumTotalsCells.nth(3).textContent()
            )?.trim(),

            taxes: (
                await this.premiumTotalsCells.nth(4).textContent()
            )?.trim(),

            fees: (
                await this.premiumTotalsCells.nth(5).textContent()
            )?.trim(),

            billablePremium: (
                await this.premiumTotalsCells.nth(6).textContent()
            )?.trim(),

            aprp: (
                await this.premiumTotalsCells.nth(7).textContent()
            )?.trim(),

            calculatedCommission: (
                await this.premiumTotalsCells.nth(8).textContent()
            )?.trim()
        };
    }

    async startUpdateEmlEndorsement(
        endorsementDate = getFormattedDate(new Date())
    ): Promise<void> {
        await this.moveToDropdown.selectOption('endorseWithWorkspace');
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.endorsementRequestorDropdown.selectOption('Insurer');
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.endorsementContinueButton.click();
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.commercialEndorsementDateField.fill(endorsementDate);
        await this.commercialEndorsementDateField.press('Tab');
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.endorsementReasonDropdown.selectOption('PROP_UPDATEEML');
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.endorsementStartButton.click();
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        if (await this.isVisibleWithin(this.endorsementConfirmationButton, 15_000)) {
            await this.endorsementConfirmationButton.click();
            await waitForBarbadosLoadingSpinner(this.ratingPage);
        }
    }

    async updateReinsuranceEml(emlAmount: string): Promise<void> {
        await this.navigateToTab('Reinsurance');

        await this.reinsuranceEmlField.fill(emlAmount);
        await this.reinsuranceEmlField.press('Tab');
        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    async rateAndPrintEndorsementPremium(): Promise<void> {
        await this.navigateToTab('Premium');
        await this.clickRateButton();
        await this.getOverallPremiumSummary();
        await this.getOverallPremiumTotals();
    }

    async printEndorsementFundingSummary(): Promise<void> {
        await this.navigateToFundingSummary();
        await this.fundingSummary();
    }

    async purchaseAndFinishEndorsement(): Promise<void> {
        await this.purchaseQuoteButton.click();
        await waitForBarbadosLoadingSpinner(this.ratingPage);

        if (await this.isVisibleWithin(this.purchaseConfirmationButton, 15_000)) {
            await this.purchaseConfirmationButton.click();
            await waitForBarbadosLoadingSpinner(this.ratingPage);
        }

        await this.finishPurchaseButton.click();
        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }

    async completeUpdateEmlEndorsement(emlAmount: string): Promise<void> {
        await this.startUpdateEmlEndorsement();
        await this.updateReinsuranceEml(emlAmount);
        await this.rateAndPrintEndorsementPremium();
        await this.printEndorsementFundingSummary();
        await this.purchaseAndFinishEndorsement();
    }

    private async isVisibleWithin(
        locator: Locator,
        timeout: number
    ): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    private getTabLocator(tabName: string): Locator {
        return this.tabLabels.filter({
            hasText: new RegExp(`^${tabName}$`)
        });
    }

    async addLiabilityLimits(
        limits: LiabilityLimitDetails
    ): Promise<void> {

        await this.liabilityGeneralAggregateLimitField.fill(
            limits.generalAggregateLimit
        );

        await this.liabilityGeneralAggregateLimitField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await this.liabilityEachOccurrenceLimitField.fill(
            limits.eachOccurrenceLimit
        );

        await this.liabilityEachOccurrenceLimitField.press('Tab');

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async addLiabilityClassInformation(
        _classDetails: LiabilityClassDetails
    ): Promise<void> {

        // =========================================
        // Add Class
        // =========================================

        await this.addLiabilityClassButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Open Class Search Popup
        // =========================================

        await this.liabilityClassSearchButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        // =========================================
        // Select First Class
        // =========================================

        await this.firstLiabilityClassButton.click();

        await waitForBarbadosLoadingSpinner(this.ratingPage);

        await waitForBarbadosLoadingSpinner(this.ratingPage);
    }
    async getPolicySectionDetails(): Promise<PolicySectionDetails> {

        const country = await this.policyCountryText.textContent();

        const effectiveDate = await this.policyEffectiveDateField.inputValue();

        const premiumFinancing =
            await this.policyPremiumFinancingText.textContent();

        const currency = await this.policyCurrencyText.textContent();

        return {
            country: country?.trim() || '',
            effectiveDate: effectiveDate.trim(),
            premiumFinancing:
                premiumFinancing?.trim() || '',
            currency: currency?.trim() || ''
        };
    }
    async verifyPolicySection(
        expected: PolicySectionDetails
    ): Promise<void> {

        const actual =
            await this.getPolicySectionDetails();

        expect(actual.country)
            .toBe(expected.country);

        expect(actual.effectiveDate)
            .toBe(expected.effectiveDate);

        expect(actual.premiumFinancing)
            .toBe(expected.premiumFinancing);

        expect(actual.currency)
            .toBe(expected.currency);
    }
    async verifyDriverDetails(
        expected: {
            driverType: string;
            firstName: string;
            lastName: string;
            gender: string;
            addressLine1: string;
            parish: string;
            licenceType: string;
            licenceNumber: string;
            licenceCountry: string;
        }
    ): Promise<void> {

        const actual = {
            driverType: await this.driverTypeDropdown.textContent(),
            firstName: await this.driverFirstNameField.textContent(),
            lastName: await this.driverLastNameField.textContent(),
            gender: await this.driverGenderDropdown.textContent(),
            addressLine1: await this.driverAddressLine1Field.textContent(),
            parish: await this.driverParishDropdown.textContent(),
            licenceType: await this.driverLicenceTypeDropdown.textContent(),
            licenceNumber: await this.driverLicenceNumberField.textContent(),
            licenceCountry:
                await this.driverLicenceCountryDropdown.textContent()
        };

        expect(actual.driverType?.trim()).toBe(expected.driverType);
        expect(actual.firstName?.trim()).toBe(expected.firstName);
        expect(actual.lastName?.trim()).toBe(expected.lastName);
        expect(actual.gender?.trim()).toBe(expected.gender);
        expect(actual.addressLine1?.trim()).toBe(expected.addressLine1);
        expect(actual.parish?.trim()).toBe(expected.parish);
        expect(actual.licenceType?.trim()).toBe(expected.licenceType);
        expect(actual.licenceNumber?.trim()).toBe(expected.licenceNumber);
        expect(actual.licenceCountry?.trim()).toBe(expected.licenceCountry);
    }
    async verifyVehicleDetails(
        expected: VehicleOverviewDetails
    ): Promise<void> {

        const actual = {
            vinNumber: await this.vehicleVinField.textContent(),
            modelYear: await this.vehicleModelYearDropdown.textContent(),
            make: await this.vehicleMakeDropdown.textContent(),
            model: await this.vehicleModelDropdown.textContent(),
            bodyType: await this.vehicleBodyTypeDropdown.textContent(),
            sumInsured: await this.vehicleSumInsuredField.textContent(),
            sizeClass: await this.vehicleSizeClassDropdown.textContent(),
            businessUse: await this.vehicleBusinessUseDropdown.textContent(),
            writtenOffIndicator:
                await this.vehicleWrittenOffIndicator.textContent(),
            claimFreeYears: await this.vehicleClaimFreeYearsField.textContent()
        };

        expect(actual.vinNumber?.trim()).toBe(expected.vinNumber);
        expect(actual.modelYear?.trim()).toBe(expected.modelYear);
        expect(actual.make?.trim()).toBe(expected.make);
        expect(actual.model?.trim()).toBe(expected.model);
        expect(actual.bodyType?.trim()).toBe(expected.bodyType);
        expect(actual.sumInsured?.trim()).toBe(expected.sumInsured);
        expect(actual.sizeClass?.trim()).toBe(expected.sizeClass);
        expect(actual.businessUse?.trim()).toBe(expected.businessUse);
        expect(actual.writtenOffIndicator?.trim()).toBe(
            expected.writtenOffIndicator
        );
        expect(actual.claimFreeYears?.trim()).toBe(expected.claimFreeYears);
    }
    async verifyFundingSummary(
        expected: FundingSummaryDetails
    ): Promise<void> {

        const actual = {
            paymentPlan:
                await this.fundingSummaryFields.paymentPlan.textContent(),
            interestRate:
                await this.fundingSummaryFields.interestRate.textContent(),
            totalFinanceCharge:
                await this.fundingSummaryFields.financeCharge.textContent()
        };

        expect(actual.paymentPlan?.trim()).toBe(expected.paymentPlan);
        expect(actual.interestRate?.trim()).toBe(expected.interestRate);
        expect(actual.totalFinanceCharge?.trim()).toBe(
            expected.totalFinanceCharge
        );
    }
}
