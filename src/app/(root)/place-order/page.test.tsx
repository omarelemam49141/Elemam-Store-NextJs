import { renderWithProviders } from '@/test-utils/render-with-providers'
import PlaceOrderPage from './page'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { enCheckoutSteps } from '@/enums/checkout-steps-enum'

const authMock = vi.fn()
const cartActionMock = vi.fn()
const findUserMock = vi.fn()
const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`)
})

const checkoutStepsSpy = vi.fn()
const shippingSummarySpy = vi.fn()
const paymentSummarySpy = vi.fn()
const cartItemsSummarySpy = vi.fn()
const orderSummarySpy = vi.fn()

vi.mock('@/auth', () => ({
  auth: (...args: unknown[]) => authMock(...args)
}))

vi.mock('@/lib/actions/cart/cart-actions', () => ({
  GetCartAction: (...args: unknown[]) => cartActionMock(...args)
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      findFirst: (...args: unknown[]) => findUserMock(...args)
    }
  }
}))

vi.mock('next/navigation', () => ({
  redirect: (path: string) => redirectMock(path)
}))

vi.mock('@/components/shared/features/checkout-steps', () => ({
  __esModule: true,
  default: (props: unknown) => {
    checkoutStepsSpy(props)
    return <div data-testid="checkout-steps">Checkout steps</div>
  }
}))

vi.mock('@/components/shared/features/order/cart-items-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    cartItemsSummarySpy(props)
    return <div data-testid="cart-items-summary">Cart items summary</div>
  }
}))

vi.mock('@/components/shared/features/order/order-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    orderSummarySpy(props)
    return <div data-testid="order-summary">Order summary</div>
  }
}))

vi.mock('@/components/shared/features/order/payment-method-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    paymentSummarySpy(props)
    return <div data-testid="payment-summary">Payment summary</div>
  }
}))

vi.mock('@/components/shared/features/order/shipping-address-summary', () => ({
  __esModule: true,
  default: (props: unknown) => {
    shippingSummarySpy(props)
    return <div data-testid="shipping-summary">Shipping summary</div>
  }
}))

const cart = {
  sessionCartId: 'session-1',
  userId: 'user-1',
  itemsPrice: 120,
  taxPrice: 18,
  shippingPrice: 10,
  totalPrice: 148,
  items: [{
    productId: 'prod-1',
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    quantity: 2,
    price: 40,
    image: '/images/sample-products/p1-1.jpg'
  }]
}

const user = {
  id: 'user-1',
  name: 'Jane Shopper',
  address: { street: '123 Main' },
  paymentMethodId: 'pm-1',
  paymentMethod: { id: 'pm-1', name: 'Visa', type: 'Credit' }
}

describe('PlaceOrderPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redirectMock.mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`)
    })
  })

  it('redirects to sign-in when no authenticated user', async () => {
    authMock.mockResolvedValueOnce(null)

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/sign-in')
    expect(redirectMock).toHaveBeenCalledWith('/sign-in')
  })

  it('redirects to cart when cart action fails', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: false })

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/cart')
    expect(redirectMock).toHaveBeenCalledWith('/cart')
  })

  it('redirects to sign-in when user record missing', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: true, data: cart })
    findUserMock.mockResolvedValueOnce(null)

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/sign-in')
    expect(findUserMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { paymentMethod: true }
    })
  })

  it('redirects to shipping address when user lacks address', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: true, data: cart })
    findUserMock.mockResolvedValueOnce({ ...user, address: null })

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/shipping-address')
  })

  it('redirects to cart when cart data is null', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: true, data: null })
    findUserMock.mockResolvedValueOnce(user)

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/cart')
  })

  it('redirects to payment methods when user lacks payment method', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: true, data: cart })
    findUserMock.mockResolvedValueOnce({ ...user, paymentMethod: null })

    await expect(PlaceOrderPage()).rejects.toThrow('REDIRECT:/payment-methods')
  })

  it('renders summaries when all prerequisites are met', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-1' } })
    cartActionMock.mockResolvedValueOnce({ success: true, data: cart })
    findUserMock.mockResolvedValueOnce(user)

    const Page = await PlaceOrderPage()
    renderWithProviders(Page)

    expect(checkoutStepsSpy).toHaveBeenCalledWith({ currentStep: enCheckoutSteps.ePlaceOrder })
    expect(shippingSummarySpy).toHaveBeenCalledWith({ shippingAddress: user.address, canEdit: true })
    expect(paymentSummarySpy).toHaveBeenCalledWith({ paymentMethod: user.paymentMethod, canEdit: true })
    expect(cartItemsSummarySpy).toHaveBeenCalledWith({ cartItems: cart.items })
    expect(orderSummarySpy).toHaveBeenCalledWith({ cart, user, canPlaceOrder: true })
    expect(screen.getByTestId('checkout-steps')).toBeInTheDocument()
    expect(screen.getByTestId('shipping-summary')).toBeInTheDocument()
    expect(screen.getByTestId('payment-summary')).toBeInTheDocument()
    expect(screen.getByTestId('cart-items-summary')).toBeInTheDocument()
    expect(screen.getByTestId('order-summary')).toBeInTheDocument()
  })
})

