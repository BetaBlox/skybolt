import { captilalize } from '@repo/utils';
import { AdminFieldType, AdminRecord } from '@repo/types';
import { Dashboard, getAttributeType } from '@repo/admin-config';
import { Card, CardContent } from '@/components/card';
import ShowViewField from '@/widgets/records/show/show-view-field';

interface Props {
  dashboard: Dashboard<unknown>;
  modelName: string;
  record: AdminRecord;
}
export default function RecordDetailsCard({
  dashboard,
  modelName,
  record,
}: Props) {
  const { showAttributes } = dashboard;

  return (
    <Card>
      <CardContent>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-bold leading-6 text-gray-900">Id</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {record.id}
            </dd>
          </div>

          {showAttributes.map((attribute) => {
            const attributeType = getAttributeType(modelName, attribute);

            return (
              <div
                key={attributeType.name}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="text-sm font-bold leading-6 text-gray-900">
                  {captilalize(attributeType.name)}
                </dt>
                {attributeType.type === AdminFieldType.JSON ? (
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <pre>
                      <ShowViewField
                        record={record}
                        modelName={modelName}
                        attribute={attribute}
                      />
                    </pre>
                  </dd>
                ) : (
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <ShowViewField
                      record={record}
                      modelName={modelName}
                      attribute={attribute}
                    />
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
