import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  interactive?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const cardVariants = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  elevated: 'bg-white border border-neutral-200 shadow-md',
  outlined: 'bg-white border-2 border-neutral-200 shadow-none',
  ghost: 'bg-transparent border-none shadow-none'
};

const paddingVariants = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
};

const headerPaddingVariants = {
  none: '',
  sm: 'px-3 pt-3',
  md: 'px-4 pt-4',
  lg: 'px-6 pt-6',
  xl: 'px-8 pt-8'
};

const contentPaddingVariants = {
  none: '',
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-6',
  xl: 'px-8'
};

const footerPaddingVariants = {
  none: '',
  sm: 'px-3 pb-3',
  md: 'px-4 pb-4',
  lg: 'px-6 pb-6',
  xl: 'px-8 pb-8'
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    hoverable = false,
    interactive = false,
    children,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        // 基础样式
        'rounded-xl transition-all duration-200',
        // 变体样式
        cardVariants[variant],
        // 内边距
        padding !== 'none' && paddingVariants[padding],
        // 悬停效果
        hoverable && 'hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1',
        // 交互效果
        interactive && 'cursor-pointer hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, separator = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        separator && 'border-b border-neutral-200 pb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-neutral-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-neutral-600 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'none', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-neutral-700',
        padding !== 'none' && contentPaddingVariants[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, separator = false, padding = 'none', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        separator && 'border-t border-neutral-200 pt-4',
        padding !== 'none' && footerPaddingVariants[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

// 预设卡片组合
export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const FeatureCard = ({ title, description, icon, action, className }: FeatureCardProps) => (
  <Card variant="elevated" hoverable className={cn('group', className)}>
    <CardHeader>
      {icon && (
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-200 transition-colors">
          {icon}
        </div>
      )}
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    {action && (
      <CardFooter separator>
        {action}
      </CardFooter>
    )}
  </Card>
);

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon,
  className 
}: StatsCardProps) => (
  <Card variant="elevated" className={cn('relative overflow-hidden', className)}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardDescription>{title}</CardDescription>
        {icon && (
          <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center text-primary-600 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-neutral-900 mb-2">
        {value}
      </div>
      {(subtitle || trendValue) && (
        <div className="flex items-center space-x-2 text-sm">
          {subtitle && <span className="text-neutral-600">{subtitle}</span>}
          {trendValue && (
            <span
              className={cn(
                'font-medium',
                trend === 'up' && 'text-green-600',
                trend === 'down' && 'text-red-600',
                trend === 'neutral' && 'text-neutral-600'
              )}
            >
              {trendValue}
            </span>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);