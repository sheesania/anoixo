import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const TenseSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (newValue: string) => {
    props.updateAttr(props.id, newValue);
  };
  const label = 'Tense';
  const items = [
    {
        label: 'Aorist',
        value: 'aorist',
    },
    {
        label: 'Imperfect',
        value: 'imperfect',
    },
    {
        label: 'Future',
        value: 'future',
    },
    {
        label: 'Perfect',
        value: 'perfect',
    },
    {
        label: 'Pluperfect',
        value: 'pluperfect',
    },
    {
        label: 'Present',
        value: 'present',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default TenseSelector;
