import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';

const POSSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  return (
    <div className='POSSelector'>
        Part of Speech. Current value? {props.value}
    </div>
  );
})

export default POSSelector;
