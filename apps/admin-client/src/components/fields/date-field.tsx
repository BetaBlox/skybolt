'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/button';
import { Calendar } from '@/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { AdminAttributeType, AdminModelField } from '@repo/types';
import FieldLabel from '@/components/fields/record-field-label';
import { createLocalDate } from '@/lib/date';

interface Props {
  field: AdminModelField;
  attributeType: AdminAttributeType;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function DateField({ field, value, onChange }: Props) {
  const handleChange = (newDate: Date | undefined) => {
    if (newDate) {
      const newValue = format(newDate, 'yyyy-MM-dd');
      onChange(field.name, newValue);
    }
  };

  const date = value ? createLocalDate(value) : undefined;

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => handleChange(newDate)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
