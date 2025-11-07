import { fireEvent, screen } from '@testing-library/react'
import ProductImages from './index'
import { renderWithProviders } from '@/test-utils/render-with-providers'
import { describe, expect, it } from 'vitest'

const mockImages = [
  '/images/sample-products/p1-1.jpg',
  '/images/sample-products/p1-2.jpg',
  '/images/sample-products/p1-3.jpg'
]

describe('ProductImages', () => {
  it('renders the first image as the default hero', () => {
    renderWithProviders(<ProductImages images={mockImages} />)

    const heroImage = screen.getAllByRole('img', { name: /product image/i })[0] as HTMLImageElement
    expect(heroImage.src).toContain(mockImages[0])
  })

  it('updates the hero image when a thumbnail is clicked', () => {
    renderWithProviders(<ProductImages images={mockImages} />)

    const thumbnails = screen.getAllByRole('img', { name: /product image/i }).slice(1)
    const secondThumb = thumbnails[1]

    fireEvent.click(secondThumb)

    const heroImage = screen.getAllByRole('img', { name: /product image/i })[0] as HTMLImageElement
    expect(heroImage.src).toContain(mockImages[1])
  })

  it('adds the active border class to the selected thumbnail', () => {
    renderWithProviders(<ProductImages images={mockImages} />)

    const [, ...thumbnails] = screen.getAllByRole('img', { name: /product image/i })
    fireEvent.click(thumbnails[2])

    expect(thumbnails[2].className.split(' ')).toContain('border-orange-500')
    expect(thumbnails[0].className.split(' ')).not.toContain('border-orange-500')
  })
})

