import AttributeToComponentMap from '../../../query/Attributes/AttributeToComponentMap';
import { AttributesQuery } from '../../../query/QueryTypes';
import PartOfSpeechSelector from './PartOfSpeechSelector';
import LexicalFormField from './LexicalFormField';
import InflectedFormField from './InflectedFormField';
import CaseSelector from './CaseSelector';
import PersonSelector from './PersonSelector';
import NumberSelector from './NumberSelector';
import GenderSelector from './GenderSelector';
import TenseSelector from './TenseSelector';
import VoiceSelector from './VoiceSelector';
import MoodSelector from './MoodSelector';

const NLFAttributeComponentMap: AttributeToComponentMap = [
  {
    attrId: 'class',
    component: PartOfSpeechSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'lemma',
    component: LexicalFormField,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'normalized',
    component: InflectedFormField,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'case',
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
  {
    attrId: 'person',
    component: PersonSelector,
    shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
      return !allAttributes || !allAttributes['class'] ||
        allAttributes['class'] === 'verb';
    },
  },
  {
    attrId: 'number',
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
  {
    attrId: 'gender',
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
  {
    attrId: 'tense',
    component: TenseSelector,
    shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
      return !allAttributes || !allAttributes['class'] ||
        allAttributes['class'] === 'verb';
    },
  },
  {
    attrId: 'voice',
    component: VoiceSelector,
    shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
      return !allAttributes || !allAttributes['class'] ||
        allAttributes['class'] === 'verb';
    },
  },
  {
    attrId: 'mood',
    component: MoodSelector,
    shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => {
      return !allAttributes || !allAttributes['class'] ||
        allAttributes['class'] === 'verb';
    },
  },
];

export default NLFAttributeComponentMap;
