# Vercel Deployment Guide

## Issues Fixed

The following deployment issues have been resolved:

1. **WebSocket Error (`b.mask is not a function`)**: 
   - Removed `@neondatabase/serverless` and `@prisma/adapter-neon` packages
   - Removed `ws` WebSocket library dependency
   - Updated Prisma client to use standard PostgreSQL connection

2. **Database Connection Issues**:
   - Implemented proper Prisma client caching for serverless functions
   - Added proper error handling and logging

3. **Build Configuration**:
   - Updated Next.js config for better serverless compatibility
   - Added Vercel-specific configuration in `vercel.json`
   - Removed Turbopack for better build stability

## Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables in Vercel**:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `NODE_ENV`: Set to "production"
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: Generate a secure random string
   - `CRON_SECRET`: Generate a secure random string for cron job authentication

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## Database Setup

Make sure your PostgreSQL database connection string is properly formatted:
```
postgresql://username:password@hostname:port/database?sslmode=require
```

## Cart Cleanup & Rate Limiting

The application includes automated cleanup of orphaned carts to prevent stock locking:

### Features
- **Rate Limiting**: Limits cart creation to 5 per IP address per hour to prevent abuse
- **Automated Cleanup**: Cron job runs every 15 minutes
- **Stock Restoration**: Automatically restores product stock from abandoned carts
- **Cleanup Window**: Removes anonymous carts (userId is null) older than 2 hours

### How It Works
1. When anonymous users delete their session cookie, their cart becomes orphaned
2. The cleanup job finds these orphaned carts every 15 minutes
3. Stock is restored for all products in the orphaned cart
4. The orphaned cart is deleted from the database

This prevents malicious users from draining product stock by repeatedly creating and abandoning carts.

## Key Changes Made

- **db/prisma.ts**: Simplified Prisma client without Neon adapter
- **next.config.ts**: Added serverless-specific webpack configuration
- **vercel.json**: Added Vercel deployment configuration and cron job schedule
- **package.json**: Removed problematic WebSocket dependencies
- **lib/actions/cart/cart-actions.ts**: Added rate limiting and cleanup functions
- **app/api/cron/cleanup-carts/route.ts**: Cron endpoint for automated cleanup
- Removed Turbopack from build process for better compatibility

The app should now deploy successfully to Vercel without WebSocket or database connection errors.
