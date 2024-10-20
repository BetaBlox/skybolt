import { useState, useEffect } from 'react';
import {
  AdminAttributeType,
  AdminFieldType,
  AdminModelField,
} from '@repo/types';

export function useFieldValidation(
  field: AdminModelField,
  attributeType: AdminAttributeType,
  value: string,
) {
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState<boolean>(false);

  const validateField = (value: string | number) => {
    let errorMessage: string | null = null;

    const trimmedVal = String(value).trim();

    // Check if the field is required and empty
    const length = trimmedVal.length;
    if (field.isRequired && length === 0) {
      errorMessage = 'This field is required.';
    }

    // MinLength validation for string fields
    if (
      (attributeType.type === AdminFieldType.STRING ||
        attributeType.type === AdminFieldType.TEXT) &&
      attributeType.minLength &&
      length < attributeType.minLength
    ) {
      errorMessage = `This field must be at least ${attributeType.minLength} characters.`;
    }

    // MaxLength validation for string fields
    if (
      (attributeType.type === AdminFieldType.STRING ||
        attributeType.type === AdminFieldType.TEXT) &&
      attributeType.maxLength &&
      length > attributeType.maxLength
    ) {
      errorMessage = `This field must be no more than ${attributeType.maxLength} characters.`;
    }

    // Email validation logic
    if (attributeType.type === AdminFieldType.EMAIL && trimmedVal) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmedVal)) {
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // URL validation logic
    if (attributeType.type === AdminFieldType.URL && trimmedVal) {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(trimmedVal)) {
        errorMessage = 'Please enter a valid URL.';
      }
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
