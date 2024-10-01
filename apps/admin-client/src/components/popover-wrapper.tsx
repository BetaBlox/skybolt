import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';

interface PopoverWrapperProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
const PopoverWrapper = ({
  isOpen,
  onClose,
  children,
  className = '',
  ...props
}: PopoverWrapperProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close the popover if clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        'absolute z-10 mt-1 w-full max-w-md rounded-md border border-gray-300 bg-white shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PopoverWrapper;
