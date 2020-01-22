import React, {memo, ChangeEvent} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttributeEditor from '../AttributeEditor';
import TextField from '@material-ui/core/TextField';
import './LexicalFormSelector.css';

const LexicalFormSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.updateAttr(props.id, event.target.value);
  };

  const label = 'Lexical Form';

  return (
    <AttributeEditor labelText={label}>
        <TextField className='attribute-input lexical-form-selector' placeholder='Any' value={props.value || ''} 
          onChange={onChange}/>
    </AttributeEditor>
  );
});

export default LexicalFormSelector;
