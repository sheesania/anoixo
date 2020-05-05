import React, { memo } from 'react';

type Props = {
  type: 'active' | 'inactive';
  id: string;
};

const Arrow: React.FC<Props> = memo((props: Props) => {
  const color = props.type === 'active' ? 'black' : 'lightgray';
  const lineLength = props.type === 'active' ? 140 : 90;

  return (
    <svg id={props.id} width={`${lineLength + 8}px`} height="40px">
      <defs>
        <marker
          id={`arrowhead${props.id}`}
          markerWidth={28}
          markerHeight={40}
          refX={20}
          refY={20}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polyline
            points="8,8 20,20 8,32"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <line
        x1={8}
        y1={20}
        x2={lineLength}
        y2={20}
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        markerEnd={`url(#arrowhead${props.id})`}
      />
    </svg>
  );
});

export default Arrow;
