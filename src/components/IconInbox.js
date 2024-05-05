import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../common/constants';

const IconInbox = () => {
  return (
    <Svg viewBox="0 0 490.667 490.667" width={24} height={24}>
      <Path
        d="M295.531 227.136c-4.16-4.16-10.923-4.16-15.083 0L256 251.584V21.333c0-5.888-4.779-10.667-10.667-10.667s-10.667 4.779-10.667 10.667v256c0 4.309 2.603 8.213 6.592 9.856a10.662 10.662 0 0011.606-2.304l42.667-42.667c4.16-4.159 4.16-10.922 0-15.082z"
        fill={COLORS.eshi_color}
      />
      <Path
        d="M252.864 269.803l-42.667-42.667c-4.16-4.16-10.923-4.16-15.083 0s-4.16 10.923 0 15.083l42.667 42.667c2.091 2.069 4.821 3.115 7.552 3.115s5.461-1.045 7.531-3.115c4.16-4.161 4.16-10.923 0-15.083z"
        fill={COLORS.eshi_color}
      />
      <Path
        d="M478.123 244.629l-76.907-115.371C387.328 108.437 364.096 96 339.093 96H288c-5.888 0-10.667 4.779-10.667 10.667s4.779 10.667 10.667 10.667h51.093a53.251 53.251 0 0144.373 23.744l76.907 115.371a53.135 53.135 0 018.96 29.589v140.629c0 17.643-14.357 32-32 32h-384c-17.643 0-32-14.357-32-32V287.616c0-11.413 3.563-22.315 10.624-31.979l68.992-104.704c13.867-21.056 37.184-33.6 62.357-33.6h39.36c5.888 0 10.667-4.779 10.667-10.667S208.555 96 202.667 96h-39.36c-32.384 0-62.357 16.149-80.171 43.2L14.443 243.477C4.992 256.384 0 271.637 0 287.616v139.051C0 456.064 23.936 480 53.333 480h384c29.397 0 53.333-23.936 53.333-53.333v-140.63a74.347 74.347 0 00-12.543-41.408z"
        fill={COLORS.eshi_color}
      />
      <Path
        d="M469.333 266.667H416c-29.397 0-53.333 23.936-53.333 53.333 0 17.643-14.357 32-32 32H160c-17.643 0-32-14.357-32-32 0-29.397-23.936-53.333-53.333-53.333H21.333c-5.888 0-10.667 4.779-10.667 10.667S15.445 288 21.333 288h53.333c17.643 0 32 14.357 32 32 0 29.397 23.936 53.333 53.333 53.333h170.667C360.064 373.333 384 349.397 384 320c0-17.643 14.357-32 32-32h53.333c5.888 0 10.667-4.779 10.667-10.667s-4.779-10.666-10.667-10.666z"
        fill={COLORS.eshi_color}
      />
    </Svg>
  );
};
export default IconInbox;
