/* eslint-disable import/max-dependencies */
/* eslint-disable no-console */
import React from 'react';
import { createRoot } from 'react-dom/client';

// eslint-disable-next-line import/no-unresolved
import { StatefulTabs, Pagination, ToastsContainer } from '../dist/main';

import { FormExamples } from './FormExamples';
import { TableExamples } from './TableExamples';
import { TabsExamples } from './TabsExamples';
import { DialogExamples } from './DialogExamples';
import { ListGroupExamples } from './ListGroupExamples';
import { ToastsExamples } from './ToastsExamples';
import { DropdownExamples } from './DropdownExamples';
import { TreeViewExamples } from './TreeViewExamples';
import { UncontrolledFormExamples } from './UncontrolledFormExamples';
import { ToastsWithMessageFormatterExamples } from './ToastsWithMessageFormatterExamples';
import { ToastWithCustomState } from './ToastWithCustomState';

const root = createRoot(document.getElementById('root'));

root.render(
  <div className="mt-3">
    <React.StrictMode>
      <StatefulTabs
        vertical={true}
        onlyRenderActiveTab={true}
        initialTab={0}
        tabs={[
          {
            title: 'Dialog',
            content: <DialogExamples />,
          },
          {
            title: 'Dropdown',
            content: <DropdownExamples />,
          },
          {
            title: 'Forms',
            content: (
              <ToastsContainer>
                <FormExamples />
              </ToastsContainer>
            ),
          },
          {
            title: 'Uncontrolled Forms',
            content: <UncontrolledFormExamples />,
          },
          {
            title: 'List groups',
            content: <ListGroupExamples />,
          },
          {
            title: 'Pagination',
            content: <PaginationExamples />,
          },
          {
            title: 'Tables',
            content: <TableExamples />,
          },
          {
            title: 'Tabs',
            content: <TabsExamples />,
          },
          {
            title: 'Toasts',
            content: (
              <ToastsContainer>
                <ToastsExamples />
              </ToastsContainer>
            ),
          },
          {
            title: 'Toasts with message formatter',
            content: <ToastsWithMessageFormatterExamples />,
          },
          {
            title: 'Toasts with custom state',
            content: <ToastWithCustomState />,
          },
          {
            title: 'TreeView',
            content: <TreeViewExamples />,
          },
        ]}
      />
    </React.StrictMode>
  </div>
);

// eslint-disable-next-line no-undef
module.hot.accept();

function PaginationExamples() {
  return <Pagination lastPage={10} actualPage={4} onSelect={console.log} />;
}
