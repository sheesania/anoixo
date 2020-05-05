import React, { memo, ChangeEvent, useCallback } from 'react';
import transliteratedMatchSorter from './utils/GreekMatchSorter';
import { useAttributeQueryCache } from '../../query/AttributeQueryCache';
import { useUID } from 'react-uid';
import {
  AttributeComponent,
  AttributeComponentProps,
} from '../../query/Attributes/AttributeComponent';
import AttributeEditor from '../../query/Attributes/AttributeEditor';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FilterOptionsState } from '@material-ui/lab';
import './InflectedFormField.css';

const InflectedFormField: AttributeComponent = memo(
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

    const allInflectedForms = useAttributeQueryCache('normalized');

    const filterInflectedForms = (
      inflectedForms: string[],
      state: FilterOptionsState<string>
    ) => {
      return transliteratedMatchSorter(inflectedForms, state.inputValue, 8);
    };

    const label = 'Inflected Form';

    return (
      <AttributeEditor
        labelText={label}
        labelProps={{ htmlFor: uid }}
        enabled={props.enabled}
      >
        <Autocomplete
          className="attribute-input"
          id={uid}
          renderInput={params => (
            <TextField
              {...params}
              className="inflected-form-selector"
              placeholder="Any"
            />
          )}
          options={allInflectedForms}
          filterOptions={filterInflectedForms}
          onChange={onChange}
        />
      </AttributeEditor>
    );
  }
);

export default InflectedFormField;
