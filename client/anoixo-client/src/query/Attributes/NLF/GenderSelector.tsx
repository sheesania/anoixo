import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const GenderSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    props.updateAttr(props.id, (event.target.value as string));
  };
  const label = 'Gender';
  const items = [
    {
        label: 'Masculine',
        value: 'masculine',
    },
    {
        label: 'Feminine',
        value: 'feminine',
    },
    {
        label: 'Neuter',
        value: 'neuter',
    }
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default GenderSelector;
