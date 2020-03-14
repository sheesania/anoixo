import React, { memo, useCallback } from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const MoodSelector: React.FC<AttributeComponentProps> = memo(
  (props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const label = 'Mood';
    const items = [
      {
        label: 'Indicative',
        value: 'indicative',
      },
      {
        label: 'Imperative',
        value: 'imperative',
      },
      {
        label: 'Infinitive',
        value: 'infinitive',
      },
      {
        label: 'Optative',
        value: 'optative',
      },
      {
        label: 'Participle',
        value: 'participle',
      },
      {
        label: 'Subjunctive',
        value: 'subjunctive',
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

export default MoodSelector;
