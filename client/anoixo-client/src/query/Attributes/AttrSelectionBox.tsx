import React, {memo, ReactNode} from 'react';
import {useUID} from 'react-uid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import AttrLabel from './AttrLabel';
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
  const uid = useUID();
  return (
    <div className='attribute-editor'>
      <AttrLabel id={uid} text={props.label}/>
      <Select className='attr-select-box' value={props.currentValue} onChange={props.handleChange} labelId={uid} 
      displayEmpty>
        <MenuItem value=''><em>Any</em></MenuItem>
        {props.items.map((item, index) => <MenuItem value={item.value} key={index}>{item.label}</MenuItem>)}
      </Select>
    </div>
  );
})

export default AttrSelectionBox;
