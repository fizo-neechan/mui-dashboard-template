import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

import { PaginatedResponse, PaginationParams } from './pagination.types';

// Type for the fetch function that will be passed to the hook
export type FetchFunction<T> = (params: PaginationParams) => Promise<PaginatedResponse<T>>;

// Options interface extending React Query options
export interface UsePaginatedQueryOptions<T> extends Omit<UseQueryOptions<PaginatedResponse<T>, Error, PaginatedResponse<T>>, 'queryKey' | 'queryFn'> {
  initialParams?: Partial<PaginationParams>;
  queryKeyPrefix: string[];
}

export function usePaginatedQuery<T>(
  fetchFn: FetchFunction<T>,
  options: UsePaginatedQueryOptions<T>
) {
  // Initialize pagination parameters with defaults and any provided initial values
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    ...options.initialParams
  });

  // Create the query key by combining the prefix with the pagination parameters
  const queryKey = [...options.queryKeyPrefix, paginationParams];

  // Set up the React Query hook
  const query = useQuery<PaginatedResponse<T>, Error>({
    queryKey,
    queryFn: () => fetchFn(paginationParams),
    staleTime: Infinity,
    ...options
  });

  // Pagination control functions
  const goToPage = useCallback((page: number) => {
    setPaginationParams(prev => ({
      ...prev,
      page
    }));
  }, []);

  const nextPage = useCallback(() => {
    if (query.data?.hasNext) {
      setPaginationParams(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  }, [query.data?.hasNext]);

  const previousPage = useCallback(() => {
    if (query.data?.hasPrevious) {
      setPaginationParams(prev => ({
        ...prev,
        page: prev.page - 1
      }));
    }
  }, [query.data?.hasPrevious]);

  const setLimit = useCallback((limit: number) => {
    setPaginationParams(prev => ({
      ...prev,
      page: 1,
      limit
    }));
  }, []);

  const setSearch = useCallback((searchTerm: string) => {
    setPaginationParams(prev => ({
      ...prev,
      page: 1,
      searchTerm
    }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPaginationParams(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  }, []);

  return {
    ...query,
    paginationParams,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    setSearch,
    setSort,
    currentPage: query.data?.currentPage ?? paginationParams.page,
    totalPages: query.data?.totalPages ?? 0,
    hasNext: query.data?.hasNext ?? false,
    hasPrevious: query.data?.hasPrevious ?? false,
  };
}