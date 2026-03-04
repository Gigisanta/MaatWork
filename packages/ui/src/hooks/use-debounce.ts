"use client";

import { useEffect, useState } from "react";

/**
 * A hook that returns a debounced value.
 * Useful for reducing the frequency of expensive operations like API calls during typing.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
