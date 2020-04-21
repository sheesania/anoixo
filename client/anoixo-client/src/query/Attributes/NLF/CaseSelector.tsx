import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../AttributeComponent';
import AttrSelectionBox from '../AttrSelectionBox';

const CaseSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

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

export default CaseSelector;
