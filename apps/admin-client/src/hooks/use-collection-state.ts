import { Filter } from '@/widgets/models/filter-form';
import { SortDirection, SortOrder } from '@repo/types/sort';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseCollectionStateProps {
  defaultPage?: number;
  defaultPerPage?: number;
  defaultSortField?: string;
  defaultSortOrder?: SortOrder;
}

export interface UseCollectionStateReturn {
  page: number;
  perPage: number;
  sortField: string;
  sortOrder: SortOrder;
  filters: Filter[];
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  updateSort: (newSortField: string) => void;
  applyFilter: (filter: Filter) => void;
  removeFilter: (index: number) => void;
  resetFilters: () => void;
}

export function useCollectionState({
  defaultPage = 1,
  defaultPerPage = 10,
  defaultSortField = 'id',
  defaultSortOrder = SortDirection.ASC,
}: UseCollectionStateProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination state
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get('page') || String(defaultPage), 10),
  );
  const [perPage, setPerPage] = useState<number>(
    parseInt(searchParams.get('perPage') || String(defaultPerPage), 10),
  );

  // Sorting state
  const [sortField, setSortField] = useState<string>(
    searchParams.get('sortField') || defaultSortField,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || defaultSortOrder,
  );

  // Filtering state
  const [filters, setFilters] = useState<Filter[]>(() => {
    const filterParam = searchParams.get('filters');
    return filterParam ? JSON.parse(filterParam) : [];
  });

  // Sync state to URL query params
  useEffect(() => {
    setSearchParams({
      page: String(page),
      perPage: String(perPage),
      sortField,
      sortOrder,
      filters: JSON.stringify(filters),
    });
  }, [page, perPage, sortField, sortOrder, filters, setSearchParams]);

  // Functions to modify the state
  const updateSort = (newSortField: string) => {
    if (newSortField === sortField) {
      setSortOrder(
        sortOrder === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC,
      );
    } else {
      setSortField(newSortField);
      setSortOrder(SortDirection.ASC);
    }
    setPage(1); // Reset to first page when sorting changes
  };

  const applyFilter = (filter: Filter) => {
    setFilters((prev) => [...prev, filter]);
    setPage(1); // Reset to first page when a filter is applied
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setPage(1); // Reset to first page when a filter is removed
  };

  const resetFilters = () => {
    setFilters([]);
    setPage(1); // Reset to first page when filters are cleared
  };

  return {
    page,
    perPage,
    sortField,
    sortOrder,
    filters,
    setPage,
    setPerPage,
    updateSort,
    applyFilter,
    removeFilter,
    resetFilters,
  };
}
