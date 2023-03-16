import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import App from '../App';

jest.mock('../components/Footer', () => () => <div data-testid="footer" />);
jest.mock('../components/ScrollToTop', () => () => (
  <div data-testid="scroll-to-top" />
));
jest.mock('../components/TopNavBar', () => ({
  TopNavBar: ({ toggleDarkMode }: { toggleDarkMode: () => void }) => (
    <div data-testid="top-nav-bar">
      <button onClick={toggleDarkMode} data-testid="toggle-dark-mode" />
    </div>
  ),
}));
jest.mock('../pages/NotFound', () => () => <div data-testid="not-found" />);
jest.mock('../pages/Station', () => () => <div data-testid="station" />);
jest.mock('../pages/Train', () => () => <div data-testid="train" />);
jest.mock('../pages/Home', () => () => <div data-testid="home" />);

const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

const createMatchMedia = (matches: boolean) => {
  return (query: string): MediaQueryList => ({
    matches: matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

describe('App', () => {
  beforeEach(() => {
    const headEl = document.createElement('head');
    document.body.appendChild(headEl);
    ['light', 'dark'].forEach((colorScheme) => {
      const metaEl = document.createElement('meta');
      metaEl.setAttribute('name', 'theme-color');
      metaEl.setAttribute('media', `(prefers-color-scheme: ${colorScheme})`);
      headEl.appendChild(metaEl);
    });
  });

  it('should render home page on default route', async () => {
    renderWithRouter(<App />);

    expect(await screen.findByTestId('home')).toBeDefined();
  });

  it('should render station page on station route', async () => {
    renderWithRouter(<App />, { route: '/Turenki' });

    expect(await screen.findByTestId('station')).toBeDefined();
  });

  it('should render train page on train route', async () => {
    renderWithRouter(<App />, { route: '/train/123/2023-03-03' });

    expect(await screen.findByTestId('train')).toBeDefined();
  });

  it('should render not found page when route is invalid', async () => {
    renderWithRouter(<App />, { route: '/invalid/route' });

    expect(await screen.findByTestId('not-found')).toBeDefined();
  });

  it.each([true, false])(
    'should set theme based on CSS media query prefers-color-scheme',
    async (matchesMediaQuery) => {
      window.matchMedia = createMatchMedia(matchesMediaQuery);

      renderWithRouter(<App />);

      if (matchesMediaQuery) {
        expect(await screen.findByTestId('app')).toHaveClass('dark');
      } else {
        expect(await screen.findByTestId('app')).not.toHaveClass('dark');
      }
    }
  );

  it('should switch theme when top nav bar toggles dark mode', async () => {
    window.matchMedia = createMatchMedia(false);
    const colorThemeQuerySelector =
      'meta[media="(prefers-color-scheme: light)"]';

    renderWithRouter(<App />);

    expect(await screen.findByTestId('app')).not.toHaveClass('dark');

    expect(
      document.querySelector(colorThemeQuerySelector)?.getAttribute('content')
    ).toBe('rgb(249, 249, 251)');

    const toggleDarkModeButton = await screen.findByTestId('toggle-dark-mode');
    fireEvent.click(toggleDarkModeButton);

    expect(await screen.findByTestId('app')).toHaveClass('dark');

    expect(
      document.querySelector(colorThemeQuerySelector)?.getAttribute('content')
    ).toBe('#1e1e1e');
  });
});
