'use strict';
import { INCREMENT_TOTAL_TRANSACTIONS, SAVE_TOTAL_TRANSACTIONS } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function incrementTotalTransactions() {
  return async function (dispatch) {
    try {
      dispatch(incrementTotalTransactionsSuccess());
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const incrementTotalTransactionsSuccess = () => ({
  type: INCREMENT_TOTAL_TRANSACTIONS,
  payload: 1
});

export function saveTotalTransactions(transactionCount) {
  return async function (dispatch) {
    try {
      dispatch(saveTotalTransactionsSuccess(transactionCount));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const saveTotalTransactionsSuccess = (transactionCount) => ({
  type: SAVE_TOTAL_TRANSACTIONS,
  payload: transactionCount
});
