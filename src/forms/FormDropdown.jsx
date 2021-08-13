import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'js-var-type';

import { Dropdown } from '../mixed/Dropdown';
import { useOpenState } from '../utils/useOpenState';
import { formatClasses } from '../utils/attributes';

import { objectsAreEquivalent } from '../utils/object-helpers';

import { normalizeOptions } from './helpers/form-helpers';
import { useFormControl } from './helpers/useFormControl';

export const FormDropdown = ({
  afterChange,
  // className,
  // childClassName,
  itemClassName,
  name,
  options,
  placeholder,
  template,
  dropdownClassName, //permitir customização da classe do Dropdown
}) => {
  const dropdownRef = useRef(null);

  const { getFormData, getValue, handleOnChangeFactory, setValue: _setValue } = useFormControl(name);

  const value = getValue();
  const items = normalizeOptions(options, getFormData());
  const selectedItem = useMemo(() => items.find((item) => objectsAreEquivalent(item.value, value)), [items, value]);

  const { isOpen: _isOpen, open, close } = useOpenState();
  const isOpen = _isOpen();

  const setValue = useCallback(
    (v) => {
      _setValue(v);

      // usar handleOnChangeFactory
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

  const clear = useCallback(() => {
    setValue(null);
  }, [setValue]);

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
        items={items}
        onSelect={onSelectItem}
        template={template}
        itemClassName={itemClassName}
        className={dropdownClassName}
      >
        <div
          className={formatClasses([
            'form-control',
            'd-flex',
            'align-items-center',
            'justify-content-between',
            'h-auto',
          ])}
          onClick={toggleDropdown}
        >
          {selectedItem ? (
            <>
              <div>{template(selectedItem.label)}</div>
              {isOpen && (
                <div onClick={clear}>
                  {/* Permitir customização do dev */}
                  <i className="bi bi-x"></i>
                </div>
              )}
            </>
          ) : (
            <div className="text-muted">{placeholder}</div>
          )}
        </div>
      </Dropdown>
    </div>
  );
};

FormDropdown.defaultProps = {
  template: (x) => x,
};

FormDropdown.propTypes = {
  afterChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  template: PropTypes.func,
  itemClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
};
