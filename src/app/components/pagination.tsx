"use client";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 5,
  showInfo = true,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationData = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const sidePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    if (currentPage <= sidePages + 1) {
      endPage = Math.min(totalPages - 1, maxVisiblePages);
    }
    if (currentPage >= totalPages - sidePages) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    pages.push(1);
    if (startPage > 2) pages.push('...');

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);


    const pageItems = pages.map((p, index) =>
      typeof p === 'string'
        ? { type: 'dots' as const, key: `dots-${index}`, label: '...' }
        : {
            type: 'button' as const,
            key: p,
            page: p,
            label: p.toString(),
            isActive: p === currentPage,
          }
    );


    if (currentPage > 1) {
      pageItems.unshift({ type: 'button', key: 'prev', page: currentPage - 1, label: '←', isActive: false });
    }
    if (currentPage < totalPages) {
      pageItems.push({ type: 'button', key: 'next', page: currentPage + 1, label: '→', isActive: false });
    }

    return pageItems;
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getInfoText = () => {
    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `Mostrando ${start} - ${end} de ${totalItems} elementos`;
  };

  if (!paginationData || totalPages <= 1) {
    return showInfo && totalItems > 0 ? (
      <div className="pagination-info">
        {getInfoText()}
      </div>
    ) : null;
  }

  return (
    <div className="pagination-container">
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          {getInfoText()}
        </div>
      )}
      
      <div className="pagination">
        {paginationData.map((item) => {
          if (item.type === 'dots') {
            return (
              <span key={item.key} className="pagination-dots">
                {item.label}
              </span>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => handlePageChange(item.page!)}
              className={`pagination-btn ${item.isActive ? 'pagination-btn--active' : ''}`}
              disabled={item.isActive}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}