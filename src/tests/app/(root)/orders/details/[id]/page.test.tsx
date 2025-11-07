import { renderWithProviders } from '@/test-utils/render-with-providers'
import OrderDetailsPage, { generateMetadata } from '@/app/(root)/orders/details/[id]/page'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUuidSuffix } from '@/lib/utils'

const orderDetailsMock = vi.fn()
const notFoundMock = vi.fn(() => {
  throw new Error('NOT_FOUND')
})
const shippingSummarySpy = vi.fn()
const paymentSummarySpy = vi.fn()
const cartItemsSummarySpy = vi.fn()
const orderSummarySpy = vi.fn()

vi.mock('@/lib/actions/orders/orders-actions', () => ({
  GetOrderDetailsAction: (...args: unknown[]) => orderDetailsMock(...args)
}))

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock()
}))

vi.mock('@/components/shared/features/order/shipping-address-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    shippingSummarySpy(props)
    return <section data-testid="shipping-summary">Shipping summary</section>
  }
}))

vi.mock('@/components/shared/features/order/payment-method-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    paymentSummarySpy(props)
    return <section data-testid="payment-summary">Payment summary</section>
  }
}))

vi.mock('@/components/shared/features/order/cart-items-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    cartItemsSummarySpy(props)
    return <section data-testid="cart-items-summary">Cart items summary</section>
  }
}))

vi.mock('@/components/shared/features/order/order-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    orderSummarySpy(props)
    return <aside data-testid="order-summary">Order summary</aside>
  }
}))

const baseOrder = {
  id: 'a1b2c3d4',
  itemsPrice: 120,
  shippingPrice: 10,
  taxPrice: 15,
  totalPrice: 145,
  shippingAddress: { street: '123 Main St' },
  paymentMethod: { id: 'pm-1', name: 'Visa', type: 'Credit' },
  user: { id: 'user-1', name: 'Jane Shopper' },
  orderItems: [
    {
      productId: 'prod-1',
      qty: 2,
      price: 40,
      product: {
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        images: ['/images/sample-products/p1-1.jpg']
      }
    }
  ]
}

const expectedCartItems = [
  {
    productId: 'prod-1',
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    quantity: 2,
    price: 40,
    image: '/images/sample-products/p1-1.jpg'
  }
]

describe('OrderDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    notFoundMock.mockImplementation(() => {
      throw new Error('NOT_FOUND')
    })
  })

  it('renders order details and summaries when action succeeds', async () => {
    orderDetailsMock.mockResolvedValueOnce({ success: true, data: baseOrder })

    const Page = await OrderDetailsPage({ params: Promise.resolve({ id: baseOrder.id }) })
    renderWithProviders(Page)

    expect(orderDetailsMock).toHaveBeenCalledWith(baseOrder.id)
    expect(screen.getByRole('heading', { name: /Order #.* Details/i })).toBeInTheDocument()
    expect(shippingSummarySpy).toHaveBeenCalledWith({ shippingAddress: baseOrder.shippingAddress, canEdit: false })
    expect(paymentSummarySpy).toHaveBeenCalledWith({ paymentMethod: baseOrder.paymentMethod, canEdit: false })
    expect(cartItemsSummarySpy).toHaveBeenCalledWith({ cartItems: expectedCartItems })
    expect(orderSummarySpy).toHaveBeenCalledWith({ cart: expect.objectContaining({ totalPrice: baseOrder.totalPrice }), user: baseOrder.user, canPlaceOrder: false })
    expect(screen.getByTestId('shipping-summary')).toBeInTheDocument()
    expect(screen.getByTestId('payment-summary')).toBeInTheDocument()
    expect(screen.getByTestId('cart-items-summary')).toBeInTheDocument()
    expect(screen.getByTestId('order-summary')).toBeInTheDocument()
  })

  it('calls notFound when order lookup fails', async () => {
    orderDetailsMock.mockResolvedValueOnce({ success: false })

    await expect(OrderDetailsPage({ params: Promise.resolve({ id: 'missing-order' }) })).rejects.toThrow('NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalled()
  })

  it('generates metadata using order details when available', async () => {
    orderDetailsMock.mockResolvedValueOnce({ success: true, data: baseOrder })

    const metadata = await generateMetadata({ params: Promise.resolve({ id: baseOrder.id }) })
    const suffix = getUuidSuffix(baseOrder.id)

    expect(metadata.title).toBe(`Order ${suffix}`)
    expect(metadata.alternates?.canonical).toBe(`/orders/details/${baseOrder.id}`)
    expect(metadata.openGraph?.title).toContain(suffix)
  })

  it('generates fallback metadata when the order is missing', async () => {
    orderDetailsMock.mockResolvedValueOnce({ success: false })

    const metadata = await generateMetadata({ params: Promise.resolve({ id: 'missing-order' }) })
    const suffix = getUuidSuffix('missing-order')

    expect(metadata.title).toBe(`Order ${suffix}`)
    expect(metadata.description).toContain(suffix)
  })
})

