## Desenvolvendo com UncontrolledForm

### O que é um uncontrolled component no react

Diferente de um componente "controlled" o "uncontrolled" mantem o estado no próprio componente. Com isso podemos ganhar performance em formularios muito grandes, onde muitos campos estão dentro do mesmo componente pai, porém podemos ter efeitos colaterais devido a não renderização de componentes "irmãos".

### Implementação de uncontrolled component no UncontrolledForm

#### useUncontrolledFormHelper e useUncontrolledFormControl

Os hooks useUncontrolledFormHelper e useUncontrolledFormControl são o que controlam o UncontrolledForm. O valor do "form" fica salvo no useUncontrolledFormHelper, este valor é editado em cada campo com o useUncontrolledFormControl.

#### Lógica de atualização do UncontrolledForm

Como o valor do UncontrolledForm é salvo em uma variavel que usa o hook "useRef", a lógica de atualização do form não é muito direta. Para entender como a atualização funciona, vou usar como um exemplo a edição de um FormUncontrolledInput, quando altero o valor do campo:

1. O useUncontrolledFormControl.handleOnChangeFactory é acionado;
2. O handleOnChange no useUncontrolledFormControl é acionado;
3. O setValue no useUncontrolledFormControl é acionado;
4. O setFormControlValue do formHelper é acionado pelo setValue no useUncontrolledFormControl(que é o mesmo setFormControlValue do useUncontrolledFormControl);
5. O setFormControlValue no hook useUncontrolledFormControl é acionado;
6. O "state" do "FormUncontrolledInput" é atualizado no setFormControlValue, e é disparado o formHelper.notify;
7. O formHelper.notify altera o valor do campo na ref do form;
8. O valor visível no FormUncontrolledInput é alterado, porque o state foi alterado, o setFormControlValue é atualizado, e o formHelper.setFormControlValue é atualizado

#### Como criar um novo campo no UncontrolledForm

Para criar um novo campo no UncontrolledForm, é necessario criar um estado com o "useState" e usar o hook "useUncontrolledFormControl" passando o estado como opção no terceiro parametro. Caso o novo campo seja um elemento html, você pode usar o "registerInputRef" do "useUncontrolledFormControl" como a "ref" do elemento, para usar as validações do elemento(ex: required, max, min).
