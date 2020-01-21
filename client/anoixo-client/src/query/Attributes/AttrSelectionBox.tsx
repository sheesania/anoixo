import React, {memo, ReactNode} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
  return (
      <label>{props.label}
        <Select value={props.currentValue} onChange={props.handleChange} displayEmpty>
          <MenuItem value=''><em>Any</em></MenuItem>
          {props.items.map((item, index) => <MenuItem value={item.value} key={index}>{item.label}</MenuItem>)}
        </Select>
      </label> 
  );
})

export default AttrSelectionBox;
