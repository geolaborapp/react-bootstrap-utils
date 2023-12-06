import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { booleanOrFunction } from './helpers/form-helpers';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export function UncontrolledFormInput({
  type,
  name,
  required: _required,
  disabled: _disabled,
  afterChange,
  ..._attrs
}) {
  const state = useState('');

  const { getValue, handleOnChangeFactory, getFormData, registerInputRef } = useUncontrolledFormControl(name, type, {
    state,
  });

  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  const attrs = {
    ..._attrs,
    disabled,
    name,
    required,
    type,
  };

  if (type === 'datetime-local') {
    attrs.defaultValue = getValue() ?? '';
  } else {
    attrs.value = getValue() ?? '';
  }

  return (
    <input
      className="form-control"
      {...attrs}
      onChange={handleOnChangeFactory(afterChange, type)}
      ref={registerInputRef}
    />
  );
}

UncontrolledFormInput.defaultProps = {
  type: 'text',
};

UncontrolledFormInput.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  id: PropTypes.string,
  max: PropTypes.string,
  maxLength: PropTypes.string,
  min: PropTypes.string,
  minLength: PropTypes.string,
  name: PropTypes.string.isRequired,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  step: PropTypes.string,
  type: PropTypes.string,
};

export function UncontrolledFormGroupInput(props) {
  return (
    <UncontrolledFormGroup {...props}>
      <UncontrolledFormInput {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupInput.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  help: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  max: PropTypes.string,
  maxLength: PropTypes.string,
  min: PropTypes.string,
  minLength: PropTypes.string,
  name: PropTypes.string.isRequired,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  step: PropTypes.string,
  type: PropTypes.string,
};
