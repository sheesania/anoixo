import AttributeToComponentMap from '../AttributeToComponentMap';
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
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'lemma',
    component: LexicalFormField,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'normalized',
    component: InflectedFormField,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'case',
    component: CaseSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'person',
    component: PersonSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'number',
    component: NumberSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'gender',
    component: GenderSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'tense',
    component: TenseSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'voice',
    component: VoiceSelector,
    shouldBeDisabled: () => false,
  },
  {
    attrId: 'mood',
    component: MoodSelector,
    shouldBeDisabled: () => false,
  },
];

export default NLFAttributeComponentMap;
