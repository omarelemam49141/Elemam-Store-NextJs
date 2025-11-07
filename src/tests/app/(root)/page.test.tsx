import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import Home from '@/app/(root)/page'
import { GetProductsPaginatedAction } from '@/lib/actions/products/products-actions'

vi.mock('@/lib/actions/products/products-actions', () => ({
  GetProductsPaginatedAction: vi.fn()
}))

const mockedGetProducts = vi.mocked(GetProductsPaginatedAction)

const baseProduct = {
  id: '1',
  name: 'Wireless Headphones',
  slug: 'wireless-headphones',
  category: 'Audio',
  images: ['/images/sample-products/p1-1.jpg'],
  brand: 'SoundX',
  description: 'Premium wireless headphones',
  stock: 5,
  price: 199,
  rating: 4.5,
  numReviews: 120,
  isFeatured: false,
  banner: null,
  createdAt: new Date().toISOString()
}

describe('Home page', () => {
  beforeEach(() => {
    mockedGetProducts.mockReset()
  })

  it('renders newest arrival products from the server action', async () => {
    mockedGetProducts.mockResolvedValue({
      items: [baseProduct],
      totalItemsCount: 1,
      totalPagesCount: 1
    })

    const Page = await Home()
    renderWithProviders(Page)

    expect(screen.getByRole('heading', { level: 2, name: /newest arrival/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: baseProduct.name })).toBeInTheDocument()
  })

  it('gracefully handles an empty newest arrival feed', async () => {
    mockedGetProducts.mockResolvedValue({
      items: [],
      totalItemsCount: 0,
      totalPagesCount: 0
    })

    const Page = await Home()
    renderWithProviders(Page)

    expect(screen.getByRole('heading', { level: 2, name: /newest arrival/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /wireless/i })).not.toBeInTheDocument()
  })
})

