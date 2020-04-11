import React, { ReactNode } from 'react';
import { TextName } from './TextSettings';

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


export { TextContext, TextContextProvider };