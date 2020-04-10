import React, { memo, ChangeEvent, useCallback } from 'react';
import { useAttributeQueryCache } from '../../AttributeQueryCache';
import { useUID } from 'react-uid';
import AttributeComponentProps from '../AttributeComponentProps';
import AttributeEditor from '../AttributeEditor';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FilterOptionsState } from '@material-ui/lab';
import './LexicalFormField.css';

const LexicalFormField: React.FC<AttributeComponentProps> = memo(
  (props: AttributeComponentProps) => {
    const uid = 'attr-field-' + useUID();
    const { updateAttr, id } = props;
    const onChange = useCallback(
      (event: ChangeEvent<{}>, value: string | null) => {
        const newValue = value || '';
        updateAttr(id, newValue);
      },
      [updateAttr, id]
    );

    const lexicalForms = useAttributeQueryCache('lemma');

    const defaultFilterOptions = createFilterOptions<string>();
    const filterOptions = (options: string[], state: FilterOptionsState<string>) => {
      return defaultFilterOptions(options, state).slice(0, 8);
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
          options={lexicalForms}
          filterOptions={filterOptions}
          onChange={onChange}
        />
      </AttributeEditor>
    );
  }
);

export default LexicalFormField;
