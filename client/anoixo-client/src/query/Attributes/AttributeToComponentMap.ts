import React from 'react';
import AttributeComponentProps from './AttributeComponentProps'
import { string } from 'prop-types';

// This data structure needs to maintain the order of the attributes (since the components for editing them will need 
// to be displayed in a specific order). JS objects don't reliably maintain key order, and ES6 Maps are not really 
// supported by TypeScript, so I'm using an array of objects to make sure they stay in order. This could be changed in 
// the future if TypeScript ever supports Maps (or if there's another good option for an ordered dictionary).
type AttributeToComponentMap = Array<{
    attrId: string;
    component: React.FC<AttributeComponentProps>;
}>;
export default AttributeToComponentMap;