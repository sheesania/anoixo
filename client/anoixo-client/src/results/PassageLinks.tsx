import React, { memo } from 'react';
import { ReferenceResult } from './ResultTypes';
import Chip from '@material-ui/core/Chip';
import LaunchIcon from '@material-ui/icons/Launch';
import './css/PassageLinks.css';

type LinkChipProps = {
  label: string;
  href: string;
};

const LinkChip: React.FC<LinkChipProps> = memo((props: LinkChipProps) => {
  return (
    <Chip
      className="passage-link-chip"
      size="small"
      icon={<LaunchIcon />}
      label={props.label}
      component="a"
      href={props.href}
      target="_blank"
      rel="noopener"
      clickable
    />
  );
});

type ResourceToLink = {
  label: string;
  generateLink: (references: ReferenceResult[]) => string;
};

const mainResources: ResourceToLink[] = [
  {
    label: 'NET Bible',
    generateLink: (references: ReferenceResult[]) => {
      let book;
      if (references[0].book === 'Phlm') {
        book = 'Philemon';
      } else {
        book = references[0].book;
      }
      const chapter = references[0].chapter;
      return `https://netbible.org/bible/${book}+${chapter}`;
    },
  },
  {
    label: 'Commentaries',
    generateLink: (references: ReferenceResult[]) => {
      const BIBLEHUB_BOOK_MAPPING: { [book: string]: string } = {
        Matt: 'matthew',
        Mark: 'mark',
        Luke: 'luke',
        John: 'john',
        Acts: 'acts',
        Rom: 'romans',
        '1Cor': '1_corinthians',
        '2Cor': '2_corinthians',
        Gal: 'galatians',
        Eph: 'ephesians',
        Phil: 'philippians',
        Col: 'colossians',
        '1Thess': '1_thessalonians',
        '2Thess': '2_thessalonians',
        '1Tim': '1_timothy',
        '2Tim': '2_timothy',
        Titus: 'titus',
        Phlm: 'philemon',
        Heb: 'hebrews',
        Jas: 'james',
        '1Pet': '1_peter',
        '2Pet': '2_peter',
        '1John': '1_john',
        Jude: 'jude',
        Rev: 'revelation',
      };
      const book = BIBLEHUB_BOOK_MAPPING[references[0].book];
      const chapter = references[0].chapter;
      const verse = references[0].verse;
      return `https://biblehub.com/commentaries/${book}/${chapter}-${verse}.htm`;
    },
  },
];

const translationResources: ResourceToLink[] = [
  {
    label: 'Compare other translations',
    generateLink: (references: ReferenceResult[]) => {
      const firstReference = references[0];
      const lastReference = references[references.length - 1];
      const referenceString =
        `${firstReference.book}${firstReference.chapter}:${firstReference.verse}-` +
        `${lastReference.chapter}:${lastReference.verse}`;
      return `https://www.biblegateway.com/passage/?search=${referenceString}&version=SBLGNT;ESV`;
    },
  },
];

type PassageLinksProps = {
  references: ReferenceResult[];
};

const PassageLinks: React.FC<PassageLinksProps> = memo(
  (props: PassageLinksProps) => {
    if (props.references.length > 0) {
      return (
        <div className="passage-card-links">
          <div className="passage-card-main-links">
            {mainResources.map((resourceToLink, index) => (
              <LinkChip
                label={resourceToLink.label}
                href={resourceToLink.generateLink(props.references)}
                key={index}
              />
            ))}
          </div>
          <div className="passage-card-translation-links">
            {translationResources.map((resourceToLink, index) => (
              <LinkChip
                label={resourceToLink.label}
                href={resourceToLink.generateLink(props.references)}
                key={index}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
);

export default PassageLinks;
