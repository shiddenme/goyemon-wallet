'use strict';
import { createStackNavigator } from 'react-navigation';
import EarnHome from '../components/EarnHome';
import DepositDai from '../containers/DepositDai';
import DepositDaiConfirmation from '../containers/DepositDaiConfirmation';
import DepositFirstDai from '../containers/DepositFirstDai';
import DepositFirstDaiConfirmation from '../containers/DepositFirstDaiConfirmation';
import WithdrawDai from '../containers/WithdrawDai';
import WithdrawDaiConfirmation from '../containers/WithdrawDaiConfirmation';
import Settings from '../containers/Settings';
import BackupWords from '../containers/BackupWords';
import Advanced from '../containers/Advanced';

const EarnStack = createStackNavigator(
  {
    EarnHome: {
      screen: EarnHome,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Earn'
      })
    },
    DepositDai: {
      screen: DepositDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositDaiConfirmation: {
      screen: DepositDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    DepositFirstDai: {
      screen: DepositFirstDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Deposit'
      })
    },
    DepositFirstDaiConfirmation: {
      screen: DepositFirstDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    WithdrawDai: {
      screen: WithdrawDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Withdraw'
      })
    },
    WithdrawDaiConfirmation: {
      screen: WithdrawDaiConfirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Settings: {
      screen: Settings,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: { marginTop: 18 }
      })
    },
    BackupWords: {
      screen: BackupWords,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Advanced: {
      screen: Advanced,
      navigationOptions: () => ({
        headerTransparent: true
      })
    }    
  },
  {
    initialRouteName: 'EarnHome'
  }
);

export default EarnStack;
