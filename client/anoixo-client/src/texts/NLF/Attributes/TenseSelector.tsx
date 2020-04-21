import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../../../query/Attributes/AttributeComponent';
import AttrSelectionBox from '../../../query/Attributes/AttrSelectionBox';

const TenseSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const label = 'Tense';
    const items = [
      {
        label: 'Aorist',
        value: 'aorist',
      },
      {
        label: 'Imperfect',
        value: 'imperfect',
      },
      {
        label: 'Future',
        value: 'future',
      },
      {
        label: 'Perfect',
        value: 'perfect',
      },
      {
        label: 'Pluperfect',
        value: 'pluperfect',
      },
      {
        label: 'Present',
        value: 'present',
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

export default TenseSelector;
