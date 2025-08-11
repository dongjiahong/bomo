'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw] h-[95vh]'
};

const contentPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

const justifyVariants = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between'
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, closeOnEscape, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      
      {/* 模态框内容 */}
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-2xl transform transition-all',
          'max-h-[90vh] overflow-hidden flex flex-col',
          modalSizes[size],
          size === 'full' && 'h-[95vh]',
          'animate-scale-in',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="关闭"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    onClose,
    showCloseButton = false,
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-shrink-0 px-6 py-4 border-b border-neutral-200',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 leading-6 truncate pr-8">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-600 pr-8">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 rounded-lg p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="关闭"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, padding = 'md', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-1 overflow-auto',
        contentPadding[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalContent.displayName = 'ModalContent';

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, justify = 'end', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-shrink-0 px-6 py-4 border-t border-neutral-200 flex items-center space-x-3',
        justifyVariants[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalContent, ModalFooter };

// 预设模态框组合
export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'default',
  loading = false
}) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={title} />
      <ModalContent>
        <p className="text-neutral-700">{message}</p>
      </ModalContent>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  onClose,
  title,
  message,
  confirmText = '确认',
  variant = 'info'
}) => {
  const getIcon = () => {
    const iconClass = "w-6 h-6 flex-shrink-0";
    
    switch (variant) {
      case 'success':
        return (
          <svg className={cn(iconClass, "text-green-600")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={cn(iconClass, "text-yellow-600")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="7.86,2 16.14,2 22,13.5 12,22 2,13.5" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'error':
        return (
          <svg className={cn(iconClass, "text-red-600")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg className={cn(iconClass, "text-blue-600")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={title} />
      <ModalContent>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <p className="text-neutral-700 flex-1">{message}</p>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};