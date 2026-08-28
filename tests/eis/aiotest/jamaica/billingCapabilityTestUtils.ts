import { BillingPage } from '../../../../sites/eis/pages/BillingPage';
import {
    BillingCapabilityPolicy
} from '../../../../sites/eis/aiotest/helpers/billingCapabilityPolicyFactories';
import { executionContext } from '../../../../lib/aio/executionContext';

export function recordBillingPolicy(
    policy: BillingCapabilityPolicy,
    premium?: string
): void {
    executionContext.customerId = policy.customerId;
    executionContext.customerName = policy.customerName;
    executionContext.policyNumber = policy.policyNumber;
    executionContext.policyStatus = policy.policyStatus;
    if (premium) executionContext.premium = premium;
}

export async function verifyJamaicaBillingCapabilities(
    billingPage: BillingPage,
    policy: BillingCapabilityPolicy
): Promise<void> {
    await billingPage.verifyBillingAccountForPolicy({
        customerName: policy.customerName,
        policyNumber: policy.policyNumber,
        currency: 'JMD'
    });
    await billingPage.acceptCashPayment('50.00', 'JMD');
    await billingPage.declineAcceptedPayment({
        amount: '50.00',
        currency: 'JMD'
    });
}
