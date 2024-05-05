/* eslint-disable prettier/prettier */
'use strict';
import { SET_FCM_TOKEN, STORE_USER } from '../../actions/user';

const initialState = {
  user: null,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FCM_TOKEN:
      return { ...state, fcmToken: action.payload.fcmToken };
    case STORE_USER:
      return { ...state, user: action.payload.user };
    default:
      return state;
  }
}
