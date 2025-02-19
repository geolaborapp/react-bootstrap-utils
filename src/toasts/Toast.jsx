import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { formatClasses } from '../utils/attributes';

import { ToastsContext } from './toasts-helpers';

export function Toast({ id, type, message, closeControl, position, noStyle }) {
  const toastsState = useContext(ToastsContext);
  const shouldShow = useMemo(() => Boolean(toastsState?.get(position)), [position, toastsState]);

  return (
    <div className={formatClasses(['toast', shouldShow && 'show'])} style={noStyle ? null : { width: 'auto' }}>
      <div className={formatClasses(['toast-body', 'alert', 'mb-0', `alert-${type}`, closeControl && 'd-flex'])}>
        <div>{message}</div>

        {closeControl && (
          <button
            type="button"
            className="btn-close ms-2 m-auto"
            onClick={() => toastsState.close(position, id)}
            data-bs-dismiss="toast"
            aria-label="Close"
          />
        )}
      </div>
    </div>
  );
}
export const toastPropsBaseShape = {
  closeControl: PropTypes.bool,
  message: PropTypes.string.isRequired,
  noStyle: PropTypes.bool,
  position: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
Toast.propTypes = {
  id: PropTypes.number.isRequired,
  ...toastPropsBaseShape,
};
