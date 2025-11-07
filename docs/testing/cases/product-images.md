# Product Images Component Tests

## Purpose

Ensures the product gallery highlights the selected image and updates the hero preview when shoppers choose a different thumbnail.

## Covered scenarios

- Default hero image uses the first entry from the `images` array.
- Clicking a thumbnail updates the hero `<img>` source.
- The active thumbnail receives the `border-orange-500` class while inactive items remove it.

## Implementation notes

- Located at `src/components/features/products/product-details/product-images/product-images.test.tsx`.
- Uses `renderWithProviders` to align with project-wide testing utilities.
- Interactions are simulated with Testing Library’s `fireEvent` APIs (preferred over low-level DOM manipulation).

## Future extensions

- Add accessibility assertions (e.g., focus outlines) once keyboard navigation is implemented for thumbnails.
- Capture snapshot of the gallery layout if visual regressions become a concern.

