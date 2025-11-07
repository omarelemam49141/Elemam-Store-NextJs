import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import CartPage from './page'

const getCartActionMock = vi.fn()
const cartItemsSpy = vi.fn()
const cartSummarySpy = vi.fn()

vi.mock('@/lib/actions/cart/cart-actions', () => ({
  GetCartAction: (...args: unknown[]) => getCartActionMock(...args)
}))

vi.mock('./components/empty-cart', () => ({
  __esModule: true,
  default: () => <div data-testid="empty-cart">Your cart is empty</div>
}))

vi.mock('./components/cart-items', () => ({
  __esModule: true,
  default: (props: unknown) => {
    cartItemsSpy(props)
    return <div data-testid="cart-items">Cart items rendered</div>
  }
}))

vi.mock('./components/cart-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    cartSummarySpy(props)
    return <aside data-testid="cart-summary">Summary</aside>
  }
}))

const baseCart = {
  sessionCartId: 'session-123',
  userId: 'user-1',
  itemsPrice: 120,
  taxPrice: 18,
  shippingPrice: 10,
  totalPrice: 148,
  items: [
    {
      productId: 'prod-1',
      name: 'Wireless Mouse',
      slug: 'wireless-mouse',
      quantity: 2,
      price: 40,
      image: '/images/sample-products/p1-1.jpg'
    }
  ]
}

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when the cart has no items', async () => {
    getCartActionMock.mockResolvedValueOnce({ success: true, data: null })

    const Page = await CartPage()
    renderWithProviders(Page)

    expect(screen.getByRole('heading', { level: 1, name: /shopping cart/i })).toBeInTheDocument()
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
    expect(cartItemsSpy).not.toHaveBeenCalled()
    expect(cartSummarySpy).not.toHaveBeenCalled()
  })

  it('renders cart items and summary when the cart has products', async () => {
    getCartActionMock.mockResolvedValueOnce({ success: true, data: baseCart })

    const Page = await CartPage()
    renderWithProviders(Page)

    expect(screen.queryByTestId('empty-cart')).not.toBeInTheDocument()
    expect(cartItemsSpy).toHaveBeenCalledWith({ cartItems: baseCart.items })
    expect(cartSummarySpy).toHaveBeenCalledWith({ cart: baseCart })
    expect(screen.getByTestId('cart-items')).toBeInTheDocument()
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument()
  })
})

