# Checkout Steps Component Tests

## Purpose

Confirm the checkout progress indicator correctly communicates the user’s position and completed steps.

## Covered scenarios

- Current step badge receives the primary background and elevated shadow.
- Completed steps share the primary background but without the `shadow-lg` emphasis.
- Upcoming steps use the secondary palette.

## Implementation notes

- Tests live in `src/components/shared/features/checkout-steps.test.tsx`.
- Uses `CHECKOUT_STEPS` constants to assert styling against specific labels.
- Relies on simple className assertions; if the component switches to CSS modules, update selectors accordingly.

## Future extensions

- Add mobile layout tests once a mobile-friendly rendering (non-flex) variant is introduced.
- Validate ARIA attributes when step navigation becomes interactive.

