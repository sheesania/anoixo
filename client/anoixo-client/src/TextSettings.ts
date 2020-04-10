import { useContext } from 'react';
import AttributeToComponentMap from './query/Attributes/AttributeToComponentMap';
import NLFAttributeToComponentMap from './query/Attributes/NLF/NLFAttributeComponentMap';
import { TextContext, TextName } from './TextContext';

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

const useTextSetting = () => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextSetting must be used within a TextContextProvider');
  }
  return context;
};

export { useTextSetting, TextSettings };