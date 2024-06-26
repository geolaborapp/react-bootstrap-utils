import React from 'react';
import PropTypes from 'prop-types';

import { safeClick } from '../utils/event-handlers';
import { formatClasses } from '../utils/attributes';

export function Dropdown({
  children,
  items,
  onSelect,
  isDisabled,
  isOpen,
  onTouchStart,
  onMouseEnter,
  onMouseLeave,
  template,
  className,
  itemClassName,
  menuClassName,
  listContainerRef,
}) {
  return (
    <div
      className={formatClasses(['dropdown', className, isOpen && 'show', isDisabled && 'disabled'])}
      {...{ onTouchStart, onMouseEnter, onMouseLeave }}
    >
      {children}

      {items.length > 0 && (
        <div
          className={formatClasses(['dropdown-menu', menuClassName, isOpen && 'show'])}
          // aria-labelledby="dropdownMenuButton"
          style={{ maxHeight: '200px', overflowY: 'auto' }}
          ref={listContainerRef}
        >
          {items.map(({ label, value, isDisabled }, index) => (
            <a
              key={`l[${label}]v[${value}]i[${index}]`}
              href="#"
              className={formatClasses(['dropdown-item', isDisabled && 'disabled', itemClassName])}
              onClick={safeClick(onSelect, { value, index, label })}
            >
              {template(label, value, index)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

Dropdown.defaultProps = {
  isOpen: false,
  template: (v) => v,
};

Dropdown.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onSelect: PropTypes.func,
  onTouchStart: PropTypes.func,
  template: PropTypes.func,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  menuClassName: PropTypes.string,
};
