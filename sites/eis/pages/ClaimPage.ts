import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForBarbadosLoadingSpinner } from '../../../lib/aio/waitForBarbadosLoadingSpinner';

export class ClaimPage extends BasePage {
    readonly newClaimButton: Locator;
    readonly reportingMethodDropdown: Locator;
    readonly lossDescriptionField: Locator;
    readonly lossContextSequenceDropdown: Locator;
    readonly startClaimsButton: Locator;
    readonly reportingPartyDropdown: Locator;
    readonly reportingPartyChangedButton: Locator;
    readonly reportingPartyReportedDateField: Locator;
    readonly reportingPartyReportingMethodDropdown: Locator;
    readonly reportingPartyPreviouslyReportedNoRadio: Locator;
    readonly relationshipToInsuredDropdown: Locator;
    readonly reportingPartyFirstNameField: Locator;
    readonly reportingPartyLastNameField: Locator;
    readonly reportingPartyIdentificationTypeDropdown: Locator;
    readonly reportingPartyIdentificationNumberField: Locator;
    readonly reportingPartyDateOfBirthField: Locator;
    readonly reportingPartyGenderDropdown: Locator;
    readonly reportingPartyMaritalStatusDropdown: Locator;
    readonly reportingPartyEmploymentStatusDropdown: Locator;
    readonly reportingPartyOccupationDropdown: Locator;
    readonly reportingPartyPhoneTypeDropdown: Locator;
    readonly reportingPartyPhoneNumberField: Locator;
    readonly reportingPartyEmailField: Locator;
    readonly reportingPartyMainContactYesRadio: Locator;
    readonly reportingPartyAddressTypeDropdown: Locator;
    readonly reportingPartyAddressCountryDropdown: Locator;
    readonly reportingPartyAddressPostalCodeField: Locator;
    readonly reportingPartyAddressLine1Field: Locator;
    readonly reportingPartyAddressLine2Field: Locator;
    readonly reportingPartyAddressLine3Field: Locator;
    readonly reportingPartyAddressCityField: Locator;
    readonly reportingPartyAddressParishDropdown: Locator;
    readonly reportingPartyAddressDistrictDropdown: Locator;
    readonly reportingPartyAddressStateDropdown: Locator;
    readonly privateMotorLossLocationDropdown: Locator;
    readonly privateMotorCauseOfLossDropdown: Locator;
    readonly privateMotorLossDescriptionField: Locator;
    readonly privateMotorRoadConditionField: Locator;
    readonly privateMotorWeatherConditionField: Locator;
    readonly privateMotorGeneralCommentsField: Locator;
    readonly privateMotorClaimTypeDropdown: Locator;
    readonly privateMotorContributingFactorDropdown: Locator;
    readonly privateMotorLossDateField: Locator;
    readonly privateMotorDamageSidebarTab: Locator;
    readonly vehicleDamageRiskItemDropdown: Locator;
    readonly vehicleDamageAssociatedRiskItemDropdown: Locator;
    readonly vehicleDamageYearDropdown: Locator;
    readonly vehicleDamageMakeDropdown: Locator;
    readonly vehicleDamageModelDropdown: Locator;
    readonly vehicleDamageVinField: Locator;
    readonly vehicleDamageColorField: Locator;
    readonly vehicleDamagePlateField: Locator;
    readonly vehicleDamagePlateStateDropdown: Locator;
    readonly vehicleDamageUsedWithPermissionYesRadio: Locator;
    readonly vehicleDamageDescriptionField: Locator;
    readonly vehicleDamageNotRoadworthyNoRadio: Locator;
    readonly vehicleDamageImpactDropdown: Locator;
    readonly vehicleDamageAirbagsNoRadio: Locator;
    readonly vehicleDamageCommercialUseNoRadio: Locator;
    readonly vehicleDamageSpeedField: Locator;
    readonly vehicleDamageTravelDirectionField: Locator;
    readonly vehicleDamageTotalLossNoRadio: Locator;
    readonly vehicleDamageLeakingFluidsNoRadio: Locator;
    readonly vehicleDamagePartyTypeDropdown: Locator;
    readonly vehicleDamageInsuredClaimingYesRadio: Locator;
    readonly contactPreferenceDropdown: Locator;
    readonly lossLocationDropdown: Locator;
    readonly fnolLossDescriptionField: Locator;
    readonly causeOfLossDropdown: Locator;
    readonly damageTypeDropdown: Locator;
    readonly addDamageButton: Locator;
    readonly buildingRiskItemDropdown: Locator;
    readonly buildingAssociatedRiskItemDropdown: Locator;
    readonly buildingDamageDescriptionField: Locator;
    readonly buildingPropertyDescriptionField: Locator;
    readonly buildingPartyTypeDropdown: Locator;
    readonly buildingDamageChangedButton: Locator;
    readonly buildingAssociatedRiskItemChangedButton: Locator;
    readonly buildingLocationField: Locator;
    readonly buildingStructureField: Locator;
    readonly buildingAddressLine1Field: Locator;
    readonly buildingAddressCountryDropdown: Locator;
    readonly buildingAddressParishDropdown: Locator;
    readonly completeNotificationTab: Locator;
    readonly openClaimPanelLabel: Locator;
    readonly openClaimButton: Locator;
    readonly eventDetailsTable: Locator;
    readonly adjudicationTab: Locator;
    readonly addNewFeatureButton: Locator;
    readonly adjudicationAssociatedRiskDropdown: Locator;
    readonly adjudicationCoverageDropdown: Locator;
    readonly claimDamageDetailsTable: Locator;
    readonly bodilyInjuryRiskItemDropdown: Locator;
    readonly bodilyInjuryPartyTypeDropdown: Locator;
    readonly bodilyInjuryDescriptionField: Locator;
    readonly injuredPartyDropdown: Locator;
    readonly injuredPartyContactPreferenceDropdown: Locator;
    readonly injuredPartyAddressLine1Field: Locator;
    readonly claimPartiesTable: Locator;
    readonly indemnityReserveField: Locator;
    readonly expenseReserveField: Locator;
    readonly recoveryReserveField: Locator;
    readonly featureHandlingTab: Locator;
    readonly paymentsTab: Locator;
    readonly financialTransactionsSummaryTable: Locator;
    readonly postPaymentButton: Locator;
    readonly paymentReferenceNumberField: Locator;
    readonly paymentGrossAmountField: Locator;
    readonly paymentToDropdown: Locator;
    readonly paymentMemoField: Locator;
    readonly paymentMethodDropdown: Locator;
    readonly bankAccountInfoDropdown: Locator;
    readonly bankNameDropdown: Locator;
    readonly bankBranchDropdown: Locator;
    readonly bankAccountNumberField: Locator;
    readonly bankAccountHolderNameField: Locator;
    readonly bankAccountTypeDropdown: Locator;
    readonly paymentOfferTypeDropdown: Locator;
    readonly paymentReserveTypeDropdown: Locator;
    readonly paymentAllocationAmountField: Locator;
    readonly paymentOfferStageDropdown: Locator;
    readonly paymentDamageAmountField: Locator;
    readonly validatePostPaymentButton: Locator;
    readonly financialRecordsTable: Locator;
    readonly claimListTable: Locator;
    readonly approvePaymentLink: Locator;
    readonly approvePaymentReasonField: Locator;
    readonly confirmApprovePaymentButton: Locator;
    readonly issuePaymentLink: Locator;
    readonly issuePaymentReasonField: Locator;
    readonly confirmIssuePaymentButton: Locator;

    constructor(page: Page) {
        super(page);

        this.newClaimButton = page.locator('#claimList\\:newClaim');
        this.reportingMethodDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossEvent_reportingMethod'
        );
        this.lossDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossEvent_lossDescription'
        );
        this.lossContextSequenceDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_sequenceNumber'
        );
        this.startClaimsButton = page.locator(
            '#policyDataGatherForm\\:StartClaimsActionBtn_ClaimsStartClaimsAction_footer'
        );
        this.reportingPartyDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_backedBean_partyOid'
        );
        this.reportingPartyChangedButton = page.locator(
            '#policyDataGatherForm\\:changedPartyButton_ReportingParty'
        );
        this.reportingPartyReportedDateField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_backedBean_claim_reportedDtInputDate'
        );
        this.reportingPartyReportingMethodDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_backedBean_claim_reportingMethod'
        );
        this.reportingPartyPreviouslyReportedNoRadio = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_backedBean_claim_previouslyReportedInd\\:1'
        );
        this.relationshipToInsuredDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_relationShipToInsuredCd'
        );
        this.reportingPartyFirstNameField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_partyName_firstName'
        );
        this.reportingPartyLastNameField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_partyName_lastName'
        );
        this.reportingPartyIdentificationTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_extension_identificationTypeCd'
        );
        this.reportingPartyIdentificationNumberField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_extension_identificationNumber'
        );
        this.reportingPartyDateOfBirthField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_birthDtInputDate'
        );
        this.reportingPartyGenderDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_genderCd'
        );
        this.reportingPartyMaritalStatusDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_maritalStatusCd'
        );
        this.reportingPartyEmploymentStatusDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_extension_employmentStatusCd'
        );
        this.reportingPartyOccupationDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_extension_occupationCd'
        );
        this.reportingPartyPhoneTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_partyPhoneTypeCd'
        );
        this.reportingPartyPhoneNumberField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_partyPhoneNumber'
        );
        this.reportingPartyEmailField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_partyEmail'
        );
        this.reportingPartyMainContactYesRadio = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_mainContactPartyInd\\:0'
        );
        this.reportingPartyAddressTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_addressTypeCd'
        );
        this.reportingPartyAddressCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_countryCd'
        );
        this.reportingPartyAddressPostalCodeField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_postalCode'
        );
        this.reportingPartyAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_addressLine1'
        );
        this.reportingPartyAddressLine2Field = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_addressLine2'
        );
        this.reportingPartyAddressLine3Field = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_addressLine3'
        );
        this.reportingPartyAddressCityField = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_city'
        );
        this.reportingPartyAddressParishDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_addressExtension_parishCd'
        );
        this.reportingPartyAddressDistrictDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_addressExtension_districtCd'
        );
        this.reportingPartyAddressStateDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingPartyAddressContact_addressContact_address_stateProvCd'
        );
        this.privateMotorLossLocationDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_lossLocation'
        );
        this.privateMotorCauseOfLossDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_causeOfLossCd'
        );
        this.privateMotorLossDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_lossDesc'
        );
        this.privateMotorRoadConditionField = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_environmentCondition'
        );
        this.privateMotorWeatherConditionField = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_weatherCondition'
        );
        this.privateMotorGeneralCommentsField = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_generalComments'
        );
        this.privateMotorClaimTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_claimTypeCd'
        );
        this.privateMotorContributingFactorDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_contributingFactor'
        );
        this.privateMotorLossDateField = page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_lossDtDateInputDate'
        );
        this.privateMotorDamageSidebarTab = page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Damage_"])'
        );
        this.vehicleDamageRiskItemDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_lossInfo_riskItemOid');
        this.vehicleDamageAssociatedRiskItemDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_lossInfo_associatedRiskItemOid');
        this.vehicleDamageYearDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_year');
        this.vehicleDamageMakeDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_make');
        this.vehicleDamageModelDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_model');
        this.vehicleDamageVinField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_VIN');
        this.vehicleDamageColorField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_colorCd');
        this.vehicleDamagePlateField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_plate');
        this.vehicleDamagePlateStateDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_otherVehInfo_plateIssuedStateProvCd');
        this.vehicleDamageUsedWithPermissionYesRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_usedWithPermission\\:0');
        this.vehicleDamageDescriptionField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_damageDesc');
        this.vehicleDamageNotRoadworthyNoRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_collisionInfo_drivableInd\\:1');
        this.vehicleDamageImpactDropdown = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_pointOfInitialImpact');
        this.vehicleDamageAirbagsNoRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_airbagDeployed\\:1');
        this.vehicleDamageCommercialUseNoRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_vehUsedCommercially\\:1');
        this.vehicleDamageSpeedField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_speed');
        this.vehicleDamageTravelDirectionField = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_travelDirection');
        this.vehicleDamageTotalLossNoRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_totalLoss\\:1');
        this.vehicleDamageLeakingFluidsNoRadio = page.locator('#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_leakingFluids\\:1');
        this.vehicleDamagePartyTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_partyType'
        );
        this.vehicleDamageInsuredClaimingYesRadio = page.locator(
            '#policyDataGatherForm\\:sedit_AutoLoss_autoLossInfo_insuredClaimingVehicleDamage\\:0'
        );
        this.contactPreferenceDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ReportingParty_party_contactPreferenceCd'
        );
        this.lossLocationDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLLossEvent_lossLocation'
        );
        this.fnolLossDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLLossEvent_lossDesc'
        );
        this.causeOfLossDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLLossEvent_causeOfLossCd'
        );
        this.damageTypeDropdown = page.locator(
            '#policyDataGatherForm\\:damageTypes_ClaimsDamageManager'
        );
        this.addDamageButton = page.locator(
            '#policyDataGatherForm\\:addComponentButton_ClaimsDamageManager'
        );
        this.buildingRiskItemDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_lossInfo_riskItemOid'
        );
        this.buildingAssociatedRiskItemDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_lossInfo_associatedRiskItemOid'
        );
        this.buildingDamageDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_lossInfo_damageDesc'
        );
        this.buildingPropertyDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_lossInfo_propertyDescription'
        );
        this.buildingPartyTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_lossInfo_partyType'
        );
        this.buildingDamageChangedButton = page.locator(
            '#policyDataGatherForm\\:damageChanged_PrecBuildingLoss'
        );
        this.buildingAssociatedRiskItemChangedButton = page.locator(
            '#policyDataGatherForm\\:associatedRiskItemChanged_PrecBuildingLoss'
        );
        this.buildingLocationField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_buildingLossInfo_location'
        );
        this.buildingStructureField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecBuildingLoss_buildingLossInfo_building'
        );
        this.buildingAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_PrecClaimsBuildingDamageAddress_address_addressLine1'
        );
        this.buildingAddressCountryDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecClaimsBuildingDamageAddress_address_countryCd'
        );
        this.buildingAddressParishDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecClaimsBuildingDamageAddress_address_addressExtension_parishCd'
        );
        this.completeNotificationTab = page.getByText(
            'Complete Notification',
            { exact: true }
        );
        this.openClaimPanelLabel = page.locator(
            '#policyDataGatherForm\\:componentViewPanelHeaderLabel_ClaimsOpenAction'
        );
        this.openClaimButton = page.locator(
            '#policyDataGatherForm\\:claimOpenBtn_ClaimsOpenAction'
        );
        this.eventDetailsTable = page.locator(
            '#productConsolidatedViewForm\\:scolumn_PrecCLLossEvent'
        );
        this.adjudicationTab = page.locator(
            'a.evaluation, ' +
            'a[id^="producContextInfoForm:CFClaimOverviewTabsList:"]' +
            '[id$=":tabActionLink"], ' +
            'a[id*="CFClaimOverviewDataGatherTabsList"]' +
            '[id$=":tabActionLink"]',
            { hasText: 'Adjudication' }
        );
        this.addNewFeatureButton = page.locator(
            '#productConsolidatedViewForm\\:addFeature'
        );
        this.adjudicationAssociatedRiskDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_feature_associatedInsurableRiskOid'
        );
        this.adjudicationCoverageDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_feature_coverageOid'
        );
        this.claimDamageDetailsTable = page.locator(
            '#productConsolidatedViewForm\\:scolumn_ClaimsEvaluationConsolidatedDamage'
        );
        this.bodilyInjuryRiskItemDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLClaimsInjury_lossInfo_associatedRiskItemOid'
        );
        this.bodilyInjuryPartyTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLClaimsInjury_claimsInjury_partyType'
        );
        this.bodilyInjuryDescriptionField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLClaimsInjury_claimsInjury_damageDesc'
        );
        this.injuredPartyDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsInjuryParty_backedBean_partyOid'
        );
        this.injuredPartyContactPreferenceDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsInjuryParty_party_contactPreferenceCd'
        );
        this.injuredPartyAddressLine1Field = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsInjuryPartyAddressContact_addressContact_address_addressLine1'
        );
        this.claimPartiesTable = page.locator(
            '#productConsolidatedViewForm\\:body_scolumn_ClaimsConsolidatedParty'
        );
        this.indemnityReserveField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_lossReserve'
        );
        this.expenseReserveField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_expenseReserve'
        );
        this.recoveryReserveField = page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_recoveryReserve'
        );
        this.featureHandlingTab = page.getByText(
            'Feature Handling',
            { exact: true }
        );
        this.paymentsTab = page.locator(
            "//span[normalize-space()='Payments']"
        );
        this.financialTransactionsSummaryTable = page.locator(
            '#productConsolidatedViewForm\\:body_scolumn_ClaimsFinancialTransactionsSummary'
        );
        this.postPaymentButton = page.locator(
            '#productConsolidatedViewForm\\:addPaymentClaimsPaymentRoot'
        );
        this.paymentReferenceNumberField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_payment_referenceId'
        );
        this.paymentGrossAmountField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_claimsBasePayment_grossAmount'
        );
        this.paymentToDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_claimsBasePayment_partyOid'
        );
        this.paymentMemoField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_payment_description'
        );
        this.paymentMethodDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_paymentDetailsDTO_paymentMethod'
        );
        this.bankAccountInfoDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_claimsBasePayment_bankAccountInfo'
        );
        this.bankNameDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_paymentDetailsDTO_bankName'
        );
        this.bankBranchDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_paymentDetailsDTO_bankBranchCd'
        );
        this.bankAccountNumberField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_paymentDetailsDTO_accountNumber'
        );
        this.bankAccountHolderNameField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_paymentDetailsDTO_bankAccountHolderName'
        );
        this.bankAccountTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPayment_claimsPayment_accountType'
        );
        this.paymentOfferTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_offerTypeCd'
        );
        this.paymentReserveTypeDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_distribution_reserveType'
        );
        this.paymentAllocationAmountField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_distribution_amount'
        );
        this.paymentOfferStageDropdown = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_offerStageCd'
        );
        this.paymentDamageAmountField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_damageAmount'
        );
        this.validatePostPaymentButton = page.locator(
            '#policyDataGatherForm\\:paymentValidateBtn_ClaimsPaymentPostAction'
        );
        this.financialRecordsTable = page.locator(
            '#productConsolidatedViewForm\\:scolumn_ClaimsFinancialRecords'
        );
        this.claimListTable = page.locator(
            '#claimList\\:claimListTable'
        );
        this.approvePaymentLink = page.locator(
            '#policyDataGatherForm\\:paymentActionLink_approve'
        );
        this.approvePaymentReasonField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsApprovePaymentAction_reasonDescription'
        );
        this.confirmApprovePaymentButton = page.locator(
            '#policyDataGatherForm\\:ok_ClaimsApprovePaymentAction_footer'
        );
        this.issuePaymentLink = page.locator(
            '#policyDataGatherForm\\:paymentActionLink_issue'
        );
        this.issuePaymentReasonField = page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsIssuePaymentAction_reasonDescription'
        );
        this.confirmIssuePaymentButton = page.locator(
            '#policyDataGatherForm\\:ok_ClaimsIssuePaymentAction_footer'
        );
    }

    async openNewClaim() {
        await this.claimMenuItem.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.newClaimButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillLossEvent(lossDescription: string) {
        await this.reportingMethodDropdown.selectOption('WALK_IN');
        await waitForBarbadosLoadingSpinner(this);
        await this.lossDescriptionField.fill(lossDescription);
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async completeHomeLossEventAndContext(options: {
        customerId: string;
        policyNumber: string;
    }) {
        const policyNumber = this.page.locator(
            '#policyDataGatherForm\\:policyNumber'
        );
        const customerNumber = this.page.locator(
            '#policyDataGatherForm\\:customerNumberSelection'
        );
        const broadLineOfBusiness = this.page.locator(
            '#policyDataGatherForm\\:broadLineOfBusinessCd'
        );
        const policyLineOfBusiness = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_lineOfBusinessCd'
        );
        const policyProduct = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_claim_policyProductCd'
        );
        const claimType = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_claim_claimDefinitionCd'
        );

        await this.reportingMethodDropdown.selectOption('WALK_IN');
        await expect(this.reportingMethodDropdown).toHaveValue('WALK_IN');
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await expect(policyNumber).toHaveText(options.policyNumber);
        await expect(customerNumber).toHaveText(options.customerId);
        await expect(broadLineOfBusiness).toHaveText('Personal Lines');
        await expect(policyLineOfBusiness).toHaveValue('HOME');
        await expect(policyLineOfBusiness.locator('option:checked'))
            .toHaveText('Homeowners');
        await expect(policyProduct).toHaveValue('PREC-HO');
        await expect(policyProduct.locator('option:checked'))
            .toHaveText('Home (Preconfigured)');
        await expect(claimType).toHaveValue('CLAIM_HO');
        await expect(claimType.locator('option:checked'))
            .toHaveText('Home Claim');

        await expect(this.page.getByLabel('Type of Loss', { exact: true }))
            .toHaveValue('');

        await this.lossContextSequenceDropdown.selectOption('0');
    }

    async verifyCreatedClaimAndOpen(): Promise<string> {
        const claimLink = this.page.locator(
            '#policyDataGatherForm\\:claimsCreationResultsTable_' +
            'ClaimsCreationResults\\:0\\:claimNumber_ClaimsCreationResults'
        );

        await expect(claimLink).toBeVisible({ timeout: 60_000 });
        const claimNumber = (await claimLink.innerText()).trim();
        await claimLink.click();
        await waitForBarbadosLoadingSpinner(this);
        return claimNumber;
    }

    async startNewClaimFromLossContext(
        claimProcess: 'privateMotor' | 'other' = 'other'
    ) {

        await this.lossContextSequenceDropdown.selectOption('0');
        await waitForBarbadosLoadingSpinner(this);

        if (claimProcess === 'privateMotor') {
            // await this.startClaimsButton.click();
        } else {
            await this.nextFooterButton.click();
        }

        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyCommercialAutoLossContext(options: {
        customerId: string;
        policyNumber: string;
        startClaim?: boolean;
    }) {
        await this.page.waitForTimeout(2550)
        const customerNumber = this.page.locator(
            '#policyDataGatherForm\\:customerNumberSelection'
        );
        const policyNumber = this.page.locator(
            '#policyDataGatherForm\\:policyNumber'
        );
        const policyStatus = this.page.locator(
            '#policyDataGatherForm\\:policyStatus'
        );
        const broadLineOfBusiness = this.page.locator(
            '#policyDataGatherForm\\:broadLineOfBusinessCd'
        );
        const policyLineOfBusiness = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_lineOfBusinessCd'
        );
        const policyProduct = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_claim_policyProductCd'
        );
        const claimType = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsLossContext_claim_claimDefinitionCd'
        );

        await expect(customerNumber).toHaveText(options.customerId);
        await expect(policyNumber).toHaveText(options.policyNumber);
        await expect(policyStatus).toHaveText('Active');
        await expect(broadLineOfBusiness).toHaveText('Commercial Lines');
        await expect(policyLineOfBusiness).toHaveValue('CPKGE');
        await expect(policyLineOfBusiness.locator('option:checked'))
            .toHaveText('Commercial Package');

        await expect(policyProduct).toHaveValue('CL');
        await expect(policyProduct.locator('option:checked'))
            .toHaveText('Commercial (Preconfigured)');
        await expect(claimType).toHaveValue('CL_CLAIM');
        await expect(claimType.locator('option:checked'))
            .toHaveText('Commercial Claim');
        await this.lossContextSequenceDropdown.selectOption('0');
        await waitForBarbadosLoadingSpinner(this);
        // await expect(this.lossContextSequenceDropdown).toHaveValue('0');

        if (options.startClaim) {
            await expect(this.startClaimsButton)
                .toBeVisible({ timeout: 60_000 });
            await expect(this.startClaimsButton).toBeEnabled();
            await this.startClaimsButton.click();
            await waitForBarbadosLoadingSpinner(this);
            await expect(this.reportingPartyDropdown)
                .toBeVisible({ timeout: 60_000 });
        }
    }

    async fillFnolReportingParty(customerName: string) {

        await this.selectReportingPartyCustomer(`${customerName} - Customer`);
        await this.relationshipToInsuredDropdown.selectOption('EMPLOYEE');
        await waitForBarbadosLoadingSpinner(this);
        await this.contactPreferenceDropdown.selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillCommercialAutoReportingParty(customerName: string) {
        await this.page.waitForTimeout(25000)
        await this.selectReportingPartyCustomer(
            `${customerName} - Customer`
        );
        // await expect(
        //     this.reportingPartyDropdown.locator('option:checked')
        // ).toHaveText(`${customerName} - Customer`);

        await this.contactPreferenceDropdown.selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        // await expect(this.contactPreferenceDropdown).toHaveValue('EMAIL');
        // await expect(
        //     this.contactPreferenceDropdown.locator('option:checked')
        // ).toHaveText('Email');

        await this.relationshipToInsuredDropdown.selectOption('EMPLOYEE');
        await waitForBarbadosLoadingSpinner(this);
        // await expect(this.relationshipToInsuredDropdown)
        //     .toHaveValue('EMPLOYEE');
        // await expect(
        //     this.relationshipToInsuredDropdown.locator('option:checked')
        // ).toHaveText('Employee');

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillCommercialAutoLossEvent(
        lossDescription: string,
        region: 'Barbados' | 'Jamaica' = 'Barbados'
    ): Promise<{ value: string; label: string }> {
        const riskLocationOption = this.lossLocationDropdown.locator(
            'option[value]:not([value=""]):not([value="Other"])'
        ).first();
        await riskLocationOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const riskLocationValue = await riskLocationOption.getAttribute(
            'value'
        );
        if (!riskLocationValue) {
            throw new Error(
                'No Commercial Auto claim risk location is available.'
            );
        }

        await this.lossLocationDropdown.selectOption(riskLocationValue);
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.lossLocationDropdown)
            .toHaveValue(riskLocationValue);
        // await expect(
        //     this.lossLocationDropdown.locator('option:checked')
        // ).toContainText(region);

        const causeOfLossOptions = await this.causeOfLossDropdown
            .locator('option')
            .evaluateAll((options) => options
                .map((candidate) => {
                    const option = candidate as HTMLOptionElement;

                    return {
                        value: option.value,
                        label: (option.textContent || '').trim()
                    };
                })
                .filter((option) => Boolean(option.value)));
        if (!causeOfLossOptions.length) {
            throw new Error(
                'No Commercial Auto Cause of Loss option is available.'
            );
        }

        const causeOfLoss = causeOfLossOptions[
            Math.floor(Math.random() * causeOfLossOptions.length)
        ];
        await this.causeOfLossDropdown.selectOption(causeOfLoss.value);
        await waitForBarbadosLoadingSpinner(this);
        await this.page.locator(
            '//i[starts-with(@data-tab,"Loss Event_")]/parent::span'
        ).click();
        await expect(this.causeOfLossDropdown)
            .toHaveValue(causeOfLoss.value);
        await expect(
            this.causeOfLossDropdown.locator('option:checked')
        ).toHaveText(causeOfLoss.label);

        await this.fnolLossDescriptionField.fill(lossDescription);
        await expect(this.fnolLossDescriptionField)
            .toHaveValue(lossDescription);

        if (causeOfLoss.value === 'THEFT') {
            await this.fillCommercialAutoTheftDetails();
        }

        return causeOfLoss;
    }

    private async fillCommercialAutoTheftDetails() {
        const theftTab = this.page.locator(
            'div.rf-trn[title="Theft"]'
        );
        const addTheftDetailsButton = this.page.locator(
            '#policyDataGatherForm\\:addVehicleTheftDetails'
        );
        const lastSeenDateField = this.page.locator(
            '#policyDataGatherForm\\:sedit_VehicleTheftDetails_lastSeenDtInputDate'
        );
        const missingDateField = this.page.locator(
            '#policyDataGatherForm\\:sedit_VehicleTheftDetails_missDtInputDate'
        );
        const recoveredDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_VehicleTheftDetails_recoveredCd'
        );
        const otherInsurerDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_VehicleTheftDetails_otherInsurerExistsCd'
        );
        const currentDate = new Date().toLocaleDateString('en-GB');
        const currentDatePattern = new RegExp(`^${currentDate}`);

        await expect(theftTab).toBeVisible({ timeout: 60_000 });
        await theftTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await expect(addTheftDetailsButton).toBeVisible();
        await addTheftDetailsButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await lastSeenDateField.fill(currentDate);
        await lastSeenDateField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(lastSeenDateField).toHaveValue(currentDatePattern);

        await missingDateField.fill(currentDate);
        await missingDateField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(missingDateField).toHaveValue(currentDatePattern);

        await recoveredDropdown.selectOption('NO');
        await waitForBarbadosLoadingSpinner(this);
        await expect(recoveredDropdown).toHaveValue('NO');
        await expect(recoveredDropdown.locator('option:checked'))
            .toHaveText('No');
        await expect(otherInsurerDropdown).toBeHidden();
    }

    async fillCommercialAutoVehicleDamage(options: {
        modelYear: string;
        make: string;
        model: string;
        vinNumber: string;
    }) {
        const damageTab = this.page.locator('span.rf-trn-lbl')
            .filter({ hasText: /^Damage$/ });
        const damagedPropertyDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_lossInfo_riskItemOid'
        );
        const partyTypeDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_partyType'
        );
        const damageDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_damageDesc'
        );
        const insuredClaimingDamageNoRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_insuredClaimingVehicleDamage\\:1'
        );
        const vehicleTypeDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_vehicleType'
        );
        const yearDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_otherVehInfo_year'
        );
        const makeDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_otherVehInfo_make'
        );
        const modelDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_otherVehInfo_model'
        );
        const vinField = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLoss_vehicleLossInfo_otherVehInfo_VIN'
        );
        const damageDescription =
            `Commercial auto vehicle damage ${Date.now()}`;

        await expect(damageTab).toBeVisible({ timeout: 60_000 });
        await damageTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.damageTypeDropdown.selectOption('PrecCLVehicleLoss');
        await expect(this.damageTypeDropdown)
            .toHaveValue('PrecCLVehicleLoss');
        await expect(this.damageTypeDropdown.locator('option:checked'))
            .toHaveText('Auto');

        await this.addDamageButton.click();
        await waitForBarbadosLoadingSpinner(this);

        const insuredVehicleOption = damagedPropertyDropdown.locator(
            'option[value]:not([value=""]):not([value="OTHER"])'
        ).first();
        await insuredVehicleOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const insuredVehicleValue = await insuredVehicleOption.getAttribute(
            'value'
        );
        if (!insuredVehicleValue) {
            throw new Error(
                'No insured Commercial Auto vehicle is available.'
            );
        }

        await damagedPropertyDropdown.selectOption(insuredVehicleValue);
        await waitForBarbadosLoadingSpinner(this);
        await expect(damagedPropertyDropdown)
            .toHaveValue(insuredVehicleValue);
        await expect(damagedPropertyDropdown.locator('option:checked'))
            .toHaveText(
                `${options.modelYear}, ${options.make}, ${options.model}`
            );

        await partyTypeDropdown.selectOption('FIRST');
        await waitForBarbadosLoadingSpinner(this);
        await expect(partyTypeDropdown).toHaveValue('FIRST');
        await expect(partyTypeDropdown.locator('option:checked'))
            .toHaveText('1st Party');

        await damageDescriptionField.fill(damageDescription);
        await expect(damageDescriptionField)
            .toHaveValue(damageDescription);

        await insuredClaimingDamageNoRadio.check();
        await expect(insuredClaimingDamageNoRadio).toBeChecked();
        await expect(vehicleTypeDropdown).toHaveValue('TTT');
        await expect(vehicleTypeDropdown.locator('option:checked'))
            .toHaveText('Trucks, Tractors & Trailers');
        // await expect(yearDropdown).toHaveValue(options.modelYear);
        await expect(makeDropdown).toHaveValue(options.make);
        await expect(modelDropdown).toHaveValue(options.model);
        await expect(vinField).toHaveValue(options.vinNumber);

        return damageDescription;
    }

    async fillCommercialAutoOwnerDetails(customerName: string) {
        const addOwnerButton = this.page.locator(
            '#policyDataGatherForm\\:addPrecCLVehicleLossParty'
        );
        const partyDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLossParty_backedBean_partyOid'
        );
        const changedPartyButton = this.page.locator(
            '#policyDataGatherForm\\:changedPartyButton_PrecCLVehicleLossParty'
        );
        const contactPreferenceDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLossParty_party_contactPreferenceCd'
        );
        const licenceTypeDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLossParty_licenseType'
        );
        const addressLine1Field = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLVehicleLossPartyAddressContact_addressContact_address_addressLine1'
        );
        const ownerAddress = `Commercial Auto Owner Address ${Date.now()}`;

        await expect(addOwnerButton).toBeVisible({ timeout: 60_000 });
        await addOwnerButton.click();
        await waitForBarbadosLoadingSpinner(this);

        const selectedParty = await partyDropdown.locator('option')
            .evaluateAll((options, expectedCustomerName) => {
                const normalizedCustomerName =
                    (expectedCustomerName as string).trim().toLowerCase();
                const party = options
                    .map((candidate) => candidate as HTMLOptionElement)
                    .find((option) => {
                        const label = (option.textContent || '')
                            .trim()
                            .toLowerCase();

                        return Boolean(option.value) &&
                            label.includes(normalizedCustomerName) &&
                            label.includes('customer');
                    });

                return {
                    value: party?.value || '',
                    label: party?.textContent?.trim() || ''
                };
            }, customerName);
        if (!selectedParty.value) {
            throw new Error(
                `No Auto Owner customer option found for "${customerName}".`
            );
        }

        await partyDropdown.selectOption(selectedParty.value);
        await partyDropdown.evaluate((element) => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
        if (await changedPartyButton.count()) {
            await changedPartyButton.evaluate((element) => {
                (element as HTMLElement).click();
            });
        }
        await waitForBarbadosLoadingSpinner(this);
        await expect(partyDropdown).toHaveValue(selectedParty.value);
        await expect(partyDropdown.locator('option:checked'))
            .toContainText(customerName);

        await contactPreferenceDropdown.selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        await expect(contactPreferenceDropdown).toHaveValue('EMAIL');
        await expect(contactPreferenceDropdown.locator('option:checked'))
            .toHaveText('Email');

        const licenceTypes = await licenceTypeDropdown.locator('option')
            .evaluateAll((options) => options
                .map((candidate) => {
                    const option = candidate as HTMLOptionElement;

                    return {
                        value: option.value,
                        label: (option.textContent || '').trim()
                    };
                })
                .filter((option) => Boolean(option.value)));
        if (!licenceTypes.length) {
            throw new Error('No Auto Owner licence type is available.');
        }
        const licenceType = licenceTypes[
            Math.floor(Math.random() * licenceTypes.length)
        ];
        await licenceTypeDropdown.selectOption(licenceType.value);
        await waitForBarbadosLoadingSpinner(this);
        await expect(licenceTypeDropdown).toHaveValue(licenceType.value);
        await expect(licenceTypeDropdown.locator('option:checked'))
            .toHaveText(licenceType.label);

        await addressLine1Field.fill(ownerAddress);
        await addressLine1Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(addressLine1Field).toHaveValue(ownerAddress);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillHomeFnolReportingParty(
        customerName: string,
        region: 'Barbados' | 'Jamaica' = 'Barbados'
    ) {
        const suffix = Date.now().toString();
        const identificationNumber = `ID${suffix.slice(-12)}`;
        const email = `home.claim.${suffix}@example.com`;
        const addressLine1 = `${suffix.slice(-6)} Hope Road`;
        const fnolTab = this.page.locator('a.fnol').filter({
            hasText: 'FNOL'
        });

        await expect(fnolTab).toBeVisible({ timeout: 60_000 });
        await fnolTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectReportingPartyCustomer(customerName);
        await expect(
            this.reportingPartyDropdown.locator('option:checked')
        ).toContainText(customerName);

        await this.reportingPartyIdentificationNumberField.fill(
            identificationNumber
        );
        await expect(this.reportingPartyIdentificationNumberField)
            .toHaveValue(identificationNumber);

        await this.contactPreferenceDropdown.selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.contactPreferenceDropdown).toHaveValue('EMAIL');

        await this.reportingPartyEmailField.fill(email);
        await expect(this.reportingPartyEmailField).toHaveValue(email);

        await this.reportingPartyAddressLine1Field.fill(addressLine1);
        await this.reportingPartyAddressLine1Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.reportingPartyAddressLine1Field)
            .toHaveValue(addressLine1);

        const parishCode = region === 'Jamaica' ? 'JM-01' : 'BB-08';
        await this.reportingPartyAddressParishDropdown.selectOption(parishCode);
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.reportingPartyAddressParishDropdown)
            .toHaveValue(parishCode);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillHomeLossEventDetails(options: {
        causeOfLoss: string;
        lossDescription: string;
    }) {
        const lossLocationDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_lossLocation'
        );
        const causeOfLossDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_causeOfLossCd'
        );
        const resultingDamageDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_resultingDamageCd'
        );
        const lossDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_lossDesc'
        );
        const otherResultingDamageField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossEvent_otherResultingDamage'
        );
        const otherResultingDamage =
            `Other resulting damage ${Date.now()}`;
        const riskLocationOption = lossLocationDropdown.locator(
            'option[value]:not([value=""]):not([value="Other"])'
        ).first();

        await riskLocationOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const riskLocationValue = await riskLocationOption.getAttribute(
            'value'
        );
        if (!riskLocationValue) {
            throw new Error('No Home claim risk location is available.');
        }
        await lossLocationDropdown.selectOption(riskLocationValue);
        await waitForBarbadosLoadingSpinner(this);
        await expect(lossLocationDropdown).toHaveValue(riskLocationValue);

        const causeOfLossOption = causeOfLossDropdown.locator(
            `option[value="${options.causeOfLoss}"]`
        );
        await expect(causeOfLossOption)
            .toBeAttached({ timeout: 60_000 });
        await causeOfLossDropdown.selectOption({
            value: options.causeOfLoss
        });
        await waitForBarbadosLoadingSpinner(this);
        await expect(causeOfLossDropdown).toHaveValue(options.causeOfLoss);

        await expect(
            resultingDamageDropdown.locator('option[value="OTHER"]')
        ).toBeAttached({ timeout: 60_000 });
        await resultingDamageDropdown.selectOption('OTHER');
        await waitForBarbadosLoadingSpinner(this);
        await expect(resultingDamageDropdown)
            .toHaveValue('OTHER');

        await expect(otherResultingDamageField)
            .toBeVisible({ timeout: 60_000 });
        await otherResultingDamageField.fill(otherResultingDamage);
        await otherResultingDamageField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(otherResultingDamageField)
            .toHaveValue(otherResultingDamage);

        await lossDescriptionField.fill(options.lossDescription);
        await expect(lossDescriptionField)
            .toHaveValue(options.lossDescription);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async addHomeAndContentsDamage(damageDescription: string) {
        const damageSidebarTab = this.page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Damage_"])'
        );
        const riskItemDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PropertyLoss_lossInfo_riskItemOid'
        );
        const damageDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:sedit_PropertyLoss_lossInfo_damageDesc'
        );
        const partyTypeDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_PropertyLoss_lossInfo_partyType'
        );

        await expect(damageSidebarTab).toBeVisible({ timeout: 60_000 });
        await damageSidebarTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.damageTypeDropdown.selectOption('PropertyLoss');
        await expect(this.damageTypeDropdown).toHaveValue('PropertyLoss');
        await expect(this.addDamageButton).toBeVisible({ timeout: 60_000 });
        await this.addDamageButton.click();
        await waitForBarbadosLoadingSpinner(this);

        const riskItemOption = riskItemDropdown.locator(
            'option[value]:not([value=""]):not([value="OTHER"])'
        ).first();
        await riskItemOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const riskItemValue = await riskItemOption.getAttribute('value');
        if (!riskItemValue) {
            throw new Error('No Home and Contents risk item is available.');
        }

        await riskItemDropdown.selectOption(riskItemValue);
        await waitForBarbadosLoadingSpinner(this);
        await expect(riskItemDropdown).toHaveValue(riskItemValue);

        await damageDescriptionField.fill(damageDescription);
        await expect(damageDescriptionField)
            .toHaveValue(damageDescription);

        await partyTypeDropdown.selectOption('FIRST');
        await waitForBarbadosLoadingSpinner(this);
        await expect(partyTypeDropdown).toHaveValue('FIRST');
    }

    async addHomePropertyOwnerDetails(options: {
        customerName: string;
        bankCode: string;
    }) {
        const suffix = Date.now().toString();
        const accountNumber = suffix.slice(-12).padStart(12, '0');
        const routingNumber = suffix.slice(-8).padStart(8, '0');
        const city = `City${suffix.slice(-6)}`;
        const addLossPartyButton = this.page.locator(
            '#policyDataGatherForm\\:addLossParty'
        );
        const partyDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_backedBean_partyOid'
        );
        const paymentMethodDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_preferredPaymentMethod'
        );
        const accountInformationDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_bankAccountInfo'
        );
        const bankNameDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_bankName'
        );
        // const bankNameDropdown = this.page.locator(
        //     '#policyDataGatherForm\\:bankName_LossParty'
        // );
        const accountNumberField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_bankAccountNumber'
        );
        const routingNumberField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_bankTransitNumber'
        );
        const accountHolderNameField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossParty_party_' +
            'partyEFTDetails_accountHolderName'
        );
        const cityField = this.page.locator(
            '#policyDataGatherForm\\:sedit_LossPartyAddressContact_' +
            'addressContact_address_city'
        );

        await expect(addLossPartyButton).toBeVisible({ timeout: 60_000 });
        await addLossPartyButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectOptionContainingText(
            partyDropdown,
            options.customerName
        );
        await expect(partyDropdown.locator('option:checked'))
            .toContainText(options.customerName);
        await paymentMethodDropdown.selectOption('eft');
        await waitForBarbadosLoadingSpinner(this);
        await expect(paymentMethodDropdown).toHaveValue('eft');
        await accountInformationDropdown.selectOption('OTHER');
        await waitForBarbadosLoadingSpinner(this);
        await expect(accountInformationDropdown).toHaveValue('OTHER');
        await this.page.waitForTimeout(2500)
        // await bankNameDropdown.selectOption(options.bankCode);
        await waitForBarbadosLoadingSpinner(this);
        // await expect(bankNameDropdown).toHaveValue(options.bankCode);

        await accountNumberField.fill(accountNumber);
        // await routingNumberField.fill(routingNumber);
        await accountHolderNameField.fill(options.customerName);
        await cityField.fill(city);
        await cityField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        // await expect(accountNumberField).toHaveValue(accountNumber);
        // await expect(routingNumberField).toHaveValue(routingNumber);
        await expect(accountHolderNameField)
            .toHaveValue(options.customerName);
        await expect(cityField).toHaveValue(city);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorReportingParty(customerName: string) {
        const uniqueContactSuffix = Date.now().toString();
        const phoneNumber = `246${uniqueContactSuffix.slice(-7)}`;
        const email = `claim.${uniqueContactSuffix}@example.com`;

        await expect(this.reportingPartyReportedDateField)
            .not.toHaveValue('', { timeout: 60_000 });
        await this.reportingPartyReportingMethodDropdown.selectOption(
            'WALK_IN'
        );
        await this.reportingPartyPreviouslyReportedNoRadio.check();

        await this.selectReportingPartyCustomer(customerName);
        await this.relationshipToInsuredDropdown.selectOption('SELF');
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.reportingPartyFirstNameField)
            .not.toHaveValue('', { timeout: 60_000 });
        await expect(this.reportingPartyLastNameField)
            .not.toHaveValue('', { timeout: 60_000 });
        await expect(this.reportingPartyIdentificationTypeDropdown)
            .not.toHaveValue('', { timeout: 60_000 });
        await expect(this.reportingPartyIdentificationNumberField)
            .not.toHaveValue('', { timeout: 60_000 });
        await expect(this.reportingPartyDateOfBirthField)
            .not.toHaveValue('', { timeout: 60_000 });

        await this.reportingPartyGenderDropdown.selectOption('male');
        await this.reportingPartyMaritalStatusDropdown.selectOption('S');
        await this.reportingPartyEmploymentStatusDropdown.selectOption(
            'EMP_FT'
        );
        await this.reportingPartyOccupationDropdown.selectOption(
            'ITSpecTech'
        );
        await this.reportingPartyPhoneTypeDropdown.selectOption(
            'mobilePhone'
        );
        await this.reportingPartyPhoneNumberField.fill(phoneNumber);
        await this.reportingPartyEmailField.fill(email);
        await this.contactPreferenceDropdown.selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        await this.reportingPartyMainContactYesRadio.check();
        await waitForBarbadosLoadingSpinner(this);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorReportingPartyAddress(
        region: 'Barbados' | 'Jamaica' = 'Barbados'
    ) {
        const addressSuffix = Date.now().toString().slice(-6);
        const isJamaica = region === 'Jamaica';

        await this.reportingPartyAddressTypeDropdown.selectOption('contact');
        await this.reportingPartyAddressCountryDropdown.selectOption(
            isJamaica ? 'JM' : 'BB'
        );
        await waitForBarbadosLoadingSpinner(this);

        if (await this.reportingPartyAddressPostalCodeField.isVisible()) {
            await this.reportingPartyAddressPostalCodeField.fill(
                isJamaica ? '00000' : 'BB11000'
            );
            await this.reportingPartyAddressPostalCodeField.press('Tab');
            await waitForBarbadosLoadingSpinner(this);
        }
        await this.reportingPartyAddressLine1Field.fill(
            `${addressSuffix} Hope Road`
        );
        await this.reportingPartyAddressLine1Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.reportingPartyAddressLine2Field.fill(
            isJamaica ? 'Kingston' : 'Bridgetown'
        );
        await this.reportingPartyAddressLine2Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.reportingPartyAddressLine3Field.fill(region);
        await this.reportingPartyAddressLine3Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.reportingPartyAddressCityField.fill(
            isJamaica ? 'Kingston' : 'Bridgetown'
        );
        await this.reportingPartyAddressCityField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.selectOptionContainingText(
            this.reportingPartyAddressParishDropdown,
            isJamaica ? 'Kingston' : 'St. Michael'
        );
        if (await this.reportingPartyAddressDistrictDropdown.isVisible()) {
            await this.selectOptionContainingText(
                this.reportingPartyAddressDistrictDropdown,
                isJamaica ? 'Kingston' : 'Bridgetown'
            );
        }
        if (await this.reportingPartyAddressStateDropdown.isVisible()) {
            await this.reportingPartyAddressStateDropdown.selectOption(
                isJamaica ? 'JM-01' : 'BB-08'
            );
        }

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorLossEvent(lossDescription: string) {
        const currentDate = new Date().toLocaleDateString('en-GB');
        const uniqueSuffix = Date.now();

        await this.selectPreferredOrFirstOption(
            this.privateMotorLossLocationDropdown,
            '__first_available_location__'
        );
        await this.privateMotorCauseOfLossDropdown.selectOption('COLLISION');
        await expect(this.privateMotorLossDescriptionField)
            .toHaveValue(lossDescription);

        await this.privateMotorRoadConditionField.fill(
            `Dry road ${uniqueSuffix}`
        );
        await this.privateMotorWeatherConditionField.fill(
            `Clear weather ${uniqueSuffix}`
        );
        await this.privateMotorGeneralCommentsField.fill(
            `Private motor loss event comments ${uniqueSuffix}`
        );
        await this.privateMotorClaimTypeDropdown.selectOption(
            'FIRST_PARTY_PROPERTY'
        );
        await this.privateMotorContributingFactorDropdown.selectOption('A9');

        await expect(this.privateMotorLossDateField)
            .toBeDisabled();
        await expect(this.privateMotorLossDateField)
            .toHaveValue(currentDate);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async navigateToPrivateMotorDamageSection() {
        // await expect(this.privateMotorDamageSidebarTab)
        //     .toBeVisible({ timeout: 60_000 });
        await this.privateMotorDamageSidebarTab.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async addPrivateMotorVehicleDamage() {
        await this.damageTypeDropdown.selectOption('AutoLoss');
        await expect(this.damageTypeDropdown).toHaveValue('AutoLoss');
        await expect(this.addDamageButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addDamageButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorVehicleDamageDetails(
        region: 'Barbados' | 'Jamaica' = 'Barbados'
    ) {
        const suffix = Date.now().toString();
        await this.page.waitForTimeout(10000)
        await this.selectOptionContainingText(
            this.vehicleDamageRiskItemDropdown,
            '2024, Audi, A4'
        );
        await expect(this.vehicleDamageAssociatedRiskItemDropdown)
            .toHaveValue(/.+/, { timeout: 60_000 });
        await expect(this.vehicleDamageAssociatedRiskItemDropdown)
            .toContainText('2024, Audi, A4');

        await expect(this.vehicleDamageYearDropdown).toBeDisabled();
        await expect(this.vehicleDamageYearDropdown).toHaveValue('2024');
        await expect(this.vehicleDamageMakeDropdown).toBeDisabled();
        await expect(this.vehicleDamageMakeDropdown).toHaveValue('Audi');
        await expect(this.vehicleDamageModelDropdown).toBeDisabled();
        await expect(this.vehicleDamageModelDropdown).toHaveValue('A4');
        await expect(this.vehicleDamageVinField).toBeDisabled();
        await expect(this.vehicleDamageVinField)
            .not.toHaveValue('', { timeout: 60_000 });

        await this.vehicleDamageColorField.fill('Black');
        await this.vehicleDamagePlateField.fill(
            `${region === 'Jamaica' ? 'JM' : 'BB'}${suffix.slice(-6)}`
        );
        await expect(this.vehicleDamagePlateStateDropdown).toBeDisabled();
        await this.vehicleDamageUsedWithPermissionYesRadio.check();
        await this.vehicleDamageDescriptionField.fill(
            `Front vehicle damage ${suffix}`
        );
        await this.vehicleDamageNotRoadworthyNoRadio.check();
        await this.vehicleDamageImpactDropdown.selectOption('FRONT');
        await waitForBarbadosLoadingSpinner(this);
        await this.vehicleDamageAirbagsNoRadio.check();
        await this.vehicleDamageCommercialUseNoRadio.check();
        await this.vehicleDamageSpeedField.fill('35');
        await this.vehicleDamageTravelDirectionField.fill('North');
        await this.vehicleDamageTotalLossNoRadio.check();
        await waitForBarbadosLoadingSpinner(this);
        await this.vehicleDamageLeakingFluidsNoRadio.check();
        await this.vehicleDamagePartyTypeDropdown.selectOption('FIRST');
        await waitForBarbadosLoadingSpinner(this);
        await this.vehicleDamageInsuredClaimingYesRadio.check();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorVehiclePartyDetails(customerName: string) {
        const partyDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_backedBean_partyOid'
        );
        const autoPopulatedFields = [
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_partyName_firstName',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_partyName_lastName',
            '#policyDataGatherForm\\:sedit_AutoOccupant_dateFirstLicensedInputDate',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_birthDtInputDate',
            '#policyDataGatherForm\\:sedit_AutoOccupant_currentLicenseIssueDateInputDate',
            '#policyDataGatherForm\\:sedit_AutoOccupant_extension_identificationTypeCd',
            '#policyDataGatherForm\\:sedit_AutoOccupant_extension_identificationNumber',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_genderCd',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_partyPhoneTypeCd',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_partyPhoneNumber',
            '#policyDataGatherForm\\:sedit_AutoOccupant_extension_employmentStatusCd',
            '#policyDataGatherForm\\:sedit_AutoOccupant_extension_occupationCd',
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_partyEmail'
        ];
        await this.page.waitForTimeout(10000);
        await this.selectOptionContainingText(partyDropdown, customerName);
        await expect(
            partyDropdown.locator('option:checked')
        ).toContainText(customerName);
        await expect(this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_relationShipToInsuredCd'
        )).toHaveValue('SELF');

        for (const selector of autoPopulatedFields) {
            await expect(this.page.locator(selector))
                .not.toHaveValue('', { timeout: 60_000 });
        }

        await this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_contactPreferenceCd'
        ).selectOption('EMAIL');
        await waitForBarbadosLoadingSpinner(this);
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_reportedDriverTypeCd'
        ).selectOption('M');
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_party_contactPreferenceCd'
        )).toHaveValue('EMAIL');
        await expect(this.page.locator(
            '#policyDataGatherForm\\:sedit_AutoOccupant_reportedDriverTypeCd'
        )).toHaveValue('M');

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyPrivateMotorClaimNotification(
        customerName: string,
        lossDescription: string,
        region: 'Barbados' | 'Jamaica' = 'Barbados'
    ) {
        const customerRow = this.claimPartiesTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: customerName })
            .first();

        await expect(this.claimPartiesTable)
            .toBeVisible({ timeout: 60_000 });
        await expect(customerRow).toBeVisible({ timeout: 60_000 });
        await expect(customerRow).toContainText(customerName);
        await expect(customerRow).toContainText('Reporting Party');
        await expect(customerRow).toContainText('Vehicle Party');
        await expect(customerRow).toContainText('Driver');
        await expect(customerRow.locator('td').nth(2))
            .not.toHaveText('');
        await expect(customerRow.locator('td').nth(3))
            .not.toHaveText('');
        await expect(customerRow.locator('td').nth(4))
            .not.toHaveText('');

        const lossEventTable = this.page.locator(
            '#productConsolidatedViewForm\\:scolumn_LossEvent'
        );
        const lossEventRow = lossEventTable.locator('tbody tr').first();
        const currentDate = new Date().toLocaleDateString('en-GB');

        await expect(lossEventTable).toBeVisible({ timeout: 60_000 });
        await expect(lossEventRow).toContainText(currentDate);
        await expect(lossEventRow).toContainText(region);
        await expect(lossEventRow).toContainText('Collision');
        await expect(lossEventRow).toContainText(lossDescription);
        await expect(lossEventRow).toContainText('1st Party Property');
        await expect(lossEventRow).toContainText('Unknown or Unclassified');
        await expect(lossEventRow.locator('td').nth(6))
            .not.toHaveText('');
    }

    async verifyHomeClaimNotification(options: {
        customerName: string;
        causeOfLoss: string;
        lossDescription: string;
        region?: 'Barbados' | 'Jamaica';
    }) {
        const region = options.region ?? 'Barbados';
        const lossEventTable = this.page.locator(
            '#productConsolidatedViewForm\\:scolumn_LossEvent'
        );
        const lossEventRow = lossEventTable.locator('tbody tr').first();
        const lossCells = lossEventRow.locator('td');
        const currentDate = new Date().toLocaleDateString('en-GB');

        await expect(lossEventTable).toBeVisible({ timeout: 60_000 });
        await expect(lossCells.nth(0)).toContainText(currentDate);
        await expect(lossCells.nth(1)).toContainText(region);
        await expect(lossCells.nth(2)).toHaveText(options.causeOfLoss);
        await expect(lossCells.nth(3)).toHaveText('Claim Management');
        await expect(lossCells.nth(4)).not.toHaveText('');
        await expect(lossCells.nth(5))
            .toContainText(options.lossDescription);

        const claimPartyRow = this.claimPartiesTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: options.customerName })
            .first();
        const partyCells = claimPartyRow.locator('td');

        await expect(this.claimPartiesTable)
            .toBeVisible({ timeout: 60_000 });
        await expect(claimPartyRow).toBeVisible({ timeout: 60_000 });
        await expect(partyCells.nth(0)).toContainText(options.customerName);
        await expect(partyCells.nth(1)).toContainText('Customer');
        await expect(partyCells.nth(1)).toContainText('Insured');
        await expect(partyCells.nth(1)).toContainText(
            'Property Owner Party'
        );
        await expect(partyCells.nth(1)).toContainText('Reporting Party');
        await expect(partyCells.nth(2)).toContainText('Hope Road');
        await expect(partyCells.nth(2)).toContainText(region);
        await expect(partyCells.nth(3)).not.toHaveText('');
        // await expect(partyCells.nth(4)).toContainText(
        //     /home\.claim\.\d+@example\.com/
        // );
    }

    async addHomeAdjudicationFeature(options: {
        damageDescription: string;
        coverage: string;
        indemnityReserve: string;
        expenseReserve: string;
        recoveryReserve: string;
        region?: 'Barbados' | 'Jamaica';
    }) {
        const region = options.region ?? 'Barbados';
        const associatedRiskDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_' +
            'feature_associatedInsurableRiskOid'
        );
        const coverageDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_' +
            'feature_coverageOid'
        );
        const coverageDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_' +
            'feature_coverageDesc'
        );

        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);

        const damageRow = this.claimDamageDetailsTable
            .locator('tbody tr')
            .filter({ hasText: options.damageDescription })
            .first();
        const damageCells = damageRow.locator('td');
        await expect(this.claimDamageDetailsTable)
            .toBeVisible({ timeout: 60_000 });
        await expect(damageRow).toBeVisible({ timeout: 60_000 });
        await expect(damageCells.nth(0)).toHaveText(/^\d+$/);
        await expect(damageCells.nth(1)).toHaveText('Home and Contents');
        await expect(
            damageRow.locator('span[id$=":partyType"]')
        ).toHaveText('1st Party');
        await expect(damageCells.nth(3)).toContainText(region);
        await expect(damageCells.nth(4))
            .toContainText(options.damageDescription);

        await expect(this.addNewFeatureButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addNewFeatureButton.click();
        await waitForBarbadosLoadingSpinner(this);

        const associatedRiskOption = associatedRiskDropdown.locator(
            'option[value]:not([value=""])'
        ).first();
        await associatedRiskOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const associatedRiskValue = await associatedRiskOption.getAttribute(
            'value'
        );
        if (!associatedRiskValue) {
            throw new Error('No Home adjudication risk is available.');
        }

        await associatedRiskDropdown.selectOption(associatedRiskValue);
        await waitForBarbadosLoadingSpinner(this);
        await expect(associatedRiskDropdown)
            .toHaveValue(associatedRiskValue);

        await this.selectOptionContainingText(
            coverageDropdown,
            options.coverage
        );
        await expect(coverageDropdown.locator('option:checked'))
            .toContainText(options.coverage);

        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_lossReserve'
            ),
            options.indemnityReserve
        );
        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_expenseReserve'
            ),
            options.expenseReserve
        );
        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_recoveryReserve'
            ),
            options.recoveryReserve
        );

        if (options.coverage === 'Ex Gratia') {
            const coverageNotes =
                `Ex Gratia coverage determination ${Date.now()}`;
            await coverageDescriptionField.fill(coverageNotes);
            await expect(coverageDescriptionField)
                .toHaveValue(coverageNotes);
        }

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.saveAndExitButton)
            .toBeVisible({ timeout: 60_000 });
        await this.saveAndExitButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyHomeClaimFeature(options: {
        customerName: string;
        coverage: string;
        indemnityReserve: number;
        expenseReserve: number;
        region?: 'Barbados' | 'Jamaica';
    }) {
        const region = options.region ?? 'Barbados';
        const featureTable = this.page.locator(
            '#policyDataGatherForm\\:body_featureInfoTable_' +
            'ClaimsFeatureView'
        );
        const featureTableBody = featureTable.locator(
            'tbody[id$=":tb"]'
        );
        const featureRow = featureTableBody
            .locator('tr.rf-dt-r')
            .first();

        await expect(featureTable).toBeVisible({ timeout: 60_000 });
        await expect(featureTableBody).toBeVisible({ timeout: 60_000 });
        await expect(featureRow).toBeVisible({ timeout: 60_000 });
        await expect(featureRow.locator(
            'td[id$=":column_feature_featureNumberDisplayValue"]'
        )).toHaveText(/^\d+-\d+$/);
        await expect(featureRow.locator(
            'td[id$=":column_feature_identifier"]'
        )).toHaveText(/^\d+$/);
        await expect(featureRow.locator('span[id$=":claimant"]'))
            .toHaveText(options.customerName);
        await expect(featureRow.locator(
            'span[id$=":associatedInsurableRiskDisplayValue"]'
        )).toContainText(region);
        const coverageCell = featureRow.locator(
            'td[id$=":column_coverage_displayValue"]'
        );
        const displayedCoverage = (await coverageCell.innerText()).trim();
        if (displayedCoverage) {
            await expect(coverageCell).toHaveText(options.coverage);
        }
        await expect(featureRow.locator(
            'td[id$=":column_loss_displayValue"]'
        )).toContainText(region);
        await expect(featureRow.locator(
            'td[id$=":column_feature_featureOwner_' +
            'displayValueAsClaimFileOwner"]'
        )).toHaveText('Claim Management');
        await expect(featureRow.locator(
            'td[id$=":column_feature_featureOwner_dateAssigned"]'
        )).toContainText(/\d{2}\/\d{2}\/\d{4}/);
        const totalIncurredCell = featureRow.locator(
            'td[id$=":column_totalIncurreds"]'
        );
        await expect(totalIncurredCell)
            .toHaveText(/^[A-Z]{3}[\d,]+\.\d{2}$/);
        const totalIncurred = this.parseClaimCurrency(
            await totalIncurredCell.innerText()
        );
        expect(totalIncurred).toBeCloseTo(
            options.indemnityReserve + options.expenseReserve,
            2
        );
    }

    async addPrivateMotorAdjudicationFeature(options: {
        indemnityReserve: string;
        expenseReserve: string;
        recoveryReserve: string;
        evaluationOfLiabilityDescription: string;
    }) {
        const suffix = Date.now();
        const currentDate = new Date().toLocaleDateString('en-GB');
        const associatedRiskDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_associatedInsurableRiskOid'
        );
        const coverageDropdown = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_coverageOid'
        );

        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.addNewFeatureButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addNewFeatureButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.page.waitForTimeout(5000);
        await this.selectOptionContainingText(
            associatedRiskDropdown,
            '2024, Audi, A4'
        );
        await this.page.waitForTimeout(3000);
        await expect(coverageDropdown)
            .toBeEnabled({ timeout: 60_000 });
        await this.selectOptionContainingText(
            coverageDropdown,
            'Comprehensive Coverage'
        );

        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_coverageLetterIssuedCd'
        ).selectOption('RESERV_OF_RIGHTS');
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_coverageLetterIssuedDtInputDate'
        ).fill(currentDate);
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_coverageDesc'
        ).fill(`Private motor coverage determination ${suffix}`);
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_coverageDeterminationDisputed\\:1'
        ).check();
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_estEvalOfLiabilityCd'
        ).selectOption('CLEAR');
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_estEvalOfLiabilityPercent'
        ).fill('100');
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_finalEvalOfLiabilityCd'
        ).selectOption('CLEAR');
        await waitForBarbadosLoadingSpinner(this);
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_finalEvalOfLiabilityPercent'
        ).fill('100');
        await this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_finalEvalOfLiabilityPercent'
        ).press('Tab');
        await waitForBarbadosLoadingSpinner(this);

        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_lossReserve'
            ),
            options.indemnityReserve
        );
        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_expenseReserve'
            ),
            options.expenseReserve
        );
        await this.fillAdjudicationReserve(
            this.page.locator(
                '#policyDataGatherForm\\:sedit_EvaluationFeature_recoveryReserve'
            ),
            options.recoveryReserve
        );

        const evaluationOfLiabilityDescription = this.page.locator(
            '#policyDataGatherForm\\:sedit_EvaluationFeature_feature_evaluationOfLiabilityDesc'
        );
        await evaluationOfLiabilityDescription.fill(
            options.evaluationOfLiabilityDescription
        );
        await evaluationOfLiabilityDescription.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(evaluationOfLiabilityDescription).toHaveValue(
            options.evaluationOfLiabilityDescription
        );

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.saveAndExitButton)
            .toBeVisible({ timeout: 60_000 });
        await this.saveAndExitButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyPrivateMotorAdjudicationFeature(
        customerName: string,
        indemnityReserve: number,
        expenseReserve: number
    ) {
        const featureTable = this.page.locator(
            '#policyDataGatherForm\\:body_featureInfoTable_ClaimsFeatureView'
        );
        const featureRow = featureTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: 'Comprehensive Coverage' })
            .first();

        await expect(featureTable).toBeVisible({ timeout: 60_000 });
        await expect(featureRow).toBeVisible({ timeout: 60_000 });

        const cells = featureRow.locator('td');
        await expect(cells.nth(0)).not.toHaveText('');
        await expect(cells.nth(1)).not.toHaveText('');
        await expect(cells.nth(2)).toContainText(customerName);
        await expect(cells.nth(3)).toContainText('2024, Audi, A4');
        await expect(cells.nth(4)).toContainText('Comprehensive Coverage');
        await expect(cells.nth(5)).toContainText('2024, Audi, A4');
        await expect(cells.nth(6)).not.toHaveText('');
        await expect(cells.nth(7)).not.toHaveText('');

        const totalIncurred = this.parseClaimCurrency(
            (await cells.nth(8).textContent()) || ''
        );
        expect(totalIncurred).toBeCloseTo(
            indemnityReserve + expenseReserve,
            2
        );
    }

    async fillFnolLossEvent(
        lossDescription: string,
        lossLocationText: string
    ): Promise<string> {
        await this.selectOptionContainingText(
            this.lossLocationDropdown,
            lossLocationText
        );

        const causeOfLossText = await this.selectPreferredOrFirstOption(
            this.causeOfLossDropdown,
            'WSGD'
        );

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        return causeOfLossText;
    }

    async fillPropertyDamageSummary(
        damageDescription: string,
        propertyAddress: {
            addressLine1: string;
            country?: string;
            parish?: string;
            propertyDescription?: string;
        } = {
                addressLine1: '12 Hope Road',
                country: 'BB',
                parish: 'St. Michael'
            }
    ) {
        await this.damageTypeDropdown.selectOption('PrecBuildingLoss');
        await waitForBarbadosLoadingSpinner(this);
        await this.addDamageButton.click();
        await waitForBarbadosLoadingSpinner(this);
        const damagedPropertyValue =
            await this.selectPropertyDamageRiskItem(
                this.buildingRiskItemDropdown,
                propertyAddress.propertyDescription ||
                propertyAddress.addressLine1
            );

        // await expect(this.buildingRiskItemDropdown)
        //     .toHaveValue(damagedPropertyValue, { timeout: 5_000 });
        // await this.clickHiddenButtonIfPresent(this.buildingDamageChangedButton);

        // await this.selectPropertyDamageRiskItem(
        //     this.buildingAssociatedRiskItemDropdown,
        //     propertyAddress.propertyDescription ||
        //         propertyAddress.addressLine1,
        //     damagedPropertyValue
        // );
        // await expect(this.buildingAssociatedRiskItemDropdown)
        //     .toHaveValue(damagedPropertyValue, { timeout: 5_000 });
        // await this.clickHiddenButtonIfPresent(
        //     this.buildingAssociatedRiskItemChangedButton
        // );

        // await expect(this.buildingLocationField)
        //     .not.toHaveValue('', { timeout: 10_000 });
        // await expect(this.buildingStructureField)
        //     .not.toHaveValue('', { timeout: 10_000 });

        await this.buildingDamageDescriptionField.fill(damageDescription);
        await this.buildingPropertyDescriptionField.fill(
            propertyAddress.propertyDescription ||
            `${propertyAddress.addressLine1} property damage`
        );
        await this.buildingPartyTypeDropdown.selectOption('FIRST');
        await waitForBarbadosLoadingSpinner(this);


    }

    async addCommercialPropertyOwnerDetails(customerName: string) {
        const uniqueSuffix = Date.now().toString();
        const identificationNumber =
            uniqueSuffix.slice(-11).padStart(11, '0');
        const addressLine1 =
            `Commercial Property Address ${uniqueSuffix.slice(-6)}`;
        const addPropertyOwnerButton = this.page.locator(
            '#policyDataGatherForm\\:addPrecBuildingLossParty'
        );
        const partyNameDropdown = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_backedBean_partyOid'
        );
        const firstNameField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_party_partyName_firstName'
        );
        const lastNameField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_party_partyName_lastName'
        );
        const identificationNumberField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_extension_identificationNumber'
        );
        const contactPreferenceDropdown = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_party_contactPreferenceCd'
        );
        const addressLine1Field = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossPartyAddressContact_' +
            'addressContact_address_addressLine1'
        );
        const dateOfBirthField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_party_birthDtInputDate'
        );
        const emailAddressField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecBuildingLossParty_party_partyEmail'
        );

        // await expect(addPropertyOwnerButton)
        //     .toBeVisible({ timeout: 60_000 });
        await addPropertyOwnerButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectOptionContainingText(
            partyNameDropdown,
            customerName
        );
        await waitForBarbadosLoadingSpinner(this);
        await expect(partyNameDropdown.locator('option:checked'))
            .toContainText(customerName);

        await identificationNumberField.fill(identificationNumber);
        await expect(identificationNumberField)
            .toHaveValue(identificationNumber);

        await contactPreferenceDropdown.selectOption('EMAIL');
        await expect(contactPreferenceDropdown).toHaveValue('EMAIL');

        await addressLine1Field.fill(addressLine1);
        await addressLine1Field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await expect(addressLine1Field).toHaveValue(addressLine1);

        await expect(firstNameField).not.toHaveValue('');
        await expect(lastNameField).not.toHaveValue('');
        await expect(dateOfBirthField).not.toHaveValue('');
        await expect(emailAddressField).not.toHaveValue('');

        const firstName = await firstNameField.inputValue();
        const lastName = await lastNameField.inputValue();
        expect(customerName).toContain(firstName);
        expect(customerName).toContain(lastName);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async continueWithoutDamageSummary() {
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async selectVehicleDamage() {
        await this.damageTypeDropdown.selectOption({
            value: 'AutoLoss',
            label: 'Vehicle'
        });
        await expect(this.damageTypeDropdown).toHaveValue('AutoLoss');
    }

    async addBodilyInjuryDamage() {
        await this.damageTypeDropdown.selectOption({
            value: 'PrecCLClaimsInjury',
            label: 'Bodily Injury'
        });
        await expect(this.damageTypeDropdown)
            .toHaveValue('PrecCLClaimsInjury');
        await this.addDamageButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillBodilyInjuryDetails(injuryDescription: string) {
        const riskItemOption = this.bodilyInjuryRiskItemDropdown.locator(
            'option[value]:not([value=""])'
        ).first();

        await riskItemOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });

        const riskItemValue = await riskItemOption.getAttribute('value');

        if (!riskItemValue) {
            throw new Error(
                'No Bodily Injury risk item option is available.'
            );
        }

        await this.bodilyInjuryRiskItemDropdown.selectOption(
            riskItemValue
        );
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.bodilyInjuryRiskItemDropdown)
            .toHaveValue(riskItemValue, { timeout: 60_000 });

        await this.bodilyInjuryPartyTypeDropdown.selectOption('FIRST');
        await waitForBarbadosLoadingSpinner(this);
        await this.bodilyInjuryDescriptionField.fill(injuryDescription);
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillInjuredPartyDetails(
        customerName: string,
        addressLine1: string
    ) {
        await this.page.waitForTimeout(5000);
        await this.selectOptionContainingText(
            this.injuredPartyDropdown,
            `${customerName} - Insured`
        );
        await this.injuredPartyContactPreferenceDropdown.selectOption(
            'EMAIL'
        );
        await waitForBarbadosLoadingSpinner(this);
        await this.injuredPartyAddressLine1Field.fill(addressLine1);
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openClaimFromCompleteNotification() {
        await this.completeNotificationTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.openClaimPanelLabel)
            .toHaveText('Open Claim');
        await expect(this.openClaimButton)
            .toBeVisible();
        await expect(this.openClaimButton)
            .toBeEnabled();
        await this.openClaimButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyEventDetails(lossDescription: string, causeOfLossText: string) {
        await expect(this.eventDetailsTable)
            .toBeVisible({ timeout: 60_000 });
        await expect(this.eventDetailsTable)
            .toContainText(lossDescription);
        await expect(this.eventDetailsTable)
            .toContainText(causeOfLossText);
    }

    async verifyClaimPartyDetails(
        customerName: string,
        injuredPartyAddress: string
    ) {
        await expect(this.claimPartiesTable)
            .toBeVisible({ timeout: 60_000 });

        const injuredPartyRow = this.claimPartiesTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: customerName })
            .filter({ hasText: 'Injured Party, Insured' })
            .first();

        await expect(injuredPartyRow)
            .toBeVisible({ timeout: 60_000 });
        await expect(injuredPartyRow)
            .toContainText(customerName);
        await expect(injuredPartyRow)
            .toContainText('Injured Party, Insured');
        await expect(injuredPartyRow)
            .toContainText(injuredPartyAddress);
    }

    async addCommercialPropertyAdjudicationFeature(options: {
        indemnityReserve: string;
        expenseReserve: string;
        recoveryReserve: string;
    }): Promise<string> {
        const coverageDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:' +
            'sedit_PrecCLEvaluationFeature_feature_coverageDesc'
        );
        const pendingFeaturePopup = this.page.locator(
            '#policyDataGatherForm\\:pendingFeaturePopup_container'
        );
        const pendingFeaturePopupMessage = this.page.locator(
            '#policyDataGatherForm\\:messageList'
        );
        const pendingFeaturePopupOkButton = this.page.locator(
            '#policyDataGatherForm\\:pendingFeaturePopup_ok'
        );

        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.addNewFeatureButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addNewFeatureButton.click();
        await waitForBarbadosLoadingSpinner(this);

        const associatedRiskOption =
            this.adjudicationAssociatedRiskDropdown.locator(
                'option[value]:not([value=""]):not([value="null"])'
            ).first();
        await associatedRiskOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const associatedRiskValue =
            await associatedRiskOption.getAttribute('value');
        if (!associatedRiskValue) {
            throw new Error(
                'No Commercial Property adjudication risk is available.'
            );
        }
        await this.adjudicationAssociatedRiskDropdown.selectOption(
            associatedRiskValue
        );
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.adjudicationAssociatedRiskDropdown)
            .toHaveValue(associatedRiskValue);

        const coverages = await this.adjudicationCoverageDropdown
            .locator('option')
            .evaluateAll((coverageOptions) => coverageOptions
                .map((candidate) => {
                    const option = candidate as HTMLOptionElement;

                    return {
                        value: option.value,
                        label: (option.textContent || '').trim()
                    };
                })
                .filter((coverage) =>
                    Boolean(coverage.value) &&
                    ['Structure', 'Ex Gratia'].includes(coverage.label)
                ));
        if (!coverages.length) {
            throw new Error(
                'No supported Commercial Property coverage is available.'
            );
        }
        const selectedCoverage =
            coverages[Math.floor(Math.random() * coverages.length)];
        await this.adjudicationCoverageDropdown.selectOption(
            selectedCoverage.value
        );
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.adjudicationCoverageDropdown)
            .toHaveValue(selectedCoverage.value);
        await expect(
            this.adjudicationCoverageDropdown.locator('option:checked')
        ).toHaveText(selectedCoverage.label);

        if (selectedCoverage.label === 'Ex Gratia') {
            const coverageNotes =
                `Ex Gratia coverage determination ${Date.now()}`;
            await coverageDescriptionField.fill(coverageNotes);
            await expect(coverageDescriptionField)
                .toHaveValue(coverageNotes);
        }

        await this.fillAdjudicationReserve(
            this.indemnityReserveField,
            options.indemnityReserve
        );
        await this.fillAdjudicationReserve(
            this.expenseReserveField,
            options.expenseReserve
        );
        await this.fillAdjudicationReserve(
            this.recoveryReserveField,
            options.recoveryReserve
        );

        expect(this.parseClaimCurrency(
            await this.indemnityReserveField.inputValue()
        )).toBeCloseTo(Number(options.indemnityReserve), 2);
        expect(this.parseClaimCurrency(
            await this.expenseReserveField.inputValue()
        )).toBeCloseTo(Number(options.expenseReserve), 2);
        expect(this.parseClaimCurrency(
            await this.recoveryReserveField.inputValue()
        )).toBeCloseTo(Number(options.recoveryReserve), 2);

        // await this.nextFooterButton.click();
        // await waitForBarbadosLoadingSpinner(this);
        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.saveAndExitButton.click();
        await waitForBarbadosLoadingSpinner(this);

        if (selectedCoverage.label === 'Ex Gratia') {
            const popupIsVisible = await pendingFeaturePopup
                .waitFor({ state: 'visible', timeout: 10_000 })
                .then(() => true)
                .catch(() => false);

            if (popupIsVisible) {
                await expect(pendingFeaturePopupMessage).toContainText(
                    'This feature has an Ex Gratia Coverage'
                );
                await expect(pendingFeaturePopupOkButton).toBeVisible();
                await pendingFeaturePopupOkButton.click();
                await waitForBarbadosLoadingSpinner(this);
                await expect(pendingFeaturePopup).toBeHidden({
                    timeout: 60_000
                });
            }
        }

        return selectedCoverage.label;
    }

    async fillCommercialLiabilityAdjudicationFeature(options: {
        associatedRiskText: string;
        indemnityReserve: string;
        expenseReserve: string;
        recoveryReserve: string;
    }) {
        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.addNewFeatureButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addNewFeatureButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectRiskItemOption(
            this.adjudicationAssociatedRiskDropdown,
            options.associatedRiskText
        );
        await this.selectOptionContainingText(
            this.adjudicationCoverageDropdown,
            'Products - Completed'
        );

        await this.fillAdjudicationReserve(
            this.indemnityReserveField,
            options.indemnityReserve
        );
        await this.fillAdjudicationReserve(
            this.expenseReserveField,
            options.expenseReserve
        );
        await this.fillAdjudicationReserve(
            this.recoveryReserveField,
            options.recoveryReserve
        );

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.featureHandlingTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.saveAndExitButton)
            .toBeVisible({ timeout: 60_000 });
        await this.saveAndExitButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openPaymentsAndVerifyTotalIncurred(
        indemnityReserve: number,
        expenseReserve: number,
        recoveryReserve?: number
    ) {
        await this.page.waitForTimeout(5000)
        await this.paymentsTab.scrollIntoViewIfNeeded();
        await this.paymentsTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.financialTransactionsSummaryTable)
            .toBeVisible({ timeout: 60_000 });

        const totalIncurredRow = this.financialTransactionsSummaryTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: 'Total incurreds' })
            .first();

        await expect(totalIncurredRow)
            .toBeVisible({ timeout: 60_000 });

        const cells = totalIncurredRow.locator('td');
        const displayedIndemnity = this.parseClaimCurrency(
            await cells.nth(2).innerText()
        );
        const displayedExpense = this.parseClaimCurrency(
            await cells.nth(3).innerText()
        );
        const displayedTotal = this.parseClaimCurrency(
            await cells.nth(5).innerText()
        );

        expect(displayedIndemnity).toBeCloseTo(indemnityReserve, 2);
        expect(displayedExpense).toBeCloseTo(expenseReserve, 2);
        expect(displayedTotal).toBeCloseTo(
            indemnityReserve + expenseReserve,
            2
        );

        if (recoveryReserve !== undefined) {
            const featureReserveRow = this.financialTransactionsSummaryTable
                .locator('tbody[id$=":tb"] tr')
                .filter({ hasText: 'Total feature reserves' })
                .first();
            await expect(featureReserveRow)
                .toBeVisible({ timeout: 60_000 });
            const featureReserveCells = featureReserveRow.locator('td');
            expect(this.parseClaimCurrency(
                await featureReserveCells.nth(2).innerText()
            )).toBeCloseTo(indemnityReserve, 2);
            expect(this.parseClaimCurrency(
                await featureReserveCells.nth(3).innerText()
            )).toBeCloseTo(expenseReserve, 2);
            expect(this.parseClaimCurrency(
                await featureReserveCells.nth(4).innerText()
            )).toBeCloseTo(recoveryReserve, 2);
        }
        return displayedTotal;
    }

    async fillClaimPaymentDetails(options: {
        referenceNumber: string;
        grossAmount: string;
        customerName: string;
        paymentMemo: string;
        bankCode?: string;
        accountNumber: string;
    }) {

        await this.postPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentReferenceNumberField.fill(options.referenceNumber);
        await this.paymentGrossAmountField.fill(options.grossAmount);
        await this.paymentGrossAmountField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.selectOptionContainingText(
            this.paymentToDropdown,
            options.customerName
        );
        await this.paymentMemoField.fill(options.paymentMemo);
        await this.paymentMethodDropdown.selectOption('eft');
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentMethodDropdown).toHaveValue('eft');

        await this.bankAccountInfoDropdown.selectOption('OTHER');
        await waitForBarbadosLoadingSpinner(this);
        let bankCode = options.bankCode;
        if (bankCode) {
            const requestedBankOption = this.bankNameDropdown.locator(
                `option[value="${bankCode}"]`
            );
            if (await requestedBankOption.count() === 0) {
                bankCode = undefined;
            }
        }
        bankCode ??= await this.getFirstAvailableValue(
            this.bankNameDropdown,
            'bank'
        );
        await this.bankNameDropdown.selectOption(bankCode);
        await waitForBarbadosLoadingSpinner(this);

        const branchOption = this.bankBranchDropdown.locator(
            'option[value]:not([value=""])'
        ).first();
        await branchOption.waitFor({
            state: 'attached',
            timeout: 60_000
        });
        const branchValue = await branchOption.getAttribute('value');

        if (!branchValue) {
            throw new Error(
                `No bank branch is available for bank code "${bankCode}".`
            );
        }

        await this.bankBranchDropdown.selectOption(branchValue);
        await waitForBarbadosLoadingSpinner(this);
        await this.bankAccountNumberField.fill(options.accountNumber);
        await this.bankAccountHolderNameField.fill(options.customerName);
        await this.bankAccountTypeDropdown.selectOption('SAVINGS');
        await expect(this.bankAccountTypeDropdown).toHaveValue('SAVINGS');
    }

    async fillPaymentAllocationDetails(allocationAmount: string) {
        await this.paymentOfferTypeDropdown.selectOption('OTH_BODINJ');
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentReserveTypeDropdown.selectOption('INDEMNITY');
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentAllocationAmountField.fill(allocationAmount);
        await this.paymentAllocationAmountField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentOfferStageDropdown.selectOption('FINAL');
        await waitForBarbadosLoadingSpinner(this);
        await this.paymentDamageAmountField.fill(allocationAmount);
        await this.paymentDamageAmountField.press('Tab');
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.validatePostPaymentButton)
            .toBeVisible({ timeout: 60_000 });
        await this.validatePostPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async fillPrivateMotorPaymentAllocationDetails(options: {
        offerType: string;
        grossAmount: string;
        isExGratiaCoverage?: boolean;
        allocationTab?: boolean;
        paymentDetailsTab?: boolean
    }) {
        const paymentAllocationTab = this.page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Payment Allocation_"])'
        );
        const paymentDetailsTab = this.page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Payment Details_"])'
        );
        const postPaymentLabel = this.page.locator(
            '#policyDataGatherForm\\:componentViewPanelHeaderLabel_ClaimsPaymentPostAction'
        );
        // await expect(paymentAllocationTab)
        //     .toBeVisible({ timeout: 60_000 });
        if (options.allocationTab === true) {
            await paymentAllocationTab.click();
        }
        await waitForBarbadosLoadingSpinner(this);

        await this.paymentOfferTypeDropdown.selectOption(options.offerType);
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentOfferTypeDropdown)
            .toHaveValue(options.offerType);

        if (!options.isExGratiaCoverage) {
            await expect(this.paymentReserveTypeDropdown).toBeEnabled();
            await this.paymentReserveTypeDropdown.selectOption('INDEMNITY');
            await waitForBarbadosLoadingSpinner(this);
            await expect(this.paymentReserveTypeDropdown)
                .toHaveValue('INDEMNITY');
        } else {
            await expect(this.paymentReserveTypeDropdown).toBeDisabled();
        }

        const finalPaymentYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_' +
            'paymentDistribution_finalPaymentInd\\:0'
        );
        await finalPaymentYesRadio.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(finalPaymentYesRadio).toBeChecked();
        // await expect(this.paymentAllocationAmountField)
        //     .not.toHaveValue('', { timeout: 60_000 });

        const adjustReserveYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_adjustReserveInd\\:0'
        );

        if (await adjustReserveYesRadio.isEnabled()) {
            await adjustReserveYesRadio.click();
            await waitForBarbadosLoadingSpinner(this);
            await expect(adjustReserveYesRadio).toBeChecked();
        }

        const grossAmount = this.parseClaimCurrency(options.grossAmount);
        const amountText = grossAmount.toFixed(2);
        const allocationField = (fieldName: string) => this.page.locator(
            `#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_${fieldName}`
        );
        const fillAmount = async (field: Locator, value: string) => {
            await expect(field).toBeVisible({ timeout: 60_000 });
            await field.fill(value);
            await field.press('Tab');
            await waitForBarbadosLoadingSpinner(this);
        };
        const feeField = allocationField('fee');
        const partsField = allocationField('parts');
        const labourField = allocationField('labour');
        const preAccidentValueField = allocationField('preAccidentValue');
        const medicalExpensesField = allocationField('medicalExpenses');
        let primaryAmountField: Locator;

        if (options.isExGratiaCoverage) {
            const exGratiaReasonDropdown = allocationField(
                'paymentDistribution_exGratiaReason'
            );
            const exGratiaAmountField = allocationField('exGratiaAmount');
            const reasonOptions = await exGratiaReasonDropdown
                .locator('option:not([value=""])')
                .evaluateAll(options => options.map(option => (
                    option as HTMLOptionElement
                ).value));
            const reason = reasonOptions[
                Math.floor(Math.random() * reasonOptions.length)
            ];

            if (!reason) {
                throw new Error('No Ex Gratia reason is available.');
            }

            await exGratiaReasonDropdown.selectOption(reason);
            await waitForBarbadosLoadingSpinner(this);
            await expect(exGratiaReasonDropdown).toHaveValue(reason);

            const feeAmount = Math.min(1, grossAmount / 2);
            await fillAmount(feeField, feeAmount.toFixed(2));
            await fillAmount(
                exGratiaAmountField,
                (grossAmount - feeAmount).toFixed(2)
            );
            primaryAmountField = exGratiaAmountField;
        } else switch (options.offerType) {
            case 'CASH_IN_LIEU':
                await fillAmount(labourField, '0.00');
                await fillAmount(partsField, amountText);
                primaryAmountField = partsField;
                break;
            case 'FINAL_BILL':
                await fillAmount(labourField, '0.00');
                await fillAmount(partsField, '0.00');
                await fillAmount(feeField, amountText);
                primaryAmountField = feeField;
                break;
            case 'TOTAL_LOSS':
                await this.paymentOfferStageDropdown.selectOption('FINAL');
                await waitForBarbadosLoadingSpinner(this);
                await fillAmount(preAccidentValueField, amountText);
                primaryAmountField = preAccidentValueField;
                break;
            case 'TP_PROPERTY_DMG':
                await this.paymentOfferStageDropdown.selectOption('FINAL');
                await waitForBarbadosLoadingSpinner(this);
                await fillAmount(partsField, amountText);
                primaryAmountField = partsField;
                break;
            case 'TP_BODILY_INJURY':
                await this.paymentOfferStageDropdown.selectOption('FINAL');
                await waitForBarbadosLoadingSpinner(this);
                await fillAmount(medicalExpensesField, amountText);
                primaryAmountField = medicalExpensesField;
                break;
            default:
                await fillAmount(feeField, amountText);
                primaryAmountField = feeField;
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            const allocationAmount = this.parseClaimCurrency(
                await this.paymentAllocationAmountField.inputValue()
            );
            if (Math.abs(allocationAmount - grossAmount) < 0.01) {
                break;
            }

            const primaryAmount = this.parseClaimCurrency(
                await primaryAmountField.inputValue()
            );
            await fillAmount(
                primaryAmountField,
                (primaryAmount + grossAmount - allocationAmount).toFixed(2)
            );
        }

        const allocationAmount = this.parseClaimCurrency(
            await this.paymentAllocationAmountField.inputValue()
        );
        // expect(allocationAmount).toBeCloseTo(grossAmount, 2);
        // await expect(paymentDetailsTab)
        //     .toBeVisible({ timeout: 60_000 });
        if (options.paymentDetailsTab === true) {
            await paymentDetailsTab.click();
        }
        // await waitForBarbadosLoadingSpinner(this);

        // await expect(postPaymentLabel)
        //     .toBeVisible({ timeout: 60_000 });
        await expect(postPaymentLabel).toHaveText('Post Payment');
        // await expect(this.validatePostPaymentButton)
        //     .toBeVisible({ timeout: 60_000 });
        await this.validatePostPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);
        if (options.isExGratiaCoverage) {
            const paymentOkButton = this.page.locator(
                'input[id="paymentFinish_ClaimsPaymentPostAction:' +
                'paymentOkBtn_ClaimsPaymentPostAction"]'
            );
            await expect(paymentOkButton)
                .toBeVisible({ timeout: 60_000 });
            await paymentOkButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    async fillCommercialPropertyPaymentAllocationDetails(options: {
        offerType: string;
        grossAmount: string;
        isExGratiaCoverage?: boolean;
    }) {
        const allocationField = (fieldName: string) => this.page.locator(
            `#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_${fieldName}`
        );
        const fillAmount = async (field: Locator, value: string) => {
            await expect(field).toBeVisible({ timeout: 60_000 });
            await field.fill(value);
            await field.press('Tab');
            await waitForBarbadosLoadingSpinner(this);
        };
        const postPaymentLabel = this.page.locator(
            '#policyDataGatherForm\\:' +
            'componentViewPanelHeaderLabel_ClaimsPaymentPostAction'
        );
        const finalPaymentYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_' +
            'paymentDistribution_finalPaymentInd\\:0'
        );
        const adjustReserveYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_' +
            'adjustReserveInd\\:0'
        );
        const exGratiaReasonDropdown = allocationField(
            'paymentDistribution_exGratiaReason'
        );
        const exGratiaDescriptionField = allocationField(
            'paymentDistribution_exGratiaReasonDesc'
        );
        const exGratiaAmountField = allocationField('exGratiaAmount');
        const feeField = allocationField('fee');
        const damageAmountField = allocationField('damageAmount');
        const benefitAmountField = allocationField('benefitAmount');
        const lessExcessField = allocationField('lessExcess');
        const grossAmount = this.parseClaimCurrency(options.grossAmount);
        const amountText = grossAmount.toFixed(2);

        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentOfferTypeDropdown.locator(
            `option[value="${options.offerType}"]`
        )).toBeAttached({ timeout: 60_000 });
        await this.paymentOfferTypeDropdown.selectOption(options.offerType);
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentOfferTypeDropdown)
            .toHaveValue(options.offerType);

        if (options.isExGratiaCoverage) {
            await expect(this.paymentReserveTypeDropdown).toBeDisabled();
        } else {
            await expect(this.paymentReserveTypeDropdown).toBeEnabled();
            await this.paymentReserveTypeDropdown.selectOption('INDEMNITY');
            await waitForBarbadosLoadingSpinner(this);
            await expect(this.paymentReserveTypeDropdown)
                .toHaveValue('INDEMNITY');
        }

        await finalPaymentYesRadio.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(finalPaymentYesRadio).toBeChecked();

        if (await adjustReserveYesRadio.isEnabled()) {
            await adjustReserveYesRadio.click();
            await waitForBarbadosLoadingSpinner(this);
            await expect(adjustReserveYesRadio).toBeChecked();
        }

        if (await lessExcessField.isVisible()) {
            await fillAmount(lessExcessField, '0.00');
        }

        let primaryAmountField: Locator;
        switch (options.offerType) {
            case 'CLAIM_PREP_COST':
                primaryAmountField = benefitAmountField;
                break;
            case 'PROFESSFEES':
                primaryAmountField = feeField;
                break;
            case 'BNS_INTS_COST_WORK':
            case 'BNS_INTS_LOSS_GP':
            case 'MD_BUILDING':
            case 'MD_CONTN_STOCK':
                await this.paymentOfferStageDropdown.selectOption('FINAL');
                await waitForBarbadosLoadingSpinner(this);
                await expect(this.paymentOfferStageDropdown)
                    .toHaveValue('FINAL');
                primaryAmountField = damageAmountField;
                break;
            default:
                throw new Error(
                    `Unsupported Commercial Property offer type: ` +
                    options.offerType
                );
        }

        if (options.isExGratiaCoverage) {
            const reasonOptions = await exGratiaReasonDropdown
                .locator('option[value]:not([value=""])')
                .evaluateAll(reasonElements => reasonElements.map(
                    reason => (reason as HTMLOptionElement).value
                ));
            const reason = reasonOptions[
                Math.floor(Math.random() * reasonOptions.length)
            ];
            if (!reason) {
                throw new Error('No Ex Gratia reason is available.');
            }
            await exGratiaReasonDropdown.selectOption(reason);
            await waitForBarbadosLoadingSpinner(this);
            await expect(exGratiaReasonDropdown).toHaveValue(reason);

            if (await exGratiaDescriptionField.isVisible()) {
                const description =
                    `Commercial property Ex Gratia ${Date.now()}`;
                await exGratiaDescriptionField.fill(description);
                await expect(exGratiaDescriptionField)
                    .toHaveValue(description);
            }

            const primaryAmount = Math.min(1, grossAmount / 2);
            await fillAmount(
                primaryAmountField,
                primaryAmount.toFixed(2)
            );
            await fillAmount(
                exGratiaAmountField,
                (grossAmount - primaryAmount).toFixed(2)
            );
        } else {
            await fillAmount(primaryAmountField, amountText);
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            const allocationAmount = this.parseClaimCurrency(
                await this.paymentAllocationAmountField.inputValue()
            );
            if (Math.abs(allocationAmount - grossAmount) < 0.01) {
                break;
            }

            const primaryAmount = this.parseClaimCurrency(
                await primaryAmountField.inputValue()
            );
            await fillAmount(
                primaryAmountField,
                (primaryAmount + grossAmount - allocationAmount).toFixed(2)
            );
        }

        // expect(this.parseClaimCurrency(
        //     await this.paymentAllocationAmountField.inputValue()
        // )).toBeCloseTo(grossAmount, 2);
        await expect(postPaymentLabel).toHaveText('Post Payment');
        await this.validatePostPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);

        if (options.isExGratiaCoverage) {
            const paymentOkButton = this.page.locator(
                'input[id="paymentFinish_ClaimsPaymentPostAction:' +
                'paymentOkBtn_ClaimsPaymentPostAction"]'
            );
            await expect(paymentOkButton)
                .toBeVisible({ timeout: 60_000 });
            await paymentOkButton.click();
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    async fillHomePaymentAllocationDetails(options: {
        offerType: string;
        grossAmount: string;
    }) {
        const paymentAllocationTab = this.page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Payment Allocation_"])'
        );
        const paymentDetailsTab = this.page.locator(
            'span.rf-trn-lbl:has(i[data-tab^="Payment Details_"])'
        );
        const postPaymentLabel = this.page.locator(
            '#policyDataGatherForm\\:' +
            'componentViewPanelHeaderLabel_ClaimsPaymentPostAction'
        );
        const allocationField = (fieldName: string) => this.page.locator(
            `#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_${fieldName}`
        );
        const fillAmount = async (field: Locator, value: string) => {
            await expect(field).toBeVisible({ timeout: 60_000 });
            await field.fill(value);
            await field.press('Tab');
            await waitForBarbadosLoadingSpinner(this);
        };

        await expect(paymentAllocationTab)
            .toBeVisible({ timeout: 60_000 });
        await paymentAllocationTab.click();
        await waitForBarbadosLoadingSpinner(this);

        await expect(this.paymentOfferTypeDropdown.locator(
            `option[value="${options.offerType}"]`
        )).toBeAttached({ timeout: 60_000 });
        await this.paymentOfferTypeDropdown.selectOption({
            value: options.offerType
        });
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentOfferTypeDropdown)
            .toHaveValue(options.offerType);

        await this.paymentReserveTypeDropdown.selectOption('INDEMNITY');
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.paymentReserveTypeDropdown)
            .toHaveValue('INDEMNITY');

        const finalPaymentYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_' +
            'paymentDistribution_finalPaymentInd\\:0'
        );
        await finalPaymentYesRadio.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(finalPaymentYesRadio).toBeChecked();

        const adjustReserveYesRadio = this.page.locator(
            '#policyDataGatherForm\\:sedit_ClaimsPaymentDistribution_' +
            'adjustReserveInd\\:0'
        );
        await adjustReserveYesRadio.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(adjustReserveYesRadio).toBeChecked();

        const grossAmount = this.parseClaimCurrency(options.grossAmount);
        const amountText = grossAmount.toFixed(2);
        let primaryAmountField: Locator;

        switch (options.offerType) {
            case 'FINPAYNT':
            case 'TP_PROPERTY_DMG':
                primaryAmountField = allocationField('damageAmount');
                break;
            case 'LOSSOFACCO':
                primaryAmountField = allocationField('benefitAmount');
                break;
            case 'TP_BODILY_INJURY':
                primaryAmountField = allocationField('generalDamages');
                break;
            case 'PROFESSFEES':
                primaryAmountField = allocationField('fee');
                break;
            default:
                throw new Error(
                    `Unsupported Home payment offer type: ${options.offerType}`
                );
        }

        if (await this.paymentOfferStageDropdown.isVisible()) {
            await this.paymentOfferStageDropdown.selectOption('FINAL');
            await waitForBarbadosLoadingSpinner(this);
            await expect(this.paymentOfferStageDropdown)
                .toHaveValue('FINAL');
        }

        await fillAmount(primaryAmountField, amountText);

        for (let attempt = 0; attempt < 3; attempt++) {
            const allocationAmount = this.parseClaimCurrency(
                await this.paymentAllocationAmountField.inputValue()
            );
            if (Math.abs(allocationAmount - grossAmount) < 0.01) {
                break;
            }
            const primaryAmount = this.parseClaimCurrency(
                await primaryAmountField.inputValue()
            );
            await fillAmount(
                primaryAmountField,
                (primaryAmount + grossAmount - allocationAmount).toFixed(2)
            );
        }

        const allocationAmount = this.parseClaimCurrency(
            await this.paymentAllocationAmountField.inputValue()
        );
        expect(allocationAmount).toBeCloseTo(grossAmount, 2);

        await expect(paymentDetailsTab)
            .toBeVisible({ timeout: 60_000 });
        await paymentDetailsTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(postPaymentLabel)
            .toHaveText('Post Payment', { timeout: 60_000 });
        await expect(this.validatePostPaymentButton)
            .toBeVisible({ timeout: 60_000 });
        await this.validatePostPaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);

    }

    async verifyPostedPaymentDetails(options: {
        referenceNumber?: string;
        paidTo: string;
        totalPaymentAmount: number;
        transactionStatus?: string;
        note?: string;
    }) {
        // await expect(this.financialRecordsTable)
        //     .toBeVisible({ timeout: 60_000 });

        const paymentRow = this.financialRecordsTable
            .locator('tbody tr')
            .filter({ hasText: options.paidTo })
            .filter({
                hasText: options.transactionStatus ?? 'Pending'
            })
            .first();

        // await expect(paymentRow)
        //     .toBeVisible({ timeout: 60_000 });

        const cells = paymentRow.locator('td');
        await expect(cells.nth(0)).not.toHaveText('');
        await expect(cells.nth(1)).not.toHaveText('');
        await expect(cells.nth(2)).toContainText(options.paidTo);

        const displayedPaymentAmount = this.parseClaimCurrency(
            await cells.nth(3).innerText()
        );
        // expect(displayedPaymentAmount).toBeCloseTo(
        //     options.totalPaymentAmount,
        //     2
        // );

        const displayedRecoveryAmount = this.parseClaimCurrency(
            await cells.nth(4).innerText()
        );
        expect(displayedRecoveryAmount).toBeCloseTo(0, 2);

        await expect(cells.nth(5)).toHaveText(
            options.transactionStatus ?? 'Pending'
        );
        // await expect(cells.nth(6)).toHaveText(options.note ?? 'Final');
        return (await cells.nth(0).innerText()).trim();
    }

    async verifyClaimDetailsInClaimList(
        lossDescription: string,
        productText = 'Commercial (Preconfigured)'
    ) {
        await expect(this.claimListTable)
            .toBeVisible({ timeout: 60_000 });

        const claimRow = this.claimListTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: lossDescription })
            .first();

        await expect(claimRow)
            .toBeVisible({ timeout: 60_000 });
        await expect(claimRow.locator('td').nth(0).locator('a'))
            .toHaveText(/^OC\d+$/);
        await expect(claimRow)
            .toContainText(productText);
        await expect(claimRow)
            .toContainText(lossDescription);
        await expect(claimRow)
            .toContainText('Claim Management');
        await expect(claimRow.locator('td').last())
            .toHaveText('Open');
    }

    async openClaimFromClaimList(lossDescription: string) {
        const claimRow = this.claimListTable
            .locator('tbody[id$=":tb"] tr')
            .filter({ hasText: lossDescription })
            .first();

        await expect(claimRow)
            .toBeVisible({ timeout: 60_000 });
        await claimRow.locator('td').nth(0).locator('a').click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async openPaymentsTab() {
        await expect(this.paymentsTab)
            .toBeVisible({ timeout: 60_000 });
        await this.paymentsTab.scrollIntoViewIfNeeded();
        await this.paymentsTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.financialRecordsTable)
            .toBeVisible({ timeout: 60_000 });
    }

    async openPaymentByReference(referenceNumber: string) {
        const paymentRow = this.getPaymentRow(referenceNumber);

        await expect(paymentRow)
            .toBeVisible({ timeout: 60_000 });
        await paymentRow.locator('td').nth(0).locator('a').click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async approvePayment(reason: string) {
        await expect(this.approvePaymentLink)
            .toBeVisible({ timeout: 60_000 });
        await this.approvePaymentLink.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.approvePaymentReasonField.fill(reason);
        await this.confirmApprovePaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async issuePayment(reason: string) {
        await expect(this.issuePaymentLink)
            .toBeVisible({ timeout: 60_000 });
        await this.issuePaymentLink.click();
        await waitForBarbadosLoadingSpinner(this);
        await this.issuePaymentReasonField.fill(reason);
        await this.confirmIssuePaymentButton.click();
        await waitForBarbadosLoadingSpinner(this);
    }

    async verifyPaymentTransactionStatus(
        referenceNumber: string,
        expectedStatus: string
    ) {
        const paymentRow = this.getPaymentRow(referenceNumber);

        await expect(paymentRow)
            .toBeVisible({ timeout: 60_000 });
        await expect(paymentRow.locator('td').nth(5))
            .toHaveText(expectedStatus);
    }

    async verifyClaimDamageDetails(options: {
        damageDescription: string;
        damageType?: string;
        partyType?: string;
        damageText?: string;
    }) {
        const {
            damageDescription,
            damageType = 'Property',
            partyType = '1st Party',
            damageText = 'Test Structure'
        } = options;
        if (process.env.PWDEBUG) {
        }
        await expect(this.adjudicationTab)
            .toBeVisible({ timeout: 60_000 });
        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.claimDamageDetailsTable)
            .toBeVisible({ timeout: 60_000 });

        const damageRow = this.claimDamageDetailsTable
            .locator('tbody tr')
            .filter({ hasText: damageDescription })
            .first();

        await expect(damageRow)
            .toBeVisible({ timeout: 60_000 });
        await expect(damageRow.locator('td').nth(0))
            .toContainText(/\d+/);
        await expect(damageRow.locator('td').nth(1))
            .toContainText(damageType);
        await expect(damageRow.locator('td').nth(2))
            .toContainText(partyType);
        await expect(damageRow.locator('td').nth(3))
            .toContainText(damageText);
        await expect(damageRow.locator('td').nth(4))
            .toContainText(damageDescription);
    }

    async verifyCommercialAutoAdjudicationDamage(options: {
        damageDescription: string;
        modelYear: string;
        make: string;
        model: string;
    }) {
        // await expect(this.adjudicationTab)
        //     .toBeVisible({ timeout: 60_000 });
        await this.adjudicationTab.click();
        await waitForBarbadosLoadingSpinner(this);

        // await this.verifyClaimDamageDetails({
        //     damageDescription: options.damageDescription,
        //     damageType: 'Auto',
        //     partyType: '1st Party',
        //     damageText:
        //         `${options.modelYear}, ${options.make}, ${options.model}`
        // });
    }

    async addCommercialAutoAdjudicationFeature(options: {
        associatedRiskText: string;
        indemnityReserve: string;
        expenseReserve: string;
        recoveryReserve: string;
    }): Promise<string> {
        const coverageDescriptionField = this.page.locator(
            '#policyDataGatherForm\\:sedit_PrecCLEvaluationFeature_feature_coverageDesc'
        );

        await expect(this.addNewFeatureButton)
            .toBeVisible({ timeout: 60_000 });
        await this.addNewFeatureButton.click();
        await waitForBarbadosLoadingSpinner(this);

        await this.selectRiskItemOption(
            this.adjudicationAssociatedRiskDropdown,
            options.associatedRiskText
        );
        await expect(
            this.adjudicationAssociatedRiskDropdown.locator('option:checked')
        ).toContainText(options.associatedRiskText);

        const coverages = await this.adjudicationCoverageDropdown
            .locator('option')
            .evaluateAll((coverageOptions) => coverageOptions
                .map((candidate) => {
                    const option = candidate as HTMLOptionElement;

                    return {
                        value: option.value,
                        label: (option.textContent || '').trim()
                    };
                })
                .filter((option) => Boolean(option.value)));
        if (!coverages.length) {
            throw new Error(
                'No Commercial Auto adjudication coverage is available.'
            );
        }
        const coverage = coverages[
            Math.floor(Math.random() * coverages.length)
        ];
        await this.adjudicationCoverageDropdown.selectOption(coverage.value);
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.adjudicationCoverageDropdown)
            .toHaveValue(coverage.value);
        await expect(
            this.adjudicationCoverageDropdown.locator('option:checked')
        ).toHaveText(coverage.label);

        if (coverage.label === 'Ex Gratia') {
            const coverageNotes =
                `Ex Gratia coverage determination ${Date.now()}`;
            await coverageDescriptionField.fill(coverageNotes);
            await expect(coverageDescriptionField)
                .toHaveValue(coverageNotes);
        }

        await this.fillAdjudicationReserve(
            this.indemnityReserveField,
            options.indemnityReserve
        );
        await this.fillAdjudicationReserve(
            this.expenseReserveField,
            options.expenseReserve
        );
        await this.fillAdjudicationReserve(
            this.recoveryReserveField,
            options.recoveryReserve
        );

        expect(this.parseClaimCurrency(
            await this.indemnityReserveField.inputValue()
        )).toBeCloseTo(Number(options.indemnityReserve), 2);
        expect(this.parseClaimCurrency(
            await this.expenseReserveField.inputValue()
        )).toBeCloseTo(Number(options.expenseReserve), 2);
        expect(this.parseClaimCurrency(
            await this.recoveryReserveField.inputValue()
        )).toBeCloseTo(Number(options.recoveryReserve), 2);

        await this.nextFooterButton.click();
        await waitForBarbadosLoadingSpinner(this);
        await expect(this.saveAndExitButton)
            .toBeVisible({ timeout: 60_000 });
        await this.saveAndExitButton.click();
        await waitForBarbadosLoadingSpinner(this);

        return coverage.label;
    }

    async verifyCommercialAutoClaimDamageAndFeature(options: {
        damageDescription: string;
        vehicleText: string;
        coverage: string;
        customerName: string;
        indemnityReserve: number;
        expenseReserve: number;
    }) {
        await this.verifyClaimDamageDetails({
            damageDescription: options.damageDescription,
            damageType: 'Auto',
            partyType: '1st Party',
            damageText: options.vehicleText
        });

        const featureTable = this.page.locator(
            '#productConsolidatedViewForm\\:scolumn_EvaluationClaimFeature'
        );
        const featureRow = featureTable.locator('tbody tr')
            .filter({ hasText: options.coverage })
            .filter({ hasText: options.vehicleText })
            .first();

        await expect(featureTable).toBeVisible({ timeout: 60_000 });
        await expect(featureRow).toBeVisible({ timeout: 60_000 });

        const cells = featureRow.locator('td');
        await expect(cells).toHaveCount(9);
        await expect(cells.nth(0)).toHaveText(/^\d+-\d+$/);
        await expect(cells.nth(1)).toHaveText(/^\d+$/);
        await expect(cells.nth(2)).toHaveText(options.vehicleText);
        await expect(cells.nth(3)).toHaveText(options.coverage);
        // await expect(cells.nth(4)).toHaveText(options.customerName);
        await expect(cells.nth(5)).toHaveText(options.vehicleText);
        await expect(cells.nth(6))
            .toHaveText(/^[A-Z]{3}[\d,]+\.\d{2}$/);
        expect(this.parseClaimCurrency(
            await cells.nth(6).innerText()
        )).toBeCloseTo(
            options.indemnityReserve + options.expenseReserve,
            2
        );
        await expect(cells.nth(7)).toHaveText('Open');
        await expect(cells.nth(8)).toContainText('Actions');
    }

    private getPaymentRow(referenceNumber: string): Locator {
        return this.financialRecordsTable
            .locator('tbody tr')
            .filter({ hasText: referenceNumber })
            .first();
    }

    private async getFirstAvailableValue(
        dropdown: Locator,
        optionName: string
    ): Promise<string> {
        const option = dropdown.locator(
            'option[value]:not([value=""])'
        ).first();

        await option.waitFor({ state: 'attached', timeout: 60_000 });
        const value = await option.getAttribute('value');

        if (!value) {
            throw new Error(`No ${optionName} option is available.`);
        }

        return value;
    }

    private async fillAdjudicationReserve(
        field: Locator,
        value: string
    ) {
        await field.fill(value);
        await field.press('Tab');
        await waitForBarbadosLoadingSpinner(this);
    }

    private parseClaimCurrency(value: string): number {
        const amount = Number(value.replace(/[^0-9.-]/g, ''));
        return value.includes('(') && value.includes(')')
            ? -Math.abs(amount)
            : amount;
    }

    private async selectPreferredOrFirstOption(
        select: Locator,
        preferredValue: string
    ): Promise<string> {
        const selected = await select.locator('option').evaluateAll(
            (options, value) => {
                const preferred = options.find((option) =>
                    (option as HTMLOptionElement).value === value
                ) as HTMLOptionElement | undefined;
                const fallback = options.find((option) => {
                    const optionValue = (option as HTMLOptionElement).value;
                    return optionValue && optionValue !== 'Other';
                }) as HTMLOptionElement | undefined;
                const option = preferred || fallback;

                return {
                    value: option?.value || '',
                    text: option?.textContent?.trim() || ''
                };
            },
            preferredValue
        );

        if (!selected.value) {
            throw new Error('No selectable option was found.');
        }

        await select.selectOption(selected.value);
        await waitForBarbadosLoadingSpinner(this);

        return selected.text;
    }

    private async selectFirstAvailableOption(select: Locator) {
        await this.selectPreferredOrFirstOption(select, '');
    }

    private async selectOptionByLabelOrFirstAvailable(
        select: Locator,
        labelText: string
    ): Promise<string> {
        const selected = await select.locator('option').evaluateAll(
            (options, textToMatch) => {
                const normalizedTextToMatch = (textToMatch as string)
                    .trim()
                    .toLowerCase();
                const preferred = options.find((candidate) => {
                    const option = candidate as HTMLOptionElement;
                    const optionText = (option.textContent || '')
                        .trim()
                        .toLowerCase();

                    return Boolean(option.value) &&
                        optionText.includes(normalizedTextToMatch);
                }) as HTMLOptionElement | undefined;
                const fallback = options.find((candidate) => {
                    const option = candidate as HTMLOptionElement;

                    return Boolean(option.value);
                }) as HTMLOptionElement | undefined;
                const option = preferred || fallback;

                return {
                    value: option?.value || '',
                    text: option?.textContent?.trim() || ''
                };
            },
            labelText
        );

        if (!selected.value) {
            throw new Error('No selectable option was found.');
        }

        await select.selectOption(selected.value);
        await expect(select)
            .toHaveValue(selected.value, { timeout: 5_000 });
        await select.evaluate((element) => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await waitForBarbadosLoadingSpinner(this);

        return selected.text;
    }

    private async clickHiddenButtonIfPresent(button: Locator) {
        if (await button.count()) {
            await button.evaluate((element) => {
                (element as HTMLElement).click();
            });
            await waitForBarbadosLoadingSpinner(this);
        }
    }

    private async selectPropertyDamageRiskItem(
        select: Locator,
        preferredText: string,
        preferredValue?: string
    ): Promise<string> {
        await expect(select)
            .toBeVisible({ timeout: 60_000 });

        const selected = await select.locator('option').evaluateAll(
            (options, preference) => {
                const { text, value } = preference as {
                    text: string;
                    value?: string;
                };
                const normalizedText = text.trim().toLowerCase();
                const candidates = options
                    .map((candidate) => candidate as HTMLOptionElement)
                    .filter((option) =>
                        Boolean(option.value) &&
                        option.value !== 'OTHER' &&
                        option.value !== 'null'
                    );
                const valueMatch = candidates.find((option) =>
                    Boolean(value) && option.value === value
                );
                const textMatch = candidates.find((option) =>
                    (option.textContent || '')
                        .trim()
                        .toLowerCase()
                        .includes(normalizedText)
                );
                const option = valueMatch || textMatch || candidates[0];

                return {
                    value: option?.value || '',
                    text: option?.textContent?.trim() || ''
                };
            },
            {
                text: preferredText,
                value: preferredValue
            }
        );

        if (!selected.value) {
            throw new Error(
                `No property damage risk item option found for "${preferredText}".`
            );
        }

        await select.selectOption(selected.value);
        await expect(select)
            .toHaveValue(selected.value, { timeout: 5_000 });
        await select.evaluate((element) => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await waitForBarbadosLoadingSpinner(this);

        return selected.value;
    }

    private async selectRiskItemOption(
        select: Locator,
        preferredText: string
    ): Promise<string> {
        return await this.selectPropertyDamageRiskItem(select, preferredText);
    }

    private async selectOptionContainingText(
        select: Locator,
        expectedText: string
    ): Promise<string> {
        const selected = await select.locator('option').evaluateAll(
            (options, textToMatch) => {
                const normalizedTextToMatch = (textToMatch as string)
                    .trim()
                    .toLowerCase();
                const option = options.find((candidate) => {
                    const selectOption = candidate as HTMLOptionElement;
                    const optionText = (selectOption.textContent || '')
                        .trim()
                        .toLowerCase();

                    return Boolean(selectOption.value) &&
                        selectOption.value !== 'Other' &&
                        optionText.includes(normalizedTextToMatch);
                }) as HTMLOptionElement | undefined;

                return {
                    value: option?.value || '',
                    text: option?.textContent?.trim() || ''
                };
            },
            expectedText
        );

        if (!selected.value) {
            throw new Error(
                `No selectable option contains "${expectedText}".`
            );
        }

        await select.selectOption(selected.value);
        await select.evaluate((element) => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await waitForBarbadosLoadingSpinner(this);

        return selected.text;
    }

    private async selectReportingPartyCustomer(customerName: string) {
        const selected = await this.reportingPartyDropdown
            .locator('option')
            .evaluateAll((options, expectedCustomerName) => {
                const customerNameText = (expectedCustomerName as string)
                    .trim()
                    .toLowerCase();
                const customerOption = options.find((candidate) => {
                    const option = candidate as HTMLOptionElement;
                    const optionText = (option.textContent || '')
                        .trim()
                        .toLowerCase();

                    return Boolean(option.value) &&
                        optionText.includes(' - customer') &&
                        (!customerNameText ||
                            optionText.includes(customerNameText));
                }) as HTMLOptionElement | undefined;
                const fallbackCustomerOption = options.find((candidate) => {
                    const option = candidate as HTMLOptionElement;
                    const optionText = (option.textContent || '').trim();

                    return Boolean(option.value) &&
                        optionText.includes(' - Customer');
                }) as HTMLOptionElement | undefined;
                const option = customerOption || fallbackCustomerOption;

                return {
                    value: option?.value || '',
                    text: option?.textContent?.trim() || ''
                };
            }, customerName);

        if (!selected.value) {
            throw new Error(
                `No reporting party Customer option found for "${customerName}".`
            );
        }

        await this.reportingPartyDropdown.selectOption(selected.value);
        await this.reportingPartyDropdown.evaluate((element) => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await expect(this.reportingPartyDropdown)
            .toHaveValue(selected.value, { timeout: 5_000 });

        if (await this.reportingPartyChangedButton.count()) {
            await this.reportingPartyChangedButton.evaluate((element) => {
                (element as HTMLElement).click();
            });
        }

        await waitForBarbadosLoadingSpinner(this);
        await expect(this.reportingPartyDropdown)
            .toHaveValue(selected.value, { timeout: 5_000 });
    }

    private async selectOptionByText(select: Locator, text: string) {
        const value = await select.locator('option').evaluateAll(
            (options, expectedText) => {
                const option = options.find((candidate) => {
                    const selectOption = candidate as HTMLOptionElement;

                    return Boolean(selectOption.value) &&
                        (selectOption.textContent || '').includes(expectedText);
                }) as HTMLOptionElement | undefined;

                return option?.value || '';
            },
            text
        );

        if (!value) {
            throw new Error(`No selectable option contains "${text}".`);
        }

        await select.selectOption(value);
        await waitForBarbadosLoadingSpinner(this);
    }
}
