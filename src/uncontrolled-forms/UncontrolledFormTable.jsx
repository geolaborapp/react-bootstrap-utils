import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { isFunction } from 'js-var-type';

import { Table } from '../table/Table';
import { formatClasses } from '../utils/attributes';

import { booleanOrFunction } from './helpers/form-helpers';

import { useUncontrolledFormControl } from './helpers/useUncontrolledFormControl';
import { UncontrolledFormGroup } from './UncontrolledFormGroup';

/**
 * UncontrolledFormTable
 *
 * This component allows you to control an array of itens in an UncontrolledForm.
 * This array will be shown as a table.
 * @param {object} param0
 * @param {name} param0.name - Name of the field
 * @param {boolean|Function=} param0.required - Defines whether the field is required for the form or not. If it's a function, the first parameter is the formData
 * @param {boolean|Function=} param0.disabled - Defines whether the field is disabled for the form or not. If it's a function, the first parameter is the formData
 * @param {Function=} param0.afterChange - Function that will run after an update on the field
 * @param {object} param0.tableProps - Props of the "Table" component
 * @param {Function=} param0.getCustomActions -  Function that recieves "item" and "index", and must return an array of Table actions.
 * @param {Function} param0.getAddItemComponent - Function that recieves the "item to be added" and must return the element that will be used to add new itens on the Table
 * @param {Function} param0.getRemoveComponent - Function that recieves the "remove item function" and must return the element that will be used to remove the item
 * @returns {JSX.Element}
 *
 * @example
 *
 * ```jsx
 * function FormUncontrolledFormGroupTable() {
 * return (
 *   <UncontrolledFormGroupTable
 *     name="formTable"
 *     required
 *     label="Simple UncontrolledFormTable"
 *     afterChange={(...args) => console.log('formTable', args)}
 *     tableProps={{
 *       actionLabel: 'Actions',
 *       columns: [
 *         {
 *           attribute: 'name',
 *           label: 'Name',
 *         },
 *         {
 *           attribute: 'number',
 *           label: 'Number',
 *         },
 *       ],
 *     }}
 *     getRemoveComponent={(removeItem) => <i class="bi bi-trash-fill" onClick={() => removeItem()}></i>}
 *     getAddItemComponent={(addItem) => <AddFormGroupTableItem addItem={addItem} />}
 *   />
 * );
 *}
 *
 *function AddFormGroupTableItem({ addItem }) {
 * // Form to generate new itens
 *
 *  return (
 *    <Dialog
 *      title="Add item"
 *      body={({ close }) => (
 *        <UncontrolledForm
 *          initialValues={{}}
 *          onSubmit={(data) => {
 *            addItem(data);
 *            close();
 *          }}
 *          onCancel={() => {
 *            close();
 *          }}
 *        >
 *          <UncontrolledFormGroupInput name="name" label="Name" required />
 *          <UncontrolledFormGroupInput name="number" label="Number" type="number" required />
 *        </UncontrolledForm>
 *      )}
 *    >
 *      <button type="button" className="btn btn-primary">
 *        Add item
 *      </button>
 *    </Dialog>
 *  );
 *}
 * ```
 */

export function UncontrolledFormTable({
  name,
  required: _required,
  disabled: _disabled,
  afterChange,
  tableProps,
  getCustomActions,
  getAddItemComponent,
  getRemoveComponent,
  ..._attrs
}) {
  const state = useState([]);

  const { getValue, getFormData, registerInputRef, setValue } = useUncontrolledFormControl(name, 'array', {
    state,
  });

  const value = useMemo(() => getValue(), [getValue]);

  const removeItem = useCallback(
    (doc, index) => {
      let newValue;

      setValue((prevState) => {
        newValue = prevState?.filter?.((_, i) => i !== index) ?? [];

        return newValue;
      });

      if (isFunction(afterChange)) {
        afterChange(newValue);
      }
    },
    [afterChange, setValue]
  );
  const addItem = useCallback(
    (item) => {
      let newValue;

      setValue((prevState) => {
        newValue = [...(prevState || []), item];

        return newValue;
      });

      if (isFunction(afterChange)) {
        afterChange(newValue);
      }
    },
    [afterChange, setValue]
  );

  const addItemComponent = useMemo(() => getAddItemComponent?.(addItem) ?? <></>, [addItem, getAddItemComponent]);

  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  const attrs = {
    ..._attrs,
    disabled,
    name,
    required,
  };

  /** The input is for the default form validation, and will not be shown */

  return (
    <>
      <input
        className={formatClasses(['form-control', 'visually-hidden'])}
        {...attrs}
        ref={registerInputRef}
        id={name}
        value={value?.length > 0 ? '1' : ''} //for required validation
      />
      {addItemComponent}
      <Table
        actions={(doc, index) => [
          ...(getCustomActions?.(doc, index) ?? []),
          {
            content: getRemoveComponent(() => removeItem(doc, index)),
          },
        ]}
        docs={value}
        {...tableProps}
      ></Table>
    </>
  );
}

UncontrolledFormTable.defaultProps = {
  tableProps: {},
};

const formTableProps = {
  afterChange: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tableProps: PropTypes.shape(Table.propTypes),
  getCustomActions: PropTypes.func,
  getRemoveComponent: PropTypes.func,
  getAddItemComponent: PropTypes.func,
};

UncontrolledFormTable.propTypes = formTableProps;

export function UncontrolledFormGroupTable(props) {
  return (
    <UncontrolledFormGroup {...props} id={props?.name}>
      <UncontrolledFormTable {...props} />
    </UncontrolledFormGroup>
  );
}

UncontrolledFormGroupTable.propTypes = {
  ...formTableProps,
  help: PropTypes.node,
  label: PropTypes.node.isRequired,
};
