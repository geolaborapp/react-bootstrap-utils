import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'js-var-type';

import { Dropdown } from '../mixed/Dropdown';
import { useOpenState } from '../utils/useOpenState';
import { formatClasses } from '../utils/attributes';

import { getSelectedOption, normalizeOptions } from './helpers/form-helpers';
import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export const UncontrolledFormDropdown = ({
  afterChange,
  childClassName,
  disabled,
  dropdownClassName,
  includeEmptyItem,
  itemClassName,
  listContainerRef,
  menuClassName,
  name,
  options,
  placeholder,
  template,
  toggleIcon,
  trackBy,
}) => {
  const dropdownRef = useRef(null);
  const state = useState('');

  const { getFormData, getValue, setValue: _setValue } = useUncontrolledFormControl(name, undefined, { state });

  const value = getValue();
  const items = normalizeOptions(options, getFormData());
  const selectedItem = useMemo(() => getSelectedOption(value, items, trackBy), [items, trackBy, value]);

  const { isOpen: _isOpen, open, close } = useOpenState();
  const isOpen = _isOpen();

  const setValue = useCallback(
    (v) => {
      if (disabled) {
        return;
      }

      const previousValue = getValue();

      _setValue(v);

      if (isFunction(afterChange)) {
        afterChange(v, previousValue);
      }
    },
    [_setValue, afterChange, disabled, getValue]
  );

  const onSelectItem = useCallback(
    ({ value }) => {
      setValue(value);
      close();
    },
    [close, setValue]
  );

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      return isOpen ? close() : open();
    }
  }, [close, disabled, isOpen, open]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    /* The logic in this effect allows the user to close the dropdown menu when they click outside of the component. */
    const pageClickEvent = (e) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [close, isOpen, open, disabled]);

  return (
    <div ref={dropdownRef}>
      <Dropdown
        isOpen={isOpen}
        isDisabled={disabled}
        items={includeEmptyItem ? [{ value: null, label: <div className="m-3"></div> }, ...items] : items}
        onSelect={onSelectItem}
        template={template}
        itemClassName={itemClassName}
        className={dropdownClassName}
        menuClassName={menuClassName}
        listContainerRef={listContainerRef}
      >
        <div
          className={formatClasses([
            'input-group justify-content-between form-control h-auto',
            childClassName,
            disabled && 'text-muted bg-light',
          ])}
          onClick={toggleDropdown}
        >
          {selectedItem ? (
            template(selectedItem.label, selectedItem.value)
          ) : (
            <div className="text-muted">{placeholder}</div>
          )}
          {toggleIcon(isOpen)}
        </div>
      </Dropdown>
    </div>
  );
};

UncontrolledFormDropdown.defaultProps = {
  includeEmptyItem: true,
  menuClassName: 'p-0 w-100',
  template: (x) => x,
  toggleIcon: function toggleIcon(isOpen) {
    return (
      <div className="d-flex align-items-center px-2">
        <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </div>
    );
  },
};

UncontrolledFormDropdown.propTypes = {
  afterChange: PropTypes.func,
  childClassName: PropTypes.string,
  disabled: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  includeEmptyItem: PropTypes.bool,
  itemClassName: PropTypes.string,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  menuClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  template: PropTypes.func,
  toggleIcon: PropTypes.func,
  trackBy: PropTypes.string,
};

export function UncontrolledFormGroupDropdown(props) {
  return (
    <UncontrolledFormGroup {...props}>
      <UncontrolledFormDropdown {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupDropdown.propTypes = {
  afterChange: PropTypes.func,
  childClassName: PropTypes.string,
  disabled: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  help: PropTypes.node,
  includeEmptyItem: PropTypes.bool,
  itemClassName: PropTypes.string,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  menuClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  template: PropTypes.func,
  toggleIcon: PropTypes.func,
  trackBy: PropTypes.string,
};
