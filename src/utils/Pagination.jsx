import React from 'react';
import "../utils/pagination.css"

const Pagination = ({ currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination">
      <span
        onClick={() => {   
            if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }}}
        className={currentPage === 1 ? 'disabled' : ''}
      >
        ◀️
      </span>

      {[...Array(totalPages)].map((_, i) => (
        <span
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </span>
      ))}

      <span
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        className={currentPage === totalPages ? 'disabled' : ''}
      >
        ▶️
      </span>
    </div>
  );
};

export default Pagination;
