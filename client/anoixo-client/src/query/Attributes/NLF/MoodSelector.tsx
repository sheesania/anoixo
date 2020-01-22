import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const MoodSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (newValue: string) => {
    props.updateAttr(props.id, newValue);
  };
  const label = 'Mood';
  const items = [
    {
        label: 'Indicative',
        value: 'indicative',
    },
    {
        label: 'Imperative',
        value: 'imperative',
    },
    {
        label: 'Infinitive',
        value: 'infinitive',
    },
    {
        label: 'Optative',
        value: 'optative',
    },
    {
        label: 'Participle',
        value: 'participle',
    },
    {
        label: 'Subjunctive',
        value: 'subjunctive',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default MoodSelector;
