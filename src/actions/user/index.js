export const SET_FCM_TOKEN = 'SET_FCM_TOKEN';
export const STORE_USER = 'STORE_USER';

export const setFcmToken = (fcmToken) => ({
  type: SET_FCM_TOKEN,
  payload: { fcmToken },
});

export const storeUser = (user) => ({
  type: STORE_USER,
  payload: { user },
});
