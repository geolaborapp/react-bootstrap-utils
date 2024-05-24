import React, { useCallback } from 'react';
// eslint-disable-next-line import/no-unresolved
import { ToastsContainer } from '../dist/main';
import { ToastsExamples } from './ToastsExamples';

export function ToastsWithMessageFormatterExamples() {
  const messageFormatter = useCallback((message) => `Text added on formatter + ${message}`);

  return (
    <div className="row">
      Toasts with text prepended
      <ToastsContainer messageFormatter={messageFormatter}>
        <ToastsExamples />
      </ToastsContainer>
    </div>
  );
}
