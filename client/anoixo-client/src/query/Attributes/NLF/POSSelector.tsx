import React, {memo, ReactNode} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const POSSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (event: React.ChangeEvent<{value: unknown}>, child: ReactNode) => {
    console.log(event);
  };
  const items = [
    {
      label: 'Verbal',
      value: 'verb',
    },
    {
      label: 'Noun',
      value: 'noun',
    }
  ]

  return (
    <AttrSelectionBox label='Part of Speech' currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
})

export default POSSelector;
