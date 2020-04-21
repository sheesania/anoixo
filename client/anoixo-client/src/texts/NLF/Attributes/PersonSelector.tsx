import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../../../query/Attributes/AttributeComponent';
import AttrSelectionBox from '../../../query/Attributes/AttrSelectionBox';

const PersonSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
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
        enabled={props.enabled}
        handleChange={handleChange}
      />
    );
  }
);

export default PersonSelector;
