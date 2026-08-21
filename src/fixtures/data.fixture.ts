import {
  createCheckoutCustomer,
  type CheckoutCustomerOverrides,
} from '../data/factories/customer.factory.js';
import { createPost } from '../data/factories/post.factory.js';

export interface DataFactory {
  checkoutCustomer(
    overrides?: CheckoutCustomerOverrides,
  ): ReturnType<typeof createCheckoutCustomer>;
  post(overrides?: Parameters<typeof createPost>[0]): ReturnType<typeof createPost>;
}

export const dataFactory: DataFactory = {
  checkoutCustomer: createCheckoutCustomer,
  post: createPost,
};
