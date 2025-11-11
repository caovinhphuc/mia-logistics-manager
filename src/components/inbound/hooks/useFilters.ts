import { useState, useCallback } from 'react';
import { Filters, InboundItem } from '../types/inbound';

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    status: [],
    carrier: [],
    destination: [],
    product: [],
    category: [],
    documentStatus: [],
    timelineStatus: [],
  });

  const [filterExpanded, setFilterExpanded] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(
    null
  );

  const toggleFilter = useCallback(
    (filterType: keyof Filters, value: string) => {
      setFilters((prev) => {
        const currentValues = prev[filterType];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];

        return {
          ...prev,
          [filterType]: newValues,
        };
      });
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      status: [],
      carrier: [],
      destination: [],
      product: [],
      category: [],
      documentStatus: [],
      timelineStatus: [],
    });
  }, []);

  const getActiveFilterCount = useCallback(() => {
    return Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0
    );
  }, [filters]);

  const getFilterSummary = useCallback(() => {
    const activeFilters = [];
    if (filters.status.length > 0)
      activeFilters.push(`Trạng thái: ${filters.status.length}`);
    if (filters.carrier.length > 0)
      activeFilters.push(`Nhà vận chuyển: ${filters.carrier.length}`);
    if (filters.destination.length > 0)
      activeFilters.push(`Đích đến: ${filters.destination.length}`);
    if (filters.product.length > 0)
      activeFilters.push(`Sản phẩm: ${filters.product.length}`);
    if (filters.category.length > 0)
      activeFilters.push(`Phân loại: ${filters.category.length}`);
    return activeFilters.join(', ');
  }, [filters]);

  const applyFilters = useCallback(
    (items: InboundItem[]) => {
      return items.filter((item) => {
        // Status filter
        if (
          filters.status.length > 0 &&
          !filters.status.includes(item.status)
        ) {
          return false;
        }

        // Carrier filter
        if (
          filters.carrier.length > 0 &&
          item.carrier &&
          !filters.carrier.includes(item.carrier)
        ) {
          return false;
        }

        // Destination filter
        if (
          filters.destination.length > 0 &&
          !filters.destination.includes(item.destination)
        ) {
          return false;
        }

        // Product filter
        if (
          filters.product.length > 0 &&
          !filters.product.includes(item.product)
        ) {
          return false;
        }

        // Category filter
        if (
          filters.category.length > 0 &&
          !filters.category.includes(item.category)
        ) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    filterExpanded,
    activeFilterSection,
    setFilterExpanded,
    setActiveFilterSection,
    toggleFilter,
    clearAllFilters,
    getActiveFilterCount,
    getFilterSummary,
    applyFilters,
  };
};
