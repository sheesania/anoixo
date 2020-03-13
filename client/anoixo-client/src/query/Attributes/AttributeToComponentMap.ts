import React from 'react';
import AttributeComponentProps from './AttributeComponentProps';
import { AttributesQuery } from '../QueryTypes';

/**
 * This is a type for matching the available attributes on word queries for a provider (e.g. Greek NT, Hebrew OT,
 * Septuagint, ...) to components for editing each attribute. For example, attrId 'case' might map to a 'CaseSelector'
 * component. The idea is that then a component for editing word queries can just grab the currently selected provider,
 * get the AttributeToComponentMap for it, and then display the right components for editing the attributes on the word
 * query - all dynamically, in a way that allows providers to easily be swapped out and still each have their own unique
 * set of attributes and components for editing them. See NLFAttributeComponentMap under /NLF for an example of such a
 * map.
 *
 * This data structure needs to maintain the order of the attributes (since the components for editing them will need
 * to be displayed in a specific order). JS objects don't reliably maintain key order, and ES6 Maps are not really
 * supported by TypeScript, so I'm using an array of objects to make sure they stay in order. This could be changed in
 * the future if TypeScript ever supports Maps (or if there's another good option for an ordered dictionary).
 */
type AttributeToComponentMap = Array<{
  /** the key for this attribute in the query */
  attrId: string;
  /** the component for editing the attribute value */
  component: React.FC<AttributeComponentProps>;
  /**
   * A matching function for whether this attribute is irrelevant based on the value of other attributes.
   * For example, a 'tense' attribute component should be disabled if 'noun' is selected for part of speech.
   */
  shouldBeDisabled: (allAttributes: AttributesQuery | undefined) => boolean;
}>;
export default AttributeToComponentMap;
