import React, { useRef, useCallback, useState } from 'react';
import { isUndefined } from 'js-var-type';
import PropTypes from 'prop-types';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { UncontrolledFormInput } from './UncontrolledFormInput';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

export function UncontrolledFormInputMask({ mask, name, inputAttrs }) {
  const state = useState('');
  const ref = useRef(null);
  const { afterChange, ..._inputAttrs } = inputAttrs;

  const setFormattedValue = useCallback((value) => {
    const valueFormatado = mask?.format?.(value) ?? value;

    if (isUndefined(valueFormatado)) {
      return;
    }

    ref.current.value = valueFormatado;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const afterSetValue = useCallback((v) => setFormattedValue(v), [setFormattedValue]);
  const formControl = useUncontrolledFormControl(name, undefined, { state, afterSetValue });

  const handleKeyDown = useCallback(
    (e) => {
      const value = formControl.getValue();

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (Number(value) === 0 || String(value).length === 1) {
          e.target.value = '';
          formControl.setValue('');
          afterChange?.('');
        }
      }
    },
    [afterChange, formControl]
  );

  return (
    <>
      <input
        ref={ref}
        className="form-control"
        name={`__mask.${name}`}
        defaultValue=""
        onChange={(e) => {
          const { rawValue } = mask?.parse?.(e.target.value) ?? {
            rawValue: e.target.value,
          };

          const previousValue = formControl.getValue();

          formControl.setValue(rawValue);
          afterChange?.(rawValue, previousValue);
        }}
        onKeyDown={handleKeyDown}
        disabled={inputAttrs?.disabled}
        {..._inputAttrs}
      />
      <UncontrolledFormInput name={name} style={{ display: 'none' }} />
    </>
  );
}

UncontrolledFormInputMask.defaultProps = {
  inputAttrs: {},
};

UncontrolledFormInputMask.propTypes = {
  mask: PropTypes.shape({
    format: PropTypes.func.isRequired,
    parse: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  inputAttrs: PropTypes.object,
};

export function UncontrolledFormGroupInputMask(props) {
  return (
    <UncontrolledFormGroup {...props}>
      <UncontrolledFormInputMask {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupInputMask.propTypes = {
  label: PropTypes.node.isRequired,
  mask: PropTypes.shape({
    format: PropTypes.func.isRequired,
    parse: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  inputAttrs: PropTypes.shape({
    afterChange: PropTypes.func,
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    help: PropTypes.node,
    id: PropTypes.string,
    max: PropTypes.string,
    maxLength: PropTypes.string,
    min: PropTypes.string,
    minLength: PropTypes.string,
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    step: PropTypes.string,
    type: PropTypes.string,
  }),
};
