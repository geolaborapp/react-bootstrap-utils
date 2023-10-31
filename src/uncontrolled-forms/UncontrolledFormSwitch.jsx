import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { booleanOrFunction } from './helpers/form-helpers';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export function UncontrolledFormSwitch({
  id,
  name,
  required: _required,
  trueLabel,
  falseLabel,
  disabled: _disabled,
  afterChange,
  ...props
}) {
  const state = useState('');

  const { getValue, handleOnChangeFactory, getFormData, registerInputRef } = useUncontrolledFormControl(
    name,
    'boolean',
    {
      state,
    }
  );

  const value = getValue();
  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  return (
    <div className="form-check form-switch">
      <input
        {...{ required, name, id, disabled }}
        type="checkbox"
        className="form-check-input"
        onChange={handleOnChangeFactory(afterChange)}
        checked={value}
        ref={registerInputRef}
        {...props}
      />
      <label className="form-check-label" htmlFor={id}>
        {(trueLabel || falseLabel) && (value ? trueLabel : falseLabel)}
      </label>
    </div>
  );
}

UncontrolledFormSwitch.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  falseLabel: PropTypes.node,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  trueLabel: PropTypes.node,
};

export function UncontrolledFormGroupSwitch(props) {
  return (
    <UncontrolledFormGroup mockInvalidSibling={true} {...props}>
      <UncontrolledFormSwitch {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupSwitch.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  falseLabel: PropTypes.node,
  help: PropTypes.node,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  trueLabel: PropTypes.node,
};
