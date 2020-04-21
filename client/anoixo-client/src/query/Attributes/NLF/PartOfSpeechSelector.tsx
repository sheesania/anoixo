import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../AttributeComponent';
import AttrSelectionBox from '../AttrSelectionBox';

const PartOfSpeechSelector: AttributeComponent = memo((props: AttributeComponentProps) => {
    const { updateAttr, id } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const label = 'Part of Speech';
    const items = [
      {
        label: 'Adjective',
        value: 'adj',
      },
      {
        label: 'Adverb',
        value: 'adv',
      },
      {
        label: 'Article/Determiner',
        value: 'det',
      },
      {
        label: 'Conjunction',
        value: 'conj',
      },
      {
        label: 'Interjection',
        value: 'intj',
      },
      {
        label: 'Noun',
        value: 'noun',
      },
      {
        label: 'Particle',
        value: 'ptcl',
      },
      {
        label: 'Preposition',
        value: 'prep',
      },
      {
        label: 'Pronoun',
        value: 'pron',
      },
      {
        label: 'Verbal',
        value: 'verb',
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

export default PartOfSpeechSelector;
