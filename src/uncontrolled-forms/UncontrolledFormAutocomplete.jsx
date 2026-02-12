import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmptyLike, isFunction, isObject } from 'js-var-type';

import { Dropdown } from '../mixed/Dropdown';
import { useOpenState } from '../utils/useOpenState';
import { formatClasses } from '../utils/attributes';
import { getValueByPath } from '../utils/getters-setters';
import { defaultFilter } from '../utils/filter';

import {
  booleanOrFunction,
  getSelectedOption,
  handleInputChange,
  normalizeOptions,
  serializeValue,
  valuesAreEqual,
} from './helpers/form-helpers';
import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
// eslint-disable-next-line import/max-dependencies
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

function getSelectedItem(value, items, allowUnlistedValue, trackBy) {
  const selectedItem = getSelectedOption(value, items, trackBy);

  if (isEmptyLike(selectedItem) && !isEmptyLike(value) && allowUnlistedValue) {
    const _label = trackBy && isObject(value) ? getValueByPath(value, trackBy) : serializeValue(value);

    return { value: value, label: _label };
  }

  return selectedItem;
}
export function UncontrolledFormAutocomplete({
  afterChange,
  allowUnlistedValue,
  disabled: _disabled,
  filter = defaultFilter,
  id,
  listContainerRef,
  name,
  onSearch = () => {},
  onClearSearch = () => {},
  openOnFocus = false,
  options,
  placeholder,
  required: _required,
  template = (x) => x,
  trackBy,
}) {
  const state = useState('');

  const {
    getValue,
    setValue: _setValue,
    registerInputRef,
    isValid,
    getFormSubmitedAttempted,
    getFormData,
  } = useUncontrolledFormControl(name, undefined, { state });
  const value = getValue();

  const setValue = useCallback(
    (v) => {
      const previousValue = getValue();

      _setValue(v);
      if (isFunction(afterChange)) {
        afterChange(v, previousValue);
      }
    },
    [_setValue, afterChange, getValue]
  );

  const [searchValue, setSearchValue] = useState('');
  const items = normalizeOptions(options, getFormData(), searchValue);

  const [selectedItem, setSelectedItem] = useState(getSelectedItem(value, items, allowUnlistedValue, trackBy));
  const { isOpen, open, close } = useOpenState();
  const [ignoreBlur, setIgnoreBlur] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const searchInputRef = useRef(null);

  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  const controlFeedback = getFormSubmitedAttempted() ? (isValid() ? 'is-valid' : 'is-invalid') : '';

  const updateSearchInputValidation = useCallback(() => {
    searchInputRef.current.setCustomValidity(controlFeedback === 'is-invalid' ? 'invalid' : '');
  }, [controlFeedback]);

  const clearSearchValue = useCallback(() => {
    if (isEmptyLike(value) && !isFocused) {
      setSearchValue('');
      setSelectedItem(null);

      onClearSearch();
    }
  }, [isFocused, value, onClearSearch]);

  const onSearchInputType = useCallback(
    (_, nextSearchValue) => {
      setSearchValue(nextSearchValue);
      onSearch(nextSearchValue);
      open();

      if (nextSearchValue && value) {
        setValue(null);
      }
    },
    [onSearch, open, setValue, value]
  );

  const inputHandleChange = useMemo(
    () =>
      handleInputChange.bind(null, {
        update: onSearchInputType,
      }),
    [onSearchInputType]
  );

  const onSearchInputFocus = useCallback(() => {
    if (openOnFocus) {
      setTimeout(() => {
        open();
      }, 100);
    }
  }, [open, openOnFocus]);

  const onSearchInputBlur = useCallback(() => {
    if (isEmptyLike(searchValue) && value) {
      setValue('');
      setSelectedItem(null);
      updateSearchInputValidation();
    } else if (selectedItem?.label !== searchValue && !isEmptyLike(searchValue) && allowUnlistedValue) {
      onSelectItem({ value: searchValue, label: searchValue });
    }

    if (ignoreBlur) {
      searchInputRef.current.focus();
    } else {
      close();
      setFocus(false);
    }
  }, [
    close,
    ignoreBlur,
    searchValue,
    setValue,
    updateSearchInputValidation,
    value,
    onSelectItem,
    allowUnlistedValue,
    selectedItem,
  ]);

  const enableSearchInput = useCallback(() => {
    if (disabled) {
      return;
    }

    setFocus(true);
    setTimeout(() => {
      searchInputRef.current.focus();
    });
  }, [disabled]);

  const onSelectItem = useCallback(
    ({ value, label }) => {
      setValue(value);
      setSearchValue(label);
      setSelectedItem({ value, label });
      setIgnoreBlur(false);
      setTimeout(() => {
        setFocus(false);
        close();
      }, 60);
    },
    [close, setValue]
  );

  useEffect(updateSearchInputValidation, [updateSearchInputValidation]);
  useEffect(clearSearchValue, [clearSearchValue]);
  useEffect(() => {
    if (selectedItem?.label) {
      setSearchValue(selectedItem?.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /* Handles case when a useFormControl.setValue is used. Without this logic,
     * selectedItem would not be updated. */
    if (!valuesAreEqual(selectedItem?.value, value, trackBy)) {
      const item = getSelectedItem(value, items, allowUnlistedValue, trackBy);

      setSelectedItem(item);

      if (item?.label) {
        setSearchValue(item?.label);
      }
    }
  }, [allowUnlistedValue, items, selectedItem?.value, trackBy, value]);

  return (
    <>
      <input
        {...{ placeholder, disabled }}
        type="search"
        ref={searchInputRef}
        className={formatClasses(['form-control', isFocused ? '' : 'd-none', controlFeedback])}
        onChange={inputHandleChange}
        onFocus={onSearchInputFocus}
        onBlur={onSearchInputBlur}
        value={searchValue}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
        autoComplete="off"
      />

      {!isFocused && (
        <div
          className={formatClasses(['form-control', controlFeedback, disabled ? 'bg-light text-muted' : ''])}
          disabled={disabled}
          onClick={enableSearchInput}
        >
          {selectedItem
            ? template
              ? template(selectedItem?.label, selectedItem?.value)
              : selectedItem?.label
            : placeholder}
        </div>
      )}

      <Dropdown
        isOpen={isOpen()}
        items={items.filter(filter(searchValue))}
        onSelect={onSelectItem}
        template={template}
        onClick={(e) => e.stopPropation()}
        onTouchStart={() => setIgnoreBlur(true)}
        onMouseEnter={() => setIgnoreBlur(true)}
        onMouseLeave={() => setIgnoreBlur(false)}
        listContainerRef={listContainerRef}
      >
        <input
          type="text"
          className={formatClasses(['form-control', 'position-absolute', 'fixed-bottom', 'opacity-0'])}
          style={{ zIndex: '-9999' }}
          {...{ name, required, id }}
          onChange={() => {}}
          value={getValue()}
          ref={registerInputRef}
        />
      </Dropdown>
    </>
  );
}

UncontrolledFormAutocomplete.propTypes = {
  afterChange: PropTypes.func,
  allowUnlistedValue: PropTypes.bool,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  filter: PropTypes.func,
  id: PropTypes.string,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  name: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  onClearSearch: PropTypes.func,
  openOnFocus: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  template: PropTypes.func,
  trackBy: PropTypes.string,
};

export function UncontrolledFormGroupAutocomplete(props) {
  return (
    <UncontrolledFormGroup {...props}>
      <UncontrolledFormAutocomplete {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupAutocomplete.propTypes = {
  afterChange: PropTypes.func,
  allowUnlistedValue: PropTypes.bool,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  filter: PropTypes.func,
  help: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  name: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  onClearSearch: PropTypes.func,
  openOnFocus: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  template: PropTypes.func,
  trackBy: PropTypes.string,
  type: PropTypes.string,
};
