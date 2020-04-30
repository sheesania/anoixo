import React, { memo, useCallback } from 'react';
import { useTextSetting } from '../texts/TextSettings';
import { WordQuery } from './QueryTypes';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './css/WordBuilder.css';

type Props = {
  word: WordQuery;
  wordIndex: number;
  showDeleteButton: boolean;
  updateWord: (updateIndex: number, updatedWord: WordQuery) => void;
  deleteWord: (wordIndex: number) => void;
};

const WordBuilder: React.FC<Props> = memo((props: Props) => {
  const { word, wordIndex, showDeleteButton, updateWord, deleteWord } = props;

  const updateAttr = useCallback(
    (updateAttrId: string, updateValue: string) => {
      const updatedAttributes = word.attributes ? { ...word.attributes } : {};
      if (updateValue) {
        updatedAttributes[updateAttrId] = updateValue;
      } else {
        // This will work regardless of whether updateAttrId exists in the dictionary
        delete updatedAttributes[updateAttrId];
      }

      const updatedWord = {
        ...word,
        attributes: updatedAttributes,
      };
      updateWord(wordIndex, updatedWord);
    },
    [word, wordIndex, updateWord]
  );

  const currentText = useTextSetting();
  const attributes = currentText.attributeDisplayOrder.map((attribute, index) => {
    let attrValue = undefined;
    if (word.attributes && attribute in word.attributes) {
      attrValue = word.attributes[attribute];
    }

    const AttrComponent = currentText.attributes[attribute].component;
    const enabled = currentText.attributes[attribute].shouldBeEnabled(word.attributes);
    return (
      <AttrComponent
        id={attribute}
        value={attrValue}
        updateAttr={updateAttr}
        enabled={enabled}
        key={index}
      />
    );
  });

  return (
    <Paper className="WordBuilder" elevation={3}>
      <div className='word-card-header'>
        <Typography variant="h5" component="h2">
          <span className="word-card-title-highlighted">Word</span>{' '}
          <span className="word-card-title-subtitle">with</span>
        </Typography>
        {showDeleteButton &&
          <IconButton aria-label="Delete" onClick={() => deleteWord(wordIndex)}>
            <CloseIcon style={{color: 'crimson'}} />
          </IconButton>
        }
      </div>
      {attributes}
    </Paper>
  );
});

export default WordBuilder;
