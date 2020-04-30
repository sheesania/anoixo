import React, { memo } from 'react';
import { AttributesQuery, Query } from '../query/QueryTypes';
import { useTextSetting } from '../texts/TextSettings';
import Typography from '@material-ui/core/Typography';

type Props = {
  query: Query;
};

const verbalizeQuery = (query: Query, verbalizeAttributes: (attributes: AttributesQuery | undefined) => string):
  (JSX.Element | string)[] => {
  const sequenceStrings = query.sequences.map((sequence) => {
    const wordStrings = sequence.map((word) => <strong>{verbalizeAttributes(word.attributes)}</strong>);

    if (!wordStrings.length) {
      return [''];
    }

    const wordStringsWithLinks: (JSX.Element | string)[] = [wordStrings[0]];
    for (let i = 1; i < wordStrings.length; i++) {
      wordStringsWithLinks.push(' followed by ');
      wordStringsWithLinks.push(wordStrings[i]);

      const previousWord = sequence[i - 1];
      if (previousWord.link) {
        const plural = previousWord.link.allowedWordsBetween === 1 ? '' : 's'
        wordStringsWithLinks.push(` with up to ${previousWord.link.allowedWordsBetween} word${plural} in between`);
      }

      wordStringsWithLinks.push(' ');
    }

    return wordStringsWithLinks;
  });

  // Join sequences into one non-nested array of elements joined by 'and'
  const joinedText = sequenceStrings.reduce(
    (previous: (string | JSX.Element)[], current: (string | JSX.Element)[]) => {
      if (!previous.length) {
        return [...current];
      } else {
        return [...previous, ' and ', ...current];
      }
    },
    []
  );

  return joinedText;
};

const VerbalizedQuery: React.FC<Props> = memo((props: Props) => {
  const currentText = useTextSetting();

  return (
    <Typography style={{ margin: '1.2rem'}}>
      for {verbalizeQuery(props.query, currentText.verbalizeAttributes)}
    </Typography>
  );
});

export default VerbalizedQuery;
