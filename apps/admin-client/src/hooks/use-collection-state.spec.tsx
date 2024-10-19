import { Filter } from '@/widgets/models/filter-form';
import {
  useCollectionState,
  UseCollectionStateReturn,
} from '@/hooks/use-collection-state';
import {
  AdminFieldType,
  AdminFilterOperator,
  SortDirection,
} from '@repo/types';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

function HookWrapper({ children }: { children: () => JSX.Element }) {
  return <>{children()}</>;
}

const defaultArgs = {
  defaultPage: 1,
  defaultPerPage: 10,
  defaultSortField: 'id',
  defaultSortOrder: SortDirection.ASC,
};

describe('useCollectionState Hook', () => {
  function renderHookInRouter(hook: () => UseCollectionStateReturn): {
    result: UseCollectionStateReturn;
  } {
    let result: unknown;
    render(
      <BrowserRouter>
        <HookWrapper>
          {() => {
            result = hook();
            return <div></div>;
          }}
        </HookWrapper>
      </BrowserRouter>,
    );
    return { result: result as UseCollectionStateReturn };
  }

  // Re-render to reflect the state update
  function getResults() {
    return renderHookInRouter(() => useCollectionState(defaultArgs)).result;
  }

  it('should initialize state with default values', () => {
    const { result } = renderHookInRouter(() =>
      useCollectionState(defaultArgs),
    );

    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
    expect(result.sortField).toBe('id');
    expect(result.sortOrder).toBe(SortDirection.ASC);
    expect(result.filters).toEqual([]);
  });

  it('should update page state', () => {
    const { result } = renderHookInRouter(() =>
      useCollectionState(defaultArgs),
    );

    act(() => {
      result.setPage(2);
    });

    const updatedResult = getResults();
    expect(updatedResult.page).toBe(2);
  });

  it('should update perPage state', () => {
    const { result } = renderHookInRouter(() =>
      useCollectionState(defaultArgs),
    );

    act(() => {
      result.setPerPage(20);
    });

    const updatedResult = getResults();
    expect(updatedResult.perPage).toBe(20);
  });

  it('should update sortField and sortOrder', () => {
    const { result } = renderHookInRouter(() =>
      useCollectionState(defaultArgs),
    );

    act(() => {
      result.updateSort('name');
    });

    const updatedResult = getResults();
    expect(updatedResult.sortField).toBe('name');
    expect(updatedResult.sortOrder).toBe(SortDirection.ASC);
  });

  describe('filters', () => {
    it('should apply a new filter', () => {
      const { result } = renderHookInRouter(() =>
        useCollectionState(defaultArgs),
      );

      const newFilter: Filter = {
        modelName: 'User',
        type: AdminFieldType.STRING,
        field: 'status',
        operator: AdminFilterOperator.EQUALS,
        value: 'active',
      };

      act(() => {
        result.applyFilter(newFilter);
      });

      const updatedResult = getResults();
      expect(updatedResult.filters).toEqual([newFilter]);
    });

    it('should reset page when filter changes', () => {
      const { result } = renderHookInRouter(() =>
        useCollectionState(defaultArgs),
      );

      act(() => {
        result.setPage(2);
      });

      act(() => {
        const filter: Filter = {
          modelName: 'User',
          type: AdminFieldType.STRING,
          field: 'status',
          operator: AdminFilterOperator.EQUALS,
          value: 'active',
        };
        result.applyFilter(filter);
      });

      const updatedResult = getResults();
      expect(updatedResult.page).toBe(1); // Reset to page 1 after filters change
    });

    it('should clear filters', () => {
      const { result } = renderHookInRouter(() =>
        useCollectionState(defaultArgs),
      );

      act(() => {
        const filter: Filter = {
          modelName: 'User',
          type: AdminFieldType.STRING,
          field: 'status',
          operator: AdminFilterOperator.EQUALS,
          value: 'active',
        };
        result.applyFilter(filter);
      });

      act(() => {
        result.resetFilters();
      });

      const updatedResult = getResults();
      expect(updatedResult.filters).toEqual([]);
      expect(updatedResult.page).toBe(1); // Reset to page 1 after filters clear
    });
  });
});
