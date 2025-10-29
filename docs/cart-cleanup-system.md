# Cart Cleanup & Rate Limiting System

## Overview

The Cart Cleanup & Rate Limiting System is a comprehensive solution designed to prevent abuse and maintain data integrity in the e-commerce application. It addresses the critical issue of orphaned anonymous carts that can lock product inventory indefinitely.

## Problem Statement

### The Issue
Anonymous users can:
1. Add items to their cart (reducing product stock)
2. Delete their session cookie (`CART_ID_SESSION`)
3. Refresh the page to get a new session cookie
4. Repeat this process indefinitely

This creates **orphaned carts** in the database:
- `userId` is `null` (anonymous user)
- `sessionCartId` is no longer tracked (cookie deleted)
- Product stock remains locked indefinitely
- Database accumulates unreachable cart records

### Impact
- **Inventory Loss**: Products become unavailable due to locked stock
- **Database Bloat**: Accumulation of orphaned cart records
- **Potential Abuse**: Malicious users can drain all product stock
- **Business Impact**: Lost sales and poor user experience

## Solution Architecture

The system implements a **two-layer protection strategy**:

### Layer 1: Rate Limiting
- **Purpose**: Prevent rapid cart creation abuse
- **Mechanism**: IP-based rate limiting
- **Limit**: Configurable via `CART_RATE_LIMIT_PER_HOUR` environment variable (defaults to 5 carts per IP address per hour)
- **Scope**: Only applies to NEW cart creation (not updates)
- **Configuration**: Set `CART_RATE_LIMIT_PER_HOUR` in your environment variables to customize the limit

### Layer 2: Automated Cleanup
- **Purpose**: Clean up orphaned carts and restore stock
- **Mechanism**: Scheduled cron job
- **Frequency**: Every 15 minutes
- **Window**: Carts older than 2 hours with `userId = null`

## Technical Implementation

### Rate Limiting System

#### Storage
```typescript
// In-memory Map for serverless compatibility
const cartCreationRateLimits = new Map<string, { 
  count: number; 
  resetAt: Date 
}>();
```

#### Rate Limit Logic
```typescript
async function checkCartCreationRateLimit(ip: string): Promise<boolean> {
  // 1. Clean up expired entries
  // 2. Check if IP has exceeded limit (configurable via CART_RATE_LIMIT_PER_HOUR)
  // 3. Increment counter if allowed
  // 4. Return true/false
}
```

#### IP Detection
```typescript
async function getClientIP(): Promise<string> {
  // Check x-forwarded-for header (load balancers)
  // Fallback to x-real-ip header
  // Default to 'unknown' if not found
}
```

### Cleanup System

#### Database Query
```sql
SELECT * FROM "Cart" 
WHERE "userId" IS NULL 
AND "createdAt" < (NOW() - INTERVAL '2 hours')
```

#### Stock Restoration
```typescript
// For each item in orphaned cart
await prisma.product.update({
  where: { id: item.productId },
  data: { stock: { increment: item.quantity } }
});
```

#### Cart Deletion
```typescript
await prisma.cart.delete({
  where: { id: cart.id }
});
```

## API Endpoints

### Cleanup Cron Endpoint

**URL**: `/api/cron/cleanup-carts`  
**Method**: `GET`  
**Authentication**: Bearer token using `CRON_SECRET`

#### Request Headers
```
Authorization: Bearer <CRON_SECRET>
```

#### Response Format
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

#### Error Responses
- `401 Unauthorized`: Invalid or missing CRON_SECRET
- `500 Internal Server Error`: Database or processing error

## Configuration

### Environment Variables

#### Required
```env
CRON_SECRET=your-secure-random-string-here
```

#### Optional
```env
# For development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=postgresql://...

# Cart Rate Limiting (defaults to 5 if not set)
CART_RATE_LIMIT_PER_HOUR=5
```

### Vercel Configuration

#### Cron Schedule
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-carts",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Schedule**: Every 15 minutes  
**Timezone**: UTC (Vercel default)

## Security Considerations

### Cron Endpoint Security
- **Authentication**: Bearer token required
- **Secret Management**: Use strong, random CRON_SECRET
- **Environment**: Store secret in Vercel environment variables
- **Access**: Only Vercel cron service can access

### Rate Limiting Security
- **IP-based**: Prevents abuse from single source
- **Memory Storage**: Resets on serverless function restart
- **Graceful Degradation**: Continues operation if rate limit fails

### Data Protection
- **Stock Restoration**: Atomic operations prevent data corruption
- **Error Handling**: Logs errors but continues processing
- **Transaction Safety**: Each cart processed independently

## Monitoring & Observability

### Logging
```typescript
// Success logging
console.log(`Cleaned up ${cleanedCarts} orphaned carts and restored ${restoredProducts} products`);

// Error logging
console.error(`Failed to restore stock for product ${item.productId}:`, error);
console.error(`Failed to delete cart ${cart.id}:`, error);
```

### Metrics to Monitor
- **Cleanup Frequency**: Should run every 15 minutes
- **Orphaned Cart Count**: Track trends over time
- **Stock Restoration**: Monitor restored quantities
- **Rate Limit Hits**: Track blocked requests
- **Error Rates**: Monitor cleanup failures

### Health Checks
- **Cron Job Status**: Verify Vercel cron is running
- **Database Connectivity**: Ensure cleanup can access database
- **Environment Variables**: Verify CRON_SECRET is set

## Performance Impact

### Database Operations
- **Query Efficiency**: Indexed on `userId` and `createdAt`
- **Batch Processing**: Processes multiple carts per run
- **Connection Pooling**: Uses Prisma connection management

### Memory Usage
- **Rate Limiting**: Minimal memory footprint (Map storage)
- **Cleanup Process**: Processes carts in batches
- **Serverless**: Stateless design for serverless deployment

### Execution Time
- **Rate Limiting**: < 1ms per request
- **Cleanup Job**: Depends on orphaned cart count
- **Vercel Limit**: 30 seconds max execution time

## Troubleshooting

### Common Issues

#### Cron Job Not Running
1. **Check Vercel Dashboard**: Verify cron is enabled
2. **Verify CRON_SECRET**: Ensure environment variable is set
3. **Check Logs**: Review Vercel function logs
4. **Test Endpoint**: Manually call `/api/cron/cleanup-carts`

#### Rate Limiting Not Working
1. **Check IP Detection**: Verify `getClientIP()` function
2. **Memory Reset**: Rate limits reset on function restart
3. **Load Balancer**: Ensure proper header forwarding

#### Stock Not Restored
1. **Database Connection**: Verify Prisma connectivity
2. **Product Existence**: Check if products still exist
3. **Transaction Issues**: Review error logs
4. **Data Integrity**: Verify cart item structure

### Debug Commands

#### Test Cleanup Manually
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-app.vercel.app/api/cron/cleanup-carts
```

#### Check Orphaned Carts
```sql
SELECT COUNT(*) FROM "Cart" 
WHERE "userId" IS NULL 
AND "createdAt" < (NOW() - INTERVAL '2 hours');
```

#### Verify Rate Limiting
```typescript
// Add temporary logging in checkCartCreationRateLimit
console.log(`Rate limit check for IP ${ip}:`, entry);
```

## Future Enhancements

### Potential Improvements
1. **Redis Storage**: Replace in-memory rate limiting with Redis
2. **Advanced Metrics**: Add detailed analytics dashboard
3. **Configurable Limits**: Make rate limits configurable
4. **Email Alerts**: Notify on high cleanup volumes
5. **Cart Recovery**: Attempt to recover abandoned carts
6. **User Behavior**: Track cart abandonment patterns

### Scalability Considerations
1. **Database Sharding**: For high-volume applications
2. **Distributed Rate Limiting**: For multi-region deployments
3. **Queue System**: For processing large cleanup batches
4. **Caching Layer**: For frequently accessed data

## Conclusion

The Cart Cleanup & Rate Limiting System provides robust protection against cart abuse while maintaining a smooth user experience. The two-layer approach ensures both immediate prevention and long-term cleanup, making the e-commerce application more resilient and reliable.

### Key Benefits
- ✅ **Prevents Stock Locking**: Automatic cleanup restores inventory
- ✅ **Blocks Abuse**: Rate limiting prevents malicious behavior
- ✅ **Maintains Performance**: Efficient database operations
- ✅ **Ensures Reliability**: Comprehensive error handling
- ✅ **Easy Monitoring**: Clear logging and metrics

### Maintenance
- **Regular Monitoring**: Check cleanup logs weekly
- **Secret Rotation**: Update CRON_SECRET periodically
- **Performance Review**: Monitor database query performance
- **Feature Updates**: Stay updated with system improvements
