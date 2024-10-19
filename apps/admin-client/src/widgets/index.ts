import PageHeader from '@/widgets/core/page-header';
import { PageSection } from '@/widgets/core/page-section';
import { PageSectionHeading } from '@/widgets/core/page-section-heading';
import CollectionTable from '@/widgets/models/collection-table';
import { KpiCards } from '@/widgets/models/kpi-cards';
import DeleteRecordCard from '@/widgets/records/show/delete-record-card';
import HasManyTable from '@/widgets/records/show/has-many-table';
import { HasOneRelationshipsCard } from '@/widgets/records/show/has-one-relationships-card';
import RecordDetailsCard from '@/widgets/records/show/record-details-card';
import RelatedCollectionTabs from '@/widgets/records/show/related-collection-tabs';
import { ImpersonateUserCard } from '@/widgets/users/impersonate-user-card';
import { UpdatePasswordCard } from '@/widgets/users/update-password-card';

const widgets: Record<string, React.ElementType> = {
  // Core
  PageHeader: PageHeader,
  PageSection: PageSection,
  PageSectionHeading: PageSectionHeading,

  // Model widgets
  CollectionTable: CollectionTable,
  KpiCards: KpiCards,

  // Record show widgets
  RecordDetailsCard: RecordDetailsCard,
  DeleteRecordCard: DeleteRecordCard,
  RelatedCollectionTabs: RelatedCollectionTabs,
  HasManyTable: HasManyTable,
  HasOneRelationshipsCard: HasOneRelationshipsCard,

  // User widgets
  UpdatePasswordCard: UpdatePasswordCard,
  ImpersonateUserCard: ImpersonateUserCard,
};

export { widgets };
