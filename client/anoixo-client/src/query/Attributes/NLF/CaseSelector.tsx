import React, {memo, useCallback} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const CaseSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const {updateAttr, id} = props;
  const handleChange = useCallback((newValue: string) => {
    updateAttr(id, newValue);
  }, [updateAttr, id]);

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
