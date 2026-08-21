export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export const checkoutBoundaryCases = [
  { field: 'firstName', value: '', expected: 'First Name is required' },
  { field: 'lastName', value: '', expected: 'Last Name is required' },
  { field: 'postalCode', value: '', expected: 'Postal Code is required' },
] as const;
