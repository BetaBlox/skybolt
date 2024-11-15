import { MODEL_RECORD } from '@/common/routes';
import DateTimeWithTooltip from '@/components/datetime-with-tooltip';
import { createLocalDate } from '@/lib/date';
import { getAttributeType, getDashboard } from '@repo/admin-config';
import { FieldType, HasOneAttributeType } from '@repo/types/admin';
import { routeWithParams } from '@repo/utils';
import { format } from 'date-fns';
import { ExternalLinkIcon, MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminRecord = Record<string, unknown> & { id: number };

interface Props {
  record: AdminRecord;
  modelName: string;
  attribute: string;
}
export default function CollectionViewField({
  record,
  modelName,
  attribute,
}: Props): React.ReactNode {
  const attributeType = getAttributeType(modelName, attribute);
  const { type } = attributeType;
  const value = record[attributeType.name];

  if (type === FieldType.JSON) {
    return <JsonField value={value} />;
  } else if (type === FieldType.BOOLEAN) {
    return <BooleanField value={value} />;
  } else if (type === FieldType.DATETIME) {
    return <DateTimeWithTooltip date={String(value)} />;
  } else if (type === FieldType.RELATIONSHIP_HAS_ONE) {
    return <HasOneField record={record} attributeType={attributeType} />;
  } else if (type === FieldType.URL) {
    return <UrlField value={value} />;
  } else if (type === FieldType.DATE) {
    return <DateField value={value} />;
  } else if (type === FieldType.IMAGE) {
    return <ImageField value={value} />;
  } else if (type === FieldType.EMAIL) {
    return <EmailField value={value} />;
  } else {
    return <StringField value={value} />;
  }
}

const StringField = ({ value }: { value: unknown }) => {
  return String(value);
};

const EmailField = ({ value }: { value: unknown }) => {
  return (
    <a
      href={`mailto:${String(value)}`}
      className="flex flex-row items-center gap-x-2 underline"
    >
      <MailIcon className="h-4 w-4" />
      {String(value)}
    </a>
  );
};

const JsonField = ({ value }: { value: unknown }) => {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
};

const BooleanField = ({ value }: { value: unknown }) => {
  return value === true ? 'yes' : 'no';
};

const ImageField = ({ value }: { value: unknown }) => {
  return value ? <img src={String(value)} className="h-12" /> : null;
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
  attributeType: HasOneAttributeType;
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
