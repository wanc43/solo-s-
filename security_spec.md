# Security Specification for SOLO Electronics Store

## Data Invariants
1. **Users**: A user can only read and write their own profile. Only admins can see all users.
2. **Products**: Anyone can read products. Only admins can create, update, or delete products.
3. **Categories**: Anyone can read categories. Only admins can modify them.
4. **Carts**: A user can only read and write their own cart.
5. **Wishlists**: A user can only read and write their own wishlist.
6. **Orders**: A user can only read and write their own orders. Only admins can see all orders and update statuses.

## The "Dirty Dozen" Payloads (To Be Blocked)
1. **Identity Spoofing**: Attempt to create a user profile for a different UID.
2. **Role Escalation**: A customer attempting to update their role to 'admin'.
3. **Product Poisoning**: A customer attempting to update the price of a product.
4. **Cart Hijacking**: A user attempting to read another user's cart.
5. **Order Manipulation**: A user attempting to change an order status to 'delivered' for their own order.
6. **Orphaned Orders**: Creating an order without valid product IDs.
7. **Junk ID**: Creating a document with a 1MB string as the ID.
8. **Shadow Fields**: Adding an `isVerified` field to a user profile that isn't in the schema.
9. **Timestamp Spoofing**: Setting a `createdAt` date in the past.
10. **Wishlist Overflow**: Adding 10,000 items to a wishlist array.
11. **Negative Price**: Creating a product with a negative price.
12. **Anonymous Admin**: Attempting admin actions without being in the `admins` collection.

## Test Strategy (firestore.rules.test.ts)
We will use `@firebase/rules-unit-testing` to verify these invariants.
