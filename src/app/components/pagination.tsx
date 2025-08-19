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

    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push({
        type: 'button',
        key: 'prev',
        page: currentPage - 1,
        label: '←',
        isActive: false,
      });
    }

    // First page
    if (startPage > 1) {
      pages.push({
        type: 'button',
        key: 1,
        page: 1,
        label: '1',
        isActive: false,
      });
      if (startPage > 2) {
        pages.push({
          type: 'dots',
          key: 'dots1',
          label: '...',
        });
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        type: 'button',
        key: i,
        page: i,
        label: i.toString(),
        isActive: i === currentPage,
      });
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push({
          type: 'dots',
          key: 'dots2',
          label: '...',
        });
      }
      pages.push({
        type: 'button',
        key: totalPages,
        page: totalPages,
        label: totalPages.toString(),
        isActive: false,
      });
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push({
        type: 'button',
        key: 'next',
        page: currentPage + 1,
        label: '→',
        isActive: false,
      });
    }

    return pages;
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