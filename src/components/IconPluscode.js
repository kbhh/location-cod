import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const SvgComponent = ({ color }) => {
  return (
    <Svg
      data-name="Group 9665"
      width={18.166}
      height={18.166}
      viewBox="0 0 18.166 18.166">
      <Circle
        data-name="Ellipse 494"
        cx={1.817}
        cy={1.817}
        r={1.817}
        transform="translate(0 7.266)"
        fill={color}
      />
      <Circle
        data-name="Ellipse 495"
        cx={1.817}
        cy={1.817}
        r={1.817}
        transform="translate(14.533 7.266)"
        fill={color}
      />
      <Circle
        data-name="Ellipse 496"
        cx={1.817}
        cy={1.817}
        r={1.817}
        transform="translate(7.266)"
        fill={color}
      />
      <Circle
        data-name="Ellipse 497"
        cx={1.817}
        cy={1.817}
        r={1.817}
        transform="translate(7.266 14.533)"
        fill={color}
      />
      <Path
        data-name="Rectangle 850"
        fill={color}
        d="M7.224 7.224h3.718v3.718H7.224z"
      />
    </Svg>
  );
};

export default SvgComponent;
