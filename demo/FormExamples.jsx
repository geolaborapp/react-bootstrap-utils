/* eslint-disable no-console */
import React, { useMemo, useState } from 'react';
import {
  Form,
  FormGroupInput,
  FormGroupSelect,
  FormGroupSwitch,
  FormGroupCheckbox,
  FormGroupRadio,
  FormGroupTextarea,
  FormGroupAutocomplete,
  FormGroupDropdown,
  useFormControl,
  FormGroupAutocompleteTag,
  Table,
  FormAutocompleteTag,
  FormGroupTable,
  Dialog,
  // eslint-disable-next-line import/no-unresolved
} from '../dist/main';

export function FormExamples() {
  const [bootstrapFormValidation, setBootstrapFormValidation] = useState(false);
  const [changeCustomValidation, setChangeCustomValidation] = useState(false);
  const [useCustomActions, setUseCustomActions] = useState(false);

  const validations = useMemo(
    () => ({
      numberField: [
        {
          message: 'Must be filled if textField is not empty',
          validate(value, formData) {
            return !formData.textField || value;
          },
        },
      ],
      autocompleteField: [
        {
          message: 'Must be filled',
          validate(value) {
            return value;
          },
        },
      ],
      selectField: [
        {
          message: 'Must be filled if autocompleteField1 is empty',
          validate(value, formData) {
            return formData.autocompleteField1 || value;
          },
        },
      ],
      switchField: [
        {
          message: 'Must be filled if selectField is empty',
          validate(value, formData) {
            return formData.selectField || value;
          },
        },
      ],
      checkboxField: [
        {
          message: 'Must be filled if switchField is empty',
          validate(value, formData) {
            return formData.switchField || value;
          },
        },
      ],
      radioField: [
        {
          message: 'Must be filled if checkboxField is empty',
          validate(value, formData) {
            return formData.checkboxField || value;
          },
        },
      ],
      textareaField: [
        {
          message: 'Must be filled if radioField is empty',
          validate(value, formData) {
            return formData.radioField || value;
          },
        },
      ],
      variableCustomValidation: [
        {
          message: `Must be filled with "${changeCustomValidation ? 'b' : 'a'}"`,
          validate(value, formData) {
            return changeCustomValidation ? value === 'b' : value === 'a';
          },
        },
      ],
      undefinedMessageField: [
        {
          validate(value) {
            return value;
          },
        },
      ],
      formTable2: [
        {
          message: 'Must have more than 2 itens',
          validate(value) {
            return value?.length > 2;
          },
        },
      ],
    }),
    [changeCustomValidation]
  );

  return (
    <Form
      initialValues={{
        textField: 'abc',
        autocompleteField1: { _id: '2345', name: '2345 name' },
        autocompleteField4: 'unlisted item',
        autocompleteTag2: [{ label: 'preSelected', value: 'preSelected' }],
        autocompleteField6: { _id: '2' },
        selectField4: { e: 2, c: 'b' },
        switchField2: true,
        checkboxField2: true,
        radioField2: 'b',
        numberField: null,
        dateField: new Date().toISOString(),
        dropdownField1: {
          title: 'Title two',
        },
        dropdownField2: '03',
      }}
      onChange={(data) => console.log('onChange', data)}
      onSubmit={(formData) => {
        console.log('onSubmit', formData);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }}
      transform={(formData, _, update) => {
        console.log('transform >> formData:', formData);

        formData.__v = formData.__v ? formData.__v + 1 : 1;

        update(formData);
      }}
      onCancel={(resetForm) => {
        console.log('onCancel');
        resetForm();
      }}
      customValidation={bootstrapFormValidation}
      validations={validations}
      customActions={
        useCustomActions
          ? (isSubmiting, { onCancel, resetForm, clearForm }) => (
              <div>
                <button type="submit" className="btn btn-success me-2">
                  Custom save
                </button>
                <button type="button" className="btn btn-secondary me-2" onClick={() => resetForm()}>
                  Custom reset
                </button>
                <button type="button" className="btn btn-info" onClick={() => clearForm()}>
                  Custom clear
                </button>
              </div>
            )
          : undefined
      }
    >
      <h5>Form configuration:</h5>
      <FormGroupSwitch
        id="bootstrapFormValidation"
        name="bootstrapFormValidation"
        label="Use bootstrap form validation?"
        afterChange={(value) => setBootstrapFormValidation(value)}
      />
      <FormGroupSwitch
        id="changeVariableCustomValidation"
        name="changeVariableCustomValidation"
        label="Change validation for variable custom validation?"
        afterChange={(value) => setChangeCustomValidation(value)}
      />
      <FormGroupSwitch
        id="useCustomActions"
        name="useCustomActions"
        label="Use form custom actions?"
        afterChange={(value) => setUseCustomActions(value)}
      />
      <hr />
      <div className="row">
        <div className="col">
          <FormGroupInput
            name="variableCustomValidation"
            label="Variable custom validation"
            placeholder={'Type "a" or "b"'}
            help={'if "Change validation for variable custom validation" is not setted this should be "a" else "b" '}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <FormGroupInput name="textField" label="Text field" disabled help="Text field help" />
        </div>
        <div className="col">
          <FormGroupInput
            name="textField2"
            label="Text field 2"
            required
            placeholder="Fill some value"
            afterChange={console.log.bind(console, 'afterChange input')}
            inputClassName="text-danger text-uppercase"
          />
        </div>
        <div className="col">
          <FormGroupInput
            name="numberField"
            label="Number field"
            type="number"
            disabled={({ textField2 }) => textField2 === 'ABC'}
          />
        </div>
        <div className="col">
          <FormGroupInput name="dateField" label="Date field" type="datetime-local" />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <FormGroupAutocomplete
            name="disabledAutocompleteField"
            label="Disabled Autocomplete"
            options={['1234', '2345', '3456']}
            placeholder="Type some numbers"
            help="Disabled autocomplete"
            disabled
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField"
            label="Autocomplete Field with Custom Validation"
            options={['111', '222', '333']}
            placeholder="Type some numbers"
            allowUnlistedValue
            required
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField1"
            label="Autocomplete Object Options"
            options={[
              { value: { _id: '1234', name: '1234 name' }, label: '1234 Label' },
              { value: { _id: '2345', name: '2345 name' }, label: '2345 Label' },
              { value: { _id: '3456', name: '3456 name' }, label: '3456 Label' },
            ]}
            placeholder="Type some numbers"
            trackBy="_id"
            help="Autocomplete help"
            allowUnlistedValue
            required={(formData) => formData.textField2}
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField2"
            label="Autocomplete that opens on focus"
            options={(_, searchValue) => {
              if (searchValue.length < 2) {
                return ['Abcde', 'Fghij', 'klmno'];
              }

              return ['1234', '2345', '3456'];
            }}
            onSearch={console.log}
            placeholder="Type some letters"
            openOnFocus={true}
            afterChange={console.log.bind(console, 'afterChange autocomplete')}
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField3"
            label="Autocomplete with item template"
            options={Array.from({ length: 10 }).map((_, index) => ({
              value: index + 1,
              label: `${index + 1}${index + 2}${index + 3}${index + 4}`,
            }))}
            placeholder="Type some numbers"
            template={(option) => (
              <>
                <strong>{option}</strong> - {option}
              </>
            )}
            required={() => true}
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField4"
            label="Autocomplete that allows custom user input"
            options={['1234', '2345', '3456']}
            placeholder="Type some numbers"
            allowUnlistedValue={true}
            afterChange={(newValue, oldValue) => {
              console.log(oldValue, ' changed to  :>> ', newValue);
            }}
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField5"
            label="Autocomplete that logs when searched value is cleared"
            options={['1234', '2345', '3456']}
            placeholder="Type some numbers"
            afterChange={(newValue, oldValue) => {
              console.log(oldValue, ' changed to  :>> ', newValue);
            }}
            onClearSearch={() => {
              console.log('search has been cleared');
            }}
          />
        </div>
        <div className="col">
          <FormGroupAutocomplete
            name="autocompleteField6"
            label="Autocomplete with custom template"
            options={[
              {
                label: 'value that can be searched',
                value: {
                  attribute1: 'value',
                  attribute2: 'that can',
                  attribute3: 'be searched',
                  _id: '1',
                },
              },
              {
                label: 'another value that can be searched',
                value: {
                  attribute1: 'another value',
                  attribute2: 'that can',
                  attribute3: 'be searched',
                  _id: '2',
                },
              },
              {
                label: 'something that can be searched',
                value: {
                  attribute1: 'something',
                  attribute2: 'that can',
                  attribute3: 'be searched',
                  _id: '3',
                },
              },
            ]}
            trackBy="_id"
            placeholder="Type to search in the available options"
            afterChange={(newValue, oldValue) => {
              console.log('autocompleteField6: ', oldValue, ' changed to  :>> ', newValue);
            }}
            onClearSearch={() => {
              console.log('search has been cleared');
            }}
            template={(label, value) => (
              <div className="d-flex flex-column py-1">
                <div>{value?.attribute1}</div>
                <em>{value?.attribute2}</em>
                <div>{value?.attribute3}</div>
              </div>
            )}
            openOnFocus
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag1"
            label="Autocomplete with tags"
            repeatedTagErrorMessage="Impossible to add repeated tag"
            options={[
              {
                label: '1',
                value: '1',
              },
              {
                label: 'tag',
                value: 'tag',
              },
            ]}
            allowRemove
            openOnFocus
            disabled
          />
        </div>
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag2"
            label="Autocomplete with tags2"
            repeatedTagErrorMessage="Impossible to add repeated tag"
            options={[
              {
                label: '1',
                value: '1',
              },
              {
                label: 'tag',
                value: 'tag',
              },
              {
                label: 'preSelected',
                value: 'preSelected',
              },
            ]}
            allowRemove
            openOnFocus
            afterChange={(newValue, lastValue) =>
              console.log('autocompleteTag2 changed. From: ', lastValue, ' To:', newValue)
            }
            onSearch={(searchedValue) => console.log('autocompleteTag2 serachedValue changed to: ', searchedValue)}
          />
        </div>
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag3"
            label="Autocomplete with tags3 - Required"
            required
            repeatedTagErrorMessage="Impossible to add repeated tag"
            addButtonIcon={<i className="bi bi-person-add" />}
            removeButtonIcon={<i className="bi bi-person-dash" />}
            options={['1', 'tag', 'preSelected']}
            allowRemove
            openOnFocus
            help="Add at least one tag to this field"
          />
        </div>
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag4"
            label="Autocomplete with tags4 - Tracking by _id"
            repeatedTagErrorMessage="Impossible to add repeated tag"
            options={[
              {
                label: '1',
                _id: '1',
              },
              {
                label: 'tag',
                _id: '2',
              },
              {
                label: 'preSelected',
                _id: '3',
              },
            ]}
            allowRemove
            openOnFocus
            trackBy="_id"
            help="Write something and press Enter or click on the button"
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag5"
            label="Autocomplete with tags5 - Tracking by _id - Without new tags"
            repeatedTagErrorMessage="Impossible to add repeated tag"
            options={[
              {
                label: '1',
                _id: '1',
              },
              {
                label: 'tag',
                _id: '2',
              },
              {
                label: 'preSelected',
                _id: '3',
              },
              {
                _id: '4',
              },
            ]}
            allowUnlistedValue={false}
            allowRemove
            openOnFocus
            trackBy="_id"
            help="unhelpfull help"
            template={(v) => (
              <em>
                <b>{v}</b>
              </em>
            )}
          />
        </div>
        <div className="col">
          <FormGroupAutocompleteTag
            name="autocompleteTag6"
            label="Autocomplete with tags6 - Tracking by _id - Without new tags, with repeated options"
            repeatedTagErrorMessage="Impossible to add repeated tag"
            options={[
              {
                label: '1',
                _id: '1',
              },
              {
                label: 'Repeated 1',
                _id: '1',
              },
              {
                label: 'tag',
                _id: '2',
              },
              {
                label: 'Repeated tag',
                _id: '2',
              },
            ]}
            allowUnlistedValue={false}
            allowRemove
            openOnFocus
            trackBy="_id"
            placeholder="Select one or more tags"
          />
        </div>
      </div>
      <FormAutocompleteTagsWithCustomLabel />

      <div className="row">
        <div className="col-4">
          <FormGroupSelect
            name="selectField"
            label="Select field (list)"
            options={['A', 'B', 'C']}
            disabled
            help="Select help"
          />
        </div>
        <div className="col-4">
          <FormGroupSelect
            name="selectNumberField"
            label="Select field (number list)"
            afterChange={console.log.bind(console, 'afterChange select')}
            options={[1, 2, 3, 4]}
          />
        </div>
        <div className="col-4">
          <FormGroupSelect
            name="selectField2"
            label="Select field 2 (array of objects)"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'd' },
            ]}
            required
          />
        </div>
        <div className="col-4">
          <FormGroupSelect
            name="selectBooleanField"
            label="Select boolean"
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
            required
          />
        </div>
        <div className="col-4">
          <FormGroupSelect
            name="selectField3"
            label="Select field 3 (function)"
            options={(formData) =>
              Object.entries(formData)
                .filter(([key, value]) => key !== 'selectField3' && value)
                .map(([, value]) => value)
            }
            placeholder="Select one value"
          />
        </div>
        <div className="col-4">
          <FormGroupSelect
            name="selectField4"
            label="Select field 4 (objects with trackBy)"
            options={[
              { label: 'A', value: { c: 'a', e: 1 } },
              { label: 'B', value: { c: 'b', e: 2 } },
              { label: 'C', value: { c: 'd', e: 3 } },
            ]}
            trackBy="c"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <FormSwitchExample
            id="switchFieldId"
            name="switchField"
            label="Switch field"
            trueLabel="ON"
            falseLabel="OFF"
            help="Switch help"
            afterChange={console.log.bind(console, 'afterChange switch')}
          />
        </div>
        <div className="col">
          <FormGroupSwitch id="switchFieldId2" name="switchField2" label="Switch field 2" disabled />
        </div>
        <div className="col">
          <FormGroupCheckbox
            id="checkboxFieldId"
            name="checkboxField"
            label="Checkbox field"
            valueLabel="Checkbox description"
            help="Checkbox help"
            onClick={() => console.log('TESTE')}
            afterChange={console.log.bind(console, 'afterChange checkbox')}
          />
        </div>
        <div className="col">
          <FormGroupCheckbox id="checkboxFieldId2" name="checkboxField2" label="Checkbox field 2" disabled />
        </div>
        <div className="col">
          <FormGroupRadio
            id="radioFieldId"
            name="radioField"
            label="Radio field"
            options={[
              {
                value: 'a',
                label: 'A',
              },
              {
                value: 'b',
                label: 'B',
              },
              {
                value: 'c',
                label: 'C',
              },
            ]}
            help="Radio help"
            afterChange={console.log.bind(console, 'afterChange radio')}
          />
        </div>
        <div className="col">
          <FormGroupRadio
            id="radioFieldId2"
            name="radioField2"
            label="Radio field 2"
            options={[
              {
                value: 'a',
                label: 'A',
              },
              {
                value: 'b',
                label: 'B',
              },
            ]}
            disabled
          />
        </div>
      </div>

      <FormGroupTextarea
        name="textareaField"
        label="Textarea field"
        help="Textarea help"
        afterChange={console.log.bind(console, 'afterChange textarea')}
      />
      <FormGroupTextarea name="textareaField2" label="Textarea field 2" disabled rows="1" />

      <FormGroupTextarea name="undefinedMessageField" label="Undefined message field" rows="1" />

      {[0, 1].map((index) => (
        <div className="row" key={index}>
          <div className="col">
            <FormGroupInput name={`array[${index}].data.text`} label={`Array text ${index}`} />
          </div>
          <div className="col">
            <FormGroupSelect
              name={`array[${index}].data.select`}
              label={`Array select ${index}`}
              options={['Yes', 'No']}
            />
          </div>
        </div>
      ))}

      <FormGroupDropdown
        name="dropdownField1"
        label="Dropdown using object as value"
        options={[
          {
            value: {
              firstValue: 'Title one',
              secondValue: 1,
            },
            label: {
              title: 'Title one',
              subtitle: 'subtitle one',
            },
          },
          {
            value: {
              firstValue: 'Title two',
              secondValue: 2,
            },
            label: {
              title: 'Title two',
              subtitle: 'subtitle two',
            },
          },
          {
            value: {
              firstValue: 'Title three',
              secondValue: 3,
            },
            label: {
              title: 'Title three',
              subtitle: 'subtitle three',
            },
          },
        ]}
        help="dropdown help"
        placeholder="Select one value"
        afterChange={() => console.log('afterChange dropdown')}
        template={(label, value) => {
          return value ? (
            <div>
              <strong>{label.title ?? '-'}</strong>
              <p className="m-0">{label.subtitle ?? '-'}</p>
            </div>
          ) : (
            label
          );
        }}
        itemClassName="border-bottom"
        childClassName="text-muted"
        trackBy="secondValue"
      />

      <FormGroupDropdown
        name="dropdownField2"
        label="Dropdown using string as value"
        options={[
          {
            value: '01',
            label: <p>Value one</p>,
          },
          {
            value: '02',
            label: <p>Value two</p>,
          },
          {
            value: '03',
            label: <p>Value three</p>,
          },
        ]}
        placeholder="Select one value"
        includeEmptyItem={false}
        menuClassName="p-4 w-100"
      />

      <h5>FormTable</h5>
      <div className="row mb-2">
        <FormGroupTable1 />
        <FormGroupTable2 />
      </div>

      <ResetForm />
      <ClearForm />
    </Form>
  );
}

const ResetForm = () => {
  const formControl = useFormControl();

  const reset = () => {
    console.log('reset form - resets to initial state');

    formControl.resetFormData();
  };

  return (
    <button type="button" className="btn btn-outline-secondary mb-3" onClick={reset}>
      Reset form
    </button>
  );
};

const ClearForm = () => {
  const formControl = useFormControl();

  const clear = () => {
    console.log('clear form - sets empty state');

    formControl.clearFormData();
  };

  return (
    <button type="button" className="btn btn-outline-info ms-2 mb-3" onClick={clear}>
      Clear form
    </button>
  );
};

const FormSwitchExample = () => {
  const autocompleteField1FormControl = useFormControl('autocompleteField1');

  const afterChange = (value) => {
    console.log('afterChange switch');

    if (value) {
      autocompleteField1FormControl.setValue({ _id: '3456', name: '3456 name' });
    } else {
      autocompleteField1FormControl.setValue(null);
    }
  };

  return (
    <FormGroupSwitch
      id="switchFieldId"
      name="switchField"
      label="Switch field"
      trueLabel="ON"
      falseLabel="OFF"
      help="Switch Autocomplete Object Options Value"
      afterChange={afterChange}
      onClick={() => console.log('TESTE')}
    />
  );
};

function FormAutocompleteTagsWithCustomLabel() {
  const autocompleteTag6FormControl = useFormControl('autocompleteTag7');
  const tags = useMemo(() => autocompleteTag6FormControl.getValue() || []);

  return (
    <div className="row mb-3">
      <div className="col">
        <label className="form-label">Autocomplete with tags - Custom label:</label>
        <Table
          docs={tags}
          columns={[
            { attribute: 'label', label: 'Label' },
            { attribute: 'value', label: 'Value' },
          ]}
        />
        <FormAutocompleteTag
          name="autocompleteTag7"
          repeatedTagErrorMessage="Impossible to add repeated tag"
          options={[
            {
              label: '1',
              value: '1',
            },
            {
              label: 'tag',
              value: 'tag',
            },
          ]}
          allowRemove
          openOnFocus
        />
      </div>
    </div>
  );
}

function FormGroupTable1() {
  return (
    <FormGroupTable
      name="formTable1"
      required
      label="Simple FormTable"
      afterChange={(...args) => console.log('formTable', args)}
      tableProps={{
        actionLabel: 'Actions',
        columns: [
          {
            attribute: 'name',
            label: 'Name',
          },
          {
            attribute: 'number',
            label: 'Number',
          },
        ],
      }}
      getRemoveComponent={(removeItem) => <i class="bi bi-trash-fill" onClick={() => removeItem()}></i>}
      getAddItemComponent={(addItem) => <AddFormGroupTableItem addItem={addItem} />}
    />
  );
}
function FormGroupTable2() {
  return (
    <FormGroupTable
      name="formTable2"
      required
      label="FormTable with minimum itens validation"
      tableProps={{
        actionLabel: 'Actions',
        columns: [
          {
            attribute: 'name',
            label: 'Name',
          },
          {
            attribute: 'number',
            label: 'Number',
          },
        ],
      }}
      getRemoveComponent={(removeItem) => <i class="bi bi-trash-fill" onClick={() => removeItem()}></i>}
      getAddItemComponent={(addItem) => <AddFormGroupTableItem addItem={addItem} />}
    />
  );
}

function AddFormGroupTableItem({ addItem }) {
  return (
    <Dialog
      title="Add item"
      body={({ close }) => (
        <Form
          initialValues={{}}
          onSubmit={(data) => {
            console.info('submit', data);
            addItem(data);
            close();
          }}
          onCancel={() => {
            console.warn('cancel');
            close();
          }}
        >
          <FormGroupInput name="name" label="Name" required />
          <FormGroupInput name="number" label="Number" type="number" required />
        </Form>
      )}
    >
      <button type="button" className="btn btn-primary">
        Add item
      </button>
    </Dialog>
  );
}
