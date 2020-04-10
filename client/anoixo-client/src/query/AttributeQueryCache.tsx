import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { useTextSetting, TextSettings } from '../TextSettings';

type AttributeQueryCache = {
  [attr: string]: string[];
};

const AttributeQueryCacheContext = React.createContext<AttributeQueryCache>({});

type Props = {
  children: ReactNode;
};
const AttributeQueryCacheProvider: React.FC<Props> = (props: Props) => {
  const [cache, setCache] = useState<AttributeQueryCache>({});
  const currentText = useTextSetting();

  useEffect(() => {
    const newCache: AttributeQueryCache = {}
    const attrsToCache = TextSettings[currentText].attributeQueriesToCache;
    for (const attr of attrsToCache) {
      newCache[attr] = ['test1', 'test2']
    }
    setCache(newCache);
  }, [currentText]);

  return (
    <AttributeQueryCacheContext.Provider value={cache}>
      {props.children}
    </AttributeQueryCacheContext.Provider>
  );
};

const useAttributeQueryCache = () => {
  return useContext(AttributeQueryCacheContext);
};

export { useAttributeQueryCache, AttributeQueryCacheProvider };