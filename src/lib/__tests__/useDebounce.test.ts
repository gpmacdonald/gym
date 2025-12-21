import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated' });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Advance time by less than delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Advance time past delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Rapid updates
    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abc' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abcd' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Still should be original value
    expect(result.current).toBe('a');

    // Wait full delay from last change
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('abcd');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should work with different types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 42 } }
    );

    expect(result.current).toBe(42);

    rerender({ value: 100 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(100);
  });
});
