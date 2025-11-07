import { screen } from '@testing-library/react'
import { describe, beforeEach, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import ProductPage, { generateMetadata } from '@/app/(root)/products/[slug]/page'

const productActionMock = vi.fn()
const productFromCartMock = vi.fn()
const addToCartSpy = vi.fn()
const notFoundMock = vi.fn(() => {
  throw new Error('NOT_FOUND')
})

vi.mock('@/lib/actions/products/products-actions', () => ({
  GetProductBySlugAction: (...args: unknown[]) => productActionMock(...args)
}))

vi.mock('@/lib/actions/cart/cart-actions', () => ({
  GetProductFromCart: (...args: unknown[]) => productFromCartMock(...args)
}))

vi.mock('@/components/features/cart/add-to-cart-btn', () => ({
  __esModule: true,
  default: (props: unknown) => {
    addToCartSpy(props)
    return <button data-testid="add-to-cart">Add to cart</button>
  }
}))

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock()
}))

const baseProduct = {
  id: 'prod-123',
  name: 'Ultra Headphones',
  slug: 'ultra-headphones',
  category: 'Audio',
  images: ['/images/sample-products/p1-1.jpg', '/images/sample-products/p1-2.jpg'],
  brand: 'SoundX',
  description: 'Crystal clear sound for audiophiles.',
  stock: 8,
  price: 199,
  isFeatured: false,
  banner: null,
  rating: '4.2',
  numReviews: 134,
  createdAt: new Date()
}

const cartItem = {
  productId: baseProduct.id,
  name: baseProduct.name,
  slug: baseProduct.slug,
  quantity: 1,
  price: baseProduct.price,
  image: baseProduct.images[0]
}

describe('Product details page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    notFoundMock.mockImplementation(() => {
      throw new Error('NOT_FOUND')
    })
  })

  it('renders product information and passes props to AddToCart', async () => {
    productActionMock.mockResolvedValueOnce(baseProduct)
    productFromCartMock.mockResolvedValueOnce(cartItem)

    const Page = await ProductPage({ params: Promise.resolve({ slug: baseProduct.slug }) })
    renderWithProviders(Page)

    expect(productActionMock).toHaveBeenCalledWith(baseProduct.slug)
    expect(screen.getByRole('heading', { level: 1, name: baseProduct.name })).toBeInTheDocument()
    expect(screen.getByText(`${baseProduct.brand} ${baseProduct.category}`)).toBeInTheDocument()
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    expect(screen.getByTestId('add-to-cart')).toBeInTheDocument()
    expect(addToCartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cartItem: expect.objectContaining({ productId: baseProduct.id }),
        productFromCart: cartItem,
        stock: baseProduct.stock
      })
    )
  })

  it('invokes notFound when the product does not exist', async () => {
    productActionMock.mockResolvedValueOnce(null)

    await expect(ProductPage({ params: Promise.resolve({ slug: 'missing-product' }) })).rejects.toThrow('NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalled()
    expect(productFromCartMock).not.toHaveBeenCalled()
  })

  it('generates metadata for existing products', async () => {
    productActionMock.mockResolvedValueOnce(baseProduct)

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: baseProduct.slug }) })

    expect(metadata.title).toBe(`${baseProduct.name} | ${baseProduct.brand}`)
    expect(metadata.alternates?.canonical).toBe(`/products/${baseProduct.slug}`)
    expect(metadata.openGraph?.title).toContain(baseProduct.name)
  })

  it('generates not-found metadata for missing products', async () => {
    productActionMock.mockResolvedValueOnce(null)

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'missing-product' }) })

    expect(metadata.title).toBe('Product Not Found')
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})