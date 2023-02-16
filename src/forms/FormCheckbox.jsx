import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useFormControl } from './helpers/useFormControl';
import { booleanOrFunction } from './helpers/form-helpers';
import { FormGroup } from './FormGroup';

export function FormCheckbox({
  id,
  name,
  required: _required,
  valueLabel,
  disabled: _disabled,
  afterChange,
  ...props
}) {
  const { getValue, handleOnChangeFactory, register, getFormData } = useFormControl(name, 'boolean');
  const registerRef = useCallback(register, [register]);
  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  return (
    <div className="custom-control custom-checkbox">
      <input
        {...{ required, name, id, disabled }}
        type="checkbox"
        className="custom-control-input"
        onChange={handleOnChangeFactory(afterChange)}
        checked={getValue()}
        ref={registerRef}
        {...props}
      />
      <label className="custom-control-label" htmlFor={id}>
        {valueLabel}
      </label>
    </div>
  );
}

FormCheckbox.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  valueLabel: PropTypes.node,
};

export function FormGroupCheckbox(props) {
  return (
    <FormGroup mockInvalidSibling={true} {...props}>
      <FormCheckbox {...props} />
    </FormGroup>
  );
}

FormGroupCheckbox.propTypes = {
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
