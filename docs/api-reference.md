# API Reference

## Cart Cleanup System

### Cleanup Cron Endpoint

**Endpoint**: `GET /api/cron/cleanup-carts`  
**Purpose**: Automated cleanup of orphaned anonymous carts  
**Authentication**: Bearer token required

#### Headers
```
Authorization: Bearer <CRON_SECRET>
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Cleaned up 3 orphaned carts and restored 15 products",
  "data": {
    "cleanedCarts": 3,
    "restoredProducts": 15
  }
}
```

**Error (401)**
```json
{
  "error": "Unauthorized"
}
```

**Error (500)**
```json
{
  "error": "Internal server error"
}
```

#### Usage
This endpoint is called automatically by Vercel cron every 15 minutes. Manual testing:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-app.vercel.app/api/cron/cleanup-carts
```

---

## Cart Actions

### Add to Cart

**Server Action**: `AddToCartServerAction(cartItem: CartItemType)`  
**Purpose**: Add item to cart with rate limiting

#### Rate Limiting
- **Limit**: Configurable via `CART_RATE_LIMIT_PER_HOUR` environment variable (defaults to 5 new carts per IP per hour)
- **Scope**: Only applies to NEW cart creation
- **Error**: "Too many cart operations. Please try again later."

#### Input
```typescript
interface CartItemType {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}
```

#### Response
```typescript
interface GenericResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
```

### Remove from Cart

**Server Action**: `RemoveFromCartServerAction(cartItemId: string, cartItemSlug: string, cartItemName: string)`  
**Purpose**: Remove item from cart and restore stock

### Get Cart

**Server Action**: `GetCartAction()`  
**Purpose**: Retrieve current user's cart

### Cart Migration

**Server Action**: `MigrateSessionCartToUserAction(userId: string)`  
**Purpose**: Migrate anonymous cart to user account

**Server Action**: `RollbackCartMigrationAction(cartId: string, sessionCartId: string)`  
**Purpose**: Rollback cart migration if authentication fails

### Cleanup

**Server Action**: `CleanupOrphanedCartsAction()`  
**Purpose**: Clean up orphaned carts (used by cron job)

---

## Authentication

### Sign In

**Server Action**: `SignInServerAction(prevState: GenericResponse<null>, formData: FormData)`  
**Purpose**: Authenticate user and migrate cart

### Sign Up

**Server Action**: `SignUpServerAction(prevState: GenericResponse<unknown>, formData: FormData)`  
**Purpose**: Create user account and migrate cart

### Sign Out

**Server Action**: `SignOutServerAction()`  
**Purpose**: Sign out user and redirect to sign-in page

---

## Error Handling

### Common Error Responses

#### Rate Limit Exceeded
```json
{
  "success": false,
  "message": "Too many cart operations. Please try again later."
}
```

#### Cart Not Found
```json
{
  "success": false,
  "message": "Cart doesn't exist"
}
```

#### Product Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

#### Insufficient Stock
```json
{
  "success": false,
  "message": "Stock is not enough"
}
```

#### Validation Error
```json
{
  "success": false,
  "message": "Validation error details",
  "data": {
    "field": "error message"
  }
}
```

---

## Rate Limiting Details

### Implementation
- **Storage**: In-memory Map
- **Key**: Client IP address
- **Value**: `{ count: number, resetAt: Date }`
- **Reset**: After 1 hour per IP
- **Limit**: Configurable via `CART_RATE_LIMIT_PER_HOUR` environment variable (defaults to 5)

### Configuration
Set the `CART_RATE_LIMIT_PER_HOUR` environment variable to customize the rate limit:
```env
# Default: 5 carts per hour
CART_RATE_LIMIT_PER_HOUR=5

# More lenient: 10 carts per hour
CART_RATE_LIMIT_PER_HOUR=10

# Stricter: 3 carts per hour
CART_RATE_LIMIT_PER_HOUR=3
```

### IP Detection Priority
1. `x-forwarded-for` header (first IP)
2. `x-real-ip` header
3. `'unknown'` fallback

### Headers Checked
```
x-forwarded-for: 192.168.1.1, 10.0.0.1
x-real-ip: 192.168.1.1
```

---

## Database Schema

### Cart Table
```sql
CREATE TABLE "Cart" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "User"("id"),
  "sessionCartId" TEXT NOT NULL,
  "items" JSON[] DEFAULT ARRAY[]::JSON[],
  "itemsPrice" DECIMAL(12,2) NOT NULL,
  "taxPrice" DECIMAL(12,2) NOT NULL,
  "shippingPrice" DECIMAL(12,2) NOT NULL,
  "totalPrice" DECIMAL(12,2) NOT NULL,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Cleanup Query
```sql
SELECT * FROM "Cart" 
WHERE "userId" IS NULL 
AND "createdAt" < (NOW() - INTERVAL '2 hours');
```

---

## Testing

### Manual Testing

#### Test Rate Limiting
```bash
# Make 6 requests quickly to trigger rate limit
for i in {1..6}; do
  curl -X POST /api/cart/add \
       -H "Content-Type: application/json" \
       -d '{"productId":"test","name":"Test","slug":"test","price":10,"quantity":1,"image":"test.jpg"}'
done
```

#### Test Cleanup
```bash
# Call cleanup endpoint manually
curl -H "Authorization: Bearer $CRON_SECRET" \
     https://your-app.vercel.app/api/cron/cleanup-carts
```

#### Test Cart Migration
```typescript
// In browser console after adding items to cart
await fetch('/api/auth/signin', {
  method: 'POST',
  body: new FormData(form)
});
```

---

## Monitoring

### Key Metrics
- **Cleanup Frequency**: Should run every 15 minutes
- **Orphaned Cart Count**: Track over time
- **Rate Limit Hits**: Monitor blocked requests
- **Stock Restoration**: Track restored quantities
- **Error Rates**: Monitor API failures

### Logs to Watch
```bash
# Vercel function logs
vercel logs --follow

# Look for these patterns:
# "Cleaned up X orphaned carts"
# "Too many cart operations"
# "Failed to restore stock"
# "CRON_SECRET not configured"
```
