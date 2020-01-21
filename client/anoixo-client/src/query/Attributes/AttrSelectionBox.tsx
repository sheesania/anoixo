import React, {memo, ReactNode} from 'react';
import {useUID} from 'react-uid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import AttributeEditor from './AttributeEditor';
import './AttrSelectionBox.css';

type Props = {
    label: string;
    currentValue: string;
    items: {
        label: string;
        value: string;
    }[];
    handleChange: (event: React.ChangeEvent<{value: unknown}>, child: ReactNode) => void;
}

const AttrSelectionBox: React.FC<Props> = memo((props: Props) => {
  const uid = 'attr-select-' + useUID();
  return (
    <AttributeEditor labelText={props.label} labelProps={{id: uid}}>
      <Select className='attr-select-box' value={props.currentValue} onChange={props.handleChange} labelId={uid} 
        displayEmpty>
        <MenuItem value=''><span className='any-element'>Any</span></MenuItem>
        {props.items.map((item, index) => 
          <MenuItem value={item.value} key={index}>
            <span className={item.value === props.currentValue ? 'selected-item' : ''}>{item.label}</span>
          </MenuItem>
        )}
      </Select>
    </AttributeEditor>
  );
});

export default AttrSelectionBox;
