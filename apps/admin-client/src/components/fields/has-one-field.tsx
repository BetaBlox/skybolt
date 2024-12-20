import FieldLabel from './record-field-label';
import { useQuery } from '@tanstack/react-query';
import {
  ModelField,
  RecordsPayload,
  HasOneAttributeType,
  SelectOption,
} from '@repo/types/admin';
import { getDashboard } from '@repo/admin-config';
import { RecordApi } from '@/api/RecordApi';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/select';
import { Spinner } from '@/components/spinner';

interface Props {
  field: ModelField;
  modelName: string;
  attribute: string;
  attributeType: HasOneAttributeType;
  value: string;
  onChange: (key: string, value: string | number) => void;
}
export default function RelationshipHasOneField({
  field,
  attributeType,
  value = '',
  onChange,
}: Props) {
  const { modelName } = attributeType;

  const recordsQuery = useQuery({
    queryKey: ['hasOne', modelName],
    queryFn: async () =>
      RecordApi.findMany(modelName!, 1, 1000).then(({ data }) => data), // Likely need to support searching AJAX instead of just loading everything
  });

  if (recordsQuery.isPending) return <Spinner />;
  if (recordsQuery.isError || !modelName) return 'Error loading data';

  const data = recordsQuery.data as RecordsPayload;
  const relatedDashboard = getDashboard(data.modelName);

  // TODO: paginated results are limited to 20, probably an issue
  const options: SelectOption[] = data.paginatedResult.data.map((r) => ({
    value: r.id,
    label: relatedDashboard.getDisplayName(r),
  }));

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Select
          // id={field.name}
          name={field.name}
          value={value}
          required={field.isRequired}
          onValueChange={(value: string) =>
            onChange(attributeType.sourceKey!, parseInt(value, 10))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select one" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
