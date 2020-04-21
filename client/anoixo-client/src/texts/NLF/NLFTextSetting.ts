import { AttributesQuery } from '../../query/QueryTypes';
import { TextSetting } from '../TextSettings';
import PartOfSpeechSelector from './Attributes/PartOfSpeechSelector';
import LexicalFormField from './Attributes/LexicalFormField';
import InflectedFormField from './Attributes/InflectedFormField';
import CaseSelector from './Attributes/CaseSelector';
import PersonSelector from './Attributes/PersonSelector';
import NumberSelector from './Attributes/NumberSelector';
import GenderSelector from './Attributes/GenderSelector';
import TenseSelector from './Attributes/TenseSelector';
import VoiceSelector from './Attributes/VoiceSelector';
import MoodSelector from './Attributes/MoodSelector';

export type NLFAttribute =
  'class' | 'lemma' | 'normalized' | 'case' | 'person' | 'number' | 'gender' | 'tense' | 'voice' | 'mood';
export const NLFTextSetting: TextSetting<NLFAttribute> = {
  serverTextId: 'nlf',
  attributeQueriesToCache: ['lemma', 'normalized'],
  attributeDisplayOrder:
    ['class', 'lemma', 'normalized', 'case', 'person', 'number', 'gender', 'tense', 'voice', 'mood'],
  attributes: {
    class: {
      displayName: 'Part of Speech',
      component: PartOfSpeechSelector,
      shouldBeEnabled: () => true,
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
      component: CaseSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
    },
    person: {
      displayName: 'Person',
      component: PersonSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
    },
    number: {
      displayName: 'Number',
      component: NumberSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
    },
    gender: {
      displayName: 'Gender',
      component: GenderSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'adj' ||
          allAttributes['class'] === 'det' ||
          allAttributes['class'] === 'noun' ||
          allAttributes['class'] === 'pron' ||
          allAttributes['class'] === 'verb';
      },
    },
    tense: {
      displayName: 'Tense',
      component: TenseSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
    },
    voice: {
      displayName: 'Voice',
      component: VoiceSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
    },
    mood: {
      displayName: 'Mood',
      component: MoodSelector,
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
        return !allAttributes || !allAttributes['class'] ||
          allAttributes['class'] === 'verb';
      },
    }
  }
}