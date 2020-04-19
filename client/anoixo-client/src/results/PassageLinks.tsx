import React, { memo } from 'react';
import { ReferenceResult } from './ResultTypes';
import Chip from '@material-ui/core/Chip';
import LaunchIcon from '@material-ui/icons/Launch';
import './css/PassageLinks.css';

type LinkChipProps = {
  label: string;
  href: string;
}

const LinkChip: React.FC<LinkChipProps> = memo((props: LinkChipProps) => {
  return (
    <Chip
        className='passage-link-chip'
        size='small'
        icon={<LaunchIcon/>}
        label={props.label}
        component='a'
        href={props.href}
        target='_blank'
        rel='noopener'
        clickable
      />
  );
});

type ResourceToLink = {
  label: string;
  generateLink: (references: ReferenceResult[]) => string;
}

const mainResources: ResourceToLink[] = [
  {
    label: 'NET Bible',
    generateLink: (references: ReferenceResult[]) => {
      return `https://netbible.org/bible/${references[0].book}+${references[0].chapter}`;
    },
  }
];

const translationResources: ResourceToLink[] = [
  {
    label: 'Compare other translations',
    generateLink: (references: ReferenceResult[]) => {
      const firstReference = references[0];
      const lastReference = references[references.length - 1];
      const referenceString = `${firstReference.book}${firstReference.chapter}:${firstReference.verse}-` +
        `${lastReference.chapter}:${lastReference.verse}`;
      return `https://www.biblegateway.com/passage/?search=${referenceString}&version=sblgnt;ESV`;
    },
  }
];

type PassageLinksProps = {
  references: ReferenceResult[];
};

const PassageLinks: React.FC<PassageLinksProps> = memo((props: PassageLinksProps) => {
  return (
    <div className='passage-card-links'>
      <div className='passage-card-main-links'>
        {mainResources.map((resourceToLink) =>
          <LinkChip label={resourceToLink.label} href={resourceToLink.generateLink(props.references)} />
        )}
      </div>
      <div className='passage-card-translation-links'>
        {translationResources.map((resourceToLink) =>
          <LinkChip label={resourceToLink.label} href={resourceToLink.generateLink(props.references)} />
        )}
      </div>
    </div>
  );
});

export default PassageLinks;
