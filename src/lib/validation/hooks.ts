import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface UseValidationReturn<T> {
  errors: ValidationError[];
  isValid: boolean;
  validate: (data: T) => boolean;
  validateField: (field: keyof T, value: any) => boolean;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
  getFieldError: (field: keyof T) => string | undefined;
  hasFieldError: (field: keyof T) => boolean;
}

export function useValidation<T>(schema: z.ZodSchema<T>): UseValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback((data: T): boolean => {
    try {
      schema.parse(data);
      setErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        setErrors(validationErrors);
        return false;
      }
      return false;
    }
  }, [schema]);

  const validateField = useCallback((field: keyof T, value: any): boolean => {
    try {
      // For field validation, we'll validate the entire object with just this field
      // This is a simplified approach for the demo
      const testData = { [field]: value } as Partial<T>;
      
      // Try to validate just this field by creating a partial schema
      if ('shape' in schema && schema.shape) {
        const fieldSchema = (schema.shape as any)[field];
        if (fieldSchema) {
          fieldSchema.parse(value);
          // Remove any existing errors for this field
          setErrors(prev => prev.filter(error => error.field !== String(field)));
          return true;
        }
      }
      
      // Fallback: just clear errors for this field since we can't validate partial
      setErrors(prev => prev.filter(error => error.field !== String(field)));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError: ValidationError = {
          field: String(field),
          message: error.errors[0]?.message || 'Invalid value',
        };
        
        // Update errors for this field
        setErrors(prev => [
          ...prev.filter(error => error.field !== String(field)),
          fieldError,
        ]);
        return false;
      }
      return false;
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => prev.filter(error => error.field !== String(field)));
  }, []);

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return errors.find(error => error.field === String(field))?.message;
  }, [errors]);

  const hasFieldError = useCallback((field: keyof T): boolean => {
    return errors.some(error => error.field === String(field));
  }, [errors]);

  const isValid = errors.length === 0;

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
  };
}

// Hook for form validation with React Hook Form integration
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const validation = useValidation(schema);

  const validateForm = useCallback((data: T) => {
    const isValid = validation.validate(data);
    
    if (!isValid) {
      // Return errors in React Hook Form format
      const formErrors: Record<string, { message: string }> = {};
      validation.errors.forEach(error => {
        formErrors[error.field] = { message: error.message };
      });
      return formErrors;
    }
    
    return {};
  }, [validation]);

  return {
    ...validation,
    validateForm,
  };
}

// Hook for real-time field validation
export function useFieldValidation<T>(
  schema: z.ZodSchema<T>,
  field: keyof T,
  debounceMs: number = 300
) {
  const [error, setError] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    async (value: any) => {
      setIsValidating(true);
      
      // Debounce validation
      await new Promise(resolve => setTimeout(resolve, debounceMs));
      
      try {
        // Try to validate just this field
        if ('shape' in schema && schema.shape) {
          const fieldSchema = (schema.shape as any)[field];
          if (fieldSchema) {
            fieldSchema.parse(value);
            setError(undefined);
          }
        } else {
          // Fallback: just clear errors for this field since we can't validate partial
          setError(undefined);
        }
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          setError(validationError.errors[0]?.message || 'Invalid value');
        }
      } finally {
        setIsValidating(false);
      }
    },
    [schema, field, debounceMs]
  );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    error,
    isValidating,
    validateField,
    clearError,
    hasError: !!error,
  };
}

