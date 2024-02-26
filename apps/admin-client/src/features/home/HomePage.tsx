import PageHeader from '@/components/PageHeader';
import { modelDisplayName } from '@/config/admin';
import { DMMF } from 'database';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { camelize, routeWithParams } from 'utils';
import { MODEL } from '@/common/routes';

export default function HomePage() {
  const models = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await fetch('/api/models', {
        method: 'GET',
      });
      return res.json();
    },
  });

  if (models.isPending) return 'Loading...';
  if (models.isError) return 'Error loading data';

  return (
    <div>
      <PageHeader heading="Home" />
      {models.data.map((m: DMMF.Model) => (
        <div>
          <Link
            to={routeWithParams(MODEL, {
              modelName: camelize(m.name),
            })}
          >
            {modelDisplayName(m.name)}
          </Link>
        </div>
      ))}
    </div>
  );
}
