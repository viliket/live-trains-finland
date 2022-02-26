import { render, screen } from '@testing-library/react';

import App from './App';

jest.mock('react-i18next', () => ({
  // This mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  Trans: ({ children }: { children?: React.ReactNode }) => children,
}));

test('renders logo', () => {
  render(<App />);
  const logoElement = screen.getByText(/logo.svg/i);
  expect(logoElement).toBeInTheDocument();
});
