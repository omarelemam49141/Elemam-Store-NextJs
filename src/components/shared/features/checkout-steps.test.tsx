import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import CheckoutSteps from './checkout-steps'
import { CHECKOUT_STEPS, enCheckoutSteps } from '@/enums/checkout-steps-enum'
import { describe, expect, it } from 'vitest'

describe('CheckoutSteps', () => {
  it('highlights the current step', () => {
    renderWithProviders(<CheckoutSteps currentStep={enCheckoutSteps.ePaymentMethod} />)

    const currentBadge = screen.getByText(CHECKOUT_STEPS[enCheckoutSteps.ePaymentMethod])
    expect(currentBadge.className).toContain('shadow-lg')
    expect(currentBadge.className).toContain('bg-primary')
  })

  it('marks completed steps without the strong highlight', () => {
    renderWithProviders(<CheckoutSteps currentStep={enCheckoutSteps.ePaymentMethod} />)

    const previousBadge = screen.getByText(CHECKOUT_STEPS[enCheckoutSteps.eShippingAddress])
    expect(previousBadge.className).toContain('bg-primary')
    expect(previousBadge.className).not.toContain('shadow-lg')
  })

  it('styles future steps as secondary', () => {
    renderWithProviders(<CheckoutSteps currentStep={enCheckoutSteps.ePaymentMethod} />)

    const futureBadge = screen.getByText(CHECKOUT_STEPS[enCheckoutSteps.ePlaceOrder])
    expect(futureBadge.className).toContain('bg-secondary')
  })
})

