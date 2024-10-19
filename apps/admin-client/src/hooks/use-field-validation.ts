import { useState, useEffect } from 'react';
import { AdminModelField } from '@repo/types';

export function useFieldValidation(field: AdminModelField, value: string) {
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState<boolean>(false);

  const validateField = (value: string | number) => {
    let errorMessage: string | null = null;

    // Check if the field is required and empty
    const length = String(value).trim().length;
    if (field.isRequired && length === 0) {
      errorMessage = 'This field is required.';
    }

    setDirty(true);
    setError(errorMessage);
  };

  useEffect(() => {
    if (field.isRequired && dirty) {
      validateField(value || '');
    }
  }, [value, field, dirty]);

  return { error, validateField, dirty };
}
