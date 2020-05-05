import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { useTextSetting } from '../texts/TextSettings';
import { ServerSettings } from '../AppSettings';

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
    const attrsToCache = currentText.attributeQueriesToCache;
    const attrFetches = [];

    for (const attr of attrsToCache) {
      const url = `${ServerSettings.apiUrl}/text/${currentText.serverTextId}/attribute/${attr}`;
      attrFetches.push(
        fetch(url)
          .then(response => {
            if (!response.ok) {
              return;
            }
            return response.json();
          })
          .then(json => {
            newCache[attr] = json;
            return Promise.resolve();
          })
          .catch((err) => {  //if we can't get the attributes, they just won't be available for autocomplete
            console.log(`Error fetching values for attribute '${attr}': ${err}`);
          })
      );
    }

    Promise.all(attrFetches).then(() => {
      setCache(newCache);
    });
  }, [currentText]);

  return (
    <AttributeQueryCacheContext.Provider value={cache}>
      {props.children}
    </AttributeQueryCacheContext.Provider>
  );
};

const useAttributeQueryCache = (attribute: string) => {
  const cache = useContext(AttributeQueryCacheContext);
  return cache[attribute] || [];
};

export { useAttributeQueryCache, AttributeQueryCacheProvider };