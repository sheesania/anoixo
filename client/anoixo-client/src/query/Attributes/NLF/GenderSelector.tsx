import React, {memo, useCallback} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const GenderSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const {updateAttr, id} = props;
  const handleChange = useCallback((newValue: string) => {
    updateAttr(id, newValue);
  }, [updateAttr, id]);

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
