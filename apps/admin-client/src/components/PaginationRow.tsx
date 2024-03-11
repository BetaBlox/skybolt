import { PaginatedResult } from '@repo/types';
import { classNames } from '@repo/utils';

interface Props {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  paginatedResult?: PaginatedResult<any>;
  onPageChange: (page: number) => void;
  onPerPageChange: (page: number) => void;
}
export default function PaginationRow({
  paginatedResult,
  onPageChange,
  // onPerPageChange,
}: Props) {
  if (!paginatedResult) {
    return null;
  }

  const { meta } = paginatedResult;
  const { total, currentPage, lastPage, perPage, prev, next } = meta;

  const handlePrevClick = () => prev && onPageChange(currentPage - 1);
  const handleNextClick = () => next && onPageChange(currentPage + 1);

  const prevDisabled = prev === null;
  const nextDisabled = next === null;
  const pageMin = prevDisabled ? 1 : perPage * (currentPage - 1);
  const pageMax = nextDisabled ? total : perPage * currentPage;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
      <div className="flex flex-1 items-center justify-between sm:hidden">
        <button
          className={classNames(
            'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
            prevDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
          onClick={handlePrevClick}
          disabled={prevDisabled}
        >
          Previous
        </button>
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{lastPage}</span>
          </p>
        </div>
        <button
          className={classNames(
            'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
            nextDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
          onClick={handleNextClick}
          disabled={nextDisabled}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{pageMin}</span> to{' '}
            <span className="font-medium">{pageMax}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <button
            className={classNames(
              'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
              prevDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
            onClick={handlePrevClick}
            disabled={prevDisabled}
          >
            Previous
          </button>
          <button
            className={classNames(
              'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
              nextDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
            onClick={handleNextClick}
            disabled={nextDisabled}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
