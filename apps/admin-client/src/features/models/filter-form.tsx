import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { Dashboard } from '@repo/admin-config';
import {
  AdminFieldType,
  AdminFilterOperator,
  AdminFilterType,
} from '@repo/types';
import { captilalize } from '@repo/utils';
import { ChangeEvent, useState } from 'react';

export interface Filter {
  field: string;
  operator: string;
  value: string;
  type: string;
}

export interface FilterOption {
  field: string;
  label: string;
  type: string;
}

export interface OperatorOptions {
  [key: string]: string[];
}

const operatorOptions: OperatorOptions = {
  text: [
    AdminFilterOperator.CONTAINS,
    AdminFilterOperator.EQUALS,
    AdminFilterOperator.STARTS_WITH,
    AdminFilterOperator.ENDS_WITH,
  ],
  date: [
    AdminFilterOperator.EQUALS,
    AdminFilterOperator.GREATER_THAN,
    AdminFilterOperator.LESS_THAN,
  ],
  boolean: [AdminFilterOperator.EQUALS],
};

interface Props {
  dashboard: Dashboard<unknown>;
  onApplyFilter: (filter: Filter) => void;
  onClearFilters: () => void;
}
const FilterForm = ({ dashboard, onApplyFilter, onClearFilters }: Props) => {
  const [filter, setFilter] = useState<Filter>({
    field: '',
    operator: '',
    value: '',
    type: '',
  });

  const filterOptions = getFilterOptions(dashboard);

  const handleFieldChange = (fieldName: string) => {
    const fieldType =
      filterOptions.find((option) => option.field === fieldName)?.type || '';
    setFilter({
      ...filter,
      field: fieldName,
      operator: '',
      type: fieldType,
      value: '',
    });
  };

  const handleOperatorChange = (value: string) => {
    setFilter({ ...filter, operator: value });
  };

  const handleValueChange = (value: string) => {
    setFilter({ ...filter, value: value });
  };

  const handleApplyFilter = () => {
    if (filter.field && filter.operator) {
      onApplyFilter(filter);
      setFilter({ field: '', operator: '', value: '', type: '' });
    }
  };

  return (
    <div className="mb-4 rounded-md bg-gray-100 p-4">
      <div className="flex flex-row gap-2">
        <Select value={filter.field} onValueChange={handleFieldChange}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.field} value={option.field}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filter.operator} onValueChange={handleOperatorChange}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operatorOptions[filter.type]?.map((operator) => (
              <SelectItem key={operator} value={operator}>
                {operator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filter.type !== 'boolean' && (
          <Input
            type={filter.type === 'date' ? 'date' : 'text'}
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleValueChange(e.target.value)
            }
            placeholder="Enter value"
            className="max-w-[300px]"
          />
        )}

        <Button onClick={handleApplyFilter} type="button">
          Apply
        </Button>
        <Button onClick={onClearFilters} type="button" variant={'outline'}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

const getFilterOptions = (dashboard: Dashboard<unknown>): FilterOption[] => {
  if (!dashboard || !dashboard.collectionFilterAttributes) {
    return [];
  }

  const options: FilterOption[] = [];

  dashboard.collectionFilterAttributes.forEach((attribute) => {
    const field = dashboard.attributeTypes.find(
      (type) => type.name === attribute,
    );

    if (field) {
      options.push({
        field: field.name,
        label: captilalize(field.name),
        type: adminFieldTypeToFilterType(field.type),
      });
    }
  });

  return options;
};

const adminFieldTypeToFilterType = (fieldType: AdminFieldType): string => {
  switch (fieldType) {
    case AdminFieldType.STRING:
    case AdminFieldType.TEXT:
      return AdminFilterType.TEXT;
    case AdminFieldType.BOOLEAN:
      return AdminFilterType.BOOLEAN;
    case AdminFieldType.DATETIME:
      return AdminFilterType.DATE;
    case AdminFieldType.INTEGER:
      return AdminFilterType.NUMBER;
    default:
      return AdminFilterType.TEXT;
  }
};

export default FilterForm;
