import {Dimensions} from 'react-native';

export const COLORS = {
  black: 'black',
  white: 'white',
  grey: '#d3d3d3',
  light_grey: '#efefef',
  eshi_light: '#ca7b32',
  eshi_color: '#50a118',
  info_color: '#8A9EAD',
  info_color_light: 'rgba(138,158,173,0.20)',
  plus_code_color: '#5C84F0',
};

export const DIMENS = {
  full_height: Dimensions.get('window').height,
  full_width: Dimensions.get('window').width,
};

export const LATITUDE_DELTA = 0.00522;
export const LONGITUDE_DELTA =
  (LATITUDE_DELTA * DIMENS.full_width) / DIMENS.full_height;

export const INFO =
  'Plus Codes work just like street addresses. They can help you get and use a simple digital address. You can use Plus Codes to identify a specific location to receive deliveries, access emergency and social services, or direct people to a place. Since the codes are simple, you can easily share them with others.\n\n Plus Code is internationally recognized addressing system You can search the address on google, and it will find your location on the map.\n\nWhen you’re in the town or city where you want to search, you can enter a 6 - or seven- digit Plus Code. For example, if you’re in Addis Ababa, you can directly search for 2QP2+8X (Menelik II statue)';

export const BASE_URL =
  'https://us-central1-locator-4bda2.cloudfunctions.net/app/api/v1/';

export const GRAPHHOPPER_API = 'https://graphhopper.com/api/1';
export const GRAPHHOPPER_KEY = 'a9397c5b-000e-4ff9-b4f3-9bd4935f1653';
// plus code to yene code lookup
export const YENE_CODE_LOOKUP = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  // A: 'አ',
  // B: 'በ',
  C: 'ለ',
  // D: 'ደ',
  // E: 'ዠ',
  F: 'መ',
  G: 'ረ',
  H: 'ሸ',
  // I: 'ጨ',
  J: 'ቀ',
  // K: 'ከ',
  // L: 'ለ',
  M: 'በ',
  // N: 'ነ',
  // O: 'ጸ',
  P: 'ተ',
  Q: 'ቸ',
  R: 'አ',
  // S: 'ሠ',
  // T: 'ተ',
  // U: 'ኘ',
  V: 'ከ',
  W: 'ወ',
  X: 'ዘ',
  // Y: 'የ',
  // Z: 'ዘ',
  '+': '፡'
};
