// src/hooks/useDebounce.js  (Question 9)
// Generic debounce hook: returns `value` only after it has stopped
// changing for `delay` ms. Replaces the manual ref-based debounce
// written by hand in Question 5.

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timerId); // clear on every keystroke / unmount
  }, [value, delay]);

  return debounced;
}
