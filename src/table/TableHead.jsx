import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'js-var-type';

import { getColumnClass } from './table-helpers';

export function TableHead({
  columns,
  hasActions,
  actionLabel,
  columnHeaderFormat,
  sortableHeaderIconFormat,
  sortOptions,
  setSortOptions,
}) {
  const changeSort = useCallback(
    (attribute) => {
      setSortOptions((prevState) => {
        const attributeChanged = prevState.sortBy !== attribute;
        const order = !attributeChanged && prevState.sortOrder === 'ASC' ? 'DESC' : 'ASC';

        return {
          sortBy: attribute,
          sortOrder: order,
        };
      });
    },
    [setSortOptions]
  );

  const buildSortingHeader = useCallback(
    (column) => (
      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            changeSort(column?.attribute);
          }}
          className="mr-1"
        >
          {isFunction(sortableHeaderIconFormat) ? (
            sortableHeaderIconFormat(column, sortOptions)
          ) : sortOptions.sortBy === column?.attribute ? (
            sortOptions.sortOrder === 'ASC' ? (
              <i className="bi bi-arrow-down"></i>
            ) : (
              <i className="bi bi-arrow-up"></i>
            )
          ) : (
            <i className="bi bi-arrow-down-up"></i>
          )}
        </a>
        {column?.label}
      </div>
    ),
    [changeSort, sortOptions, sortableHeaderIconFormat]
  );

  const renderHeaderContent = useCallback(
    (column) => {
      if (isFunction(columnHeaderFormat)) {
        return columnHeaderFormat(column);
      }

      if (column?.isSortable) {
        return buildSortingHeader(column);
      }

      return column?.label;
    },
    [buildSortingHeader, columnHeaderFormat]
  );

  return (
    <thead>
      <tr>
        {columns?.map((column, columnIndex) => (
          <th key={columnIndex} className={getColumnClass(column)}>
            {renderHeaderContent(column)}
          </th>
        ))}
        {hasActions && <th className="text-center">{actionLabel}</th>}
      </tr>
    </thead>
  );
}

TableHead.propTypes = {
  actionLabel: PropTypes.string,
  hasActions: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  columnHeaderFormat: PropTypes.func,
  sortableHeaderIconFormat: PropTypes.func,
  sortOptions: PropTypes.shape({
    sortBy: PropTypes.string,
    sortOrder: PropTypes.oneOf(['ASC', 'DESC']),
  }),
  setSortOptions: PropTypes.func.isRequired,
};
