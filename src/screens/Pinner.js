import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  // Alert,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';
import {set} from 'react-native-reanimated';
// import Geolocation from '@react-native-community/geolocation';
import {COLORS, LATITUDE_DELTA, LONGITUDE_DELTA} from '../common/constants';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const offset = 24 + 100; // status bar height + random offset

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

const Pinner = ({navigation, route: {params = {}} = {}}) => {
  const {receivedLocation = {}, from} = params;
  const [currentLocation, setPosition] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [isNewPosition, setisNewPosition] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(0);

  let mapRef = useRef(null);

  // const getCurrentPosition = () => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const region = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       };
  //       setPosition(region);
  //       mapRef.current.animateToRegion(region, 2000);
  //     },
  //     (error) => Alert.alert('Error', JSON.stringify(error)),
  //     {
  //       enableHighAccuracy: false,
  //       timeout: 15000,
  //       maximumAge: 15000,
  //     },
  //   );
  // };

  const selectLocation = () => {
    // navigation.navigate('Location', {
    //   receivedLocation: currentLocation,
    //   from: 'Pinner',
    // });
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Location',
          params: {
            receivedLocation: currentLocation,
            from: 'Pinner',
          },
        },
      ],
    });
  };

  const fromLocation = from === 'Location';

  useEffect(() => {
    if (!fromLocation) {
      return;
    }
    const region = {
      latitude: receivedLocation.latitude,
      longitude: receivedLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    setPosition(region);
    mapRef.current.animateToRegion(region, 2000);
  }, [fromLocation, receivedLocation.latitude, receivedLocation.longitude]);

  const setNewPosition = (position) => {
    const region = {
      latitude: position.coordinate.latitude,
      longitude: position.coordinate.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    setPosition(region);
  };

  const handleRegionChange = (position) => {
    setPosition(position);
    isFirstTime <= 1 && setIsFirstTime(isFirstTime + 1);
    isFirstTime >= 1 && !isNewPosition && setisNewPosition(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        onRegionChangeComplete={handleRegionChange}
        followsUserLocation={true}
        zoomEnabled={true}
        ref={mapRef}
        // onMapReady={fromLocation ? null : getCurrentPosition}
      />
      <View style={styles.fakeMarker}>
        <Image
          style={styles.pin}
          resizeMode="contain"
          source={require('../assets/images/pin.png')}
        />
      </View>
      {
        // <Icon
        //   raised
        //   containerStyle={styles.iconButton}
        //   name="gps-fixed"
        //   type="material"
        //   color={COLORS.eshi_color}
        //   onPress={() => { }}
        // />
      }
      {isNewPosition && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => selectLocation()}
            style={[styles.bubble]}>
            <Text style={styles.buttonText}>Get Yene Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Pinner;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '104%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '15%',
    marginBottom: 30,
  },
  bubble: {
    backgroundColor: COLORS.eshi_color,
    paddingHorizontal: 18,
    borderRadius: 20,
    width: 200,
    padding: 8,
    marginHorizontal: 5,
  },
  iconButton: {
    marginBottom: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 15,
  },
  pin: {
    width: 40,
    height: 40,
  },
  fakeMarker: {
    position: 'absolute',
    top: (height - offset) / 2,
    left: width / 2 - 20,
  },
});
