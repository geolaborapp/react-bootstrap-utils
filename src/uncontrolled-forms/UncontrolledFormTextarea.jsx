import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { booleanOrFunction } from './helpers/form-helpers';

import { UncontrolledFormGroup } from './UncontrolledFormGroup';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';

export function UncontrolledFormTextarea({ name, required: _required, disabled: _disabled, afterChange, ..._attrs }) {
  const state = useState('');

  const { handleOnChangeFactory, getFormData, getValue, registerInputRef } = useUncontrolledFormControl(
    name,
    undefined,
    {
      state,
    }
  );

  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  const attrs = {
    ..._attrs,
    disabled,
    name,
    required,
  };

  return (
    <textarea
      {...attrs}
      className="form-control"
      onChange={handleOnChangeFactory(afterChange)}
      value={getValue()}
      ref={registerInputRef}
    />
  );
}

UncontrolledFormTextarea.defaultProps = {
  type: 'text',
};

UncontrolledFormTextarea.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export function UncontrolledFormGroupTextarea(props) {
  return (
    <UncontrolledFormGroup {...props}>
      <UncontrolledFormTextarea {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupTextarea.propTypes = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  help: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
