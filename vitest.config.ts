import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json-summary'],
      exclude: ['src/generated/**', 'src/test-utils/**', '**/*.d.ts'],
      include: [
        'src/components/features/cart/add-to-cart-btn/index.tsx',
        'src/components/features/products/product-details/product-images/index.tsx',
        'src/components/shared/features/order/order-summary.tsx',
        'src/components/shared/features/checkout-steps.tsx',
        'src/app/(root)/page.tsx',
        'src/app/(root)/products/[slug]/page.tsx',
        'src/app/(root)/cart/page.tsx',
        'src/app/(root)/shipping-address/page.tsx',
        'src/app/(root)/payment-methods/page.tsx',
        'src/app/(root)/place-order/page.tsx',
        'src/app/(root)/orders/details/[id]/page.tsx'
      ],
      thresholds: {
        lines: 60,
        statements: 60,
        branches: 50,
        functions: 60
      }
    },
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})

