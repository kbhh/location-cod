const OpenLocationCode = require('open-location-code').OpenLocationCode;
import { ToastAndroid } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { BASE_URL } from './constants';
import { YENE_CODE_LOOKUP } from './constants';
import storage from '@react-native-firebase/storage';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}


export async function getDetailFromLatLong(location) {
  const olc = new OpenLocationCode();
  if (location.address) {
    const regex = /%20/gi;
    location.address = location.address.replace(regex, ' ');
  }
  const code = olc.encode(location.latitude, location.longitude);
  if (location.locationId) {
    try {
      console.log('Awaited Result....', location);
      const cldLocation = await get(`locations/${location.locationId}`);
      if (cldLocation && cldLocation.image) {
        const image_uri = cldLocation.image + '?alt=media';
        location.image_uri = image_uri;
      }
      if (cldLocation && cldLocation.voice) {
        const voice_uri = cldLocation.voice + '?alt=media';
        location.voice_uri = voice_uri;
      }
    } catch (error) {
      console.log("error/...", error);
      return {
        ...location,
        code,
      };
    }
  }

  return {
    ...location,
    code,
  };
}

export function showToast(msj) {
  ToastAndroid.show(msj, ToastAndroid.SHORT);
}

export function isNewDate(modifiedDate) {
  const now = new Date();
  const oneDay = 86400000;
  if (now - new Date(modifiedDate) < oneDay) {
    return true;
  }
  return false;
}

export function compressOpenCageData(formattedAddress) {
  formattedAddress = `${formattedAddress?.components?.neighbourhood
    ? formattedAddress?.components?.neighbourhood
    : ''
    }##${formattedAddress?.components?.suburb
      ? formattedAddress?.components?.suburb
      : ''
    }##${formattedAddress?.components?.county
      ? formattedAddress?.components?.county
      : ''
    }##${formattedAddress?.components?.state
      ? formattedAddress?.components?.state
      : ''
    }##${formattedAddress?.formatted ? formattedAddress?.formatted : ''}`;
  console.log('ADDRESS IS', formattedAddress.split('/').join(''));
  return formattedAddress.split('/').join('');
}

export function post(path, payload, create = true) {
  return fetch(BASE_URL + path, {
    method: create ? 'POST' : 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json;charset=UTF-8',
      'X-Application-Key': 'Eshi_Locator',
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then((err) => {
        let error = err[Object.keys(err)[0]];
        error = typeof error === 'string' ? error : error[0];
        showToast(error);
        throw new Error(error);
      });
    }
  });
}

export function get(path, timeout = 10000) {
  return Promise.race([
    fetch(BASE_URL + path, {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        'X-Application-Key': 'Eshi_Locator',
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((err) => {
          let error = err[Object.keys(err)[0]];
          error = typeof error === 'string' ? error : error[0];
          showToast(error);
          throw new Error(error);
        });
      }
    }),

    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout),
    ),
  ]);
  // return fetch(BASE_URL + path, {
  //   headers: {
  //     'Content-type': 'application/json;charset=UTF-8',
  //     'X-Application-Key': 'Eshi_Locator',
  //   },
  // }).then((res) => {
  //   if (res.ok) {
  //     return res.json();
  //   } else {
  //     return res.json().then((err) => {
  //       let error = err[Object.keys(err)[0]];
  //       error = typeof error === 'string' ? error : error[0];
  //       showToast(error);
  //       throw new Error(error);
  //     });
  //   }
  // });
}

export async function upload(location, file, filetype) {
  try {
    console.log('locations...', location);
    const fileName = file.replace(/^.*[\\\/]/, '');
    const reference = storage().ref(fileName);
    return reference.putFile(file);
  } catch (err) {
    throw err;
  }

  // return RNFetchBlob.fetch(
  //   'POST',
  //   `${BASE_URL}locations/${location.account_id}/${location.id}/${filetype}/${fileName}`,
  //   {
  //     'Content-Type': 'multipart/form-data',
  //     'X-Application-Key': 'Eshi_Locator',
  //   },
  //   [
  //     {
  //       name: filetype,
  //       filename: fileName,
  //       data: RNFetchBlob.wrap(file),
  //     },
  //   ],
  // )
  //   .then((response) => response.json())
  //   .then((apiResponse) => {
  //     if (apiResponse.error) {
  //       console.log(JSON.stringify(apiResponse.error, null, 1));
  //       throw new Error('Wrong Upload operation!');
  //     }
  //     return apiResponse;
  //   });
}

export function getLatlongFromPlusCode(plusCode) {
  if (!plusCode) {
    throw new Error('Invalid plusCode value');
  }
  const olc = new OpenLocationCode();
  return olc.decode(plusCode);
}

export function translatePlusCodeToYeneCode(pluscode) {
  if (!pluscode) {
    return '';
  }
  const splitedCode = pluscode.split('');
  let yenecode = '';
  splitedCode?.forEach((code) => (yenecode += YENE_CODE_LOOKUP[code] || code));
  return yenecode;
}

export function translateYeneCodeToPlusCode(yenecode) {
  if (!yenecode) {
    return '';
  }
  const splitedYeneCode = yenecode.split('');
  let pluscode = '';

  splitedYeneCode?.forEach(
    (code) => (pluscode += getKeyByValue(YENE_CODE_LOOKUP, code) || code),
  );
  return pluscode;
}

export function copyToClipboard(text) {
  Clipboard.setString(translatePlusCodeToYeneCode(text));
  showToast('Location copied to clipbaord.');
}
