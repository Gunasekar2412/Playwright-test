export const executionContext = {
    policyNumber: '',
    policyStatus: '',
    customerId: '',
    customerName: '',
    customerDetails: '',
    region: '',
    premium: ''
};

export function resetExecutionContext() {
    executionContext.policyNumber = '';
    executionContext.policyStatus = '';
    executionContext.customerId = '';
    executionContext.customerName = '';
    executionContext.customerDetails = '';
    executionContext.region = '';
    executionContext.premium = '';
}
