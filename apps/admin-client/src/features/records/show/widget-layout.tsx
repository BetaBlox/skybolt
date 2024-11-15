import { Dashboard } from '@repo/admin-config';
import { PageSection } from '@/widgets/core/page-section';
import { widgets } from '@/widgets';
import { AdminRecord } from '@repo/types/admin';
import { PageSectionHeading } from '@/widgets/core/page-section-heading';

interface Props {
  dashboard: Dashboard<unknown>;
  modelName: string;
  record: AdminRecord;
}

export function WidgetLayout({ dashboard, modelName, record }: Props) {
  const layouts = dashboard?.showPageWidgets || [];

  if (layouts.length === 0) {
    return null;
  }

  return (
    <div>
      {layouts.map((row, rowIndex) => (
        <PageSection key={rowIndex}>
          {row.heading ? (
            <PageSectionHeading>{row.heading}</PageSectionHeading>
          ) : null}
          <div className="grid grid-cols-12 gap-4">
            {row.components.map((comp) => {
              const Widget = widgets[comp.componentName];
              return (
                <div
                  key={comp.componentName}
                  className={`col-span-12 md:col-span-${comp.span}`}
                >
                  {Widget ? (
                    <Widget
                      dashboard={dashboard}
                      modelName={modelName}
                      record={record}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </PageSection>
      ))}
    </div>
  );
}
