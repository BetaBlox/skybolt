import { HOME } from '@/common/routes';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

export type Breadcrumb = {
  href: string;
  text: string;
  current: boolean;
};

interface Props {
  heading: string;
  breadcrumbs?: Breadcrumb[];
  actions?: JSX.Element | null;
}
export default function PageHeader({
  heading,
  breadcrumbs = [],
  actions = null,
}: Props) {
  return (
    <div className="mb-10">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <div>
                <Link to={HOME} className="text-gray-400 hover:text-gray-500">
                  <HomeIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </div>
            </li>
            {breadcrumbs.map((page) => (
              <li key={page.text}>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link
                    to={page.href}
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    aria-current={page.current ? 'page' : undefined}
                  >
                    {page.text}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="mt-4 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
            {heading}
          </h1>
        </div>
        {actions && (
          <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
