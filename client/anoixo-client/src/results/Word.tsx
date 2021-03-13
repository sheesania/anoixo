import React, { memo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { useTextSetting, TextSetting } from '../texts/TextSettings';
import { WordResult } from './ResultTypes';
import './css/Word.css';

type Props = {
  word: WordResult;
};

const getAttributeTooltipText = (
  word: WordResult,
  currentText: TextSetting<string>
) => {
  const attributeElements = [];
  for (let attribute of currentText.attributeDisplayOrder) {
    if (!(attribute in word)) {
      continue;
    }

    const attrSettings = currentText.attributes[attribute];
    const attrDisplayName = attrSettings.displayName;

    // Some kinds of attributes have display names for specific values in the settings (for instance, 'ptcp' should be
    // displayed as 'Participle'). Others don't (lemmas, for instance). So check the settings for a value display
    // name, and just use the raw value of the attribute otherwise
    let attrValue = word[attribute];
    if (attrSettings.values) {
      const valueSettings = attrSettings.values.get(attrValue);
      if (valueSettings) {
        attrValue = valueSettings.displayName;
      }
    }

    attributeElements.push(
      <React.Fragment>
        <strong>{attrDisplayName}: </strong>
        {attrValue}
        <br />
      </React.Fragment>
    );
  }

  return <div>{attributeElements}</div>;
};

const Word: React.FC<Props> = memo((props: Props) => {
  const word = props.word;

  const matchedWordClass = word.matchedSequence > -1 ? 'matched-word' : '';
  const tooltipContent = getAttributeTooltipText(word, useTextSetting());

  return (
    <Tooltip
      title={tooltipContent}
      classes={{
        tooltip: 'attribute-tooltip',
        arrow: 'attribute-tooltip-arrow',
      }}
      interactive
      arrow
    >
      <span className={matchedWordClass}>{word.text}</span>
    </Tooltip>
  );
});

export default Word;
