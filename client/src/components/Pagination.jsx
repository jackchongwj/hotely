import React from 'react';
import ReactPaginate from 'react-paginate';

function Pagination({ currentPage, pageCount, handlePageChange }) {
  return (
    <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
      pageCount={pageCount}
      onPageChange={handlePageChange}
      containerClassName={'pagination'}
      previousLinkClassName={'pagination__link'}
      nextLinkClassName={'pagination__link'}
      disabledClassName={'pagination__link--disabled'}
      activeClassName={'pagination__link--active'}
      forcePage={currentPage}
    />
  );
}

export default Pagination;