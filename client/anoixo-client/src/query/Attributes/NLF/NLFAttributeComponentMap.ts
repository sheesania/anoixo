import AttributeToComponentMap from '../AttributeToComponentMap'
import POSSelector from './POSSelector';

const NLFAttributeComponentMap: AttributeToComponentMap = [
    {
        attrId: 'class',
        component: POSSelector
    }
];

export default NLFAttributeComponentMap;