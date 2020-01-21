import React, {memo} from 'react';
import {WordQuery} from './QueryTypes';
import {Paper} from '@material-ui/core';
import './css/WordBuilder.css';

// In the future, this could be grabbing the component map for the current provider (Greek NT, Hebrew OT, Septuagint, 
// etc) from a dictionary or something, instead of hardcoding just this one NT NLF component map.
import NLFAttributeComponentMap from './Attributes/NLF/NLFAttributeComponentMap';

type Props = {
    word: WordQuery;
};

const WordBuilder: React.FC<Props> = memo((props: Props) => {
  const attributes = NLFAttributeComponentMap.map((attrToComponent) => {
    let attrValue = undefined;
    if (props.word.attributes && attrToComponent.attrId in props.word.attributes) {
      attrValue = props.word.attributes[attrToComponent.attrId];
    }
    const AttrComponent = attrToComponent.component;
    return <AttrComponent id={attrToComponent.attrId} value={attrValue}/>
  });

  return (
    <Paper className='WordBuilder' elevation={3}>
        look at my word: {JSON.stringify(props.word)}
        {attributes}
    </Paper>
  );
})

export default WordBuilder;
