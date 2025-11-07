import { fireEvent, screen, waitFor } from '@testing-library/react'
import AddToCart from './index'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import type { CartItemType } from '@/types/cart/cart-item-type'
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

const routerPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPush
  })
}))

const addToCartMock = vi.fn()
const removeFromCartMock = vi.fn()

vi.mock('@/lib/actions/cart/cart-actions', () => ({
  AddToCartServerAction: (...args: unknown[]) => addToCartMock(...args),
  RemoveFromCartServerAction: (...args: unknown[]) => removeFromCartMock(...args)
}))

type ToastFn = MockInstance<(title: string, options?: Record<string, unknown>) => void>

type ToastSpy = ToastFn & {
  error: MockInstance<(message?: string) => void>
  success: MockInstance<(message?: string) => void>
}

const toastMock = vi.hoisted<ToastSpy>(() => {
  const base = vi.fn<(title: string, options?: Record<string, unknown>) => void>()
  const toast = Object.assign(base, {
    error: vi.fn<(message?: string) => void>(),
    success: vi.fn<(message?: string) => void>()
  }) as ToastSpy
  return toast
})

vi.mock('sonner', () => ({
  toast: toastMock
}))

const baseCartItem: CartItemType = {
  productId: 'product-1',
  name: 'Sample Product',
  slug: 'sample-product',
  quantity: 1,
  price: 20,
  image: '/images/sample-products/p1-1.jpg'
}

describe('AddToCart', () => {
  beforeEach(() => {
    addToCartMock.mockResolvedValue({ success: true, message: 'Added!' })
    removeFromCartMock.mockResolvedValue({ success: true, message: 'Removed!' })
    toastMock.mockClear()
    toastMock.error.mockClear()
    toastMock.success.mockClear()
    routerPush.mockClear()
  })

  it('adds an item to the cart when CTA is clicked', async () => {
    renderWithProviders(
      <AddToCart cartItem={baseCartItem} productFromCart={undefined} stock={5} />
    )

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    await waitFor(() => {
      expect(addToCartMock).toHaveBeenCalledWith(baseCartItem)
    })

    expect(toastMock).toHaveBeenCalledWith('Success', expect.any(Object))
  })

  it('removes an item when the decrement button is pressed', async () => {
    renderWithProviders(
      <AddToCart
        cartItem={baseCartItem}
        productFromCart={{ ...baseCartItem, quantity: 2 }}
        stock={5}
      />
    )

    const [decrementButton] = screen.getAllByRole('button')
    fireEvent.click(decrementButton)

    await waitFor(() => {
      expect(removeFromCartMock).toHaveBeenCalledWith(
        baseCartItem.productId,
        baseCartItem.slug,
        baseCartItem.name
      )
    })
  })

  it('disables increment button when stock is 0', () => {
    renderWithProviders(
      <AddToCart
        cartItem={baseCartItem}
        productFromCart={{ ...baseCartItem, quantity: 1 }}
        stock={0}
      />
    )

    const buttons = screen.getAllByRole('button')
    const increment = buttons[buttons.length - 1]

    expect(increment).toBeDefined()
    expect(increment).toBeDisabled()
  })
})

