'use strict';
import {
  UPDATE_SLIPPAGE_CHOSEN,
  SAVE_DAI_EXCHANGE_RESERVE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  uniswap: {
    slippage: [
      {
        value: 0.1
      },
      {
        value: 0.5
      },
      {
        value: 1
      }
    ],
    slippageChosen: 1,
    daiExchange: {
      weiReserve: '',
      daiReserve: ''
    }
  }
};

const uniswap = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_EXCHANGE_RESERVE:
      return {
        uniswap: {
          ...state.uniswap,
          daiExchange: {
            weiReserve: action.payload.ETH_balance,
            daiReserve: action.payload.DAI_balance
          }
        }
      };
    case UPDATE_SLIPPAGE_CHOSEN:
      return {
        uniswap: {
          ...state.uniswap,
          slippageChosen: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default uniswap;
