import React, { useState, useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Dropdown } from '../dist/main';

const items = [
  {
    value: '1',
    label: 'Item 1',
  },
  {
    value: '2',
    label: 'Item 2',
    isDisabled: true,
  },
  {
    value: '3',
    label: 'Item 3',
  },
];

export function DropdownExamples() {
  return (
    <div className="row">
      <SimpleDropdown />
      <DropdownWithRef />
    </div>
  );
}

function SimpleDropdown() {
  const [isOpen, setIsOpen] = useState();

  return (
    <div className="col-6 mb-3">
      <h1 className="h4">Simple dropdown</h1>
      <button type="button" onClick={() => setIsOpen(true)}>
        Simple dropdown
      </button>

      <Dropdown
        items={items}
        isOpen={isOpen}
        onSelect={(args) => {
          // eslint-disable-next-line no-console
          console.info('onSelect', args);
          setIsOpen(false);
        }}
      />
    </div>
  );
}

function DropdownWithRef() {
  const [isOpen, setIsOpen] = useState();
  const [filterString, setFilterString] = useState('');
  const listContainerRef = useRef(null);

  const filter = useCallback(
    (item) => {
      const itemValue = JSON.stringify(item.label).toLowerCase();
      const searchValue = filterString.toLowerCase();

      return itemValue.includes(searchValue);
    },
    [filterString]
  );

  useEffect(() => console.log('listContainerRef?.current: ', listContainerRef?.current), [filterString]);

  return (
    <div className="col-6 mb-3">
      <h1 className="h4">Dropdown with ref</h1>
      <input type="search" value={filterString} onChange={(e) => setFilterString(e.target.value)} />

      <button type="button" onClick={() => setIsOpen(true)}>
        Dropdown with ref
      </button>

      <Dropdown
        items={items.filter(filter)}
        isOpen={isOpen}
        onSelect={(args) => {
          // eslint-disable-next-line no-console
          console.info('onSelect', args);
          setIsOpen(false);
        }}
        listContainerRef={listContainerRef}
      />
    </div>
  );
}
