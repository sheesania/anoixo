import React, { memo, useCallback } from 'react';
import { AttributeComponent, AttributeComponentProps } from '../../query/Attributes/AttributeComponent';
import { NLFAttribute, NLFTextSetting } from './NLFTextSetting';
import AttrSelectionBox from '../../query/Attributes/AttrSelectionBox';

const getNLFAttributeSelector = (attribute: NLFAttribute): AttributeComponent => {
  const NLFAttributeSelectorComponent: React.FC<AttributeComponentProps> = memo((props: AttributeComponentProps) => {
    const { enabled, updateAttr, value } = props;
    const handleChange = useCallback(
      (newValue: string) => {
        updateAttr(attribute, newValue);
      },
      [updateAttr]
    );

    const attrSettings = NLFTextSetting.attributes[attribute];
    const label = attrSettings.displayName;
    const items = [];
    if (attrSettings.values) {
      for (let [value, valueProperties] of attrSettings.values) {
        items.push({
          value: value,
          label: valueProperties.displayName,
        });
      }
    }

    return (
      <AttrSelectionBox
        label={label}
        currentValue={value || ''}
        items={items}
        enabled={enabled}
        handleChange={handleChange}
      />
    );
  });
  return NLFAttributeSelectorComponent;
};

export default getNLFAttributeSelector;
