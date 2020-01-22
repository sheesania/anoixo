import React, {memo, ChangeEvent, useCallback} from 'react';
import {useUID} from 'react-uid';
import AttributeComponentProps from '../AttributeComponentProps';
import AttributeEditor from '../AttributeEditor';
import TextField from '@material-ui/core/TextField';
import './InflectedFormField.css';

const InflectedFormField: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const uid = 'attr-field-' + useUID();
  const {updateAttr, id} = props;
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateAttr(id, event.target.value);
  }, [updateAttr, id]);

  const label = 'Inflected Form';

  return (
    <AttributeEditor labelText={label} labelProps={{htmlFor: uid}}>
        <TextField id={uid} className='attribute-input inflected-form-selector' placeholder='Any' 
          value={props.value || ''} onChange={onChange}/>
    </AttributeEditor>
  );
});

export default InflectedFormField;
