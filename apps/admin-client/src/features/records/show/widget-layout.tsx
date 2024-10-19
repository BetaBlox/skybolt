import React from 'react';
import { UpdatePasswordCard } from '@/widgets/users/update-password-card';
import { Dashboard } from '@repo/admin-config';
import { PageSection } from '@/components/page-section';
import { ImpersonateUserCard } from '@/widgets/users/impersonate-user-card';

const customComponentMap: Record<string, React.ElementType> = {
  UpdatePasswordCard: UpdatePasswordCard,
  ImpersonateUserCard: ImpersonateUserCard,
};

interface Props {
  dashboard: Dashboard<unknown>;
  modelName: string;
  record: {
    id: number;
    [key: string]: unknown;
  };
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
          <div className="grid grid-cols-12 gap-4">
            {row.components.map((comp) => {
              const CustomComponent = customComponentMap[comp.componentName];
              return (
                <div
                  key={comp.componentName}
                  className={`col-span-12 md:col-span-${comp.span}`}
                >
                  {CustomComponent ? (
                    <CustomComponent
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
