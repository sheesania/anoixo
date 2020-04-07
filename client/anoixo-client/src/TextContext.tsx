import React, { useContext, ReactNode } from 'react';

enum TextName {
  NLF
}
const TextContext = React.createContext<TextName | undefined>(undefined);

type TextContextProviderProps = {
  children: ReactNode;
  text: TextName;
};
const TextContextProvider: React.FC<TextContextProviderProps> = (props: TextContextProviderProps) => {
  return (
    <TextContext.Provider value={props.text}>
      {props.children}
    </TextContext.Provider>
  )
};

const useTextSetting = () => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextSetting must be used within a TextContextProvider');
  }
  return context;
};

export {TextName, TextContextProvider, useTextSetting}