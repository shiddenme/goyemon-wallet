'use strict';
import { SAVE_NOTIFICATION_PERMISSION } from '../constants/ActionTypes';
import { SAVE_PHOTO_LIBRARY_PERMISSION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  permissions: {
    notification: null,
    photoLibrary: ''
  }
};

const permissions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_NOTIFICATION_PERMISSION:
      return {
        permissions: { ...state.permissions, notification: action.payload }
      };
    case SAVE_PHOTO_LIBRARY_PERMISSION:
      return {
        permissions: { ...state.permissions, photoLibrary: action.payload }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default permissions;
