import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text input to remove potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  return email
    .toLowerCase()
    .replace(/[^\w@.-]/g, '') // Only allow word characters, @, ., and -
    .trim();
}

/**
 * Sanitize file names to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    return '';
  }
  
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255); // Limit length
}

/**
 * Sanitize URL to prevent malicious redirects
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }
  
  // Only allow http, https, and relative URLs
  const allowedProtocols = /^(https?:\/\/|\/)/;
  
  if (!allowedProtocols.test(url)) {
    return '';
  }
  
  return url
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
}

/**
 * Sanitize SQL input to prevent SQL injection
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b/gi, '') // Remove dangerous SQL keywords
    .trim();
}

/**
 * Sanitize search queries
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') {
    return '';
  }
  
  return query
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 100); // Limit length
}

/**
 * Sanitize user input for display
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>&'"]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&#x27;',
        '"': '&quot;',
      };
      return entities[char] || char;
    })
    .trim();
}

/**
 * Sanitize JSON input to prevent JSON injection
 */
export function sanitizeJson(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  try {
    // Parse and stringify to ensure valid JSON
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    return '';
  }
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }
  
  return phone
    .replace(/[^\d+\-\s\(\)]/g, '') // Only allow digits, +, -, spaces, and parentheses
    .trim();
}

/**
 * Sanitize employee ID
 */
export function sanitizeEmployeeId(id: string): string {
  if (typeof id !== 'string') {
    return '';
  }
  
  return id
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '') // Only allow uppercase letters, numbers, and hyphens
    .trim();
}

/**
 * Comprehensive input sanitizer that applies appropriate sanitization based on input type
 */
export function sanitizeInput(input: any, type: 'text' | 'html' | 'email' | 'url' | 'filename' | 'sql' | 'search' | 'phone' | 'employeeId' = 'text'): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  const stringInput = String(input);
  
  switch (type) {
    case 'html':
      return sanitizeHtml(stringInput);
    case 'email':
      return sanitizeEmail(stringInput);
    case 'url':
      return sanitizeUrl(stringInput);
    case 'filename':
      return sanitizeFileName(stringInput);
    case 'sql':
      return sanitizeSql(stringInput);
    case 'search':
      return sanitizeSearchQuery(stringInput);
    case 'phone':
      return sanitizePhoneNumber(stringInput);
    case 'employeeId':
      return sanitizeEmployeeId(stringInput);
    case 'text':
    default:
      return sanitizeText(stringInput);
  }
}

/**
 * Sanitize an entire object recursively
 */
export function sanitizeObject(obj: any, typeMap: Record<string, string> = {}): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, typeMap));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const sanitizationType = typeMap[key] || 'text';
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value, sanitizationType as any);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value, typeMap);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  return obj;
}

