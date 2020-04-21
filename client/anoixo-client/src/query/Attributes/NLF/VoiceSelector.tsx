import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../AttributeComponent';
import AttrSelectionBox from '../AttrSelectionBox';

const VoiceSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const label = 'Voice';
    const items = [
      {
        label: 'Active',
        value: 'active',
      },
      {
        label: 'Passive',
        value: 'passive',
      },
      {
        label: 'Middle',
        value: 'middle',
      },
      {
        label: 'Middle/Passive',
        value: 'middlepassive',
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

export default VoiceSelector;
