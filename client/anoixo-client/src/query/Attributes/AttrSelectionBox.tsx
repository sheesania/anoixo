import React, { memo, useCallback } from 'react';
import { useUID } from 'react-uid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import AttributeEditor from './AttributeEditor';

type Props = {
  /** Label text for the select box */
  label: string;
  /** Current value of the select box */
  currentValue: string;
  /** Items to put into the select box. An 'Any' item is added for you */
  items: {
    label: string;
    value: string;
  }[];
  /** Callback for when an item is selected */
  handleChange: (newValue: string) => void;
};

/**
 * An attribute editor that uses a select box for picking the value. Just pass it some props and it is ready to go
 * into a WordBuilder card.
 * Example:
 * <AttrSelectionBox label='Part of Speech' currentValue={currentValue}
 *    items={[{label: 'Noun', value: 'noun'}, {label: 'Verbal', value: 'verbal'}]}
 *    handleChange={handleChange}/>
 */
const AttrSelectionBox: React.FC<Props> = memo((props: Props) => {
  const uid = 'attr-select-' + useUID();
  const { handleChange } = props;
  const onChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      handleChange(event.target.value as string);
    },
    [handleChange]
  );

  return (
    <AttributeEditor labelText={props.label} labelProps={{ id: uid }}>
      <Select
        className="attribute-input"
        value={props.currentValue}
        onChange={onChange}
        labelId={uid}
        displayEmpty
      >
        <MenuItem value="">
          <span className="attribute-any-item">Any</span>
        </MenuItem>
        {props.items.map((item, index) => (
          <MenuItem value={item.value} key={index}>
            <span
              className={
                item.value === props.currentValue
                  ? 'attribute-selected-item'
                  : ''
              }
            >
              {item.label}
            </span>
          </MenuItem>
        ))}
      </Select>
    </AttributeEditor>
  );
});

export default AttrSelectionBox;
