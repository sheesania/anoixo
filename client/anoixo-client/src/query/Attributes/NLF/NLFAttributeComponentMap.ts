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
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'person',
    component: PersonSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'number',
    component: NumberSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'gender',
    component: GenderSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'tense',
    component: TenseSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'voice',
    component: VoiceSelector,
    shouldBeEnabled: () => true,
  },
  {
    attrId: 'mood',
    component: MoodSelector,
    shouldBeEnabled: () => true,
  },
];

export default NLFAttributeComponentMap;
