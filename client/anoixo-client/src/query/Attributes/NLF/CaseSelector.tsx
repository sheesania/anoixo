import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const CaseSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    props.updateAttr(props.id, (event.target.value as string));
  };
  const label = 'Case';
  const items = [
    {
        label: 'Accusative',
        value: 'accusative',
    },
    {
        label: 'Dative',
        value: 'dative',
    },
    {
        label: 'Genitive',
        value: 'genitive',
    },
    {
        label: 'Nominative',
        value: 'nominative',
    },
    {
        label: 'Vocative',
        value: 'vocative',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default CaseSelector;
