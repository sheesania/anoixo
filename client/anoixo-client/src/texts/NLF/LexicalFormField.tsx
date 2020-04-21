import React, { memo, ChangeEvent, useCallback } from 'react';
import transliteratedMatchSorter from './utils/GreekMatchSorter';
import { useAttributeQueryCache } from '../../query/AttributeQueryCache';
import { useUID } from 'react-uid';
import { AttributeComponent, AttributeComponentProps } from '../../query/Attributes/AttributeComponent';
import AttributeEditor from '../../query/Attributes/AttributeEditor';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FilterOptionsState } from '@material-ui/lab';
import './LexicalFormField.css';

const LexicalFormField: AttributeComponent = memo((props: AttributeComponentProps) => {
    const uid = 'attr-field-' + useUID();
    const { updateAttr, id } = props;
    const onChange = useCallback(
      (event: ChangeEvent<{}>, value: string | null) => {
        const newValue = value || '';
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const allLexicalForms = useAttributeQueryCache('lemma');

    const filterLexicalForms = (lexicalForms: string[], state: FilterOptionsState<string>) => {
      return transliteratedMatchSorter(lexicalForms, state.inputValue, 8);
    }

    const label = 'Lexical Form';

    return (
      <AttributeEditor labelText={label} labelProps={{ htmlFor: uid }} enabled={props.enabled}>
        <Autocomplete
          className='attribute-input'
          id={uid}
          renderInput={
            (params) => <TextField {...params} className='lexical-form-selector' placeholder='Any'/>
          }
          options={allLexicalForms}
          filterOptions={filterLexicalForms}
          onChange={onChange}
        />
      </AttributeEditor>
    );
  }
);

export default LexicalFormField;
