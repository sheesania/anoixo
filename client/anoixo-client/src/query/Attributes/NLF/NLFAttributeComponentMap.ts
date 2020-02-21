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
  },
  {
    attrId: 'lemma',
    component: LexicalFormField,
  },
  {
    attrId: 'normalized',
    component: InflectedFormField,
  },
  {
    attrId: 'case',
    component: CaseSelector,
  },
  {
    attrId: 'person',
    component: PersonSelector,
  },
  {
    attrId: 'number',
    component: NumberSelector,
  },
  {
    attrId: 'gender',
    component: GenderSelector,
  },
  {
    attrId: 'tense',
    component: TenseSelector,
  },
  {
    attrId: 'voice',
    component: VoiceSelector,
  },
  {
    attrId: 'mood',
    component: MoodSelector,
  },
];

export default NLFAttributeComponentMap;
