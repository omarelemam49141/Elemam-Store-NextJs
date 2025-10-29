# Environment Variables

This document lists all environment variables required and optional for the Elemam Store application.

## Required Variables

### Database
```env
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
```
- **Purpose**: PostgreSQL database connection string
- **Format**: Standard PostgreSQL connection URI
- **Required**: Yes (both development and production)
- **Example**: `postgresql://user:pass@localhost:5432/elemam_store`

### NextAuth Configuration
```env
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secure-random-string-here"
```
- **Purpose**: NextAuth.js configuration for authentication
- **NEXTAUTH_URL**: Your application's public URL
- **NEXTAUTH_SECRET**: Secret key for JWT signing (generate secure random string)
- **Required**: Yes (both development and production)
- **Development**: `http://localhost:3000`
- **Production**: Your Vercel deployment URL

### Cart Cleanup System
```env
CRON_SECRET="your-secure-cron-secret-here"
```
- **Purpose**: Authentication for the cart cleanup cron job
- **Required**: Yes (production only, optional for development)
- **Security**: Use a strong, random string (32+ characters)
- **Usage**: Bearer token for `/api/cron/cleanup-carts` endpoint

## Optional Variables

### Node Environment
```env
NODE_ENV="production"
```
- **Purpose**: Node.js environment setting
- **Default**: `development` (local), `production` (Vercel)
- **Values**: `development`, `production`, `test`
- **Required**: No (auto-set by Vercel)

### Prisma Configuration
```env
PRISMA_GENERATE_SKIP_AUTOINSTALL="true"
```
- **Purpose**: Skip Prisma client auto-install during build
- **Default**: Not set
- **Required**: No (set automatically in vercel.json)
- **Usage**: Prevents build issues on Vercel

### Cart Rate Limiting
```env
CART_RATE_LIMIT_PER_HOUR="5"
```
- **Purpose**: Maximum number of new carts per IP address per hour
- **Default**: `5` (if not set)
- **Required**: No (optional, defaults to 5)
- **Type**: Integer
- **Usage**: Controls rate limiting for cart creation to prevent abuse
- **Example**: Set to `10` for more lenient limits, or `3` for stricter limits

## Environment-Specific Configuration

### Development (.env.local)
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/elemam_store_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"

# Optional: Cart Cleanup (for testing)
CRON_SECRET="dev-cron-secret-for-testing"

# Optional: Cart Rate Limiting (defaults to 5)
CART_RATE_LIMIT_PER_HOUR="5"
```

### Production (Vercel Dashboard)
```env
# Database
DATABASE_URL="postgresql://prod_user:secure_pass@prod_host:5432/elemam_store"

# NextAuth
NEXTAUTH_URL="https://elemam-store.vercel.app"
NEXTAUTH_SECRET="super-secure-production-secret-32-chars-min"

# Cart Cleanup (Required)
CRON_SECRET="production-cron-secret-very-secure-random-string"

# Optional: Cart Rate Limiting (defaults to 5)
CART_RATE_LIMIT_PER_HOUR="5"
```

## Security Guidelines

### Secret Generation

#### NEXTAUTH_SECRET
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator (use trusted source)
# Generate 64-character hex string
```

#### CRON_SECRET
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Using UUID
node -e "console.log(require('crypto').randomUUID() + require('crypto').randomUUID())"
```

### Best Practices

1. **Never commit secrets**: Add `.env*` to `.gitignore`
2. **Use different secrets**: Different values for dev/staging/prod
3. **Rotate regularly**: Update secrets periodically
4. **Strong entropy**: Use cryptographically secure random generators
5. **Length requirements**: Minimum 32 characters for secrets

## Vercel Configuration

### Setting Environment Variables

#### Via Vercel Dashboard
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Set environment scope (Development, Preview, Production)

#### Via Vercel CLI
```bash
# Set production variable
vercel env add CRON_SECRET production

# Set for all environments
vercel env add NEXTAUTH_SECRET

# List all variables
vercel env ls

# Pull variables to local .env
vercel env pull .env.local
```

### Environment Scopes
- **Development**: Local development only
- **Preview**: Vercel preview deployments
- **Production**: Live production environment

## Validation

### Required Variables Check
The application validates required environment variables on startup:

```typescript
// Example validation (not actual code)
const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL', 
  'NEXTAUTH_SECRET'
];

const missing = requiredVars.filter(varName => !process.env[varName]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}
```

### CRON_SECRET Validation
The cron endpoint validates the secret:

```typescript
// In /api/cron/cleanup-carts/route.ts
const authHeader = request.headers.get('authorization');
const cronSecret = process.env.CRON_SECRET;

if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Troubleshooting

### Common Issues

#### Database Connection Failed
```
Error: Can't reach database server
```
**Solution**: Check `DATABASE_URL` format and database accessibility

#### NextAuth Configuration Error
```
Error: NEXTAUTH_URL is not set
```
**Solution**: Set `NEXTAUTH_URL` to your application URL

#### Cron Job Authentication Failed
```
Error: Unauthorized
```
**Solution**: Verify `CRON_SECRET` is set and matches the Authorization header

#### Missing Environment Variables
```
Error: Missing required environment variables
```
**Solution**: Check all required variables are set in your environment

### Debug Commands

#### Check Environment Variables
```bash
# Local development
node -e "console.log(process.env.DATABASE_URL ? 'DATABASE_URL: Set' : 'DATABASE_URL: Missing')"

# Vercel production
vercel env ls
```

#### Test Database Connection
```bash
# Using psql
psql "$DATABASE_URL" -c "SELECT 1;"

# Using Node.js
node -e "require('@prisma/client').PrismaClient().$connect().then(() => console.log('Connected')).catch(console.error)"
```

#### Test Cron Secret
```bash
# Test locally
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/cleanup-carts

# Test production
curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/cron/cleanup-carts
```

## File Structure

### Local Development
```
project-root/
├── .env.local          # Local environment variables (gitignored)
├── .env.example        # Example environment file
└── docs/
    └── environment-variables.md
```

### Production (Vercel)
- Environment variables stored in Vercel dashboard
- No local `.env` files in production
- Variables injected at runtime

## Migration Guide

### Adding New Variables

1. **Update this documentation**
2. **Add to `.env.example`**
3. **Update validation code** (if needed)
4. **Set in Vercel dashboard**
5. **Test in all environments**

### Removing Variables

1. **Remove from code**
2. **Update this documentation**
3. **Remove from Vercel dashboard**
4. **Clean up `.env.example`**

---

*Last updated: $(date)*
