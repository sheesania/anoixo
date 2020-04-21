import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../../../query/Attributes/AttributeComponent';
import AttrSelectionBox from '../../../query/Attributes/AttrSelectionBox';

const GenderSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

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

export default GenderSelector;
