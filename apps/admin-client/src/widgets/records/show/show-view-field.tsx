import { MODEL_RECORD } from '@/common/routes';
import { createLocalDate } from '@/lib/date';
import { getAttributeType, getDashboard } from '@repo/admin-config';
import { AdminFieldType, AdminHasOneAttributeType } from '@repo/types';
import { routeWithParams } from '@repo/utils';
import { format } from 'date-fns';
import { ExternalLinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminRecord = Record<string, unknown> & { id: number };

interface Props {
  record: AdminRecord;
  modelName: string;
  attribute: string;
}
export default function ShowViewField({
  record,
  modelName,
  attribute,
}: Props): React.ReactNode {
  const attributeType = getAttributeType(modelName, attribute);
  const { type } = attributeType;
  const value = record[attributeType.name];

  if (type === AdminFieldType.JSON) {
    return <JsonField value={value} />;
  } else if (type === AdminFieldType.BOOLEAN) {
    return <BooleanField value={value} />;
  } else if (type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
    return <HasOneField record={record} attributeType={attributeType} />;
  } else if (type === AdminFieldType.URL) {
    return <UrlField value={value} />;
  } else if (type === AdminFieldType.DATE) {
    return <DateField value={value} />;
  } else if (type === AdminFieldType.IMAGE) {
    return <ImageField value={value} />;
  } else {
    return <StringField value={value} />;
  }
}

const StringField = ({ value }: { value: unknown }) => {
  return String(value);
};

const JsonField = ({ value }: { value: unknown }) => {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
};

const BooleanField = ({ value }: { value: unknown }) => {
  return value === true ? 'yes' : 'no';
};

const ImageField = ({ value }: { value: unknown }) => {
  return value ? (
    <div>
      <img src={String(value)} className="h-12" />
      <a
        href={String(value)}
        target="_blank"
        className="mt-2 flex flex-row items-center gap-x-2 underline"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="line-clamp-1">{String(value)}</span>
        <ExternalLinkIcon className="h-4 w-4" />
      </a>
    </div>
  ) : null;
};

const DateField = ({ value }: { value: unknown }) => {
  return value ? format(createLocalDate(String(value)), 'PPP') : '';
};

const UrlField = ({ value }: { value: unknown }) => {
  if (!value) return null;
  return (
    <a
      href={String(value)}
      target="_blank"
      className="flex flex-row items-center gap-x-2 underline"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="line-clamp-1">{String(value)}</span>
      <ExternalLinkIcon className="h-4 w-4" />
    </a>
  );
};

const HasOneField = ({
  record,
  attributeType,
}: {
  record: AdminRecord;
  attributeType: AdminHasOneAttributeType;
}) => {
  // Should we even be using modelName here? Shouldn't we simply use the attributeType.name
  const relationshipModelName = attributeType.modelName;
  const relationshipRecord = (record[relationshipModelName] ||
    record[attributeType.name]) as AdminRecord;

  if (!relationshipRecord) {
    throw new Error(
      "No relationship record found on your model. Did you forget to 'include' it with your query?",
    );
  }

  const relationshipDashboard = getDashboard(relationshipModelName);
  const recordDisplayName =
    relationshipDashboard.getDisplayName(relationshipRecord);

  return (
    <Link
      to={routeWithParams(MODEL_RECORD, {
        modelName: relationshipModelName,
        id: String(relationshipRecord.id),
      })}
      className="underline"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="line-clamp-2">{String(recordDisplayName)}</span>
    </Link>
  );
};
