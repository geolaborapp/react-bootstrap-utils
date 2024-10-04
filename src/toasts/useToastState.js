import { useState, useCallback, useEffect, useRef } from 'react';
import { isDefined, isFunction, isNumber } from 'js-var-type';

import { useArrayValueMap } from '../utils/useValueMap';
import { usePreviousValue } from '../utils/usePreviousValue';
import { serializeValue } from '../forms/helpers/form-helpers';

import { TOASTS_VALID_TYPES, TOASTS_VALID_POSITIONS } from './toasts-helpers';

export function useToastState({ unique, messageFormatter, customToasts }) {
  const [nextId, setNextId] = useState(0);
  const prevCustomToasts = usePreviousValue(customToasts);
  const [currentCustomToasts, setCurrentCustomToasts] = useState({});
  const timeoutRefs = useRef({});

  const { push, unset, get, reset } = useArrayValueMap(
    unique && {
      equalityComparator: (a) => (b) => a.message === b.message,
    }
  );

  const prepareNextId = useCallback(() => setNextId((prevId) => prevId + 1), []);

  const show = useCallback(
    (message, { type = 'info', autoClose = 5000, position = 'TOP_RIGHT' } = {}) => {
      if (!TOASTS_VALID_TYPES.includes(type)) {
        throw new Error(`Invalid toast type ${type}. Must be ${TOASTS_VALID_TYPES}`);
      }

      if (!TOASTS_VALID_POSITIONS.includes(position)) {
        throw new Error(`Invalid toast position ${position}. Must be ${TOASTS_VALID_POSITIONS}`);
      }

      const toastId = nextId;
      const _message = isFunction(messageFormatter) ? messageFormatter(message) : message;

      push(position, {
        id: toastId,
        message: _message,
        type,
        position,
        closeControl: !autoClose,
      });

      if (isNumber(autoClose) && !isNaN(autoClose)) {
        const timeoutId = setTimeout(() => {
          close(position, toastId);
        }, autoClose);

        timeoutRefs.current[toastId] = { timeoutId, position };
      }

      prepareNextId();

      return toastId;
    },
    [close, messageFormatter, nextId, push, prepareNextId]
  );

  const close = useCallback(
    (position, toastId) => {
      const { timeoutId } = timeoutRefs.current?.[toastId] ?? {};

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      delete timeoutRefs.current[toastId];

      unset(position, (toast) => toast?.id !== toastId);
    },
    [unset]
  );

  const closeAll = useCallback(() => {
    for (const [toastId, { position }] of Object.entries(timeoutRefs.current)) {
      close(position, toastId);
    }

    reset();
  }, [close, reset]);

  const handleCustomToasts = useCallback(() => {
    const serializedCustomToasts = customToasts?.map?.((toast) => serializeValue(toast));
    const prevSerializedCustomToasts = prevCustomToasts?.map?.((toast) => serializeValue(toast));

    const newToasts = customToasts?.filter?.((toast) => !prevSerializedCustomToasts?.includes?.(serializeValue(toast)));
    const removedToasts = prevCustomToasts?.filter?.(
      (toast) => !serializedCustomToasts?.includes?.(serializeValue(toast))
    );

    for (const toast of newToasts ?? []) {
      push(toast.position, { ...toast, id: nextId });
      setCurrentCustomToasts((prev) => ({ ...prev, [serializeValue(toast)]: nextId }));
      prepareNextId();
    }
    for (const removedToast of removedToasts ?? []) {
      const serializedRemovedToast = serializeValue(removedToast);
      const customToastId = currentCustomToasts?.[serializedRemovedToast];

      unset(removedToast.position, (toast) => toast.id !== customToastId);
      setCurrentCustomToasts((prev) => {
        const newVal = { ...prev };

        if (isDefined(newVal?.[serializedRemovedToast])) {
          delete newVal[serializedRemovedToast];
        }

        return newVal;
      });
    }
  }, [currentCustomToasts, customToasts, nextId, prepareNextId, prevCustomToasts, push, unset]);

  useEffect(handleCustomToasts, [handleCustomToasts]);

  useEffect(
    () => closeAll,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    show,
    close,
    closeAll,
    get,
  };
}
