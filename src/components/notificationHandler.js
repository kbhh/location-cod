import React, { Component, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { setFcmToken } from '../actions/user';

const HandleNotifications = (props) => {
  const dispatch = useDispatch();

  let foregroundStateListener = useRef();
  let appKilledStateListener = useRef();
  let notificationOpenedListener = useRef();

  // request permission if permission diabled or not given
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
    } catch (error) { }
  };

  // firebase token for the user
  const getToken = async () => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        console.log(fcmToken, '============');
        dispatch(setFcmToken(fcmToken));
        messaging()
          .subscribeToTopic('all')
          .then(() => console.log('Subscribed to topic!'));
      });
  };

  // if permission enabled get firebase token else request permission
  const checkNotificationPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getToken(); // call function to get firebase token for personalized notifications.
    } else {
      requestPermission();
    }
  };

  useEffect(() => {
    checkNotificationPermission();

    // showing notification when app is in foreground.
    foregroundStateListener.current = messaging().onMessage(
      async (remoteMessage) => {
        props.navigationRef.current?.navigate('Landing', {
          incommingPackage: true,
        });
      },
    );

    // app tapped/opened in killed state
    appKilledStateListener.current = () =>
      messaging()
        .getInitialNotification()
        .then((notificationOpen) => {
          if (notificationOpen) {
            // anything you want to do with notification object.....
          }
        });

    // app tapped/opened in foreground and background state
    notificationOpenedListener.current = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        // ...anything you want to do with notification object.....
        props.navigationRef.current?.navigate('DeliveryPackageDetail');
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
          props.navigationRef.current,
        );
      },
    );

    return () => {
      appKilledStateListener.current && appKilledStateListener.current();
      notificationOpenedListener.current &&
        notificationOpenedListener.current();
      foregroundStateListener.current && foregroundStateListener.current();
    };
  }, []);

  return null;
};

export default HandleNotifications;
