import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { booleanOrFunction } from './helpers/form-helpers';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export function UncontrolledFormCheckbox({
  id,
  name,
  required: _required,
  valueLabel,
  disabled: _disabled,
  afterChange,
  ...props
}) {
  const state = useState('');
  const { getValue, handleOnChangeFactory, registerInputRef, getFormData } = useUncontrolledFormControl(
    name,
    'boolean',
    {
      state,
    }
  );

  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  return (
    <div className="form-check">
      <input
        {...{ required, name, id, disabled }}
        type="checkbox"
        className="form-check-input"
        onChange={handleOnChangeFactory(afterChange)}
        checked={getValue()}
        ref={registerInputRef}
        {...props}
      />
      <label className="form-check-label" htmlFor={id}>
        {valueLabel}
      </label>
    </div>
  );
}

UncontrolledFormCheckbox.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  valueLabel: PropTypes.node,
};

export function UncontrolledFormGroupCheckbox(props) {
  return (
    <UncontrolledFormGroup mockInvalidSibling={true} {...props}>
      <UncontrolledFormCheckbox {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupCheckbox.propTypes = {
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
