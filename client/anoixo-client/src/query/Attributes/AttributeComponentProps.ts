type AttributeComponentProps = {
    /** The key for the attribute in the word query's `attributes` dictionary */
    id: string;
    /** The current value for the attribute in the word query's `attributes` dictionary, if there is one */
    value?: string;
    /** A callback for updating the attribute's value in state */
    updateAttr: (updateAttrId: string, updateValue: string) => void;
}

export default AttributeComponentProps;