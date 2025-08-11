import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  label?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  label?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const inputVariants = {
  default: 'border-neutral-200 bg-white focus:border-primary-500 focus:ring-primary-500',
  filled: 'border-transparent bg-neutral-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
  outlined: 'border-2 border-neutral-200 bg-white focus:border-primary-500 focus:ring-0'
};

const inputSizes = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base'
};

const textareaSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    variant = 'default', 
    size = 'md',
    error = false,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    label,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              // 基础样式
              'flex w-full rounded-lg border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // 变体样式
              inputVariants[variant],
              // 尺寸样式
              inputSizes[size],
              // 错误状态
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              // 图标间距
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // 全宽
              fullWidth && 'w-full',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            'text-xs',
            error ? 'text-red-600' : 'text-neutral-500'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    error = false,
    helperText,
    fullWidth = false,
    label,
    resize = 'vertical',
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(
            // 基础样式
            'flex w-full rounded-lg border transition-colors',
            'placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // 变体样式
            inputVariants[variant],
            // 尺寸样式
            textareaSizes[size],
            // 错误状态
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            // 调整大小
            `resize-${resize}`,
            // 全宽
            fullWidth && 'w-full',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {helperText && (
          <p className={cn(
            'text-xs',
            error ? 'text-red-600' : 'text-neutral-500'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// 表单字段组件
export interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, error, className }, ref) => (
    <div ref={ref} className={cn('space-y-1', className)}>
      {children}
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
);

FormField.displayName = 'FormField';

// 表单标签组件
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-neutral-700',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
);

FormLabel.displayName = 'FormLabel';

// 表单组件
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, spacing = 'md', children, ...props }, ref) => {
    const spacingClasses = {
      sm: 'space-y-3',
      md: 'space-y-4',
      lg: 'space-y-6'
    };
    
    return (
      <form
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

export { Input, Textarea, FormField, FormLabel, Form };

// 搜索输入框组件
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, loading = false, ...props }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue || '');
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value as string);
      }
      props.onKeyDown?.(e);
    };
    
    const handleClear = () => {
      setValue('');
      onClear?.();
    };
    
    return (
      <Input
        ref={ref}
        {...props}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
        onKeyDown={handleKeyDown}
        leftIcon={
          loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )
        }
        rightIcon={
          value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )
        }
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };