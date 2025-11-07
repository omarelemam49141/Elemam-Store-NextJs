import { render, type RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import type { ReactElement, ReactNode } from 'react'

type ProvidersProps = {
  children: ReactNode
  theme?: 'light' | 'dark' | 'system'
}

function Providers({ children, theme = 'light' }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  providerProps?: Partial<ProvidersProps>
}

export function renderWithProviders(
  ui: ReactElement,
  { providerProps, ...renderOptions }: RenderWithProvidersOptions = {}
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers {...providerProps}>{children}</Providers>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'

