import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-brand focus-visible:ring-primary-500',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-[0_4px_14px_0_rgb(245_158_11_/_0.15)] focus-visible:ring-secondary-500',
  outline: 'border border-neutral-200 bg-background hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 shadow-xs focus-visible:ring-primary-500',
  ghost: 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 focus-visible:ring-primary-500',
  link: 'text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 focus-visible:ring-primary-500 p-0 h-auto',
  destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500'
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg'
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          // 基础样式
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // 变体样式
          buttonVariants[variant],
          // 尺寸样式
          buttonSizes[size],
          // 全宽样式
          fullWidth && 'w-full',
          // 加载状态
          loading && 'cursor-wait',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className={cn(
              'animate-spin text-current',
              size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : size === 'xl' ? 'w-6 h-6' : 'w-4 h-4',
              (leftIcon || children) && 'mr-2'
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className={cn(
            'flex-shrink-0',
            children && 'mr-2',
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : size === 'xl' ? 'w-6 h-6' : 'w-4 h-4'
          )}>
            {leftIcon}
          </span>
        )}
        
        {children && (
          <span className={cn(loading && !leftIcon && 'ml-2')}>
            {children}
          </span>
        )}
        
        {!loading && rightIcon && (
          <span className={cn(
            'flex-shrink-0',
            children && 'ml-2',
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : size === 'xl' ? 'w-6 h-6' : 'w-4 h-4'
          )}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

// 预设按钮组合
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="outline" {...props} />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
);

export const LinkButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="link" {...props} />
);

export const DestructiveButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="destructive" {...props} />
);