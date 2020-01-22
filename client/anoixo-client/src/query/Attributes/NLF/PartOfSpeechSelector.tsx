import React, {memo} from 'react';
import AttributeComponentProps from '../AttributeComponentProps';
import AttrSelectionBox from '../AttrSelectionBox';

const PartOfSpeechSelector: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    props.updateAttr(props.id, (event.target.value as string));
  };
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
    <AttrSelectionBox label={label} currentValue={props.value || ''} items={items} 
      handleChange={handleChange}/>
  );
});

export default PartOfSpeechSelector;
