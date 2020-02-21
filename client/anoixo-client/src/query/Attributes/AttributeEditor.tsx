import React, { memo, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import './AttributeEditor.css';

type AttrLabelProps = {
  text: string;
  extraProps?: { [key: string]: string };
};

const AttrLabel: React.FC<AttrLabelProps> = memo((props: AttrLabelProps) => {
  return (
    <Typography variant="subtitle1" component="label" {...props.extraProps}>
      {props.text}
    </Typography>
  );
});

type AttrEditorProps = {
  /** The text of the label for this attribute. */
  labelText: string;
  /** Extra props to pass to the label (e.g. an ID or htmlFor to associate it with a control) */
  labelProps?: { [key: string]: string };
  /** The control(s) for editing the attribute - e.g. a select box, text field, etc. */
  children: ReactNode;
};

/**
 * This component handles a lot of the styling and labeling for a attribute editing component. Wrap an input control in
 * it to make an attribute editing component ready to be dropped into a WordBuilder card. 
 * Example:
 * <AttributeEditor labelText={label} labelProps={{id: labelId}}>
      <Select labelId={labelId} {...other props}>
        ...menu items
      </Select>
    </AttributeEditor>
 */
const AttributeEditor: React.FC<AttrEditorProps> = memo(
  (props: AttrEditorProps) => {
    return (
      <div className="attribute-editor">
        <AttrLabel text={props.labelText} extraProps={props.labelProps} />
        {props.children}
      </div>
    );
  }
);

export default AttributeEditor;
