import { useContext, useEffect } from 'react';

import { UncontrolledFormContext } from './useUncontrolledFormHelper';

export function useUncontrolledFormEffect(name, observerFn, deps = []) {
  const formHelper = useContext(UncontrolledFormContext);

  useEffect(() => {
    const unsubscribe = formHelper.subscribe(name, observerFn);

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}
