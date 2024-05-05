import React, { useEffect } from 'react';
import { StyleSheet, View, Image, StatusBar, LogBox, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from './src/common/constants';
import Landing from './src/screens/Landing';
import Location from './src/screens/Location';
import SearchMap from './src/screens/SearchMap';

import Account from './src/screens/Account';
import Delivery from './src/screens/Delivery';
import DeliveryPackageDetail from './src/screens/DeliveryPackageDetail';
import HandleNotifications from './src/components/notificationHandler';
import DrawerContent from './src/components/drawer';
import Navigate from './src/screens/Navigate';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
enableScreens();

export const navigationRef = React.createRef();

let oldRender = Text.render;
LogBox.ignoreAllLogs();
const App = () => {
  Text.render = function (...args) {
    let origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Poppins-Regular' }, origin.props.style],
    });
  };

  const linking = {
    prefixes: [
      'https://www.google.com/maps',
      'https://www.yenecode.com/maps',
    ],
    config: {
      screens: {
        Drawer: {
          screens: {
            Home: {
              screens: {
                Location: {
                  path: '/:receivedLocation',
                  parse: {
                    receivedLocation: (latlong) => {
                      console.log('I AM HERE');
                      let [
                        latitude,
                        longitude,
                        locationId,
                        address,
                      ] = latlong.split('@@');
                      return {
                        latitude: +latitude.slice(1),
                        longitude: +longitude,
                        from: 'Intent',
                        locationId,
                        address,
                      };
                    },
                  },
                },
                NotFound: '*',
              },
            },
          },
        },
      },
    },
  };

  const Home = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        stackAnimation: 'none',
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Navigate" component={Navigate} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="NotFound" component={NotFound} />
      <Stack.Screen name="SearchMap" component={SearchMap} />
      <Stack.Screen
        name="DeliveryPackageDetail"
        component={DeliveryPackageDetail}
      />
    </Stack.Navigator>
  );

  const AppDrawer = () => (
    <Drawer.Navigator drawerContent={DrawerContent}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Account" component={Account} />
      <Drawer.Screen name="Delivery" component={Delivery} />
    </Drawer.Navigator>
  );

  return (
    <React.Fragment>
      <HandleNotifications navigationRef={navigationRef} />
      <NavigationContainer
        linking={linking}
        fallback={<Loading />}
        ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Drawer" component={AppDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
};

const Loading = () => (
  <View style={styles.container}>
    <StatusBar hidden />
    <Image
      style={styles.logo}
      resizeMode="contain"
      source={require('./src/assets/images/logo.png')}
    />
    <View style={styles.poweredby}>
      <Text style={styles.caption}>Powered By - SecuriCom</Text>
    </View>
  </View>
);

const NotFound = () => (
  <View style={styles.container}>
    <StatusBar hidden />
    <Image
      style={styles.logo}
      resizeMode="contain"
      source={require('./src/assets/images/logo.png')}
    />
    <Text style={styles.notFound}>You have used an invalid location Link.</Text>
  </View>
);

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Drawer');
      navigation.reset({
        routes: [{ name: 'Drawer' }],
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Loading />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: '30%',
    height: '30%',
  },
  notFound: {
    fontSize: 20,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: COLORS.eshi_light,
    paddingHorizontal: 20,
  },
  poweredby: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  caption: {
    color: 'rgba(0,0,0,0.5)',
  },
});

export default App;
