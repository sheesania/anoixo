import React, { memo, useCallback } from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const PersonSelector: React.FC<AttributeComponentProps> = memo(
  (props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const label = 'Person';
    const items = [
      {
        label: '1st person',
        value: 'first',
      },
      {
        label: '2nd person',
        value: 'second',
      },
      {
        label: '3rd person',
        value: 'third',
      },
    ];

    return (
      <AttrSelectionBox
        label={label}
        currentValue={props.value || ''}
        items={items}
        handleChange={handleChange}
      />
    );
  }
);

export default PersonSelector;
