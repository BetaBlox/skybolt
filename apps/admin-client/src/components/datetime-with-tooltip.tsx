// DateTimeWithTooltip.tsx
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';

interface DateTimeWithTooltipProps {
  date: string | Date; // Accept both string and Date types
}

const DateTimeWithTooltip: React.FC<DateTimeWithTooltipProps> = ({ date }) => {
  // Convert to Date object if a string is passed
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Get the abbreviated date (e.g., '3 days ago', 'Jan 1')
  const abbreviatedDate =
    formatDistanceToNow(dateObj, { addSuffix: true }) ||
    format(dateObj, 'MMM d, yyyy, HH:mm');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="text-left">{abbreviatedDate}</TooltipTrigger>
        <TooltipContent>
          {format(dateObj, 'yyyy-MM-dd HH:mm:ss')} UTC
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DateTimeWithTooltip;
