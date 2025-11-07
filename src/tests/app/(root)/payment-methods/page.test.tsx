import { renderWithProviders } from '@/test-utils/render-with-providers'
import PaymentMethodsPage from '@/app/(root)/payment-methods/page'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { enCheckoutSteps } from '@/enums/checkout-steps-enum'

const authMock = vi.fn()
const findUserMock = vi.fn()
const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`)
})
const paymentMethodsMock = vi.fn()
const checkoutStepsSpy = vi.fn()
const paymentFormSpy = vi.fn()

vi.mock('@/auth', () => ({
  auth: (...args: unknown[]) => authMock(...args)
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

vi.mock('@/lib/actions/payment-methods/payment-methods-actions', () => ({
  GetPaymentMethodsAction: (...args: unknown[]) => paymentMethodsMock(...args)
}))

vi.mock('@/components/shared/features/checkout-steps', () => ({
  __esModule: true,
  default: (props: unknown) => {
    checkoutStepsSpy(props)
    return <div data-testid="checkout-steps">Checkout steps</div>
  }
}))

vi.mock('@/app/(root)/payment-methods/payment-methods-form', () => ({
  __esModule: true,
  default: (props: unknown) => {
    paymentFormSpy(props)
    return <div data-testid="payment-form">Payment form</div>
  }
}))

describe('PaymentMethodsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redirectMock.mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`)
    })
  })

  it('redirects to sign-in when no user session exists', async () => {
    authMock.mockResolvedValueOnce(null)

    await expect(PaymentMethodsPage()).rejects.toThrow('REDIRECT:/sign-in')
    expect(redirectMock).toHaveBeenCalledWith('/sign-in')
  })

  it('redirects to sign-in when user record cannot be found', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-123' } })
    findUserMock.mockResolvedValueOnce(null)

    await expect(PaymentMethodsPage()).rejects.toThrow('REDIRECT:/sign-in')
    expect(findUserMock).toHaveBeenCalledWith({ where: { id: 'user-123' } })
    expect(redirectMock).toHaveBeenCalledWith('/sign-in')
  })

  it('renders an error message when payment method fetch fails', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-123' } })
    findUserMock.mockResolvedValueOnce({ id: 'user-123', paymentMethodId: null })
    paymentMethodsMock.mockResolvedValueOnce({ success: false, message: 'Unable to load payment methods' })

    const Page = await PaymentMethodsPage()
    renderWithProviders(Page)

    expect(screen.getByRole('heading', { level: 1, name: /error/i })).toBeInTheDocument()
    expect(screen.getByText('Unable to load payment methods')).toBeInTheDocument()
  })

  it('renders an error when no payment methods are returned', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-123' } })
    findUserMock.mockResolvedValueOnce({ id: 'user-123', paymentMethodId: null })
    paymentMethodsMock.mockResolvedValueOnce({ success: true, data: [] })

    const Page = await PaymentMethodsPage()
    renderWithProviders(Page)

    expect(screen.getByRole('heading', { level: 1, name: /error/i })).toBeInTheDocument()
    expect(screen.getByText('No payment methods found')).toBeInTheDocument()
  })

  it('renders checkout steps and payment methods form when data exists', async () => {
    const user = { id: 'user-123', paymentMethodId: 'pm-1' }
    const methods = [{ id: 'pm-1', name: 'Visa', type: 'Credit' }]
    authMock.mockResolvedValueOnce({ user })
    findUserMock.mockResolvedValueOnce(user)
    paymentMethodsMock.mockResolvedValueOnce({ success: true, data: methods })

    const Page = await PaymentMethodsPage()
    renderWithProviders(Page)

    expect(checkoutStepsSpy).toHaveBeenCalledWith({ currentStep: enCheckoutSteps.ePaymentMethod })
    expect(paymentFormSpy).toHaveBeenCalledWith({ paymentMethods: methods, userPaymentMethodId: user.paymentMethodId })
    expect(screen.getByTestId('checkout-steps')).toBeInTheDocument()
    expect(screen.getByTestId('payment-form')).toBeInTheDocument()
  })
})

