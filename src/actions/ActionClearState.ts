"use strict";
import { CLEAR_STATE } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

export function clearState() {
  return async function (dispatch: any) {
    try {
      dispatch(clearStateSuccess());
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const clearStateSuccess = () => ({
  type: CLEAR_STATE
});
