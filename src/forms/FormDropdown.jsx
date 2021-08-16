import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'js-var-type';

import { Dropdown } from '../mixed/Dropdown';
import { useOpenState } from '../utils/useOpenState';
import { formatClasses } from '../utils/attributes';
import { objectsAreEquivalent } from '../utils/object-helpers';

import { normalizeOptions } from './helpers/form-helpers';
import { useFormControl } from './helpers/useFormControl';
import { FormGroup } from './FormGroup';

export const FormDropdown = ({
  afterChange,
  childClassName,
  dropdownClassName,
  itemClassName,
  name,
  options,
  placeholder,
  template,
  toggleIcon,
}) => {
  const dropdownRef = useRef(null);

  const { getFormData, getValue, setValue: _setValue } = useFormControl(name);

  const value = getValue();
  const items = normalizeOptions(options, getFormData());
  const selectedItem = useMemo(() => items.find((item) => objectsAreEquivalent(item.value, value)), [items, value]);

  const { isOpen: _isOpen, open, close } = useOpenState();
  const isOpen = _isOpen();

  const setValue = useCallback(
    (v) => {
      _setValue(v);

      if (isFunction(afterChange)) {
        afterChange(v);
      }
    },
    [_setValue, afterChange]
  );

  const onSelectItem = useCallback(
    ({ value }) => {
      setValue(value);
      close();
    },
    [close, setValue]
  );

  const toggleDropdown = useCallback(() => (isOpen ? close() : open()), [close, isOpen, open]);

  useEffect(() => {
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
  }, [close, isOpen, open]);

  return (
    <div ref={dropdownRef}>
      <Dropdown
        isOpen={isOpen}
        items={[{ value: null, label: placeholder }, ...items]}
        onSelect={onSelectItem}
        template={template}
        itemClassName={itemClassName}
        className={dropdownClassName}
        itemsBoxClassName="p-0 w-100"
      >
        <div className="input-group">
          <div className={formatClasses(['form-control h-auto', childClassName])} onClick={toggleDropdown}>
            {selectedItem ? (
              <>
                <div>{template(selectedItem.label)}</div>
              </>
            ) : (
              <div className="text-muted">{placeholder}</div>
            )}
          </div>
          <div className="input-group-append">
            <a
              href="#"
              className="input-group-text"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              {toggleIcon(isOpen)}
            </a>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

FormDropdown.defaultProps = {
  template: (x) => x,
  toggleIcon: function toggleIcon(isOpen) {
    return <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>;
  },
};

FormDropdown.propTypes = {
  afterChange: PropTypes.func,
  childClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  template: PropTypes.func,
  toggleIcon: PropTypes.func,
};

export function FormGroupDropdown(props) {
  return (
    <FormGroup {...props}>
      <FormDropdown {...props} />
    </FormGroup>
  );
}

FormGroupDropdown.propTypes = {
  afterChange: PropTypes.func,
  childClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  help: PropTypes.node,
  itemClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  template: PropTypes.func,
  toggleIcon: PropTypes.func,
};
