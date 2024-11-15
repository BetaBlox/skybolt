import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import HasManyTable from '@/widgets/records/show/has-many-table';
import { Dashboard } from '@repo/admin-config';
import {
  FieldType,
  HasManyAttributeType,
  AdminRecord,
} from '@repo/types/admin';
import { captilalize } from '@repo/utils';

interface Props {
  dashboard: Dashboard<unknown>;
  modelName: string;
  record: AdminRecord;
}
export default function RelatedCollectionTabs({ dashboard, record }: Props) {
  const hasManyAttributes = dashboard.attributeTypes.filter(
    (attr) => attr.type === FieldType.RELATIONSHIP_HAS_MANY,
  ) as HasManyAttributeType[];

  if (hasManyAttributes.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={hasManyAttributes[0].name}>
      <TabsList className="h-14 pl-0">
        {hasManyAttributes.map((attributeType) => (
          <TabsTrigger
            key={attributeType.name}
            value={attributeType.name}
            className="h-14 rounded-bl-none rounded-br-none text-lg data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-t data-[state=active]:shadow-none"
          >
            {captilalize(attributeType.name)}
          </TabsTrigger>
        ))}
      </TabsList>
      {hasManyAttributes.map((attributeType) => (
        <TabsContent
          key={attributeType.name}
          value={attributeType.name}
          className="mt-0 rounded-lg rounded-tl-none border-b border-l border-r bg-white pt-10 shadow-md"
        >
          <div className="">
            <HasManyTable attributeType={attributeType} record={record} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
