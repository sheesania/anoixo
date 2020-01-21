import React, {memo, ReactNode} from 'react';
import Typography from '@material-ui/core/Typography';
import './AttributeEditor.css';

type AttrLabelProps = {
    text: string;
    extraProps?: {[key: string]: string};
}

const AttrLabel: React.FC<AttrLabelProps> = memo((props: AttrLabelProps) => {
  return (
    <Typography variant='subtitle1' component='label' {...props.extraProps}>{props.text}</Typography>
  );
});


type AttrEditorProps = {
    labelText: string;
    labelProps?: {[key: string]: string};
    children?: ReactNode;
}

const AttributeEditor: React.FC<AttrEditorProps> = memo((props: AttrEditorProps) => {
  return (
    <div className='attribute-editor'>
      <AttrLabel text={props.labelText} extraProps={props.labelProps}/>
      {props.children}
    </div>
  );
});

export default AttributeEditor;
