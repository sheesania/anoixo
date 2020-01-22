import React, {memo, useCallback} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const NumberSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const {updateAttr, id} = props;
  const handleChange = useCallback((newValue: string) => {
    updateAttr(id, newValue);
  }, [updateAttr, id]);

  const label = 'Number';
  const items = [
    {
        label: 'Singular',
        value: 'singular',
    },
    {
        label: 'Plural',
        value: 'plural',
    },
  ];

  return (
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default NumberSelector;
