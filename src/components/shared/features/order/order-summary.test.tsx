import { fireEvent, screen, waitFor } from '@testing-library/react'
import OrderSummary from './order-summary'
import type { CartType } from '@/types/cart/cart-type'
import type { User } from '@/generated/prisma'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

const routerPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPush
  })
}))

const createOrderMock = vi.fn()

vi.mock('@/lib/actions/orders/orders-actions', () => ({
  CreateOrderServerAction: (...args: unknown[]) => createOrderMock(...args)
}))

type ToastSpy = {
  success: MockInstance<(message?: string) => void>
  error: MockInstance<(message?: string) => void>
}

const toastMock = vi.hoisted<ToastSpy>(() => ({
  success: vi.fn<(message?: string) => void>(),
  error: vi.fn<(message?: string) => void>()
}) as ToastSpy)

vi.mock('sonner', () => ({
  toast: toastMock
}))

const cart: CartType = {
  userId: 'user-1',
  sessionCartId: 'session',
  items: [],
  itemsPrice: 100,
  taxPrice: 15,
  shippingPrice: 10,
  totalPrice: 125
}

const user = {
  id: 'user-1',
  name: 'Test User'
} as unknown as User

describe('OrderSummary', () => {
  beforeEach(() => {
    createOrderMock.mockReset()
    toastMock.success.mockReset()
    toastMock.error.mockReset()
    routerPush.mockReset()
  })

  it('hides the CTA when placing an order is disabled', () => {
    renderWithProviders(<OrderSummary cart={cart} user={user} canPlaceOrder={false} />)

    expect(screen.queryByRole('button', { name: /place order/i })).toBeNull()
  })

  it('submits the order and redirects on success', async () => {
    createOrderMock.mockResolvedValue({ success: true, message: 'Order placed', data: 'order-123' })

    renderWithProviders(<OrderSummary cart={cart} user={user} canPlaceOrder />)

    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalledWith(user, cart)
    })

    expect(toastMock.success).toHaveBeenCalledWith('Order placed')
    expect(routerPush).toHaveBeenCalledWith('/orders/details/order-123')
  })

  it('surfaces an error toast when the action fails', async () => {
    createOrderMock.mockResolvedValue({ success: false, message: 'Failed to place order' })

    renderWithProviders(<OrderSummary cart={cart} user={user} canPlaceOrder />)

    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalled()
    })

    expect(toastMock.error).toHaveBeenCalledWith('Failed to place order')
    expect(routerPush).not.toHaveBeenCalled()
  })
})

