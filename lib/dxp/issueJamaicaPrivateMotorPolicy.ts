import { faker } from '@faker-js/faker';
import type { components } from './types/dxp-api';
import { createDxpClient, type DxpClient } from './client';
import { DxpHttpError } from './client';
import { isDxpIssuanceConfigured } from './config';
import { generateCustomerInformation } from '../../sites/eis/data/CustomerData';
import type { CustomerInformation } from '../../sites/eis/data/CustomerData';

type BcicLeadCreateRequest = components['schemas']['BcicLeadCreateRequest'];
type PrecAuQuoteCreateRequest = components['schemas']['PrecAuQuoteCreateRequest'];
type PurchaseRequest = components['schemas']['PurchaseRequest'];
type PaymentPlanSummary = components['schemas']['PaymentPlanSummary'];
type BcicPolicyRateResponse = components['schemas']['BcicPolicyRateResponse'];
type LeadCreationResult = components['schemas']['LeadCreationResult'];
type PrecAuQuoteCreateUpdateResponse = components['schemas']['PrecAuQuoteCreateUpdateResponse'];
type PurchaseResponse = components['schemas']['PurchaseResponse'];

export interface IssueJamaicaPrivateMotorPolicyOptions {
  /** Insured age (affects date of birth). */
  customerAge: number;
  /** Auto package code (matches RatingPage setCoverageAndPlan second arg or Standard). */
  packageCd: 'StandardWORentalBenefits' | 'DiamondMaxWORentalBenefits';
  /** Sum insured / market value (JMD). */
  marketValue?: number;
  /** Optional VIN; random if omitted. */
  vin?: string;
}

export interface IssuedJamaicaPrivateMotorPolicy {
  customerNumber: string;
  policyNumber: string;
  /** Alias for EIS quick search — same as `customerNumber` when created via DXP lead. */
  customerId: string;
  customerDetails: CustomerInformation;
}

function jmGeo() {
  return {
    countryCd: process.env.DXP_JM_COUNTRY_CD?.trim() || 'JM',
    currencyCd: process.env.DXP_JM_CURRENCY_CD?.trim() || 'JMD',
    stateProvCd: process.env.DXP_JM_STATE_PROV_CD?.trim() || 'JM-01',
    parishCd: process.env.DXP_JM_PARISH_CD?.trim() || 'JM-01',
    districtCd: process.env.DXP_JM_DISTRICT_CD?.trim() || 'JM-01',
    branchCd: process.env.DXP_JM_BRANCH_CD?.trim() || 'HEAD_OFFICE_KINGSTON',
  };
}

function dobIsoFromDdMmYyyy(ddMmYyyy: string): string {
  const [dd, mm, yyyy] = ddMmYyyy.split('/').map((s) => s.trim());
  if (!dd || !mm || !yyyy) return '1990-01-01';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function genderCd(uiGender: string): string {
  const g = uiGender.toLowerCase();
  if (g.startsWith('f')) return 'female';
  return 'male';
}

function mapOccupationToCd(occupation: string): string {
  const map: Record<string, string> = {
    Bearer: 'Bearer',
    'IT Specialist/Technician': 'ITSpecTech',
  };
  return map[occupation] || 'Bearer';
}

function buildLeadBody(details: CustomerInformation): BcicLeadCreateRequest {
  const gi = details.generalInformation;
  const cd = details.contactDetails;
  const ai = details.additionalInformation;
  const geo = jmGeo();
  return {
    firstName: gi['First Name'].replace(/-Automation$/, ''),
    lastName: gi['Last Name'],
    dateOfBirth: dobIsoFromDdMmYyyy(gi['Date of Birth']),
    gender: genderCd(gi['Gender']),
    employer: ai['Employer']?.trim() || 'Automation Employer',
    identificationTypeCd: 'NID',
    taxId: gi['Identification Number'],
    trn: gi['Identification Number'],
    citizenshipCd: geo.countryCd,
    employmentStatusCd: ai['Employment Status'] || 'EMP_FT',
    occupationCd: mapOccupationToCd(ai['Occupation']),
    sourceOfFundCd: 'Salary',
    seniorPublicOfficeInd: false,
    addresses: [
      {
        addressLine1: cd['Address Line 1'],
        city: 'Kingston',
        countryCd: geo.countryCd,
        parishCd: geo.parishCd,
        postalCode: cd['ZIP/Post Code'] || '00000',
        stateProvCd: geo.stateProvCd,
        districtCd: geo.districtCd,
      },
    ],
    emails: cd['Email']
      ? [{ email: cd['Email'], emailTypeCd: 'PERS' }]
      : undefined,
    phones: cd['Phone Number']
      ? [{ phone: cd['Phone Number'].replace(/\D/g, '').slice(0, 15), phoneTypeCd: 'HOME' }]
      : undefined,
  };
}

function redactLeadBodyForLogs(body: BcicLeadCreateRequest): Record<string, unknown> {
  return {
    ...body,
    taxId: body.taxId ? '***redacted***' : body.taxId,
    trn: body.trn ? '***redacted***' : body.trn,
    emails: body.emails?.map((e) => ({ ...e, email: '***redacted***' })),
    phones: body.phones?.map((p) => ({ ...p, phone: '***redacted***' })),
  };
}

function buildQuoteCreateRequest(
  customerNumber: string,
  details: CustomerInformation,
  options: IssueJamaicaPrivateMotorPolicyOptions
): PrecAuQuoteCreateRequest {
  const gi = details.generalInformation;
  const cd = details.contactDetails;
  const geo = jmGeo();
  const effective = new Date();
  effective.setHours(12, 0, 0, 0);
  const effectiveDate = effective.toISOString();
  const vin = options.vin ?? faker.vehicle.vin();
  const marketValue = options.marketValue ?? 4_000_000;

  const insuredAndDriver: components['schemas']['PrecAuQuoteInsuredAndDriverCreateRequest'] = {
    firstName: gi['First Name'].replace(/-Automation$/, ''),
    lastName: gi['Last Name'],
    dateOfBirth: dobIsoFromDdMmYyyy(gi['Date of Birth']),
    genderCd: genderCd(gi['Gender']),
    employer: details.additionalInformation['Employer']?.trim() || 'Automation Employer',
    identificationTypeCd: 'NID',
    taxId: gi['Identification Number'],
    trn: gi['Identification Number'],
    maritalStatusCd: 'M',
    employmentStatusCd: details.additionalInformation['Employment Status'] || 'EMP_FT',
    occupationCd: mapOccupationToCd(details.additionalInformation['Occupation']),
    insured: {
      primaryInsuredInd: true,
      priorClaim: { hadPriorClaims: false },
    },
    driver: {
      driverTypeCd: 'A',
      relationshipToInsuredCd: 'WI',
      driverLicenses: [
        {
          ageFirstLicensed: 18,
          currentLicenseIssueDt: '2020-01-01T00:00:00',
          licensePermitNumber: faker.string.numeric(9),
          licenseStateProvCd: geo.stateProvCd,
          licenseStatusCd: 'V',
          licenseTypeCd: 'PER',
          licensedDt: '2010-01-01',
          permitBeforeLicenseInd: false,
          licenseCountry: geo.countryCd,
          licenseExpirationDt: '2030-01-01T00:00:00',
        },
      ],
    },
    address: {
      addressLine1: cd['Address Line 1'],
      city: 'Kingston',
      addressTypeCd: 'other',
      countryCd: geo.countryCd,
      districtCd: geo.districtCd,
      parishCd: geo.parishCd,
      postalCode: cd['ZIP/Post Code'] || '00000',
      stateProvCd: geo.stateProvCd,
    },
  };

  const vehicle: components['schemas']['PrecAuVehicleCreateRequest'] = {
    year: '2024',
    make: 'HONDA',
    model: 'CIVIC',
    bodyType: 'SEDAN 4D',
    performanceCd: 'A',
    vehTypeCd: 'PrivateMotor',
    vehicleUsageCd: 'PL',
    coverageTypeCd: 'Comprehensive',
    packageCd: options.packageCd,
    marketValue,
    engineSize: '1600',
    declaredAnnualMiles: '8000_11999',
    distanceForPleasurePerWeek: 100,
    purchasedNew: false,
    writtenOffInd: false,
    threeNamedDriversInd: false,
    vin,
    registeredOwner: {
      firstName: insuredAndDriver.firstName!,
      lastName: insuredAndDriver.lastName!,
      registrationTypeCd: 'SNGL',
    },
    registeredStateCd: geo.stateProvCd,
    additionalInterests: [
      {
        name: 'Automation interest',
        interestTypeCd: 'Lender',
        addressLine1: cd['Address Line 1'],
        countryCd: geo.countryCd,
        parishCd: geo.parishCd,
        districtCd: geo.districtCd,
      },
    ],
    coverages: {
      excess: 'ONEMIN750',
      bodyInjuryLimitCd: '5000000/5000000',
      propertyDamageLimitCd: '5000000',
    },
    features: {
      antiLockBrakeCd: 'NO DISCOUNT',
      armoredInd: false,
      daytimeRunningLampsInd: false,
      securityOptionsCd: 'None',
    },
  };

  return {
    customerNumber,
    contractTermTypeCd: '12',
    countryCd: geo.countryCd,
    coverageTypeCd: 'Comprehensive',
    currencyCode: geo.currencyCd,
    effectiveDate,
    premiumFinancing: false,
    riskStateCd: geo.stateProvCd,
    branchCd: geo.branchCd,
    insuredsAndDrivers: [insuredAndDriver],
    vehicles: [vehicle],
  };
}

function pickPlanCd(plans: PaymentPlanSummary[]): string {
  const enabled = plans.filter((p) => p.enabledForNewBusiness !== false && p.planCd);
  const full =
    enabled.find((p) => (p.planCd ?? '').toLowerCase().includes('full')) ??
    enabled.find((p) => (p.planCd ?? '').toLowerCase().includes('annual')) ??
    enabled[0];
  if (!full?.planCd) {
    throw new Error('DXP: no payment plan returned from available-payment-plans');
  }
  return full.planCd;
}

function buildPurchaseRequest(
  details: CustomerInformation,
  planCd: string
): PurchaseRequest {
  const gi = details.generalInformation;
  const cd = details.contactDetails;
  const geo = jmGeo();
  const firstName = gi['First Name'].replace(/-Automation$/, '');
  const lastName = gi['Last Name'];
  return {
    billingAccount: {
      billType: 'direct',
      createNewAccount: true,
      identificationNumber: gi['Identification Number'],
      trn: gi['Identification Number'],
      accountName: `${firstName} ${lastName}`,
      branch: geo.branchCd,
      currency: geo.currencyCd,
      dueDayConfig: { type: 'monthly', monthDays: [1] },
      billingAddress: {
        addressLine1: cd['Address Line 1'],
        city: 'Kingston',
        countryCd: geo.countryCd,
        districtCd: geo.districtCd,
        parishCd: geo.parishCd,
        postalCode: cd['ZIP/Post Code'] || '00000',
        stateProvCd: geo.stateProvCd,
      },
      billingContact: {
        type: 'IND',
        firstName,
        lastName,
      },
      email: cd['Email'],
      phoneNumber: cd['Phone Number']?.replace(/\D/g, '').slice(0, 15),
    },
    defaultPaymentMethod: {
      billingAccountPaymentMethod: { paymentMethodType: 'cheque' },
      policyTermPaymentMethod: { paymentMethodType: 'cheque' },
    },
    paymentPlanOption: {
      paymentPlanCd: planCd,
    },
  };
}

/**
 * Creates a lead, auto quote, rates, purchases, and pays in full via DXP (guest Basic).
 * Requires DXP_API_BASE_URL, guest + agent credentials, and correct JM lookup codes in env for your environment.
 */
export async function issueJamaicaPrivateMotorPolicyViaDxp(
  options: IssueJamaicaPrivateMotorPolicyOptions,
  client: DxpClient = createDxpClient()
): Promise<IssuedJamaicaPrivateMotorPolicy> {
  if (!isDxpIssuanceConfigured()) {
    throw new Error(
      'DXP issuance is not configured (need DXP_API_BASE_URL, guest Basic, and agent Basic / EIS credentials)'
    );
  }

  const customerDetails = generateCustomerInformation(
    options.customerAge,
    'Jamaica'
  ) as CustomerInformation;

  const leadBody = buildLeadBody(customerDetails);
  let leadResult: LeadCreationResult;
  try {
    leadResult = await client.requestJson<LeadCreationResult>({
      method: 'POST',
      path: '/quickquote/v1/leads/find-or-create',
      persona: 'guest',
      body: leadBody,
    });
  } catch (error) {
    if (error instanceof DxpHttpError && error.status === 422) {
      const redactedLead = redactLeadBodyForLogs(leadBody);
      throw new Error(
        [
          'DXP lead validation failed (422) at /quickquote/v1/leads/find-or-create.',
          'This is usually caused by environment-specific lookup codes (country/state/parish/district/occupation/sourceOfFund).',
          `Response: ${error.bodyText ?? 'no response body'}`,
          `Lead payload (redacted): ${JSON.stringify(redactedLead)}`,
          'Set/adjust DXP_JM_COUNTRY_CD, DXP_JM_STATE_PROV_CD, DXP_JM_PARISH_CD, DXP_JM_DISTRICT_CD (and, if needed, update code mappings in buildLeadBody()).',
        ].join('\n')
      );
    }
    throw error;
  }
  const customerNumber = leadResult.customerNumber;  if (!customerNumber) {
    throw new Error('DXP lead find-or-create did not return customerNumber');
  }

  const productCd = 'PREC-AU';
  const geo = jmGeo();
  const plans = await client.requestJson<PaymentPlanSummary[]>({
    method: 'GET',
    path: '/quickquote/v1/quotes/available-payment-plans',
    persona: 'guest',
    query: { productCd, countryCd: geo.countryCd },
  });
  const planCd = pickPlanCd(plans ?? []);

  const quoteBody = buildQuoteCreateRequest(customerNumber, customerDetails, options);
  const created = await client.requestJson<PrecAuQuoteCreateUpdateResponse>({
    method: 'POST',
    path: '/quickquote-auto/v1/quotes',
    persona: 'guest',
    body: quoteBody,
  });
  const policyNumber = created.policyNumber;  if (!policyNumber) {
    throw new Error('DXP create quote did not return policyNumber');
  }

  const effectiveDateStr = quoteBody.effectiveDate!.slice(0, 10);

  try {
    await client.requestJson<unknown>({
      method: 'POST',
      path: `/quickquote-auto/v1/quotes/${encodeURIComponent(policyNumber)}/update-funding-summary`,
      persona: 'guest',
      query: {
        deposit: 0,
        planCd,
        effectiveDate: effectiveDateStr,
      },
    });
  } catch (error) {
    // Some environments throw gateway 500 here when quote paymentPlan is not initialized yet.
    // We can proceed because planCd is still applied during rate and purchase.
    const message =
      error instanceof Error ? error.message : String(error);
    const canContinue =
      error instanceof DxpHttpError &&
      error.status >= 500 &&
      message.includes('paymentPlan') &&
      message.includes('null');
    if (!canContinue) {
      throw error;
    }
  }

  const rated = await client.requestJson<BcicPolicyRateResponse>({
    method: 'POST',
    path: `/quickquote-auto/v1/quotes/${encodeURIComponent(policyNumber)}/rate`,
    persona: 'guest',
    query: { planCd },
  });

  const purchaseBody = buildPurchaseRequest(customerDetails, planCd);
  await client.requestJson<PurchaseResponse>({
    method: 'POST',
    path: `/quickquote/v1/quotes/${encodeURIComponent(policyNumber)}/purchase`,
    persona: 'guest',
    body: purchaseBody,
  });

  const totalDue = rated.totalDue ?? rated.termPremium ?? rated.fullTermPremium;
  if (totalDue === undefined || totalDue === null) {
    throw new Error('DXP rate response did not include totalDue/termPremium');
  }

  await client.requestJson<unknown>({
    method: 'POST',
    path: `/quickquote/v1/quotes/${encodeURIComponent(policyNumber)}/make-payment`,
    persona: 'guest',
    query: { policyEffectiveDate: effectiveDateStr },
    body: {
      amount: { currencyCd: geo.currencyCd, value: totalDue },
      paymentMethodDetails: { paymentMethodType: 'cheque' },
    },
  });

  return {
    customerNumber,
    customerId: customerNumber,
    policyNumber,
    customerDetails,
  };
}
