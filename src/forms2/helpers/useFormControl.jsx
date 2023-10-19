import { isDefined, isFunction } from 'js-var-type';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getValueByPath } from '../../utils/getters-setters';

import { decode, getTargetValue, encode } from './form-helpers';

import { FormContext } from './useFormHelper';

/* O state é repassado como parâmetro para resolver problemas de renderização de um formulário
   formado de "uncontrolled components".
   Caso seja desejado usar este hook desassociado de um FormElement, isto é, fazer:
    useFormControl2('nameNaoReferenciadoPorFormElement')
  para alguma manipulação do valor do formData, o desenvolvedor precisa passar um state como parâmetro.
*/
export function useFormControl2(name, type, { state, afterSetValue } = {}) {
  const formHelper = useContext(FormContext);

  const [stateValue, setStateValue] = useMemo(() => state ?? [], [state]);
  const [isRegistered, setIsRegistered] = useState(false);

  const setFormControlValue = useCallback(
    (newValue) => {
      const newValueFn = isFunction(newValue) ? newValue : () => newValue;
      const nextValue = newValueFn(stateValue);

      // utilizar o setState como função trouxe problemas na ficha de ensaio
      // não foi possível identificar o motivo, porém o callback não era acionado e o valor não era atualizado
      // e nem era enviada a notificação de alteração para o form-helper
      setStateValue?.(isDefined(nextValue) ? nextValue : '');
      formHelper?.notify?.(name, nextValue);

      if (isFunction(afterSetValue)) {
        afterSetValue(nextValue);
      }
    },
    [stateValue, setStateValue, formHelper, name, afterSetValue]
  );

  const setValue = useCallback((newValue) => formHelper?.setFormControlValue?.(name, newValue), [formHelper, name]);

  const handleOnChange = useCallback(
    ({ target }, _type) => {
      const value = getTargetValue(target);
      const decodedValue = decode(value, type || _type);

      setValue(decodedValue);

      return decodedValue;
    },
    [setValue, type]
  );

  useEffect(() => {
    if (isFunction(setStateValue) && isFunction(formHelper.register)) {
      formHelper.register(name, {
        setValue: setFormControlValue,
      });
    }

    setIsRegistered(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRegistered && isFunction(setStateValue)) {
      formHelper.setFormControl(name, {
        setValue: setFormControlValue,
      });
    }
  }, [formHelper, isRegistered, name, setFormControlValue, setStateValue]);

  const registerInputRef = useCallback(
    (ref) => {
      formHelper.registerRef(name, ref);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name]
  );

  return {
    getValue() {
      const formData = formHelper?.getFormData?.() ?? {};
      const _value = getValueByPath(formData, name);

      return encode(_value, type);
    },
    setValue,
    isRegistered() {
      return isRegistered;
    },
    handleOnChangeFactory: (afterChange, type) => (e) => {
      const newValue = handleOnChange(e, type);

      if (isFunction(afterChange)) {
        afterChange(newValue, stateValue);
      }
    },
    getFormData() {
      return formHelper?.getFormData?.();
    },
    setFormData(newFormData) {
      return formHelper.updateFormData(newFormData);
    },
    getFormSubmitedAttempted: () => formHelper.getSubmitedAttempted(),
    isValid: () => formHelper.getValidationMessage(name) === '',
    registerInputRef,
  };
}
