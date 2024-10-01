import { useState, ChangeEvent, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/input';
import { routeWithParams } from '@repo/utils';
import { customFetch } from '@/common/custom-fetcher';
import { useDebounceValue } from 'usehooks-ts';
import PopoverWrapper from '@/components/popover-wrapper';
import { Link } from 'react-router-dom';
import { getDashboard } from '@repo/admin-config';

interface SearchResults {
  [modelName: string]: Record<string, unknown>[]; // Adjusted type for better type safety
}

const GlobalSearch = () => {
  const [query, setQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [debouncedValue] = useDebounceValue(query, 500);

  const {
    data: searchResults,
    isFetching,
    isError,
  } = useQuery<SearchResults>({
    queryKey: ['globalSearch', debouncedValue],
    queryFn: async () => {
      const url = routeWithParams('/api/search', {
        query: debouncedValue,
      });
      const { response, data } = await customFetch(url);

      if (!response.ok) throw new Error('Failed to fetch search results');
      return data;
    },
    enabled: !!debouncedValue, // Only run the query if there's a debounced value
  });

  // Update the query state and control dropdown visibility
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(!!value);
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.search-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder="Search across all data..."
        className="mr-2 h-8 flex-1"
      />

      <PopoverWrapper
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        className="right-0 sm:w-[300px]"
      >
        {isFetching && <LoadingMessage />}
        {isError && <ErrorMessage />}
        {!isFetching && searchResults && Object.keys(searchResults).length > 0
          ? Object.entries(searchResults).map(([modelName, results]) => (
              <div key={modelName} className="border-b border-gray-200">
                <h3 className="px-4 py-2 text-sm font-bold uppercase text-gray-700">
                  {modelName}
                </h3>
                {results.map((record, index) => (
                  <SearchResult
                    key={index}
                    modelName={modelName}
                    record={record}
                  />
                ))}
              </div>
            ))
          : !isFetching && debouncedValue && <NoResultsMessage />}
      </PopoverWrapper>
    </div>
  );
};

interface SearchResultProps {
  modelName: string;
  record: Record<string, unknown>;
}
const SearchResult = ({ modelName, record }: SearchResultProps) => {
  const dashboard = getDashboard(modelName);

  return (
    <Link
      to={routeWithParams(`/models/:modelName/:id`, {
        modelName: modelName.toLowerCase(),
        id: String(record.id),
      })}
      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
    >
      <span className="line-clamp-1">{dashboard.getDisplayName(record)}</span>
    </Link>
  );
};

const LoadingMessage = () => (
  <div className="p-4 text-gray-500">Loading...</div>
);

const ErrorMessage = () => (
  <div className="p-4 text-red-500">
    An error occurred while searching. Please try again.
  </div>
);

const NoResultsMessage = () => (
  <div className="p-4 text-gray-500">No results found.</div>
);

export default GlobalSearch;
