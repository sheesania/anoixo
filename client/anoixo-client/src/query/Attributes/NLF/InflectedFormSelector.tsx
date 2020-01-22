import React, {memo, ChangeEvent, useCallback} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttributeEditor from '../AttributeEditor';
import TextField from '@material-ui/core/TextField';
import './InflectedFormSelector.css';

const InflectedFormSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const {updateAttr, id} = props;
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateAttr(id, event.target.value);
  }, [updateAttr, id]);

  const label = 'Inflected Form';

  return (
    <AttributeEditor labelText={label}>
        <TextField className='attribute-input inflected-form-selector' placeholder='Any' value={props.value || ''} 
          onChange={onChange}/>
    </AttributeEditor>
  );
});

export default InflectedFormSelector;
