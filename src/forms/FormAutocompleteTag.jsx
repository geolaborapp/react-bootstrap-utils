import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isDefined, isEmptyLike, isFunction, isObject, isString } from 'js-var-type';

import { Dropdown } from '../mixed/Dropdown';
import { useOpenState } from '../utils/useOpenState';
import { formatClasses } from '../utils/attributes';

import { useToasts } from '../toasts/useToasts';

import { getValueByPath } from '../utils/getters-setters';

import { booleanOrFunction, handleInputChange, normalizeOptions } from './helpers/form-helpers';
import { useFormControl } from './helpers/useFormControl';
// eslint-disable-next-line import/max-dependencies
import { FormGroup } from './FormGroup';

export function FormAutocompleteTag({
  afterChange,
  repeatedTagErrorMessage,
  allowUnlistedValue,
  disabled: _disabled,
  filter,
  listContainerRef,
  name,
  onSearch,
  openOnFocus,
  options: _options,
  placeholder,
  required: _required,
  template,
  trackBy,
}) {
  const { showToast } = useToasts();

  const {
    getValue,
    setValue: _setValue,
    isValid,
    getFormSubmitedAttempted,
    getFormData,
    register,
  } = useFormControl(name);
  const { isOpen, open, close } = useOpenState();

  const [searchValue, setSearchValue] = useState('');
  const [controlFeedback, setControlFeedback] = useState('');
  const [ignoreBlur, setIgnoreBlur] = useState(false);
  const [isFocused, setFocus] = useState(false);

  const searchInputRef = useRef(null);

  const value = useMemo(() => getValue() || [], [getValue]);
  const options = useMemo(() => {
    const tagsInUse = value.map((tag) => {
      if (trackBy && isObject(tag)) {
        return getValueByPath(tag, trackBy);
      }

      return tag?.label ? tag.label : tag;
    });

    return _options.filter((tag) => {
      if (trackBy && isObject(tag)) {
        return !tagsInUse.includes(getValueByPath(tag, trackBy));
      }

      return !tagsInUse.includes(tag?.label ? tag.label : tag);
    });
  }, [_options, trackBy, value]);
  const items = useMemo(
    () => normalizeOptions(options, getFormData(), searchValue),
    [getFormData, options, searchValue]
  );
  const disabled = useMemo(() => booleanOrFunction(_disabled, getFormData()), [_disabled, getFormData]);
  const required = useMemo(() => booleanOrFunction(_required, getFormData()), [_required, getFormData]);
  const formSubmitedAttempted = useMemo(() => getFormSubmitedAttempted(), [getFormSubmitedAttempted]);

  const onSearchInputType = useCallback(
    (_, nextSearchValue) => {
      setSearchValue(nextSearchValue);
      onSearch(nextSearchValue);
      open();
    },
    [onSearch, open]
  );

  const inputHandleChange = useMemo(
    () =>
      handleInputChange.bind(null, {
        update: onSearchInputType,
      }),
    [onSearchInputType]
  );

  const registerRef = useCallback(register, [register]);
  const updateSearchInputValidation = useCallback(() => {
    searchInputRef.current.setCustomValidity(controlFeedback === 'is-invalid' ? 'invalid' : '');
  }, [controlFeedback]);

  const setValue = useCallback(
    (newTags) => {
      const previousValue = value;

      _setValue(newTags);
      if (isFunction(afterChange)) {
        afterChange(newTags, previousValue);
      }
    },
    [_setValue, afterChange, value]
  );

  const addTag = useCallback(
    (newTag = '') => {
      if (isString(newTag) && !allowUnlistedValue) {
        return;
      }

      const selectedTags = value?.map((tag) => {
        if (trackBy && isObject(tag)) {
          return getValueByPath(tag, trackBy) ?? '';
        }

        return isDefined(tag?.label) ? tag.label : tag;
      });

      if (
        (trackBy && isObject(newTag) && selectedTags?.includes(getValueByPath(newTag, trackBy))) ||
        selectedTags?.includes(newTag)
      ) {
        return showToast(repeatedTagErrorMessage, {
          type: 'danger',
        });
      }

      const newTags = [...value];

      if (!newTag?.label) {
        newTags?.push({
          label: newTag,
          value: newTag,
        });
      } else {
        newTags?.push(newTag);
      }

      setValue(newTags);
    },
    [allowUnlistedValue, repeatedTagErrorMessage, setValue, showToast, trackBy, value]
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
      updateSearchInputValidation();
    }

    if (ignoreBlur) {
      searchInputRef.current.focus();
    } else {
      close();
      setFocus(false);
    }
  }, [close, ignoreBlur, searchValue, updateSearchInputValidation, value]);

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
    ({ value }) => {
      addTag(value);
      setSearchValue('');
      setIgnoreBlur(false);
      setTimeout(() => {
        setFocus(false);
        close();
      }, 60);
    },
    [close, addTag]
  );

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectItem({ value: searchValue });
    },
    [onSelectItem, searchValue]
  );

  const onKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (allowUnlistedValue && e.key === 'Enter') {
        e.preventDefault();
        addTag(searchValue);
        setSearchValue('');
      }
    },
    [addTag, searchValue, allowUnlistedValue]
  );

  useEffect(updateSearchInputValidation, [updateSearchInputValidation]);

  useEffect(() => {
    setControlFeedback(formSubmitedAttempted ? (isValid() ? 'is-valid' : 'is-invalid') : '');
  }, [controlFeedback, formSubmitedAttempted, getFormSubmitedAttempted, isValid]);

  return (
    <div className={formatClasses(['d-flex', 'mb-3', 'form-input-tag', controlFeedback])}>
      <div className="w-100">
        <input
          placeholder={placeholder}
          disabled={disabled}
          type="search"
          ref={searchInputRef}
          className={formatClasses(['form-control', isFocused ? '' : 'd-none', controlFeedback])}
          onChange={inputHandleChange}
          onFocus={onSearchInputFocus}
          onBlur={onSearchInputBlur}
          value={searchValue}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          autoComplete="off"
        />

        <div className="overflow-hidden position-relative">
          <input
            type="text"
            className="position-absolute"
            tabIndex="-1"
            ref={registerRef}
            value={value}
            onChange={() => {}}
            required={required}
          />
        </div>

        {!isFocused && (
          <div
            className={formatClasses([
              'form-control',
              controlFeedback,
              disabled ? 'bg-light text-muted' : '',
              'h-100',
              allowUnlistedValue ? 'rounded-end-0' : '',
            ])}
            disabled={disabled}
            onClick={enableSearchInput}
          >
            {searchValue ? (template ? template(searchValue) : searchValue) : placeholder ?? <>&lrm;</>}
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
        ></Dropdown>
      </div>
      {allowUnlistedValue && (
        <button type="button" className="btn btn-secondary rounded-start-0" onClick={onClick}>
          <i className="bi bi-plus-lg" />
        </button>
      )}
    </div>
  );
}

FormAutocompleteTag.defaultProps = {
  allowUnlistedValue: true,
  openOnFocus: false,
  onSearch: () => {},
  filter: (_searchValue) => (item) => {
    const itemValue = JSON.stringify(item.label).toLowerCase();
    const searchValue = _searchValue.toLowerCase();

    return itemValue.includes(searchValue);
  },
  template: (x) => x,
  repeatedTagErrorMessage: 'Impossible to add repeated tag',
};

FormAutocompleteTag.propTypes = {
  afterChange: PropTypes.func,
  allowUnlistedValue: PropTypes.bool,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  filter: PropTypes.func,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  name: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  openOnFocus: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  repeatedTagErrorMessage: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  template: PropTypes.func,
  trackBy: PropTypes.string,
};

export function FormGroupAutocompleteTag({
  allowUnlistedValue,
  afterChange,
  disabled,
  filter,
  help,
  listContainerRef,
  name,
  onSearch,
  openOnFocus,
  options,
  placeholder,
  required,
  template,
  trackBy,
  allowRemove,
  label,
  repeatedTagErrorMessage,
}) {
  const { getValue, setValue: _setValue } = useFormControl(name, 'array');
  const tags = useMemo(() => getValue() || [], [getValue]);

  const setValue = useCallback(
    (newTags) => {
      const previousValue = tags;

      _setValue(newTags);
      if (isFunction(afterChange)) {
        afterChange(newTags, previousValue);
      }
    },
    [_setValue, afterChange, tags]
  );

  const removeTag = useCallback(
    (e, index) => {
      e.preventDefault();
      const novasTags = [...tags];

      novasTags?.splice(index, 1);

      setValue(novasTags);
    },
    [tags, setValue]
  );

  const tagsLabel = useMemo(
    () => (
      <>
        {label}
        {tags?.map((tag, index) => (
          <span key={index} className={`badge bg-${allowRemove ? 'info' : 'secondary'} mx-1`}>
            {isDefined(tag?.label) ? tag.label : tag}

            {allowRemove && (
              <a href="" className="text-light ml-1" onClick={(e) => removeTag(e, index)}>
                <i className="bi bi-x-lg"></i>
              </a>
            )}
          </span>
        ))}
      </>
    ),
    [removeTag, label, allowRemove, tags]
  );

  return (
    <FormGroup label={tagsLabel} name={name} help={help} required={required}>
      <FormAutocompleteTag
        afterChange={afterChange}
        allowUnlistedValue={allowUnlistedValue}
        disabled={disabled}
        filter={filter}
        listContainerRef={listContainerRef}
        name={name}
        onSearch={onSearch}
        openOnFocus={openOnFocus}
        options={options}
        placeholder={placeholder}
        repeatedTagErrorMessage={repeatedTagErrorMessage}
        required={required}
        template={template}
        trackBy={trackBy}
      />
    </FormGroup>
  );
}
FormGroupAutocompleteTag.defaultProps = {
  allowUnlistedValue: true,
};

FormGroupAutocompleteTag.propTypes = {
  afterChange: PropTypes.func,
  allowRemove: PropTypes.bool,
  allowUnlistedValue: PropTypes.bool,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  filter: PropTypes.func,
  listContainerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  name: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  openOnFocus: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  placeholder: PropTypes.string,
  repeatedTagErrorMessage: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  template: PropTypes.func,
  trackBy: PropTypes.string,
  help: PropTypes.node,
  label: PropTypes.node.isRequired,
};
