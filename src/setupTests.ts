// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  /**
   * See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41179.
   */
  function expectToBeDefined<T>(value: T): asserts value is NonNullable<T>;
}

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

// Note: Temporary workaround to avoid @apollo/client HttpLink throwing error for missing global fetch
global.fetch = jest.fn();

global.expectToBeDefined = <T>(value: T) => expect(value).toBeDefined();
