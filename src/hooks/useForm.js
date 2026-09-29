// src/hooks/useForm.js  (Question 9)
// Generic controlled-form hook: values, errors, handleChange, handleSubmit,
// reset, isValid. Contains no JSX — hook rule compliant.

import { useState, useCallback, useMemo } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as the user edits it.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (onValid) => {
      const foundErrors = validate(values) || {};
      setErrors(foundErrors);
      if (Object.keys(foundErrors).length > 0) return;
      try {
        setIsSubmitting(true);
        await onValid(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate]
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return { values, errors, handleChange, handleSubmit, reset, isValid, isSubmitting };
}
