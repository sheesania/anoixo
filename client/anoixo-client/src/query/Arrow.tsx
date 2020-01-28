import React, {memo} from 'react';

type Props = {
    type: 'active' | 'inactive';
};

const Arrow: React.FC<Props> = memo((props: Props) => {
    const color = props.type === 'active' ? 'black' : 'lightgray';

    return (
        <svg width="98px" height="40px">
            <defs>
                <marker id='arrowhead' markerWidth={28} markerHeight={40} refX={20} refY={20} orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <polyline points="8,8 20,20 8,32" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" 
                        stroke-linejoin="round"/>
                </marker>
            </defs>
            <line x1={8} y1={20} x2={90} y2={20} stroke={color} strokeWidth={8} strokeLinecap="round" 
                markerEnd='url(#arrowhead)'/>
        </svg>
    );
})

export default Arrow;
