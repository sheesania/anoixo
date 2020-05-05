import React, { memo } from 'react';
import { AttributesQuery, Query } from '../query/QueryTypes';
import { useTextSetting } from '../texts/TextSettings';
import Typography from '@material-ui/core/Typography';

type Props = {
  query: Query;
};

const verbalizeQuery = (
  query: Query,
  verbalizeAttributes: (attributes: AttributesQuery | undefined) => string
): (JSX.Element | string)[] => {
  const sequenceStrings = query.sequences.map(sequence => {
    const wordStrings = sequence.map(word => (
      <strong>{verbalizeAttributes(word.attributes)}</strong>
    ));

    if (!wordStrings.length) {
      return [];
    }

    const wordStringsWithLinks: (JSX.Element | string)[] = [wordStrings[0]];
    for (let i = 1; i < wordStrings.length; i++) {
      wordStringsWithLinks.push(' followed by ');
      wordStringsWithLinks.push(wordStrings[i]);

      const previousWord = sequence[i - 1];
      if (previousWord.link) {
        const plural = previousWord.link.allowedWordsBetween === 1 ? '' : 's';
        wordStringsWithLinks.push(
          ` with up to ${previousWord.link.allowedWordsBetween} word${plural} in between`
        );
      }
    }

    return wordStringsWithLinks;
  });

  // Join sequences into one non-nested array of elements joined by 'and'
  const joinedText = sequenceStrings.reduce(
    (previous: (string | JSX.Element)[], current: (string | JSX.Element)[]) => {
      if (!current.length) {
        // skip empty arrays (which came from empty sequences)
        return previous;
      }
      if (!previous.length) {
        return [...current];
      }
      return [...previous, ' and ', ...current];
    },
    []
  );

  return joinedText;
};

const VerbalizedQuery: React.FC<Props> = memo((props: Props) => {
  const currentText = useTextSetting();

  let verbalizedQuery = verbalizeQuery(
    props.query,
    currentText.verbalizeAttributes
  );
  if (!verbalizedQuery.length) {
    verbalizedQuery = ['an empty query'];
  }

  // Note React.createElement workaround for "missing key props" warning, which is irrelevant here since the array will
  // not dynamically change and need to be rerendered
  return (
    <Typography style={{ margin: '1.2rem' }}>
      for {React.createElement('span', {}, ...verbalizedQuery)}
    </Typography>
  );
});

export default VerbalizedQuery;
