interface VehicleRequiredInformation {
  generalInformation: {
    chassisVIN: string;
    modelYear: string;
    make: string;
    model: string;
    bodyType: string;
    performance: string;
    sumInsured: string;
  };
  vehicleUseDetail: {
    writtenOff: "Yes" | "No" | null;
  };
  vehicleGaraging: {
    country: string;
    addressLine1: string;
    parish: string;
  };
  registeredOwner: {
    firstName: string;
    lastName: string;
  };
}

const coverageType = [
  'Private Car Comprehensive',
  'Private Car Third Party',
  'Private Car Third Party, Fire, and Theft',
  'Private Car Third Party plus Repair',
  'Private Car A La Carte'
]

const planSelection = {
  'Private Car Comprehensive': [
    'Standard w/o Rental Benefits',
    'Standard w Rental Benefits',
    'Diamond Max w/o Rental Benefits',
    'Diamond Max w Rental Benefits'
  ],
  'Private Car Third Party': [
    'Standard',
    'Smallz'
  ],
  'Private Car Third Party, Fire, and Theft': [
    'Standard w/o Rental Benefits',
    'Standard w Rental Benefits',
  ],
  'Private Car Third Party plus Repair': [
    'Standard',
  ],
  'Private Car A La Carte': [
    'A La Carte'
  ]
}

const existingCustomers = [
  // {
  //   customerId: '510021',
  //   insuredName: 'Melissa James'
  // },
  {
    customerId: '511006',
    insuredName: 'Polly Mathew',
  }
]

const existingDriver = {
    // customerId: '510021',
    // name: 'Melissa James'
    id: '511006',
    name: 'Polly Mathew',
    licenseType: 'Permanent', 
    licenseStatus: 'Valid'
}


export {
  coverageType,
  planSelection,
  existingCustomers,
  VehicleRequiredInformation,
  existingDriver
}