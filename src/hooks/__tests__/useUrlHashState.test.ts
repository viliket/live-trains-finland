import { renderHook, act } from '@testing-library/react';

import { useUrlHashState } from '../useUrlHashState';

describe('useUrlHashState', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useUrlHashState('#test'));
    expect(result.current[0]).toBe(false);
  });

  it('should update state on hashchange event', () => {
    const { result } = renderHook(() => useUrlHashState('#test'));
    expect(result.current[0]).toBe(false);

    // Simulate a hashchange event as jsdom does not support this
    // https://github.com/jsdom/jsdom/issues/1565
    act(() => {
      window.location.hash = '#test';
      window.dispatchEvent(new Event('hashchange'));
    });

    expect(result.current[0]).toBe(true);
  });

  it('should update the URL hash when setting state to true', () => {
    const { result } = renderHook(() => useUrlHashState('#test'));
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(window.location.hash).toBe('#test');
  });

  it('should go back in history when setting state to false and current hash matches', () => {
    window.location.hash = '#test';
    const { result } = renderHook(() => useUrlHashState('#test'));
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](false);
      // Simulate a hashstate event as jsdom does not support this
      // See https://github.com/jsdom/jsdom/issues/1565
      window.location.hash = '';
      window.dispatchEvent(new Event('hashchange'));
    });

    expect(result.current[0]).toBe(false);
    expect(window.location.hash).toBe('');
  });

  it('should set state to false when setting state to false and current hash does not match', () => {
    window.history.pushState({}, '', '#other');
    const { result } = renderHook(() => useUrlHashState('#test'));
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(window.location.hash).toBe('#other');
  });
});
