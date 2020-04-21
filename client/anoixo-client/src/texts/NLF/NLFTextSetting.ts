import { AttributesQuery } from '../../query/QueryTypes';
import { TextSetting } from '../TextSettings';
import getNLFAttributeSelector from './Attributes/getNLFAttributeSelector';
import LexicalFormField from './Attributes/LexicalFormField';
import InflectedFormField from './Attributes/InflectedFormField';

export type NLFAttribute =
  'class' | 'lemma' | 'normalized' | 'case' | 'person' | 'number' | 'gender' | 'tense' | 'voice' | 'mood';
export const NLFTextSetting: TextSetting<NLFAttribute> = {
  serverTextId: 'nlf',
  attributeQueriesToCache: ['lemma', 'normalized'],
  attributeDisplayOrder:
    ['class', 'lemma', 'normalized', 'case', 'person', 'number', 'gender', 'tense', 'voice', 'mood'],
  attributes: {
    'class': {
      displayName: 'Part of Speech',
      component: getNLFAttributeSelector('class'),
      shouldBeEnabled: () => true,
      values: [
        {
          value: 'adj',
          displayName: 'Adjective',
        },
        {
          value: 'adv',
          displayName: 'Adverb',
        },
        {
          value: 'det',
          displayName: 'Article/Determiner',
        },
        {
          value: 'conj',
          displayName: 'Conjunction',
        },
        {
          value: 'intj',
          displayName: 'Interjection',
        },
        {
          value: 'noun',
          displayName: 'Noun',
        },
        {
          value: 'ptcl',
          displayName: 'Particle',
        },
        {
          value: 'prep',
          displayName: 'Preposition',
        },
        {
          value: 'pron',
          displayName: 'Pronoun',
        },
        {
          value: 'verb',
          displayName: 'Verbal',
        },
      ],
    },
    'lemma': {
      displayName: 'Lexical Form',
      component: LexicalFormField,
      shouldBeEnabled: () => true,
    },
    'normalized': {
      displayName: 'Inflected Form',
      component: InflectedFormField,
      shouldBeEnabled: () => true,
    },
    'case': {
      displayName: 'Case',
      component: getNLFAttributeSelector('case'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
      'values': [
        {
          value: 'accusative',
          displayName: 'Accusative',
        },
        {
          value: 'dative',
          displayName: 'Dative',
        },
        {
          value: 'genitive',
          displayName: 'Genitive',
        },
        {
          value: 'nominative',
          displayName: 'Nominative',
        },
        {
          value: 'vocative',
          displayName: 'Vocative',
        },
      ]
    },
    'person': {
      displayName: 'Person',
      component: getNLFAttributeSelector('person'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'first',
          displayName: '1st person',
        },
        {
          value: 'second',
          displayName: '2nd person',
        },
        {
          value: 'third',
          displayName: '3rd person',
        },
      ]
    },
    'number': {
      displayName: 'Number',
      component: getNLFAttributeSelector('number'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'singular',
          displayName: 'Singular',
        },
        {
          value: 'plural',
          displayName: 'Plural',
        },
      ]
    },
    'gender': {
      displayName: 'Gender',
      component: getNLFAttributeSelector('gender'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'masculine',
          displayName: 'Masculine',
        },
        {
          value: 'feminine',
          displayName: 'Feminine',
        },
        {
          value: 'neuter',
          displayName: 'Neuter',
        },
      ]
    },
    'tense': {
      displayName: 'Tense',
      component: getNLFAttributeSelector('tense'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'aorist',
          displayName: 'Aorist',
        },
        {
          value: 'imperfect',
          displayName: 'Imperfect',
        },
        {
          value: 'future',
          displayName: 'Future',
        },
        {
          value: 'perfect',
          displayName: 'Perfect',
        },
        {
          value: 'pluperfect',
          displayName: 'Pluperfect',
        },
        {
          value: 'present',
          displayName: 'Present',
        },
      ]
    },
    'voice': {
      displayName: 'Voice',
      component: getNLFAttributeSelector('voice'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'active',
          displayName: 'Active',
        },
        {
          value: 'passive',
          displayName: 'Passive',
        },
        {
          value: 'middle',
          displayName: 'Middle',
        },
        {
          value: 'middlepassive',
          displayName: 'Middle/Passive',
        },
      ]
    },
    'mood': {
      displayName: 'Mood',
      component: getNLFAttributeSelector('mood'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: [
        {
          value: 'indicative',
          displayName: 'Indicative',
        },
        {
          value: 'imperative',
          displayName: 'Imperative',
        },
        {
          value: 'infinitive',
          displayName: 'Infinitive',
        },
        {
          value: 'optative',
          displayName: 'Optative',
        },
        {
          value: 'participle',
          displayName: 'Participle',
        },
        {
          value: 'subjunctive',
          displayName: 'Subjunctive',
        },
      ]
    }
  }
};