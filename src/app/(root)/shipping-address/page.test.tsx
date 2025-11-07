import { renderWithProviders } from '@/test-utils/render-with-providers'
import ShippingAddressPage from './page'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { enCheckoutSteps } from '@/enums/checkout-steps-enum'

const authMock = vi.fn()
const findFirstMock = vi.fn()
const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`)
})
const checkoutStepsSpy = vi.fn()
const shippingFormSpy = vi.fn()

vi.mock('@/auth', () => ({
  auth: (...args: unknown[]) => authMock(...args)
}))

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      findFirst: (...args: unknown[]) => findFirstMock(...args)
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

vi.mock('./components/shipping-address-form', () => ({
  __esModule: true,
  default: (props: unknown) => {
    shippingFormSpy(props)
    return <form data-testid="shipping-form">Shipping form</form>
  }
}))

const signInUrl = '/sign-in?callbackUrl=%2Fshipping-address'

describe('ShippingAddressPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redirectMock.mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`)
    })
  })

  it('redirects to sign-in when no session exists', async () => {
    authMock.mockResolvedValueOnce(null)

    await expect(ShippingAddressPage()).rejects.toThrow(`REDIRECT:${signInUrl}`)
    expect(redirectMock).toHaveBeenCalledWith(signInUrl)
    expect(findFirstMock).not.toHaveBeenCalled()
  })

  it('redirects to sign-in when session lacks user id', async () => {
    authMock.mockResolvedValueOnce({ user: {} })

    await expect(ShippingAddressPage()).rejects.toThrow(`REDIRECT:${signInUrl}`)
    expect(redirectMock).toHaveBeenCalledWith(signInUrl)
    expect(findFirstMock).not.toHaveBeenCalled()
  })

  it('redirects to sign-in when user cannot be found', async () => {
    authMock.mockResolvedValueOnce({ user: { id: 'user-42' } })
    findFirstMock.mockResolvedValueOnce(null)

    await expect(ShippingAddressPage()).rejects.toThrow(`REDIRECT:${signInUrl}`)
    expect(findFirstMock).toHaveBeenCalledWith({ where: { id: 'user-42' } })
    expect(redirectMock).toHaveBeenCalledWith(signInUrl)
  })

  it('renders checkout steps and shipping form when user exists', async () => {
    const user = { id: 'user-42', name: 'Alice Shopper' }
    authMock.mockResolvedValueOnce({ user })
    findFirstMock.mockResolvedValueOnce(user)

    const Page = await ShippingAddressPage()
    renderWithProviders(Page)

    expect(checkoutStepsSpy).toHaveBeenCalledWith({ currentStep: enCheckoutSteps.eShippingAddress })
    expect(shippingFormSpy).toHaveBeenCalledWith({ user })
    expect(screen.getByTestId('checkout-steps')).toBeInTheDocument()
    expect(screen.getByTestId('shipping-form')).toBeInTheDocument()
  })
})

