import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Text,
  ScrollView,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { COLORS, DIMENS } from '../common/constants';
import IconLocation from '../components/IconLocation';
import IncomingPackageNotification from '../components/IncomingPackageNotification';
import useSavedLocations from '../components/useSavedLocations';
import Location from '../screens/Location';
import auth from '@react-native-firebase/auth';


const SendIntentAndroid = require('react-native-send-intent');

const Landing = ({ navigation, route }) => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('user is logged');
    } else {
      return auth().signInAnonymously();
    }
  });
  const [SavedLocations, setForceRefresh] = useSavedLocations();
  const [locationVisible, setLocationVisible] = useState(false);
  const [isIncommingPackage, setIsIncommingPackage] = useState(
    route.params?.incommingPackage || false,
  );
  const [title, setTitle] = useState('Your Location');
  useEffect(() => {
    setIsIncommingPackage(route.params?.incommingPackage || false);
  }, [route.params]);
  const handleRequest = () => {
    const text =
      "Share me your location using locator App. If you don't have the locator app, please download using:\n\nhttps://play.google.com/9348tyh349th3";
    SendIntentAndroid.sendText({
      text,
      title: 'My locations',
      type: SendIntentAndroid.TEXT_PLAIN,
    });
  };


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.eshi_color} />
      <Header
        leftComponent={
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.toggleDrawer()}>
            <Icon
              name="ios-menu"
              type="ionicon"
              style={styles.icon}
              color={COLORS.eshi_color}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.centerComponent}>
            <Text style={styles.headerTitle}>
              {locationVisible ? title : 'Address Locator'}
            </Text>
          </View>
        }
        placement="center"
        containerStyle={styles.toolbar}
      />
      {!locationVisible ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.info}>Get Your current Location</Text>
          <Text style={styles.command}>Tap Button Below To Start</Text>
          <TouchableHighlight
            style={styles.circle}
            underlayColor={COLORS.eshi_light}
            onPress={() => {
              setLocationVisible(true);
              // navigation.navigate('Location', {from: 'Landing'});
            }}>
            <IconLocation />
          </TouchableHighlight>
          <TouchableOpacity style={styles.row} onPress={handleRequest}>
            <Text style={styles.buttonText}>
              Request a location from someone else.
            </Text>
            <Icon name="search" color={COLORS.eshi_color} size={36} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <Location
          inside="Landing"
          navigation={navigation}
          setForceRefresh={setForceRefresh}
          setLocationVisible={setLocationVisible}
          setLandingTitle={setTitle}
        />
      )}
      {/* {!locationVisible && (
        <TouchableOpacity style={styles.row}>
          <Text style={styles.buttonText}>
            Request a location search from someone else.
          </Text>
          <Icon name="search" color={COLORS.eshi_color} size={36} />
        </TouchableOpacity>
      )} */}
      <IncomingPackageNotification
        visible={isIncommingPackage}
        onViewItemDetail={() => {
          setIsIncommingPackage(false);
          navigation.navigate('DeliveryPackageDetail');
        }}
      />
      <SavedLocations />
    </View>
  );
};
export default Landing;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: DIMENS.full_height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  toolbar: {
    backgroundColor: COLORS.white,
  },
  centerComponent: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    color: COLORS.eshi_color,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    color: COLORS.eshi_color,
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    backgroundColor: COLORS.eshi_color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 150,
  },
  info: {
    color: COLORS.eshi_color,
    fontSize: 18,
    marginBottom: 20,
  },
  command: {
    color: COLORS.info_color,
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 50,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
