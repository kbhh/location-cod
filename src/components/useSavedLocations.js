import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { SwipeablePanel } from 'rn-swipeable-panel';
import IconUp from './IconUp';
import { COLORS, DIMENS } from '../common/constants';
import SavedLocations from '../screens/Locations';
import AccessStore from '../services/AsyncStorage';
import { isNewDate } from '../common/utils';

const useLocations = () => {
  const [panelProps] = useState({
    fullWidth: true,
    openLarge: true,
    noBackgroundOpacity: true,
    noBar: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    style: {
      height: DIMENS.full_height - StatusBar.currentHeight,
    },
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [newLocations, setNewLocations] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);

  const restoreLocations = async () => {
    const STORE = (await AccessStore.get()) || { locations: [] };

    const hasStoredCredentials =
      STORE && STORE.locations && STORE.locations.length;
    if (hasStoredCredentials) {
      setNewLocations(
        STORE.locations
          .map((location) => isNewDate(location.modifiedDate))
          .filter((location) => location).length,
      );
    }
  };

  useEffect(() => {
    restoreLocations();
  }, [forceRefresh]);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const Locations = (props) => {
    return (
      <View {...props}>
        <SwipeablePanel
          {...panelProps}
          isActive={isPanelActive}
          style={{
            // height: isIphoneX() ? Dimensions.get('screen').height - 24 : '100%',
          }}>
          {isPanelActive && (
            <TouchableOpacity
              style={[styles.locationsButton, styles.locationsTopButton]}
              onPress={() => {
                closePanel();
              }}>
              <IconUp rotate={true} />
              <Text style={styles.titleText}>Saved Locations</Text>
              {newLocations > 0 && (
                <View style={styles.newContainer}>
                  <Icon
                    type="material"
                    name="fiber-new"
                    color={COLORS.eshi_color}
                    size={40}
                  />
                  <Badge
                    containerStyle={styles.badgeContainer}
                    Component={() => {
                      return (
                        <ImageBackground
                          source={require('../assets/images/pin-badge.png')}
                          resizeMode="stretch"
                          style={styles.imageBackground}>
                          <Text style={styles.badgeText}>{newLocations}</Text>
                        </ImageBackground>
                      );
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>
          )}
          <SavedLocations setIsPanelActive={setIsPanelActive} />
        </SwipeablePanel>
        {!isPanelActive && (
          <TouchableOpacity
            style={styles.locationsButton}
            onPress={() => {
              openPanel();
            }}>
            <IconUp style={styles.imageBackground} color={COLORS.eshi_color}
            />
            <Text style={styles.titleText}>Saved Locations</Text>
            {newLocations > 0 && (
              <View style={styles.newContainer}>
                <Icon
                  type="material"
                  name="fiber-new"
                  color={COLORS.eshi_color}
                  size={40}
                />
                <Badge
                  containerStyle={styles.badgeContainer}
                  Component={() => {
                    return (
                      <ImageBackground
                        source={require('../assets/images/pin-badge.png')}
                        resizeMode="stretch"
                        style={styles.imageBackground}>
                        <Text style={styles.badgeText}>{newLocations}</Text>
                      </ImageBackground>
                    );
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return [Locations, setForceRefresh];
};

export default useLocations;

const styles = StyleSheet.create({
  locationsButton: {
    padding: 20,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 65,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2.22,
    elevation: 5,
  },
  locationsTopButton: {
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  titleText: {
    textAlign: 'center',
    marginHorizontal: 50,
    fontSize: 17,
    color: COLORS.eshi_color,
    fontFamily: 'Poppins-Medium',
  },
  badgeStyle: {
    backgroundColor: COLORS.eshi_color,
    height: 22,
    paddingTop: 2,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -7,
  },
  imageBackground: {
    width: 25,
    height: 30,
    padding: 4,
  },
  newContainer: { flexDirection: 'row', marginBottom: 15, width: 50, height: 30 },
});
