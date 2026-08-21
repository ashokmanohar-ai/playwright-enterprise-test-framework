import { randomUUID } from 'node:crypto';

import type { CheckoutCustomer } from '../../pages/checkout.page.js';

export type CheckoutCustomerOverrides = Partial<CheckoutCustomer>;

export function createCheckoutCustomer(
  overrides: CheckoutCustomerOverrides = {},
): CheckoutCustomer {
  const suffix = randomUUID().slice(0, 8);
  return {
    firstName: 'Quality',
    lastName: `Engineer-${suffix}`,
    postalCode: 'SW1A 1AA',
    ...overrides,
  };
}
