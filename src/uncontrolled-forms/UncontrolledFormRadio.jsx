import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { formatClasses } from '../utils/attributes';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { booleanOrFunction } from './helpers/form-helpers';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export function UncontrolledFormRadio({
  id,
  name,
  required: _required,
  checkedValue,
  valueLabel,
  inline,
  disabled: _disabled,
  afterChange,
  state,
}) {
  const { getValue, handleOnChangeFactory, registerInputRef, getFormData } = useUncontrolledFormControl(
    name,
    undefined,
    {
      state,
    }
  );
  const value = getValue();
  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  return (
    <div className={formatClasses(['form-check', inline && 'form-check-inline'])}>
      <input
        {...{ required, name, id, disabled }}
        type="radio"
        className="form-check-input"
        onChange={handleOnChangeFactory(afterChange)}
        checked={value === checkedValue}
        value={checkedValue}
        ref={registerInputRef}
      />
      <label className="form-check-label" htmlFor={id}>
        {valueLabel}
      </label>
    </div>
  );
}

UncontrolledFormRadio.defaultProps = {
  inline: false,
};

UncontrolledFormRadio.propTypes = {
  afterChange: PropTypes.func,
  checkedValue: PropTypes.any,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  id: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  valueLabel: PropTypes.node,
  state: PropTypes.array.isRequired,
};

export function UncontrolledFormGroupRadio({ options, id, ...props }) {
  const state = useState('');

  return (
    <UncontrolledFormGroup mockInvalidSibling={true} {...props}>
      <div>
        {options.map((option, index) => (
          <UncontrolledFormRadio
            state={state}
            key={index}
            {...props}
            checkedValue={option.value}
            valueLabel={option.label}
            id={`${id}-${index}`}
          />
        ))}
      </div>
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupRadio.defaultProps = {
  inline: true,
};

UncontrolledFormGroupRadio.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  help: PropTypes.node,
  id: PropTypes.string,
  inline: PropTypes.bool,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};
