import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useFormControl } from './helpers/useFormControl';
import { booleanOrFunction } from './helpers/form-helpers';
import { FormGroup } from './FormGroup';

export function FormSwitch({
  id,
  name,
  required: _required,
  trueLabel,
  falseLabel,
  disabled: _disabled,
  afterChange,
  ...props
}) {
  const { getValue, handleOnChangeFactory, register, getFormData } = useFormControl(name, 'boolean');
  const registerRef = useCallback(register, [register]);
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
        ref={registerRef}
        {...props}
      />
      <label className="form-check-label" htmlFor={id}>
        {(trueLabel || falseLabel) && (value ? trueLabel : falseLabel)}
      </label>
    </div>
  );
}

FormSwitch.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  falseLabel: PropTypes.node,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  trueLabel: PropTypes.node,
};

export function FormGroupSwitch(props) {
  return (
    <FormGroup mockInvalidSibling={true} {...props}>
      <FormSwitch {...props} />
    </FormGroup>
  );
}

FormGroupSwitch.propTypes = {
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
