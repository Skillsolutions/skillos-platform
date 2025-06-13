import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { useValidation } from '@/lib/validation/hooks';
import { sanitizeInput } from '@/lib/security/sanitization';
import { z } from 'zod';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  schema?: z.ZodSchema<any>;
  sanitizationType?: 'text' | 'email' | 'phone' | 'employeeId' | 'search';
  onValidatedChange?: (value: string, isValid: boolean) => void;
  showValidation?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  schema,
  sanitizationType = 'text',
  onValidatedChange,
  showValidation = true,
  validateOnBlur = true,
  validateOnChange = false,
  debounceMs = 300,
  className = '',
  ...props
}) => {
  const [value, setValue] = React.useState(props.value || '');
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const debounceRef = React.useRef<NodeJS.Timeout>();

  const validateValue = React.useCallback((val: string) => {
    if (!schema) return true;

    try {
      schema.parse(val);
      setError(undefined);
      return true;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0]?.message || 'Invalid value');
      }
      return false;
    }
  }, [schema]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue, sanitizationType);
    
    setValue(sanitizedValue);
    
    if (validateOnChange && schema) {
      setIsValidating(true);
      
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Debounce validation
      debounceRef.current = setTimeout(() => {
        const isValid = validateValue(sanitizedValue);
        setIsValidating(false);
        onValidatedChange?.(sanitizedValue, isValid);
      }, debounceMs);
    } else {
      onValidatedChange?.(sanitizedValue, true);
    }
    
    props.onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validateOnBlur && schema) {
      const isValid = validateValue(value as string);
      onValidatedChange?.(value as string, isValid);
    }
    
    props.onBlur?.(e);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasError = showValidation && !!error;
  const inputClassName = `${className} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className={hasError ? 'text-red-500' : ''}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          {...props}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClassName}
        />
        
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  schema?: z.ZodSchema<any>;
  onValidatedChange?: (value: string, isValid: boolean) => void;
  showValidation?: boolean;
  validateOnBlur?: boolean;
  maxLength?: number;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  label,
  schema,
  onValidatedChange,
  showValidation = true,
  validateOnBlur = true,
  maxLength,
  className = '',
  ...props
}) => {
  const [value, setValue] = React.useState(props.value || '');
  const [error, setError] = React.useState<string | undefined>();

  const validateValue = React.useCallback((val: string) => {
    if (!schema) return true;

    try {
      schema.parse(val);
      setError(undefined);
      return true;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0]?.message || 'Invalid value');
      }
      return false;
    }
  }, [schema]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Apply max length if specified
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    setValue(newValue);
    onValidatedChange?.(newValue, true);
    props.onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (validateOnBlur && schema) {
      const isValid = validateValue(value as string);
      onValidatedChange?.(value as string, isValid);
    }
    
    props.onBlur?.(e);
  };

  const hasError = showValidation && !!error;
  const textareaClassName = `${className} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className={hasError ? 'text-red-500' : ''}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <textarea
          {...props}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${textareaClassName}`}
        />
        
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {(value as string).length}/{maxLength}
          </div>
        )}
      </div>
      
      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  schema?: z.ZodSchema<any>;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onValidatedChange?: (value: string, isValid: boolean) => void;
  showValidation?: boolean;
  placeholder?: string;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  label,
  schema,
  options,
  onValidatedChange,
  showValidation = true,
  placeholder,
  className = '',
  ...props
}) => {
  const [value, setValue] = React.useState(props.value || '');
  const [error, setError] = React.useState<string | undefined>();

  const validateValue = React.useCallback((val: string) => {
    if (!schema) return true;

    try {
      schema.parse(val);
      setError(undefined);
      return true;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0]?.message || 'Invalid value');
      }
      return false;
    }
  }, [schema]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const isValid = validateValue(newValue);
    onValidatedChange?.(newValue, isValid);
    props.onChange?.(e);
  };

  const hasError = showValidation && !!error;
  const selectClassName = `${className} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className={hasError ? 'text-red-500' : ''}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <select
        {...props}
        value={value}
        onChange={handleChange}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${selectClassName}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

