import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const VoiceSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (newValue: string) => {
    props.updateAttr(props.id, newValue);
  };
  const label = 'Voice';
  const items = [
    {
        label: 'Active',
        value: 'active',
    },
    {
        label: 'Passive',
        value: 'passive',
    },
    {
        label: 'Middle',
        value: 'middle',
    },
    {
        label: 'Middle/Passive',
        value: 'middlepassive',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default VoiceSelector;