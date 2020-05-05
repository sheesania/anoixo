import { AttributesQuery } from '../../query/QueryTypes';
import { TextSetting } from '../TextSettings';
import getNLFAttributeSelector from './getNLFAttributeSelector';
import LexicalFormField from './LexicalFormField';
import InflectedFormField from './InflectedFormField';

export type NLFAttribute =
  | 'class'
  | 'lemma'
  | 'normalized'
  | 'case'
  | 'person'
  | 'number'
  | 'gender'
  | 'tense'
  | 'voice'
  | 'mood';
export const NLFTextSetting: TextSetting<NLFAttribute> = {
  serverTextId: 'nlf',
  attributeQueriesToCache: ['lemma', 'normalized'],
  attributeDisplayOrder: [
    'class',
    'lemma',
    'normalized',
    'case',
    'person',
    'number',
    'gender',
    'tense',
    'voice',
    'mood',
  ],
  verbalizeAttributes: (attributes: AttributesQuery | undefined) => {
    if (!attributes) {
      return 'a word';
    }

    const getValueForAttr = (attr: NLFAttribute): string => {
      if (!attributes[attr]) {
        return '';
      }
      const values = NLFTextSetting.attributes[attr].values;
      const valueInfo = values && values.get(attributes[attr]);
      const displayName = valueInfo && valueInfo.displayName;
      // Default to just using the raw value of the attribute if there's no display name defined for it
      // Note the space needed for concatenating different attributes!
      return `${displayName || attributes[attr]} `;
    };

    const getVerbalizationWithArticle = (verbalization: string): string => {
      if (
        verbalization
          .charAt(0)
          .toLowerCase()
          .match(/[aeiou]/)
      ) {
        return `an ${verbalization}`;
      } else {
        return `a ${verbalization}`;
      }
    };

    const lexicalForm = getValueForAttr('lemma');
    const inflectedForm = getValueForAttr('normalized');
    const caseStr = getValueForAttr('case');
    const person = getValueForAttr('person');
    const number = getValueForAttr('number');
    const gender = getValueForAttr('gender');
    const tense = getValueForAttr('tense');
    const voice = getValueForAttr('voice');

    // If mood is participle or infinitive, use it as part of speech instead
    let mood = getValueForAttr('mood');
    let partOfSpeech = '';
    if (attributes['mood'] === 'participle') {
      partOfSpeech = mood;
      mood = '';
    } else if (attributes['mood'] === 'infinitive') {
      partOfSpeech = mood;
      mood = '';
    } else {
      partOfSpeech = getValueForAttr('class');
    }

    // If both inflected form and lexical form are defined, go with inflected form
    let root = '';
    if (inflectedForm) {
      root = inflectedForm;
    } else if (lexicalForm) {
      root = lexicalForm;
    }

    const descriptors = `${person}${number}${caseStr}${gender}${tense}${voice}${mood}${partOfSpeech}`;

    let finalString = '';
    if (root && descriptors) {
      finalString = getVerbalizationWithArticle(`${descriptors}from ${root}`);
    } else if (root) {
      finalString = root;
    } else if (descriptors) {
      finalString = getVerbalizationWithArticle(descriptors);
    }

    // Display names may be capitalized for display elsewhere, so lowercase them, plus trim the trailing space
    return finalString.toLowerCase().trim();
  },
  attributes: {
    class: {
      displayName: 'Part of Speech',
      component: getNLFAttributeSelector('class'),
      shouldBeEnabled: () => true,
      values: new Map([
        ['adj', { displayName: 'Adjective' }],
        ['adv', { displayName: 'Adverb' }],
        ['det', { displayName: 'Article/Determiner' }],
        ['conj', { displayName: 'Conjunction' }],
        ['intj', { displayName: 'Interjection' }],
        ['noun', { displayName: 'Noun' }],
        ['ptcl', { displayName: 'Particle' }],
        ['prep', { displayName: 'Preposition' }],
        ['pron', { displayName: 'Pronoun' }],
        ['verb', { displayName: 'Verbal' }],
      ]),
    },
    lemma: {
      displayName: 'Lexical Form',
      component: LexicalFormField,
      shouldBeEnabled: () => true,
    },
    normalized: {
      displayName: 'Inflected Form',
      component: InflectedFormField,
      shouldBeEnabled: () => true,
    },
    case: {
      displayName: 'Case',
      component: getNLFAttributeSelector('case'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['accusative', { displayName: 'Accusative' }],
        ['dative', { displayName: 'Dative' }],
        ['genitive', { displayName: 'Genitive' }],
        ['nominative', { displayName: 'Nominative' }],
        ['vocative', { displayName: 'Vocative' }],
      ]),
    },
    person: {
      displayName: 'Person',
      component: getNLFAttributeSelector('person'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['first', { displayName: '1st person' }],
        ['second', { displayName: '2nd person' }],
        ['third', { displayName: '3rd person' }],
      ]),
    },
    number: {
      displayName: 'Number',
      component: getNLFAttributeSelector('number'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['singular', { displayName: 'Singular' }],
        ['plural', { displayName: 'Plural' }],
      ]),
    },
    gender: {
      displayName: 'Gender',
      component: getNLFAttributeSelector('gender'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['masculine', { displayName: 'Masculine' }],
        ['feminine', { displayName: 'Feminine' }],
        ['neuter', { displayName: 'Neuter' }],
      ]),
    },
    tense: {
      displayName: 'Tense',
      component: getNLFAttributeSelector('tense'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['aorist', { displayName: 'Aorist' }],
        ['imperfect', { displayName: 'Imperfect' }],
        ['future', { displayName: 'Future' }],
        ['perfect', { displayName: 'Perfect' }],
        ['pluperfect', { displayName: 'Pluperfect' }],
        ['present', { displayName: 'Present' }],
      ]),
    },
    voice: {
      displayName: 'Voice',
      component: getNLFAttributeSelector('voice'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['active', { displayName: 'Active' }],
        ['passive', { displayName: 'Passive' }],
        ['middle', { displayName: 'Middle' }],
        ['middlepassive', { displayName: 'Middle/Passive' }],
      ]),
    },
    mood: {
      displayName: 'Mood',
      component: getNLFAttributeSelector('mood'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return (
          !allAttributes ||
          !allAttributes['class'] ||
          allAttributes['class'] === 'verb'
        );
      },
      values: new Map([
        ['indicative', { displayName: 'Indicative' }],
        ['infinitive', { displayName: 'Infinitive' }],
        ['imperative', { displayName: 'Imperative' }],
        ['optative', { displayName: 'Optative' }],
        ['participle', { displayName: 'Participle' }],
        ['subjunctive', { displayName: 'Subjunctive' }],
      ]),
    },
  },
};
