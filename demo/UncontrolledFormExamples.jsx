/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import {
  UncontrolledForm,
  UncontrolledFormGroupCheckbox,
  UncontrolledFormGroupInput,
  UncontrolledFormGroupInputMask,
  UncontrolledFormGroupSelect,
  UncontrolledFormGroupSwitch,
  UncontrolledFormGroupTextarea,
  UncontrolledFormInput,
  useUncontrolledFormControl,
  useUncontrolledFormEffect,
  UncontrolledFormGroupAutocomplete,
  UncontrolledFormGroupDropdown,
  UncontrolledFormGroupRadio,
} from '../dist/main';

export function UncontrolledFormExamples() {
  const [bootstrapFormValidation, setBootstrapFormValidation] = useState(false);
  const [transform, setTransform] = useState(null);

  const transform2 = useCallback((formData) => {
    console.log('transform2', formData);
  }, []);

  return (
    <div className="pb-4">
      <h4>Alternative Form implementation</h4>
      <UncontrolledForm
        initialValues={{
          attrA: 'ABC',
          Obj: { x: 'X', z: 0 },
          arr: [1, 2, 3, 4, 5],
          arrObj: [{ o: 1 }, { o: 2 }, { o: 3 }],
          autocomplete2Field5: { _id: '2' },
          textarea1:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque praesentium quisquam reiciendis expedita. Ad quod voluptas aliquid illum veniam odio? Nulla sed, illum eligendi amet fuga optio officia itaque nisi',
          dateMask: '0410202',
        }}
        onSubmit={(data) => console.log('onSubmit', data)}
        onChange={(data) => console.log('onChange', data)}
        transform={
          transform === 2
            ? transform2
            : (formData) => {
                console.log('transform', formData);

                return {
                  __v: formData.__v ? formData.__v + 1 : 1,
                  attrB: `${formData.attrB || ''}A`,
                  Obj: {
                    y: `${formData.Obj.y || ''}X`,
                    w: {
                      z: formData.__v ? formData.__v * 2 : 1,
                    },
                    t: formData.__v % 2 ? null : undefined,
                    u: new Date(),
                  },
                  arr: formData.arr.map((v) => parseFloat(v) + 1),
                  arrObj: formData.arrObj.map((v) => {
                    v.o = parseFloat(v.o) ** 2;

                    return v;
                  }),
                };
              }
        }
        customValidation={bootstrapFormValidation}
        validations={{
          autocomplete2Field2: [
            {
              message: 'Must be filled if Autocomplete Object Options is empty',
              validate(value, formData) {
                return formData.autocomplete2Field1 || value;
              },
            },
          ],
          attrB: [
            {
              message: 'Must be filled if AttrA is not empty',
              validate(value, formData) {
                return !formData.attrA || value;
              },
            },
          ],
        }}
      >
        <h5>Form configuration:</h5>
        <UncontrolledFormGroupSwitch
          id="bootstrapForms2Validation"
          name="bootstrapForm2Validation"
          label="Use bootstrap form validation?"
          afterChange={(value) => setBootstrapFormValidation(value)}
        />
        <hr />
        <div className="mb-3">
          <label htmlFor="">Obj</label>
          <div className="row">
            <div className="col">
              <UncontrolledFormInput name="Obj.x" />
            </div>
            <div className="col">
              <UncontrolledFormInput name="Obj.y" />
            </div>
            <div className="col">
              <UncontrolledFormInput name="Obj.z" type="number" step="0.1" />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="">Array</label>
          <FormArray />
        </div>
        <div className="mb-3">
          <label htmlFor="">Array of objects</label>
          <FormArrayOfObjects />
        </div>
        <div className="mb-3">
          <UncontrolledFormGroupInput label="Input date" name="inputDate" type="datetime-local" />
        </div>
        <UncontrolledFormGroupAutocomplete
          name="autocomplete2Field1"
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
        />

        <UncontrolledFormGroupAutocomplete
          name="autocomplete2Field2"
          label="Autocomplete Field with Custom Validation"
          options={['1', '2', '3']}
          placeholder="Type some numbers"
          allowUnlistedValue
        />

        <UncontrolledFormGroupAutocomplete
          name="autocomplete2Field3"
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

        <UncontrolledFormGroupAutocomplete
          name="autocomplete2Field4"
          label="Autocomplete Field that logs when searched value is cleared"
          options={['1', '2', '3']}
          placeholder="Type some numbers"
          afterChange={(newValue, oldValue) => {
            console.log(oldValue, ' changed to  :>> ', newValue);
          }}
          onClearSearch={() => {
            console.log('search has been cleared');
          }}
        />

        <UncontrolledFormGroupAutocomplete
          name="autocomplete2Field5"
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
            console.log(oldValue, ' changed to  :>> ', newValue);
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

        <UncontrolledFormGroupInput label="AttrA" name="attrA"></UncontrolledFormGroupInput>
        <UncontrolledFormGroupInput
          label="AttrB"
          name="attrB"
          inputClassName="text-danger text-uppercase"
        ></UncontrolledFormGroupInput>
        <UncontrolledFormGroupSelect label="AttrC" name="attrC" options={[1, 2, 3]}></UncontrolledFormGroupSelect>
        <UncontrolledFormGroupSwitch id="attrD" label="AttrD" name="attrD"></UncontrolledFormGroupSwitch>

        <UncontrolledFormGroupCheckbox
          id="checkboxFieldId"
          name="checkboxField"
          label="Checkbox field"
          valueLabel="Checkbox description"
          help="Checkbox help"
        />

        <UncontrolledFormGroupCheckbox id="checkboxFieldId2" name="checkboxField2" label="Checkbox field 2" disabled />

        <div className="mb-3">
          <label htmlFor="">Version</label>
          <FormVersion />
        </div>

        <UncontrolledFormGroupTextarea
          label="Textarea"
          name="textarea1"
          rows="5"
          afterChange={(newValue, oldValue) => {
            console.log(oldValue, ' changed to  :>> ', newValue);
          }}
        />

        <div className="mb-3">
          <label htmlFor="">Observer</label>
          <FormObserver />
        </div>
        <div className="mb-3">
          <label htmlFor="">Observer 2</label>
          <FormObserver2 />
        </div>

        <UncontrolledFormGroupInputMask
          name="decimalMask"
          label="Masked 3 decimal with"
          mask={{
            parse: decimalMask,
            format: (value) => value,
          }}
          inputAttrs={{
            afterChange(newValue, oldValue) {
              console.log(oldValue, ' changed to  :>> ', newValue);

              console.log('afterChange in decimalMask :>> ', newValue);
            },
          }}
        />

        <UncontrolledFormGroupInputMask
          name="dateMask"
          inputAttrs={{
            maxLength: '10',
          }}
          label="Masked date"
          mask={{
            parse: dateMask,
            format: (value) => dateMask(value).maskedValue,
          }}
        />

        <UncontrolledFormGroupInputMask
          name="hourMask"
          inputAttrs={{
            maxLength: '5',
          }}
          label="Hour mask"
          mask={{
            parse: hourMask,
            format: (value) => value,
          }}
        />

        <UncontrolledFormGroupInputMask
          name="currencyMask"
          label="Currency mask"
          mask={{
            parse: currencyMask,
            format: (value) => value,
          }}
        />

        <UncontrolledFormGroupInputMask
          name="maskWithCustomCss"
          inputAttrs={{
            inputClassName: 'text-danger text-uppercase',
          }}
          label="Mask with custom classes"
          mask={{
            parse: (v) => ({ rawValue: v, maskedValue: v }),
            format: (v) => v,
          }}
        />

        <UncontrolledFormGroupDropdown
          label="FormDropdown2"
          name="dropdown"
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
          template={(linha) => <p className="mb-0">{linha}</p>}
        />
        <UncontrolledFormGroupDropdown
          label="FormDropdown2 disabled"
          name="dropdown-desabilitado"
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
          template={(linha) => <p className="mb-0">{linha}</p>}
          disabled
        />

        <h4>SetValue Test</h4>

        <button
          className="btn btn-info"
          type="button"
          onClick={() => (transform === 2 ? setTransform(null) : setTransform(2))}
        >
          Toggle transform
        </button>

        <h5>FormInput</h5>
        <div className="row mb-2">
          <FormInputSetValueTeste1 />
          <FormInputSetValueTeste2 />
        </div>

        <h5>FormAutocomplete</h5>
        <div className="row mb-2">
          <FormAutocompleteSetValueTeste1 />
          <FormAutocompleteSetValueTeste2 />
        </div>

        <h5>FormCheckbox</h5>
        <div className="row mb-2">
          <FormCheckboxSetValueTeste1 />
          <FormCheckboxSetValueTeste2 />
        </div>

        <h5>FormDropdown</h5>
        <div className="row mb-2">
          <FormDropdownSetValueTeste1 />
          <FormDropdownSetValueTeste2 />
        </div>

        <h5>FormInputMask</h5>
        <div className="row mb-2">
          <FormInputMaskSetValueTeste1 />
          <FormInputMaskSetValueTeste2 />
        </div>

        <h5>FormRadio</h5>
        <div className="row mb-2">
          <FormRadioSetValueTeste1 />
          <FormRadioSetValueTeste2 />
        </div>

        <h5>FormSelect</h5>
        <div className="row mb-2">
          <FormSelectSetValueTeste1 />
          <FormSelectSetValueTeste2 />
        </div>

        <h5>FormSwitch</h5>
        <div className="row mb-2">
          <FormSwitchSetValueTeste1 />
          <FormSwitchSetValueTeste2 />
        </div>

        <h5>FormTextarea</h5>
        <div className="row mb-2">
          <FormTextareaSetValueTeste1 />
          <FormTextareaSetValueTeste2 />
        </div>
      </UncontrolledForm>
    </div>
  );
}

function FormVersion() {
  const { getValue } = useUncontrolledFormControl('__v');

  return <div>{getValue() || ''}</div>;
}

function FormArray() {
  const formArrayState = useState();
  const { getValue, setValue, isRegistered } = useUncontrolledFormControl('arr', 'array', { state: formArrayState });
  const [refresh, shouldRefresh] = useState(false);

  useEffect(() => {
    if (isRegistered()) {
      console.log('initialized value [arr] :>> ', getValue());
    } else {
      console.log('uninitialized value [arr] :>> ', getValue());
    }
  }, [getValue, setValue, isRegistered]);

  const remove = useCallback((index) => {
    const newArray = [...getValue()];

    newArray.splice(index, 1);

    setValue(newArray);

    shouldRefresh(true);

    setTimeout(() => {
      shouldRefresh(false);
    }, 100);
  });

  const newElement = useCallback(() => {
    setValue((prevValue) => [...prevValue, Math.max(...prevValue) + 1]);
  });

  if (refresh) {
    return <></>;
  }

  return (
    <>
      {(getValue() || []).map((v, index) => (
        <div className="input-group mb-2">
          <UncontrolledFormInput key={index} name={`arr[${index}]`} />

          <button className="btn btn-danger" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <div>
        <button className="btn btn-success" onClick={newElement}>
          New
        </button>
      </div>
    </>
  );
}

function FormArrayOfObjects() {
  const formArrayOfObjectsState = useState();
  const { getValue } = useUncontrolledFormControl('arrObj', 'array', { state: formArrayOfObjectsState });

  return (getValue() || []).map((v, index) => <UncontrolledFormInput key={index} name={`arrObj[${index}].o`} />);
}

function FormObserver() {
  const [state, setState] = useState(0);

  useUncontrolledFormEffect('Obj', (data) => {
    console.log('FormObserver :>> ', data);
    setState((p) => p + 1);
  });

  return <div>{state}</div>;
}

function decimalMask(value) {
  const number = parseFloat(value);
  let maskedValue = String(value);

  maskedValue = maskedValue.replace(/\D/g, '');
  maskedValue = maskedValue.replace(/(\d)(\d{3})$/, '$1.$2');

  return {
    rawValue: number,
    maskedValue,
  };
}

function dateMask(value) {
  let maskedValue = String(value);

  maskedValue = maskedValue.replace(/\D/g, '');

  maskedValue = maskedValue.replace(/(\d{2})(\d)/, '$1/$2');
  maskedValue = maskedValue.replace(/(\d{2})(\d)/, '$1/$2');

  return {
    rawValue: maskedValue,
    maskedValue,
  };
}

function hourMask(v) {
  let maskedValue = v;

  maskedValue = maskedValue.replace(/\D/g, '');
  maskedValue = maskedValue.replace(/(\d{2})(\d)/, '$1:$2');

  return { rawValue: maskedValue, maskedValue };
}

function currencyMask(v) {
  const rawValue = parseFloat(v);
  let maskedValue = v;

  maskedValue = maskedValue.replace(/\D/g, '');
  maskedValue = maskedValue.replace(/(\d)(\d{2})$/, '$1.$2');
  maskedValue = maskedValue.replace(/(?=(\d{3})+(\D))\B/g, ',');

  return { maskedValue, rawValue };
}

function FormObserver2() {
  const [toggleName, setToggleName] = useState(false);

  return (
    <div>
      <div className=" mb-2">
        <UncontrolledFormGroupSwitch
          id="formObserver2"
          label="Element observed switch"
          name="formObserver2"
          trueLabel="observed-input-1"
          falseLabel="observed-input-2"
          afterChange={(v) => setToggleName(v)}
        />
      </div>
      <FormObserved2ObservedComponent name={toggleName ? 'observed-input-1' : 'observed-input-2'} />
    </div>
  );
}

function FormObserved2ObservedComponent({ name }) {
  const [value, setValue] = useState();

  useUncontrolledFormEffect(
    name,
    (value) => {
      setValue(value);
    },
    [name]
  );

  return (
    <div>
      <div className="row mb-2">
        <div className="col-6">{`Input observed "${name}"`}</div>
        <div className="col-6">{`Value "${value}"`}</div>
      </div>
      <UncontrolledFormGroupSwitch id={name} label="Observed input switch" name={name} />
    </div>
  );
}

function FormInputSetValueTeste1({}) {
  const input2 = useUncontrolledFormControl('input2');
  const input3 = useUncontrolledFormControl('input3');

  const afterChange = useCallback((v) => {
    input2.setValue(v);
    input3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupInput label="Input 1" name="input1" afterChange={afterChange} />
      </div>
      <div className="col">
        <UncontrolledFormGroupInput label="Replicates Input 1 with setValue - same component" name="input2" />
      </div>
    </>
  );
}

function FormInputSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupInput label="Replicates Input 1 with setValue - different component" name="input3" />
    </div>
  );
}

function FormAutocompleteSetValueTeste1({}) {
  const autoComplete2 = useUncontrolledFormControl('autoComplete2');
  const autoComplete3 = useUncontrolledFormControl('autoComplete3');

  const afterChange = useCallback((v) => {
    autoComplete2.setValue(v);
    autoComplete3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupAutocomplete
          label="AutoComplete 1"
          name="autoComplete1"
          afterChange={afterChange}
          options={['1', '2', '3']}
          allowUnlistedValue
          placeholder="..."
        />
      </div>
      <div className="col">
        <UncontrolledFormGroupAutocomplete
          label="Replicates AutoComplete 1 with setValue - same component"
          name="autoComplete2"
          allowUnlistedValue
          options={[]}
          placeholder="..."
        />
      </div>
    </>
  );
}

function FormAutocompleteSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupAutocomplete
        label="Replicates AutoComplete 1 with setValue - different component"
        name="autoComplete3"
        allowUnlistedValue
        options={[]}
        placeholder="..."
      />
    </div>
  );
}

function FormCheckboxSetValueTeste1({}) {
  const checkbox2 = useUncontrolledFormControl('checkbox2');
  const checkbox3 = useUncontrolledFormControl('checkbox3');

  const afterChange = useCallback((v) => {
    checkbox2.setValue(v);
    checkbox3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupCheckbox label="Checkbox 1" name="checkbox1" id="checkbox1" afterChange={afterChange} />
      </div>
      <div className="col">
        <UncontrolledFormGroupCheckbox
          label="Replicates Checkbox 1 with setValue - same component"
          name="checkbox2"
          id="checkbox2"
        />
      </div>
    </>
  );
}

function FormCheckboxSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupCheckbox
        label="Replicates Checkbox 1 with setValue - different component"
        name="checkbox3"
        id="checkbox3"
      />
    </div>
  );
}

function FormDropdownSetValueTeste1({}) {
  const dropdown2 = useUncontrolledFormControl('dropdown2');
  const dropdown3 = useUncontrolledFormControl('dropdown3');

  const afterChange = useCallback((v) => {
    dropdown2.setValue(v);
    dropdown3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupDropdown
          label="Dropdown 1"
          name="dropdown1"
          afterChange={afterChange}
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
        />
      </div>
      <div className="col">
        <UncontrolledFormGroupDropdown
          label="Replicates Dropdown 1 with setValue - same component"
          name="dropdown2"
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
          template={(linha) => <span className="text-info">{linha}</span>}
        />
      </div>
    </>
  );
}

function FormDropdownSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupDropdown
        label="Replicates Dropdown 1 with setValue - different component"
        name="dropdown3"
        options={[
          {
            value: 1,
            label: 'Label para o valor 1',
          },
          {
            value: 2,
            label: 'Label para o valor 2',
          },
          {
            value: 3,
            label: 'Label para o valor 3',
          },
        ]}
      />
    </div>
  );
}

function FormInputMaskSetValueTeste1({}) {
  const datemask2 = useUncontrolledFormControl('datemask2');
  const datemask3 = useUncontrolledFormControl('datemask3');

  const afterChange = useCallback((v) => {
    datemask2.setValue(v);
    datemask3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupInputMask
          label="Input Mask 1"
          name="datemask1"
          mask={{
            parse: dateMask,
            format: (value) => dateMask(value).maskedValue,
          }}
          inputAttrs={{
            maxLength: '10',
            afterChange,
          }}
        />
      </div>
      <div className="col">
        <UncontrolledFormGroupInputMask
          label="Replicates Input Mask 1 with setValue - same component"
          name="datemask2"
          mask={{
            parse: dateMask,
            format: (value) => dateMask(value).maskedValue,
          }}
          inputAttrs={{
            maxLength: '10',
          }}
        />
      </div>
    </>
  );
}

function FormInputMaskSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupInputMask
        label="Replicates Input Mask 1 with setValue - different component"
        name="datemask3"
        mask={{
          parse: dateMask,
          format: (value) => dateMask(value).maskedValue,
        }}
        inputAttrs={{
          maxLength: '10',
        }}
      />
    </div>
  );
}

function FormRadioSetValueTeste1({}) {
  const radio2 = useUncontrolledFormControl('radio2');
  const radio3 = useUncontrolledFormControl('radio3');

  const afterChange = useCallback((v) => {
    radio2.setValue(v);
    radio3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupRadio
          required
          label="Radio 1"
          name="radio1"
          id="radio1"
          afterChange={afterChange}
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
        />
      </div>
      <div className="col">
        <UncontrolledFormGroupRadio
          label="Replicates Radio 1 with setValue - same component"
          name="radio2"
          id="radio2"
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
        />
      </div>
    </>
  );
}

function FormRadioSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupRadio
        label="Replicates Radio 1 with setValue - different component"
        name="radio3"
        id="radio3"
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
      />
    </div>
  );
}

function FormSelectSetValueTeste1({}) {
  const select2 = useUncontrolledFormControl('select2');
  const select3 = useUncontrolledFormControl('select3');

  const afterChange = useCallback((v) => {
    select2.setValue(v);
    select3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupSelect
          label="Select 1"
          name="select1"
          afterChange={afterChange}
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
        />
      </div>
      <div className="col">
        <UncontrolledFormGroupSelect
          label="Replicates Select 1 with setValue - same component"
          name="select2"
          options={[
            {
              value: 1,
              label: 'Label para o valor 1',
            },
            {
              value: 2,
              label: 'Label para o valor 2',
            },
            {
              value: 3,
              label: 'Label para o valor 3',
            },
          ]}
        />
      </div>
    </>
  );
}

function FormSelectSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupSelect
        label="Replicates Select 1 with setValue - different component"
        name="select3"
        options={[
          {
            value: 1,
            label: 'Label para o valor 1',
          },
          {
            value: 2,
            label: 'Label para o valor 2',
          },
          {
            value: 3,
            label: 'Label para o valor 3',
          },
        ]}
      />
    </div>
  );
}

function FormSwitchSetValueTeste1({}) {
  const switch2 = useUncontrolledFormControl('switch2');
  const switch3 = useUncontrolledFormControl('switch3');

  const afterChange = useCallback((v) => {
    switch2.setValue(v);
    switch3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupSwitch label="Switch 1" name="switch1" id="switch1" afterChange={afterChange} />
      </div>
      <div className="col">
        <UncontrolledFormGroupSwitch
          label="Replicates Switch 1 with setValue - same component"
          name="switch2"
          id="switch2"
        />
      </div>
    </>
  );
}

function FormSwitchSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupSwitch
        label="Replicates Switch 1 with setValue - different component"
        name="switch3"
        id="switch3"
      />
    </div>
  );
}

function FormTextareaSetValueTeste1({}) {
  const textarea2 = useUncontrolledFormControl('textarea2');
  const textarea3 = useUncontrolledFormControl('textarea3');

  const afterChange = useCallback((v) => {
    textarea2.setValue(v);
    textarea3.setValue(v);
  }, []);

  return (
    <>
      <div className="col">
        <UncontrolledFormGroupTextarea label="Textarea 1" name="textarea1x" afterChange={afterChange} rows="5" />
      </div>
      <div className="col">
        <UncontrolledFormGroupTextarea
          label="Replicates Textarea 1 with setValue - same component"
          name="textarea2"
          rows="5"
        />
      </div>
    </>
  );
}

function FormTextareaSetValueTeste2({}) {
  return (
    <div className="col">
      <UncontrolledFormGroupTextarea
        label="Replicates Textarea 1 with setValue - different component"
        name="textarea3"
        rows="5"
      />
    </div>
  );
}
