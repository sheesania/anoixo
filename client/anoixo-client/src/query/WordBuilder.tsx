import React, { memo, useCallback } from 'react';
import { WordQuery } from './QueryTypes';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './css/WordBuilder.css';

// In the future, this could be grabbing the component map for the current provider (Greek NT, Hebrew OT, Septuagint,
// etc) from a dictionary or something, instead of hardcoding just this one NT NLF component map.
import NLFAttributeComponentMap from './Attributes/NLF/NLFAttributeComponentMap';

type Props = {
  word: WordQuery;
  wordIndex: number;
  updateWord: (updateIndex: number, updatedWord: WordQuery) => void;
};

const WordBuilder: React.FC<Props> = memo((props: Props) => {
  const { word, wordIndex, updateWord } = props;

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

  const attributes = NLFAttributeComponentMap.map((attrToComponent, index) => {
    let attrValue = undefined;
    if (word.attributes && attrToComponent.attrId in word.attributes) {
      attrValue = word.attributes[attrToComponent.attrId];
    }
    const AttrComponent = attrToComponent.component;
    return (
      <AttrComponent
        id={attrToComponent.attrId}
        value={attrValue}
        updateAttr={updateAttr}
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
        <IconButton aria-label="delete">
          <CloseIcon style={{color: 'crimson'}} />
        </IconButton>
      </div>
      {attributes}
    </Paper>
  );
});

export default WordBuilder;
