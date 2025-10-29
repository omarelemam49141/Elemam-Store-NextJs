# Quick Start Guide

Get the Elemam Store application up and running quickly with this step-by-step guide.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Vercel account (for deployment)

## 1. Clone and Install

```bash
git clone <repository-url>
cd elemam-store
npm install
```

## 2. Environment Setup

### Create Environment File
```bash
cp .env.example .env.local
```

### Required Variables
Add these to your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/elemam_store"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string-here"

# Cart Cleanup (optional for dev)
CRON_SECRET="your-cron-secret-for-testing"
```

### Generate Secrets
```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Database Setup

### Run Migrations
```bash
npx prisma migrate dev
```

### Seed Database (Optional)
```bash
npx prisma db seed
```

## 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 5. Test Features

### Test Cart System
1. Add items to cart (anonymous)
2. Sign up/in to migrate cart
3. Remove items to restore stock

### Test Rate Limiting
1. Add 6+ items quickly to trigger rate limit
2. Should see "Too many cart operations" error

### Test Cleanup (Optional)
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     http://localhost:3000/api/cron/cleanup-carts
```

## 6. Deploy to Vercel

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy
```bash
vercel --prod
```

### Set Production Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all required variables
3. Set `NEXTAUTH_URL` to your Vercel URL
4. Use production secrets

## 7. Verify Deployment

### Check Cron Job
1. Wait 15 minutes after deployment
2. Check Vercel function logs
3. Should see cleanup logs

### Test Production Features
1. Test cart functionality
2. Test authentication
3. Test rate limiting

## Troubleshooting

### Common Issues

#### Database Connection
```
Error: Can't reach database server
```
**Fix**: Check `DATABASE_URL` format and database accessibility

#### NextAuth Error
```
Error: NEXTAUTH_URL is not set
```
**Fix**: Set `NEXTAUTH_URL` in environment variables

#### Cron Not Running
```
No cleanup logs in Vercel
```
**Fix**: Verify `CRON_SECRET` is set in Vercel environment variables

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? 'DB: OK' : 'DB: Missing')"

# Test database connection
npx prisma db push

# Check Vercel logs
vercel logs --follow
```

## Next Steps

- **Read Documentation**: Check [Cart Cleanup System](./cart-cleanup-system.md)
- **API Reference**: See [API Documentation](./api-reference.md)
- **Environment**: Review [Environment Variables](./environment-variables.md)
- **Customize**: Modify the application for your needs

## Support

- **Documentation**: Check the `docs/` folder
- **Issues**: Create GitHub issues for bugs
- **Questions**: Review troubleshooting sections

---

*Need more details? Check the comprehensive documentation in the `docs/` folder.*
