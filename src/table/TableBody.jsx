import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'js-var-type';

import { safeClick } from '../utils/event-handlers';
import { getValueByPath } from '../utils/getters-setters';
import { sortData } from '../utils/sort';

import { getColumnClass } from './table-helpers';
import { TableActions } from './TableActions';

export function TableBody({ columns, docs, rowRole, rowClass, actions, onRowClick, sortOptions }) {
  const trRole = rowRole ?? isFunction(onRowClick) ? 'button' : 'row';
  const trOnClick = isFunction(onRowClick) ? onRowClick : () => {};

  const sortedDocs = useMemo(() => {
    if (sortOptions?.sortBy && sortOptions?.sortOrder) {
      return sortData(docs, sortOptions);
    }

    return docs;
  }, [docs, sortOptions]);

  return (
    <tbody>
      {sortedDocs?.map((doc, docIndex) => (
        <tr key={docIndex} className={rowClass(doc)} role={trRole} onClick={safeClick(trOnClick, doc, docIndex)}>
          {columns?.map((column, columnIndex) => (
            <td key={columnIndex} className={getColumnClass(column)}>
              {getColumnValue(doc, column, docIndex)}
            </td>
          ))}

          <TableActions doc={doc} docIndex={docIndex} actions={actions} />
        </tr>
      ))}
    </tbody>
  );
}

TableBody.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.object)]),
  columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  docs: PropTypes.arrayOf(PropTypes.object),
  rowRole: PropTypes.string,
  rowClass: PropTypes.func,
  onRowClick: PropTypes.func,
  sortOptions: PropTypes.shape({
    sortBy: PropTypes.string,
    sortOrder: PropTypes.oneOf(['ASC', 'DESC']),
  }),
};

function getColumnValue(doc, column, docIndex) {
  const rawValue = getValueByPath(doc, column.attribute);

  if (!column.format) {
    return rawValue;
  }

  return column.format(rawValue, doc, docIndex);
}
