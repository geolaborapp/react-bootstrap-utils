import React from 'react';
import PropTypes from 'prop-types';

import { safeClick } from '../utils/event-handlers';
import { formatClasses } from '../utils/attributes';

export function ListGroupItem({ index, isActive, isDisabled, item, linked, onSelect, background, children }) {
  const classes = formatClasses([
    'list-group-item',
    isActive && 'active',
    isDisabled && 'disabled',
    linked && 'list-group-item-action',
    background && `list-group-item-${background}`,
  ]);

  const onClick = safeClick(onSelect, index, item);

  if (linked) {
    return (
      <a href="#" className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <li className={classes} onClick={onClick}>
      {children}
    </li>
  );
}

ListGroupItem.defaultProps = {
  isActive: false,
};

ListGroupItem.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  item: PropTypes.object.isRequired,
  linked: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  background: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
};
