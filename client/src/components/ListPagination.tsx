import React from 'react';
import { ModelListAction } from '../reducers/modelList';

type ListPaginationProps = {
  page: number;
  totalCount: number;
  dispatch: React.Dispatch<ModelListAction>;
};

export default function ListPagination({
  page,
  totalCount,
  dispatch,
}: ListPaginationProps) {
  const pageNumbers = [];

  for (let i = 0; i < Math.ceil(totalCount / 10); ++i) {
    pageNumbers.push(i);
  }

  if (totalCount <= 10) {
    return null;
  }

  return (
    <nav className='pageContainer'>
      <div className="pagination">
        {pageNumbers.map((number) => {
          const isCurrent = number === page;
          return (
            <li
              className={isCurrent ? 'page-item active' : 'page-item'}
              onClick={() => dispatch({ type: 'SET_PAGE', page: number })}
              key={number}
            >
              <button className="page-link">{number + 1}</button>
            </li>
          );
        })}
      </div>
    </nav>
  );
}
