import { faker } from '@faker-js/faker';
import { generateDob } from '../../../lib/utils';

// Here we either define the selections fof particular data inputs,
// or we specify the form of that data via regex

// General Information
const identificationType = [
  'Driver Licence',
  'Passport',
  'NID',
  'Voter ID'
]

const dateOfBirth = /\d{2}\/\d{2}\/\d{4}/; // Too simple need to extend this

const gender = [
  "Male",
  "Female",
  "Non Conforming"
]

const underwriterReview = [
  "", "Moral Hazard", "Frequent Claims/Adverse History", "Suspicious Activity",
  "Advised by international/Local authority not to renew", "Insured is deceased"]


// Contact Details

const addressType = [
  "Mailing",
  "Residence",
  "Previous",
  "Other"
]

// TODO: This is dynamic based on country might just define the regex for this one
const stateProvince = [];

const addressLine1 = /\w+/g;

// Sales Info
const leadSource = [
  'Advertisement (Television, Radio, Newspaper)',
  'Current customer',
  'Social Media',
  'Referred by a family member/friend',
  'Other',
  'Unknown'
]

const rating = [
  "Hot",
  "Warm",
  "Cold",
  "Unknown"
]

// Additional Information fields
const occupation = [
  "Account Executive/Call Center Worker", "Administrative Clerk/Secretary/Telephone Operator", "Bearer", "Factory Worker/Skilled Worker",
  "Farmer/Farm Worker", "Financial Officer/Internal Auditor", "Hairdresser/Barber", "Health Care Professional", "Helper/Gardner",
  "Housewife", "Insurance Professional", "IT Specialist/Technician", "Law Enforcement Professional", "Lawyer",
  "Marketing Professional", "Minister of Religion/Religious Officer", "Musician/Actor/Radio Announcer/Journalist", "Other", "Retired",
  "Security Guard/Watchman", "Senior Executive", "Shopkeeper/Bar Operator", "Student", "Supervisor/Middle Manager",
  "Taxi Owner/Taxi Driver/Bus Driver/Conductor", "Tradesman (Plumer, carpenter, painter, etc.)", "University Lecturer/Teacher/Professor", "Vendor"
];

const employmentStatus = [
  "EMP_FT",
  "EMP_PT",
  "EMP_SLF",
  "UEMP",
  "RET",
  "STUD"
];

const sourceOfFund = [
  'Dividends',
  'Gambling winnings',
  'Gifts',
  'Inheritances',
  'Pension releases',
  'Personal savings',
  'Property sales',
  'Other',
  'Salary',
  'Share sales'
]

const errorMessages = {
  trn: {
    "< 9 digits": "Only positive integer numbers are allowed in range of 100000000 to 999999999",
    "> 9 digits": "Should not exceed 9 symbols"
  }
}

export interface CustomerInformation {
  generalInformation: {
    "Identification Type": string;
    "Identification Number": string;
    "First Name": string;
    "Last Name": string;
    "Date of Birth": string;
    "Gender": string;
    "Nationality": string;
  };
  contactDetails: {
    "Address Type": string;
    "Country": string;
    "ZIP/Post Code": string;
    "Parish"?: string;
    "State/Province"?: string;
    "Address Line 1": string;
    "Phone Number": string;
    "Email": string;
  };
  additionalInformation: {
    "Occupation": string;
    "Employment Status": string;
    "Source of fund": string;
    "Prominent Person": string;
    "Employer": string;
    "Organization"?: string;
    "Title"?: string;
    "Deceased"?: string;
  };
  segments?: string[];
}

export interface NonIndividualCustomerInformation {
  generalInformation: {
    "Non-Individual Type": string;
    "Name - Legal": string;
    "Trading As": string;
    "Associate Divisions": string;
    "Associate Divisions Checkbox": boolean;
    "Lead Status": string;
    "Customer Risk Category": string;
    "Underwriter Review": string;
    "Brand Name": string;
    "Brand Type": string;
    "Brand Code": string;
  };
  contactDetails: {
    "Address Type": string;
    "Country": string;
    "Zip/Post Code": string;
    "City": string;
    "State/Province": string;
    "Parish": string;
    "Address Line 1": string;
    "Address Line 2": string;
    "Address Line 3": string;
    "In care of": string;
    "Attention": string;
    "County": string;
    "Subdivision, military, organization, other": string;
    "Latitude": string;
    "Longitude": string;
    "Accuracy": string;
    "Reference ID": string;
    "Make Preferred": string;
    "Comment": string;
    "Communication Preferences": string;
    "Temporary": boolean;
    "Phone Number": string;
    "Email": string;
  };
  salesInfo: {
    "Lead Source": string;
    "Rating": string;
  };
  businessInformation: {
    "Company Number/Taxpayer Registration Number": string;
    "Date business started": string;
    "Number of continuous years in the field": string;
    "Number of Employees": string;
    "Description": string;
    "Tax Exempt": boolean;
    "Group Sponsor": boolean;
    "Entity Type": string;
  };
  additionalInformation: {
    "Primary Contact Preference": string;
    "Use as Reference?": string;
    "Is a related party?": string;
    "Prominent Person Question": string;
    "Title": string;
    "Name of the organization": string;
    "Special Claim Review": boolean;
    "Paperless": boolean;
    "Registered Online": boolean;
    "segments": string[];
  };
}

export type CustomerType = 'Individual' | 'Non-Individual';

export type AnyCustomerInformation = CustomerInformation | NonIndividualCustomerInformation;

function generateNonIndividualCustomerInformation(
  nationality: string = 'Jamaica', 
  options?: { segments?: string[] }
): NonIndividualCustomerInformation {
  const nonIndividualType = ['Corporation', 'Partnership', 'Joint Venture', 'LLC', 'Not For Profit Organization', 'Limited Partnership'];
  const customerRiskCategory = ['High', 'Medium', 'Low'];
  
  const selectedType = nonIndividualType[Math.floor(Math.random() * nonIndividualType.length)];
  const selectedRiskCategory = customerRiskCategory[Math.floor(Math.random() * customerRiskCategory.length)];
  
  const companyName = faker.company.name();
  const tradingAs = faker.company.buzzNoun();

  const prominentPersonQuestion = Math.random() > 0.9 ? 'Yes' : 'No';
  
  return {
    generalInformation: {
      "Non-Individual Type": selectedType,
      "Name - Legal": companyName,
      "Trading As": '',
      "Associate Divisions": faker.company.name() + ' Division',
      "Associate Divisions Checkbox": false,
      "Lead Status": '',
      "Customer Risk Category": '',
      "Underwriter Review": '',
      "Brand Name": '',
      "Brand Type": '',
      "Brand Code": ''
    },
    contactDetails: {
      "Address Type": 'Legal',
      "Country": nationality,
      "Zip/Post Code": nationality.toLowerCase() === 'united states' ? '90043' : '00000',
      "City": '',
      "State/Province": nationality.toLowerCase() === 'united states' ? 'CA' : '',
      "Parish": nationality.toLowerCase() === 'jamaica' || nationality.toLowerCase() === 'barbados' ? 'St. Andrew' : '',
      "Address Line 1": faker.location.streetAddress(),
      "Address Line 2": faker.location.secondaryAddress(),
      "Address Line 3": '',
      "In care of": '',
      "Attention": '',
      "County": '',
      "Subdivision, military, organization, other": '',
      "Latitude": '',
      "Longitude": '',
      "Accuracy": '',
      "Reference ID": '',
      "Make Preferred": '',
      "Comment": '',
      "Communication Preferences": '',
      "Temporary": false,
      "Phone Number": faker.phone.number({ style: 'national' }),
      "Email": 'jegadeeshwaranm@bcicjamaica.com'
    },
    salesInfo: {
      "Lead Source": '',
      "Rating": '',
    },
    businessInformation: {
      "Company Number/Taxpayer Registration Number": '',
      "Date business started": '',
      "Number of continuous years in the field": '',
      "Number of Employees": '',
      "Description": '',
      "Tax Exempt": false,
      "Group Sponsor": false,
      "Entity Type": ''
    },
    additionalInformation: {
      "Primary Contact Preference": 'Email',
      "Use as Reference?": '',
      "Is a related party?": '',
      "Prominent Person Question": prominentPersonQuestion,
      "Title": prominentPersonQuestion === 'Yes' ? 'Minister of Finance' : '',
      "Name of the organization": prominentPersonQuestion === 'Yes' ? 'JLP' : '',
      "Special Claim Review": false,
      "Paperless": false,
      "Registered Online": false,
      "segments": options?.segments || []
    }
  };
}

function generateCustomerInformation(
  age?: number,
  nationality: string = 'Jamaica',
  options?: {
    deceased?: boolean,
    segments?: string[],
    customerType?: CustomerType
  }
): AnyCustomerInformation {
  const customerType = options?.customerType || 'Individual';

  if (customerType === 'Non-Individual') {
    return generateNonIndividualCustomerInformation(nationality, options);
  }

  // Existing individual customer generation logic
  let dateOfBirth = '15/12/1993';
  if (typeof age === 'number' && age > 0) {
    dateOfBirth = generateDob(age);
  }
  // Determine parish based on nationality
  let parish = 'St. Andrew';
  let prominentPerson = 'Yes';

  if ((nationality || '').toLowerCase() === 'barbados') {
    parish = 'St. Michael';
  }
  if ((nationality || '').toLowerCase() === 'canada') {
    parish = '';
    prominentPerson = 'No';
  }

  // Ensure deceased defaults to false unless explicitly set to true
  const isDeceased = options?.deceased === true;
  const firstName = faker.person.firstName() + "-Automation";
  const lastName = faker.person.lastName();

  const customer: CustomerInformation = {
    'generalInformation': {
      "Identification Type": identificationType[0],
      "Identification Number": Math.floor(100000000 + Math.random() * 900000000).toString(),
      "First Name": firstName,
      "Last Name": lastName,
      "Date of Birth": dateOfBirth,
      "Gender": gender[0],
      "Nationality": nationality
    },
    'contactDetails': {
      'Address Type': addressType[1],
      'Country': nationality,
      'ZIP/Post Code': '00000',
      'Parish': parish,
      'Address Line 1': faker.location.streetAddress(),
      'Phone Number': faker.phone.number({ style: 'national' }),
      'Email': 'jegadeeshwaranm@bcicjamaica.com'
    },
    'additionalInformation': {
      'Occupation': occupation[Math.floor(Math.random() * occupation.length)],
      'Employment Status': employmentStatus[0],
      'Source of fund': sourceOfFund[8],
      'Prominent Person': prominentPerson,
      'Employer': faker.company.name(),
      'Organization': faker.company.name(),
      'Title': faker.person.jobTitle(),
      'Deceased': isDeceased ? 'Yes' : 'No'
    }
  };
  if (options?.segments) {
    customer.segments = options.segments;
  }
  return customer;
}

const companyName = faker.company.name() + "-Automation";
// Non-Individual customer section is not built out as yet
const nonIndividualRequired: object = {
  'generalInformation': {
    "Non-Individual Type": 'Corporation',
    "Name - Legal": companyName,
    "Trading As": 'TestCorp',
    "Associate Divisions": 'Test Division',
    "Associate Divisions Checkbox": true,
    "Lead Status": 'Qualified',
    "Customer Risk Category": 'Medium',
    "Underwriter Review": underwriterReview[Math.floor(Math.random() * underwriterReview.length)],
    "Brand Name": 'TestBrand',
    "Brand Type": 'Corporate',
    "Brand Code": 'TB001'
  },
  'contactDetails': {
    'Address Type': 'Legal',
    'Country': 'United States',
    'Zip/Post Code': '12345',
    'City': 'Test City',
    'State/Province': 'Test State',
    'Parish': '',
    'Address Line 1': '123 Test Street',
    'Address Line 2': 'Suite 100',
    'Address Line 3': '',
    'In care of': '',
    'Attention': 'Test Contact',
    'County': 'Test County',
    'Subdivision, military, organization, other': '',
    'Latitude': '',
    'Longitude': '',
    'Accuracy': '',
    'Reference ID': '',
    'Make Preferred': 'Yes',
    'Comment': 'Test comment',
    'Communication Preferences': 'Email',
    'Temporary': false,
    'Phone Number': faker.phone.number({ style: 'national' }),
    // 'Email': faker.internet.email({ firstName: companyName, provider: 'test.com' })
    'Email': 'jegadeeshwaranm@bcicjamaica.com'
  },
  'salesInfo': {
    'Lead Source': 'Current customer',
    'Rating': 'Warm',
  },
  'businessInformation': {
    'Company Number/Taxpayer Registration Number': '28-9128282',
    'Date business started': '01/01/2020',
    'Number of continuous years in the field': '5',
    'Number of Employees': '100',
    'Description': 'Test corporation for automation testing',
    'Tax Exempt': false,
    'Group Sponsor': false,
    'Entity Type': 'Corporation'
  },
  'additionalInformation': {
    'Primary Contact Preference': 'Email',
    'Use as Reference?': 'No',
    'Is a related party?': 'No',
    'Prominent Person Question': 'No',
    'Title': 'CEO',
    'Name of the organization': 'Test Corporation Inc.',
    'Special Claim Review': false,
    'Paperless': true,
    'Registered Online': true,
    'segments': ['VIP']
  }
}

export {
  errorMessages,
  nonIndividualRequired,
  generateCustomerInformation,
  generateNonIndividualCustomerInformation,
  gender,
  occupation,
  employmentStatus,
  sourceOfFund
}

