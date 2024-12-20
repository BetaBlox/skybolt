import { Link } from 'react-router-dom';
import { captilalize, routeWithParams } from '@repo/utils';
import { Dashboard, getDashboard } from '@repo/admin-config';
import { FieldType, HasOneAttributeType, AdminRecord } from '@repo/types/admin';
import { MODEL_RECORD } from '@/common/routes';

interface Props {
  dashboard: Dashboard<unknown>;
  modelName: string;
  record: AdminRecord;
}

export const HasOneRelationshipsCard = ({ dashboard, record }: Props) => {
  const { attributeTypes } = dashboard;
  const hasOneAttributes = attributeTypes.filter(
    (attr) => attr.type === FieldType.RELATIONSHIP_HAS_ONE,
  ) as HasOneAttributeType[];

  if (hasOneAttributes.length === 0) {
    return null;
  }

  return (
    <div>
      <dl className="divide-y divide-gray-100">
        {hasOneAttributes.map((attribute) => {
          const relatedRecord = record[attribute.name] as AdminRecord;
          const dashboard = getDashboard(attribute.modelName);

          if (!relatedRecord) {
            console.error(`No related record found for ${attribute.name}`);
            return null;
          }

          return (
            <div
              key={relatedRecord.id}
              className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-bold leading-6 text-gray-900">
                {captilalize(attribute.modelName)}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Link
                  to={routeWithParams(MODEL_RECORD, {
                    modelName: attribute.modelName,
                    id: String(relatedRecord.id),
                  })}
                  className="underline"
                >
                  <span className="line-clamp-2">
                    {dashboard.getDisplayName(relatedRecord)}
                  </span>
                </Link>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};
