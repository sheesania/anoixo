import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const PersonSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (newValue: string) => {
    props.updateAttr(props.id, newValue);
  };
  const label = 'Person';
  const items = [
    {
        label: '1st person',
        value: 'first',
    },
    {
        label: '2nd person',
        value: 'second',
    },
    {
        label: '3rd person',
        value: 'third',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default PersonSelector;
