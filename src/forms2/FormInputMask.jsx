import React, { useRef, useCallback, useMemo, useEffect, Fragment, useState } from 'react';
import { isUndefined } from 'js-var-type';
import PropTypes from 'prop-types';

import { getValueByPath } from '../utils/getters-setters';

import { useFormControl2 } from './helpers/useFormControl';
import { FormInput2 } from './FormInput';
import { FormGroup2 } from './FormGroup';

export function FormInputMask2({ mask, name, inputAttrs }) {
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

  const formControl = useFormControl2(name, undefined, { state, afterSetValue: (v) => setFormattedValue(v) });
  const valorInicial = useMemo(() => getValueByPath(formControl.getFormData(), name), [formControl, name]);

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

  useEffect(() => {
    //formatação do valor inicial do input, deve ser executada apenas uma vez
    setFormattedValue(valorInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <input
        ref={ref}
        className="form-control"
        name={`__mask.${name}`}
        defaultValue=""
        onChange={(e) => {
          const { maskedValue, rawValue } = mask?.parse?.(e.target.value) ?? {
            maskedValue: e.target.value,
            rawValue: e.target.value,
          };

          e.target.value = maskedValue;
          const previousValue = formControl.getValue();

          formControl.setValue(rawValue);
          afterChange?.(rawValue, previousValue);
        }}
        onKeyDown={handleKeyDown}
        disabled={inputAttrs?.disabled}
        {..._inputAttrs}
      />
      <FormInput2 name={name} style={{ display: 'none' }} />
    </>
  );
}

FormInputMask2.defaultProps = {
  inputAttrs: {},
};

FormInputMask2.propTypes = {
  mask: PropTypes.shape({
    format: PropTypes.func.isRequired,
    parse: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  inputAttrs: PropTypes.object,
};

export function FormGroupInputMask2(props) {
  return (
    <FormGroup2 {...props}>
      <FormInputMask2 {...props} />
    </FormGroup2>
  );
}

FormGroupInputMask2.propTypes = {
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
