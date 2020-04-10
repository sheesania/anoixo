import AttributeToComponentMap from './query/Attributes/AttributeToComponentMap';
import NLFAttributeToComponentMap from './query/Attributes/NLF/NLFAttributeComponentMap';
import { TextName } from './TextContext';

type TextSetting = {
  serverTextId: string;
  attributeToComponentMap: AttributeToComponentMap;
};

const TextSettings: Record<TextName, TextSetting> = {
  [TextName.NLF]: {
    serverTextId: 'nlf',
    attributeToComponentMap: NLFAttributeToComponentMap,
  }
};

export default TextSettings;