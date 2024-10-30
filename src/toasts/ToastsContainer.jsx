import React from 'react';
import PropTypes from 'prop-types';

import { ToastsContext, TOASTS_VALID_POSITIONS } from './toasts-helpers';
import { ToastsRegion } from './ToastsRegion';
import { useToastState } from './useToastState';
import { toastPropsBaseShape } from './Toast';

export function ToastsContainer({ children, unique, noStyle, messageFormatter, customToasts, onClose }) {
  const toastsState = useToastState({ unique, messageFormatter, customToasts, onClose });

  return (
    <ToastsContext.Provider value={toastsState}>
      {children}

      <div className="toast-container">
        {TOASTS_VALID_POSITIONS.map((position) => (
          <ToastsRegion key={position} name={position} toasts={toastsState.get(position)} noStyle={noStyle} />
        ))}
      </div>
    </ToastsContext.Provider>
  );
}

ToastsContainer.defaultProps = {
  noStyle: false,
  unique: true,
};

ToastsContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  noStyle: PropTypes.bool,
  unique: PropTypes.bool,
  messageFormatter: PropTypes.func,
  customToasts: PropTypes.arrayOf(
    PropTypes.shape({
      ...toastPropsBaseShape,
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  onClose: PropTypes.func,
};
