/**
 * @format
 */
import React from 'react';
import { AppRegistry, View } from 'react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';

import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { persistor, store } from './store';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const plusCodeGenerator = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<View />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => plusCodeGenerator);
