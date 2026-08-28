import { test } from '../../../../lib/aio/aioHooks';
import { RatingPage } from '../../../../sites/eis/pages/RatingPage';
import { CustomerPage } from '../../../../sites/eis/pages/CustomerPage';
import { PolicyPage } from '../../../../sites/eis/pages/PolicyPage';
import { CommissionPage } from '../../../../sites/eis/pages/CommissionPage';
import { executionContext } from '../../../../lib/aio/executionContext';
import {
    createJamaicaPrivateMotorPolicy,
    selectJamaicaCommissionProducer
} from './privateMotorCommissionTestUtils';

test.setTimeout(720_000);

test('Successfully create a Private Motor Broker policy - Jamaica', { tag: '@ECP-TC-62' }, async ({ page }) => {
    const ratingPage = new RatingPage(page);
    const customerPage = new CustomerPage(page);
    const policyPage = new PolicyPage(page);
    const commissionPage = new CommissionPage(page);
    executionContext.region = 'Jamaica';

    await ratingPage.login(process.env.EIS_USERNAME!, process.env.EIS_PASSWORD!);
    const { group, producer } = await test.step('Select Jamaica Broker commission group', () =>
        selectJamaicaCommissionProducer(commissionPage));
    const policy = await test.step('Create and purchase Jamaica Broker policy', () =>
        createJamaicaPrivateMotorPolicy(
            page, ratingPage, customerPage, policyPage, commissionPage,
            producer,
            group.commissionRate,
            undefined,
            'FIVEMIN15000MAX450KJMD'
        ));

    executionContext.customerName = policy.customerName;
    executionContext.customerId = policy.customerId;
    executionContext.policyNumber = policy.policyNumber;
    executionContext.policyStatus = 'Policy Active';
    executionContext.premium = policy.premium.toString();
    executionContext.customerDetails = `Broker: ${producer.name}; Commission group: ${group.groupName}`;
});
