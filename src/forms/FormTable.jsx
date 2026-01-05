import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { isFunction } from 'js-var-type';

import { formatClasses } from '../utils/attributes';

import { Table } from '../table/Table';

import { useFormControl } from './helpers/useFormControl';
import { booleanOrFunction } from './helpers/form-helpers';
import { FormGroup } from './FormGroup';

/**
 * FormTable
 *
 * This component allows you to control an array of itens in an Form.
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
 *   <FormGroupTable
 *     name="formTable"
 *     required
 *     label="Simple FormTable"
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
 *     getRemoveComponent={(removeItem) => <i className="bi bi-trash-fill" onClick={() => removeItem()}></i>}
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
 *        <Form
 *          initialValues={{}}
 *          onSubmit={(data) => {
 *            addItem(data);
 *            close();
 *          }}
 *          onCancel={() => {
 *            close();
 *          }}
 *        >
 *          <FormGroupInput name="name" label="Name" required />
 *          <FormGroupInput name="number" label="Number" type="number" required />
 *        </Form>
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

export function FormTable({
  name,
  required: _required,
  disabled: _disabled,
  afterChange,
  tableProps = {},
  getCustomActions,
  getAddItemComponent,
  getRemoveComponent,
}) {
  const { getValue, register, getFormData, setValue } = useFormControl(name, 'array');
  const registerRef = useCallback(register, [register]);
  const disabled = booleanOrFunction(_disabled, getFormData());
  const required = booleanOrFunction(_required, getFormData());

  const value = useMemo(() => getValue() || [], [getValue]);

  const removeItem = useCallback(
    (doc, index) => {
      const newValue = value?.filter?.((_, i) => i !== index) ?? [];

      setValue(newValue);

      if (isFunction(afterChange)) {
        afterChange(newValue);
      }
    },
    [afterChange, setValue, value]
  );
  const addItem = useCallback(
    (item) => {
      const newValue = [...(value || []), item];

      setValue(newValue);

      if (isFunction(afterChange)) {
        afterChange(newValue);
      }
    },
    [afterChange, setValue, value]
  );

  const addItemComponent = useMemo(() => getAddItemComponent?.(addItem) ?? <></>, [addItem, getAddItemComponent]);

  const attrs = {
    disabled,
    name,
    required,
  };

  return (
    <>
      <input
        className={formatClasses(['form-control', 'visually-hidden'])}
        {...attrs}
        ref={registerRef}
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

FormTable.propTypes = formTableProps;

export function FormGroupTable(props) {
  return (
    <FormGroup {...props} id={props?.name}>
      <FormTable {...props} />
    </FormGroup>
  );
}

FormGroupTable.propTypes = {
  ...formTableProps,
  help: PropTypes.node,
  label: PropTypes.node.isRequired,
};
