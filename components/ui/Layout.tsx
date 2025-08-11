import React from 'react';
import { cn } from '@/lib/utils';

// 容器组件
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

const containerPadding = {
  none: '',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
  xl: 'px-12'
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    size = 'lg', 
    center = true,
    padding = 'md',
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-full',
        containerSizes[size],
        center && 'mx-auto',
        containerPadding[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Container.displayName = 'Container';

// 网格系统组件
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
};

const gridGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 1, 
    gap = 'md',
    responsive,
    children, 
    ...props 
  }, ref) => {
    const responsiveClasses = responsive ? [
      responsive.sm && `sm:grid-cols-${responsive.sm}`,
      responsive.md && `md:grid-cols-${responsive.md}`,
      responsive.lg && `lg:grid-cols-${responsive.lg}`,
      responsive.xl && `xl:grid-cols-${responsive.xl}`
    ].filter(Boolean).join(' ') : '';

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          gridCols[cols],
          gridGaps[gap],
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// 网格项组件
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  responsive?: {
    sm?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; start?: number; end?: number };
    md?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; start?: number; end?: number };
    lg?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; start?: number; end?: number };
    xl?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; start?: number; end?: number };
  };
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    span,
    start,
    end,
    responsive,
    children, 
    ...props 
  }, ref) => {
    const getSpanClass = (spanValue?: number, prefix = '') => 
      spanValue ? `${prefix}col-span-${spanValue}` : '';
    
    const getStartClass = (startValue?: number, prefix = '') => 
      startValue ? `${prefix}col-start-${startValue}` : '';
    
    const getEndClass = (endValue?: number, prefix = '') => 
      endValue ? `${prefix}col-end-${endValue}` : '';

    const responsiveClasses = responsive ? [
      responsive.sm && [
        getSpanClass(responsive.sm.span, 'sm:'),
        getStartClass(responsive.sm.start, 'sm:'),
        getEndClass(responsive.sm.end, 'sm:')
      ].join(' '),
      responsive.md && [
        getSpanClass(responsive.md.span, 'md:'),
        getStartClass(responsive.md.start, 'md:'),
        getEndClass(responsive.md.end, 'md:')
      ].join(' '),
      responsive.lg && [
        getSpanClass(responsive.lg.span, 'lg:'),
        getStartClass(responsive.lg.start, 'lg:'),
        getEndClass(responsive.lg.end, 'lg:')
      ].join(' '),
      responsive.xl && [
        getSpanClass(responsive.xl.span, 'xl:'),
        getStartClass(responsive.xl.start, 'xl:'),
        getEndClass(responsive.xl.end, 'xl:')
      ].join(' ')
    ].filter(Boolean).join(' ') : '';

    return (
      <div
        ref={ref}
        className={cn(
          getSpanClass(span),
          getStartClass(start),
          getEndClass(end),
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

// Flexbox 组件
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const flexDirections = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse'
};

const flexWraps = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse'
};

const flexJustify = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
};

const flexAlign = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
  baseline: 'items-baseline'
};

const flexGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row',
    wrap = 'nowrap',
    justify = 'start',
    align = 'stretch',
    gap = 'none',
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        flexDirections[direction],
        flexWraps[wrap],
        flexJustify[justify],
        flexAlign[align],
        flexGaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Flex.displayName = 'Flex';

// Stack 组件（垂直或水平排列）
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  divider?: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className, 
    direction = 'vertical',
    spacing = 'md',
    align = 'stretch',
    divider,
    children, 
    ...props 
  }, ref) => {
    const childrenArray = React.Children.toArray(children);
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          direction === 'vertical' ? flexGaps[spacing] : `space-x-${spacing === 'xs' ? '2' : spacing === 'sm' ? '4' : spacing === 'md' ? '6' : spacing === 'lg' ? '8' : spacing === 'xl' ? '12' : '0'}`,
          align === 'start' ? 'items-start' : 
          align === 'center' ? 'items-center' : 
          align === 'end' ? 'items-end' : 
          'items-stretch',
          className
        )}
        {...props}
      >
        {divider ? childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && divider}
          </React.Fragment>
        )) : children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// 分隔器组件
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ 
    className, 
    orientation = 'horizontal',
    variant = 'solid',
    spacing = 'md',
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-neutral-200',
        orientation === 'horizontal' ? [
          'w-full border-t',
          spacing === 'sm' ? 'my-2' :
          spacing === 'md' ? 'my-4' :
          spacing === 'lg' ? 'my-6' : 'my-0'
        ] : [
          'h-full border-l',
          spacing === 'sm' ? 'mx-2' :
          spacing === 'md' ? 'mx-4' :
          spacing === 'lg' ? 'mx-6' : 'mx-0'
        ],
        variant === 'dashed' ? 'border-dashed' :
        variant === 'dotted' ? 'border-dotted' : 'border-solid',
        className
      )}
      {...props}
    />
  )
);

Divider.displayName = 'Divider';

// 空状态组件
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    title,
    description,
    icon,
    action,
    size = 'md',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16'
    };

    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && (
          <div className={cn(
            'text-neutral-400 mb-4',
            iconSizes[size]
          )}>
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-neutral-600 mb-6 max-w-sm">
            {description}
          </p>
        )}
        {action}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';