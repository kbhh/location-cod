/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,

} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Polyline from '@mapbox/polyline';
import Dialog from 'react-native-dialog';
import Geolocation from 'react-native-geolocation-service';
import MapView, {
  Marker,
  AnimatedRegion,
  UrlTile,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {Icon} from 'react-native-elements';
import {getRoute} from '.././common/graphhpper';
import {showToast, translatePlusCodeToYeneCode} from '../common/utils';
import {COLORS} from '../common/constants';
import useImageViewer from '../components/useImageViewer';
const geolib = require('geolib');
import { useStopwatch } from 'react-timer-hook';

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Navigate(props) {
  const map = useRef(null);
  const currentLocationMarker = useRef(null);
  const { destination } = props.route?.params || {};
  const [vehicle, setVehicle] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [points, setPoints] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [heading, setHeading] = useState(-1);
  const [origin, setOrigin] = useState(null);
  const [ImageViewer, setViewerVisible] = useImageViewer();
  const zoomFrequency = useRef(0);
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [
    isDestinationDescriptionVisible,
    setIsDestinationDescriptionVisible,
  ] = useState(false);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const animate = (newCoordinate) => {
    if (Platform.OS === 'android') {
      if (currentLocationMarker.current) {
        currentLocationMarker?.current?.animateMarkerToCoordinate(
          newCoordinate,
          500,
        );
      }
    } else {
      currentLocation.timing(newCoordinate).start();
    }
    // setCurrentLocation(newCoordinate);
  };

  const trackMovement = () => {
    Geolocation.watchPosition(
      (position) => {
        animate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        });
        setHeading(position.coords.heading);
        setIsDestinationDescriptionVisible(
          geolib.isPointWithinRadius(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            destination,
          ),
          300,
        );
        map?.current?.animateCamera({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          heading: position.coords.heading,
        });
      },
      (error) => {
        console.log(error, 'error while traking position');
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 2,
        useSignificantChanges: true,
        forceRequestLocation: true,
      },
    );
  };

  const getCurrentPosition = useCallback(async (info = {}) => {
    // for ios request  location use
    const iosPermision =
      Platform.OS === 'ios' && (await Geolocation.requestAuthorization());
    if (iosPermision === 'granted' || Platform.OS === 'android') {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position, 'from current position');
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading,
          };
          setCurrentLocation(
            new AnimatedRegion({
              longitude: region.longitude,
              latitude: region.latitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            }),
          );
          setHeading(region.heading);
          setOrigin(region);
          trackMovement();
        },
        (error) => {
          console.log(error);
          showToast(
            'Unable to get current location.\nPlease check whether location services is on and try again.',
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 15000,
          forceRequestLocation: true,
        },
      );
    }
  }, []);

  const onStartPlay = async () => {
    console.log('onStartPlay');
    await audioRecorderPlayer.startPlayer(destination.voice_uri);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setIsOptionModalVisible(false);
      }
      // setCurrentPositionSec(e.current_position);
      // setCurrentDurationSec(e.duration);
      // setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      // setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      return;
    });
  };

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    if (origin && destination && vehicle) {
      getRoute(
        [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude],
        ],
        vehicle,
      )
        .then((res) => {
          console.log(res, 'something is changed');
          setRouteData(res.data);
        })
        .catch((error) => {
          console.log(error.response, 'graph hopper error');
        });
    }
  }, [vehicle]);

  const drawPath = () => {
    if (routeData) {
      let routePoints = Polyline.decode(routeData.paths[0].points);
      let coords = routePoints.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      // setPoints(coords);
      return (
        <>
          <MapView.Polyline
            coordinates={coords}
            strokeWidth={2}
            strokeColor={COLORS.plus_code_color}
          />
          {
            //   routeData?.paths[0]?.instructions?.map((instruction, index) => {
            //   return (
            //     <MapView.Polyline
            //       key={index}
            //       coordinates={coords.slice(
            //         instruction.interval[0],
            //         instruction.interval[1] + 1,
            //       )}
            //       strokeWidth={5}
            //       strokeColor={
            //         index % 2 === 0 ? COLORS.plus_code_color : COLORS.black
            //       }
            //     />
            //   );
            // })
          }
        </>
      );
    }
  };

  const fitMapOnPath = () => {
    if (map.current && destination && origin && vehicle) {
      setTimeout(() => {
        map.current.fitToCoordinates(
          [
            {
              latitude: origin.latitude,
              longitude: origin.longitude,
            },
            destination,
          ],
          {
            edgePadding: {
              top: 500,
              right: 200,
              bottom: 500,
              left: 200,
            },
            animated: true,
          },
        );
      }, 100);
    }
  };

  const renderAddress = (address) => {
    return (
      <View style={styles.address}>
        <View style={[styles.row]}>
          <Icon
            name="circle"
            type="font-awesome"
            iconStyle={styles.addresIcon}
          />
          <View>
            <Text style={styles.addressLabel}>From : Current Position</Text>
          </View>
        </View>
        <View style={[styles.row]}>
          <Icon
            name="circle"
            type="font-awesome"
            iconStyle={styles.addresIcon}
          />
          <View>
            <Text style={styles.addressLabel}>
              To :{' '}
              {address?.address?.split('##').slice(4).join(' ') ||
                'Unknown address'}{' '}
              ({address.infos?.locationName || 'Unknown Place'})
            </Text>
            <Text style={styles.caption}>
              {translatePlusCodeToYeneCode(address.code)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderVehicleChooser = () => {
    return (
      !vehicle && (
        <View style={styles.mediumChooser}>
          <Text style={styles.cardTitle}>
            Please choose your prefered Medium
          </Text>
          <View style={styles.mediums}>
            <TouchableOpacity
              style={[styles.info, styles.shadow, styles.navigationMode]}
              onPress={() => setVehicle('car')}>
              <Icon name="ios-car" type="ionicon" iconStyle={styles.infoIcon} />
              <Text>Car</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.info, styles.shadow, styles.navigationMode]}
              onPress={() => setVehicle('bike')}>
              <Icon
                name="ios-bicycle"
                type="ionicon"
                iconStyle={styles.infoIcon}
              />
              <Text>Bike</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.info, styles.shadow, styles.navigationMode]}
              onPress={() => setVehicle('foot')}>
              <Icon
                name="ios-walk"
                type="ionicon"
                iconStyle={styles.infoIcon}
              />
              <Text>Foot</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    );
  };

  const transform = (heading) => {
    return {
      transform: [
        {
          rotate: !heading ? '0deg' : `${heading}deg`,
        },
      ],
    };
  };

  const viewImage = () => {
    setIsOptionModalVisible(false);
    setViewerVisible(true);
  };

  const startMoving = () => {
    start(); //start timer
    map?.current?.animateCamera({
      center: {
        latitude: origin.latitude,
        longitude: origin.longitude,
      },
      heading: routeData?.paths[0]?.instructions[0]?.heading,
    });
    setHeading(routeData?.paths[0]?.instructions[0]?.heading);
  };

  const renderOptionModal = useCallback((visible) => {
    return (
      <Dialog.Container
        visible={visible}
        contentStyle={styles.dialogContainer}
        onRequestClose={() => setIsOptionModalVisible(false)}
        onBackdropPress={() => setIsOptionModalVisible(false)}>
        <View style={styles.dialogHeader}>
          <Dialog.Title style={styles.dialogTitle}>Actions</Dialog.Title>
          <Icon
            onPress={() => setIsOptionModalVisible(false)}
            name="close-o"
            type="evilicon"
            color={COLORS.eshi_color}
            size={46}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {destination.image_uri ? (
            <TouchableOpacity style={styles.listItem} onPress={viewImage}>
              <Icon
                name="ios-image"
                type="ionicon"
                iconStyle={styles.listItemIcon}
              />
              <Text style={styles.listItemLable}>View destination image</Text>
            </TouchableOpacity>
          ) : null}
          {destination.voice_uri ? (
            <TouchableOpacity style={styles.listItem} onPress={onStartPlay}>
              <Icon
                name="ios-mic"
                type="ionicon"
                iconStyle={styles.listItemIcon}
              />
              <Text style={styles.listItemLable}>Listen voice description</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </Dialog.Container>
    );
  }, []);

  return (
    <View style={styles.container}>
      {renderVehicleChooser()}
      {currentLocation && vehicle && (
        <MapView
          ref={map}
          style={styles.map}
          onLayout={fitMapOnPath}
          mapType="none"
          provider={null}
          maxZoomLevel={19}>
          {currentLocation && (
            <Marker.Animated
              flat={true}
              ref={currentLocationMarker}
              coordinate={currentLocation}>
              <View
                style={[
                  styles.currentLocationIconContainer,
                  styles.shadow,
                  transform(heading),
                ]}>
                <Icon
                  name="ios-navigate"
                  type="ionicon"
                  iconStyle={styles.markerIcon}
                />
              </View>
            </Marker.Animated>
          )}
          {destination && (
            <Marker
              style={{ alignItems: 'center' }}
              onPress={() => {
                if (destination.image_uri || destination.voice_url) {
                  setIsOptionModalVisible(true);
                }
              }}
              coordinate={{
                ...destination,
              }}>
              {isDestinationDescriptionVisible && (
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => console.log(true)}>
                  <Image
                    source={{
                      uri:
                        destination.image_uri ||
                        'https://img.icons8.com/cotton/64/000000/image--v1.png',
                    }}
                    style={{ width: 50, height: 50 }}
                    resizeMethod="scale"
                    resizeMode="center"
                  />
                </TouchableOpacity>
              )}
              <View
                style={[
                  styles.currentLocationIconContainer,
                  styles.shadow,
                  styles.destinationIconContainer,
                ]}>
                <Icon
                  name="circle-o"
                  type="font-awesome"
                  iconStyle={[styles.markerIcon, styles.destinationIcon]}
                />
              </View>
            </Marker>
          )}
          {drawPath()}
          <UrlTile
            urlTemplate="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
            zIndex={-3}
          />
        </MapView>
      )}
      <View style={[styles.header, styles.shadow]}>
        <Text style={styles.cardTitle}>Navigation</Text>
      </View>
      {routeData && destination && currentLocation && (
        <View style={styles.bottom}>
          <View style={[styles.infoContainer]}>
            {isRunning && (
              <View style={[styles.info, styles.shadow]}>
                <Text style={styles.infoLabel}>Timer</Text>
                <Text style={styles.infoValue}>
                  {hours !== 0 ? `${hours} Hr` : null}
                  {minutes !== 0 ? `${minutes} Min` : null}
                  {seconds} Sec
                </Text>
              </View>
            )}
            {!isRunning && (
              <TouchableOpacity
                style={[styles.info, styles.shadow]}
                onPress={startMoving}>
                <Text style={styles.infoValue}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Distance/Time Estimation </Text>
              <Text style={styles.cardTitle}>
                ({(routeData.paths[0].distance / 1000).toFixed(1)} Km /
                {(routeData.paths[0].time / 1000 / 60).toFixed(1)}
                {'  Min'})
              </Text>
            </View>
            <View style={styles.cardContent} />
            {renderAddress(destination)}
          </View>
        </View>
      )}
      <ImageViewer files={[destination.image_uri]} />
      {renderOptionModal(isOptionModalVisible)}
    </View>
  );
}

const transparent = 'rgba(0,0,0,0.1)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '104%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 15,
  },
  cardHeader: {
    alignItems: 'center',
    borderBottomColor: transparent,
    borderBottomWidth: 1,
    paddingBottom: 7,
  },
  header: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    width: Dimensions.get('screen').width - 30,
    marginHorizontal: 15,
    top: 50,
    left: 0,
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 17,
    color: COLORS.eshi_color,
  },
  info: {
    width: 120,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  infoContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.grey,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.eshi_color,
  },
  shadow: {
    shadowColor: COLORS.grey,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowOpacity: 5,
    shadowRadius: 400,
    elevation: 2,
  },
  mediumChooser: {
    marginTop: 150,
    alignItems: 'center',
  },
  mediums: {
    flexDirection: 'row',
    marginTop: 15,
  },
  infoIcon: {
    color: COLORS.grey,
  },
  currentLocationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.eshi_color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerIcon: {
    color: COLORS.white,
  },
  destinationIconContainer: {
    width: 30,
    height: 30,
  },
  destinationIcon: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addresIcon: {
    fontSize: 15,
    color: COLORS.grey,
    marginRight: 10,
  },
  address: {
    marginTop: 15,
  },
  addressLabel: {
    color: COLORS.black,
  },
  caption: {
    color: COLORS.grey,
    fontWeight: 'bold',
  },
  imageContainer: {
    backgroundColor: COLORS.eshi_color,
    borderRadius: 10,
    paddingVertical: 5,
    zIndex: 99999,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  dialogContainer: {
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  dialogTitle: {
    width: '80%',
    fontSize: 20,
    color: COLORS.eshi_color,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  dialogHeader: {
    marginBottom: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info_color_light,
  },
  listItem: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderBottomColor: transparent,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemLable: {
    flexGrow: 1,
    fontSize: 15,
  },
  listItemIcon: {
    color: COLORS.eshi_color,
    fontSize: 20,
    marginRight: 10,
  },
  navigationMode: {
    width: 80,
  },
});
