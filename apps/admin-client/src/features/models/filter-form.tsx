import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Dashboard } from '@repo/admin-config';
import {
  AdminFieldType,
  AdminFilterOperator,
  AdminFilterType,
} from '@repo/types';
import { captilalize } from '@repo/utils';
import { ChangeEvent, useState } from 'react';

export interface Filter {
  modelName: string;
  field: string;
  operator: string;
  value: string;
  type: string;
}

export interface FilterOption {
  modelName: string; // The model name (e.g., "User", "Wedding")
  field: string; // The field name within the model (e.g., "firstName")
  label: string; // The display label for the filter (e.g., "First Name")
  type: string; // The data type of the field (e.g., "string", "number")
  groupLabel: string; // The label for grouping (e.g., "User Fields")
}

interface GroupedFilterOption {
  label: string; // The group label (e.g., "User Fields")
  items: FilterOption[]; // Array of FilterOptions belonging to this group
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
    modelName: '',
    field: '',
    operator: '',
    value: '',
    type: '',
  });

  const filterOptions = getFilterOptions(dashboard);

  const handleFieldChange = (filterOption: FilterOption) => {
    const { modelName, field: fieldName, type: fieldType } = filterOption;

    setFilter({
      ...filter,
      modelName: modelName,
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
      setFilter({
        modelName: '',
        field: '',
        operator: '',
        value: '',
        type: '',
      });
    }
  };

  const groupedFilterOptions = groupFilterOptions(
    filterOptions,
    dashboard.modelName,
  );

  return (
    <div className="mb-4 rounded-md bg-gray-100 p-4">
      <div className="flex flex-row gap-2">
        <Select value={filter.field}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>

          <SelectContent>
            {groupedFilterOptions.map((groupFilterOption) => (
              <SelectGroup key={groupFilterOption.label}>
                <SelectLabel>{groupFilterOption.label}</SelectLabel>
                {groupFilterOption.items.map((option) => (
                  <SelectItem
                    key={`${option.modelName}.${option.field}`}
                    value={option.field}
                    onMouseDown={() => handleFieldChange(option)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.operator}
          onValueChange={handleOperatorChange}
          disabled={!filter.field}
        >
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilter();
              }
            }}
            placeholder="Enter value"
            className="max-w-[300px]"
            disabled={!filter.operator}
          />
        )}

        <Button
          onClick={handleApplyFilter}
          type="button"
          disabled={!filter.field || !filter.operator || !filter.value}
        >
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

  // Iterate over each attribute in the collectionFilterAttributes array
  dashboard.collectionFilterAttributes.forEach((attributeName) => {
    const attribute = dashboard.attributeTypes.find(
      (attr) => attr.name === attributeName,
    );

    // Ensure that the attribute exists in attributeTypes
    if (attribute) {
      if (
        attribute.type === AdminFieldType.RELATIONSHIP_HAS_ONE &&
        attribute.relatedAttributes
      ) {
        // Add related fields from related models
        attribute.relatedAttributes.forEach((relatedAttr) => {
          options.push({
            groupLabel: captilalize(attribute.name),
            // We're using the related model name as the modelName to handle
            // situations where the prisma model relationship is not the same
            // as the admin model name (e.g., "User" in the db vs "Author" as the relationship name)
            modelName: attribute.name,
            field: relatedAttr.name,
            label: captilalize(relatedAttr.name),
            type: adminFieldTypeToFilterType(relatedAttr.type),
          });
        });
      } else {
        // Add the direct field from the current model
        options.push({
          groupLabel: dashboard.modelName, // Current model name
          modelName: dashboard.modelName, // The model name this field belongs to
          field: attribute.name, // Direct attribute name
          label: captilalize(attribute.name),
          type: adminFieldTypeToFilterType(attribute.type),
        });
      }
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

function groupFilterOptions(
  collection: FilterOption[],
  prioritizeKey: string,
): GroupedFilterOption[] {
  // Validate input parameters
  if (!Array.isArray(collection) || typeof prioritizeKey !== 'string') {
    throw new Error('Invalid input parameters');
  }

  // Step 1: Group the collection by the specified groupLabel key
  const grouped = collection.reduce<Record<string, FilterOption[]>>(
    (result, filterOption) => {
      const groupKey = filterOption.groupLabel;
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(filterOption);
      return result;
    },
    {},
  );

  // Step 2: Convert the grouped object back into an array
  const groupedArray: GroupedFilterOption[] = Object.entries(grouped).map(
    ([groupKey, items]) => ({
      label: groupKey,
      items,
    }),
  );

  // Step 3: Sort the array, placing the prioritizeKey group at the front
  groupedArray.sort((a, b) => {
    if (a.label === prioritizeKey) return -1;
    if (b.label === prioritizeKey) return 1;
    return a.label.localeCompare(b.label); // Fallback to alphabetical sorting
  });

  return groupedArray;
}

export default FilterForm;
