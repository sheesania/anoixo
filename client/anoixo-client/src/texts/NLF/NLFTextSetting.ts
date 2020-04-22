import { AttributesQuery } from '../../query/QueryTypes';
import { TextSetting } from '../TextSettings';
import getNLFAttributeSelector from './getNLFAttributeSelector';
import LexicalFormField from './LexicalFormField';
import InflectedFormField from './InflectedFormField';

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
      values: new Map([
        [
          'adj', { displayName: 'Adjective' },
        ],
        [
          'adv', { displayName: 'Adverb' },
        ],
        [
          'det', { displayName: 'Article/Determiner' },
        ],
        [
          'conj', { displayName: 'Conjunction' },
        ],
        [
          'intj', { displayName: 'Interjection' },
        ],
        [
          'noun', { displayName: 'Noun' },
        ],
        [
          'ptcl', { displayName: 'Particle' },
        ],
        [
          'prep', { displayName: 'Preposition' },
        ],
        [
          'pron', { displayName: 'Pronoun' },
        ],
        [
          'verb', { displayName: 'Verbal' },
        ],
      ]),
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
      values: new Map([
        [
          'accusative', { displayName: 'Accusative' },
        ],
        [
          'dative', { displayName: 'Dative' },
        ],
        [
          'genitive', { displayName: 'Genitive' },
        ],
        [
          'nominative', { displayName: 'Nominative' },
        ],
        [
          'vocative', { displayName: 'Vocative' },
        ],
      ]),
    },
    'person': {
      displayName: 'Person',
      component: getNLFAttributeSelector('person'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: new Map([
        [
          'first', { displayName: '1st person' },
        ],
        [
          'second', { displayName: '2nd person' },
        ],
        [
          'third', { displayName: '3rd person' },
        ],
      ]),
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
      values: new Map([
        [
          'singular', { displayName: 'Singular' },
        ],
        [
          'plural', { displayName: 'Plural' },
        ],
      ]),
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
      values: new Map([
        [
          'masculine', { displayName: 'Masculine' },
        ],
        [
          'feminine', { displayName: 'Feminine' },
        ],
        [
          'neuter', { displayName: 'Neuter' },
        ],
      ]),
    },
    'tense': {
      displayName: 'Tense',
      component: getNLFAttributeSelector('tense'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: new Map([
        [
          'aorist', { displayName: 'Aorist' },
        ],
        [
          'imperfect', { displayName: 'Imperfect' },
        ],
        [
          'future', { displayName: 'Future' },
        ],
        [
          'perfect', { displayName: 'Perfect' },
        ],
        [
          'pluperfect', { displayName: 'Pluperfect' },
        ],
        [
          'present', { displayName: 'Present' },
        ],
      ]),
    },
    'voice': {
      displayName: 'Voice',
      component: getNLFAttributeSelector('voice'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: new Map([
        [
          'active', { displayName: 'Active' },
        ],
        [
          'passive', { displayName: 'Passive' },
        ],
        [
          'middle', { displayName: 'Middle' },
        ],
        [
          'middlepassive', { displayName: 'Middle/Passive' },
        ],
      ]),
    },
    'mood': {
      displayName: 'Mood',
      component: getNLFAttributeSelector('mood'),
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
      values: new Map([
        [
          'indicative', { displayName: 'Indicative' },
        ],
        [
          'infinitive', { displayName: 'Infinitive' },
        ],
        [
          'imperative', { displayName: 'Imperative' },
        ],
        [
          'optative', { displayName: 'Optative' },
        ],
        [
          'participle', { displayName: 'Participle' },
        ],
        [
          'subjunctive', { displayName: 'Subjunctive' },
        ],
      ]),
    }
  }
};