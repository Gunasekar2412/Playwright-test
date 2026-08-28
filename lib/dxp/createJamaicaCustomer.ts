import type { components } from './types/dxp-api';
import { createDxpClient, type DxpClient, DxpHttpError } from './client';
import { isDxpIssuanceConfigured } from './config';
import {
  generateCustomerInformation,
  type CustomerInformation,
} from '../../sites/eis/data/CustomerData';

type BcicLeadCreateRequest = components['schemas']['BcicLeadCreateRequest'];
type LeadCreationResult = components['schemas']['LeadCreationResult'];

export interface CreateJamaicaCustomerViaDxpOptions {
  age?: number;
  country?: 'Jamaica';
  deceased?: boolean;
  segments?: string[];
}

export interface DxpCreatedCustomer {
  customerId: string;
  customerNumber: string;
  customerName: string;
  customerDetails: CustomerInformation;
}

function jmGeo() {
  return {
    countryCd: process.env.DXP_JM_COUNTRY_CD?.trim() || 'JM',
    stateProvCd: process.env.DXP_JM_STATE_PROV_CD?.trim() || 'JM-01',
    parishCd: process.env.DXP_JM_PARISH_CD?.trim() || 'JM-01',
    districtCd: process.env.DXP_JM_DISTRICT_CD?.trim() || 'JM-01',
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
    identificationTypeCd: 'DL',
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

export async function createJamaicaCustomerViaDxp(
  options: CreateJamaicaCustomerViaDxpOptions = {},
  client: DxpClient = createDxpClient()
): Promise<DxpCreatedCustomer> {
  if (!isDxpIssuanceConfigured()) {
    throw new Error(
      'DXP customer setup is not configured (need DXP_API_BASE_URL, guest Basic, and agent Basic / EIS credentials)'
    );
  }

  const details = generateCustomerInformation(
    options.age ?? 40,
    options.country ?? 'Jamaica',
    { deceased: options.deceased, segments: options.segments }
  ) as CustomerInformation;

  const leadBody = buildLeadBody(details);
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
      throw new Error(
        [
          'DXP lead validation failed (422) at /quickquote/v1/leads/find-or-create.',
          `Response: ${error.bodyText ?? 'no response body'}`,
          `Lead payload (redacted): ${JSON.stringify(redactLeadBodyForLogs(leadBody))}`,
        ].join('\n')
      );
    }
    throw error;
  }

  const customerNumber = leadResult.customerNumber?.trim();
  if (!customerNumber) {
    throw new Error('DXP lead find-or-create did not return customerNumber');
  }

  const customerName = `${details.generalInformation['First Name']} ${details.generalInformation['Last Name']}`;
  return {
    customerId: customerNumber,
    customerNumber,
    customerName,
    customerDetails: details,
  };
}
