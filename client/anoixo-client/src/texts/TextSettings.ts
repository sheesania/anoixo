import { useContext } from 'react';
import { AttributeComponent } from '../query/Attributes/AttributeComponent';
import { AttributesQuery } from '../query/QueryTypes';
import { NLFTextSetting } from './NLF/NLFTextSetting';
import { TextContext } from './TextContext';

/**
 * These types are for defining settings for a text provider (e.g. Greek NT, Hebrew OT, Septuagint, ...). The idea is to
 * make it easy to dynamically swap out a text provider. Each text provider has a unique set of attributes you can query
 * and customized components for editing those attributes (for instance, the Greek NT text provider has a "lexical form"
 * attribute with an editor component that includes Koine Greek autocomplete). A TextSetting lets you specify a set of
 * attributes and components for them (plus other text-specific settings), so you can get that customization while also
 * being able to swap out providers easily.
 *
 * To define a TextSetting for a new text provider, you would first create a string union type with all the attributes
 * available for word queries on that text (e.g. case, number, gender, voice, ...). Then you would make a TextSetting
 * with that union as its generic type. This will allow TypeScript's type checking to ensure that you have settings
 * defined for each of the attributes in the union type, and that you only specify valid attributes for other settings
 * like attribute display order, caching, etc.
 *
 * See NLF/NLFTextSetting.ts for a working example of a TextSetting (and associated attribute union type).
 */

/**
 * Represents a union type defining all available attributes in a text. For instance, "lemma" | "case" | "gender" | ...
 * You don't need to subclass this or anything to create your attribute type - just make a string union type, and it
 * will fit this type definition.
 */
export type AvailableAttributes = string;

/**
 * Settings for one text provider. Create an object typed as TextSetting<YourAttributeUnionType> to create settings for
 * a new text provider.
 */
export type TextSetting<Attribute extends AvailableAttributes> = {
  /**
   * The ID of the text on the server, used for API URLS. So if you want to query http://your-server/api/text/ot,
   * the ID would be 'ot'
   */
  serverTextId: string;
  /**
   * An 'attribute query' to the server gets you all possible values of a certain attribute. It's useful for things like
   * autocomplete. src/query/AttributeQueryCache.tsx will do attribute queri(es) for you when the page first loads and
   * then cache them so you can use them in UI components, etc. This property tells AttributeQueryCache what attributes
   * to do queries for given the current text provider (so the values are then available to that text provider's UI
   * components).
   */
  attributeQueriesToCache: Attribute[];
  /** The order that attribute editors should be displayed in inside the word query box */
  attributeDisplayOrder: Attribute[];
  /** Settings for each attribute */
  attributes: {
    /** You are required to have settings for every attribute! */
    [attr in Attribute]: {
      /**
       * What should the display name for this attribute be in the UI? This is used in attribute editor components,
       * for verbalizing a query the user made, etc.
       */
      displayName: string;
      /** The component for editing this attribute's value for a query */
      component: AttributeComponent;
      /**
       * A matching function for whether this attribute is relevant based on the value of other attributes. For example,
       * a 'tense' attribute component might only be enabled if 'verb' is selected for part of speech.
       * This is currently only used to disable irrelevant attribute editors.
       */
      shouldBeEnabled: (allAttributes: AttributesQuery | undefined) => boolean;
      /**
       * Possible values for this attribute and their display names. This is basically a centralized place for UI
       * components to find out what values are available for a given attribute and how to display those values.
       *
       * Note that this is an alternative to using attribute queries - if you specify values here, you're hardcoding
       * them client-side instead of dynamically requesting them from the server. I've been using hardcoded values when
       * there are only a few (e.g. for case, gender, number) and attribute queries when there are many (e.g. for root
       * forms).
       */
      values?: {
        [value: string]: {
          displayName: string;
        }
      }
    };
  };
}

/**
 * All available texts. If you want to add a new text provider, add it to this enum!
 */
export enum TextName {
  NLF
};

/**
 * Text settings for each available text. If you want to add a new text provider, add its TextSettings to this object!
 */
export const TextSettings: Record<TextName, TextSetting<AvailableAttributes>> = {
  [TextName.NLF]: NLFTextSetting
};

/** Hook for grabbing the currently selected TextSetting */
export const useTextSetting = () => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextSetting must be used within a TextContextProvider');
  }
  return TextSettings[context];
};