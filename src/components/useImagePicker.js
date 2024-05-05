import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform, PermissionsAndroid,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as ImagePick from "react-native-image-picker"
import { COLORS, DIMENS } from '../common/constants';
import useImageViewer from '../components/useImageViewer';

const ImagePicker = (props) => {
  const [ImageViewer, setViewerVisible] = useImageViewer();

  const { uri, onPhotoSelected } = props;

  const options = {
    title: 'Choose Photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const handleClickImage = () => {
    setViewerVisible(true);
  };

  const onSelectPressed = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      // const iosPermision =
      //   Platform.OS === 'ios' && (await Geolocation.requestAuthorization());
      if (granted === PermissionsAndroid.RESULTS.GRANTED || iosPermision) {
        ImagePick.launchCamera(options, (response) => {
          console.log("...fsdaf", response);
          if (response.didCancel) {
            console.warn('User cancelled image picker');
          } else if (response.error) {
            console.warn('ImagePicker Error: ', response.error);
          } else {
            console.log("onPhotoSelected...", response.uri)
            onPhotoSelected(`${response.uri}`);
          }
        });
      }
    } catch (err) {
      console.log("error", err);
    }


  }, [onPhotoSelected, options]);

  return (
    <View {...props}>
      {!uri ? (
        <TouchableOpacity
          style={styles.upload}
          onPress={() => onSelectPressed()}>
          <Icon
            name="camera"
            type="evilicon"
            color={COLORS.eshi_color}
            size={50}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => handleClickImage()}>
          <Image
            PlaceholderContent={<ActivityIndicator />}
            style={styles.logo}
            resizeMode="contain"
            source={{
              uri,
            }}
          />
        </TouchableOpacity>
      )}
      <ImageViewer files={[uri]} />
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  upload: {
    borderRadius: Math.round(DIMENS.full_width + DIMENS.full_height) / 2,
    width: DIMENS.full_width * 0.15,
    height: DIMENS.full_width * 0.15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.eshi_color,
    marginTop: 8,
  },
  logo: {
    height: 60,
    width: 60,
  },
});
