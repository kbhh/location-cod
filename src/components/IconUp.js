import React from 'react';
import Svg, { Rect, Path, G } from 'react-native-svg';
const IconUp = ({ rotate }) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      <G
        data-name="Rectangle 10"
        transform="rotate(90 20 20)"
        fill="none"
        stroke="#50a118">
        <Rect width={40} height={40} rx={20} stroke="none" />
        <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} />
      </G>
      <Path
        transform={rotate && { rotation: 180, originX: 20, originY: 20 }}
        d="M12.104 23.348L20.452 15l8.348 8.348-2.068 2.069-6.28-6.28-6.28 6.28z"
        fill="#50a118"
      />
    </Svg>
  );
};
export default IconUp;
