import React, { memo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Typography from '@material-ui/core/Typography';
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

  return <Typography variant="body1">{attributeElements}</Typography>;
};

const Word: React.FC<Props> = memo((props: Props) => {
  const word = props.word;

  const matchedWordClass = word.matchedSequence > -1 ? 'matched-word' : '';
  const tooltipContent = getAttributeTooltipText(word, useTextSetting());

  return (
    <span
      data-tip={renderToStaticMarkup(tooltipContent)}
      data-background-color="#e0e0e0"
      data-text-color="black"
      className={matchedWordClass}
    >
      {word.text}
    </span>
  );
});

export default Word;
