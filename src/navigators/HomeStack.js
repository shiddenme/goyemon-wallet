'use strict';
import { createStackNavigator } from 'react-navigation';
import Initial from '../components/Initial';
import Welcome from '../components/Welcome';
import NotificationPermissionTutorial from '../components/NotificationPermissionTutorial';
import NotificationPermissionNotGranted from '../components/NotificationPermissionNotGranted';
import WalletCreation from '../components/WalletCreation';
import Start from '../containers/Start';
import ImportOptions from '../components/ImportOptions';
import ImportTwentyFourMnemonicWords from '../components/ImportTwentyFourMnemonicWords';
import ImportTwelveMnemonicWords from '../components/ImportTwelveMnemonicWords';
import CreateWalletTutorial from '../components/CreateWalletTutorial';
import ShowMnemonic from '../components/ShowMnemonic';
import VerifyMnemonic from '../containers/VerifyMnemonic';
import WalletList from '../containers/WalletList';
import Ethereum from '../containers/Ethereum';
import Send from '../containers/Send';
import Confirmation from '../containers/Confirmation';
import QRCode from '../containers/QRCode';
import Dai from '../containers/Dai';
import SendDai from '../containers/SendDai';
import ConfirmationDai from '../containers/ConfirmationDai';

const HomeStack = createStackNavigator(
  {
    Initial: {
      screen: Initial,
      navigationOptions: () => ({
        header: null
      })
    },
    Welcome: {
      screen: Welcome,
      navigationOptions: () => ({
        header: null
      })
    },
    NotificationPermissionTutorial: {
      screen: NotificationPermissionTutorial,
      navigationOptions: () => ({
        header: null
      })
    },
    NotificationPermissionNotGranted: {
      screen: NotificationPermissionNotGranted,
      navigationOptions: () => ({
        header: null
      })
    },
    WalletCreation: {
      screen: WalletCreation,
      navigationOptions: () => ({
        header: null
      })
    },
    Start: {
      screen: Start,
      navigationOptions: () => ({
        header: null
      })
    },
    ImportOptions: {
      screen: ImportOptions,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'ImportOptions'
      })
    },
    ImportTwentyFourMnemonicWords: {
      screen: ImportTwentyFourMnemonicWords,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Import'
      })
    },
    ImportTwelveMnemonicWords: {
      screen: ImportTwelveMnemonicWords,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Import'
      })
    },
    CreateWalletTutorial: {
      screen: CreateWalletTutorial,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    ShowMnemonic: {
      screen: ShowMnemonic,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    VerifyMnemonic: {
      screen: VerifyMnemonic,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    WalletList: {
      screen: WalletList,
      navigationOptions: () => ({
        headerLeft: null,
        headerTransparent: true,
        headerBackTitle: 'Wallets'
      })
    },
    Ethereum: {
      screen: Ethereum,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Ethereum'
      })
    },
    Send: {
      screen: Send,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Send'
      })
    },
    Confirmation: {
      screen: Confirmation,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    QRCode: {
      screen: QRCode,
      navigationOptions: () => ({
        headerTransparent: true
      })
    },
    Dai: {
      screen: Dai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'Dai'
      })
    },
    SendDai: {
      screen: SendDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'SendDai'
      })
    },
    ConfirmationDai: {
      screen: ConfirmationDai,
      navigationOptions: () => ({
        headerTransparent: true,
        headerBackTitle: 'ConfirmationDai'
      })
    }
  },
  {
    initialRouteName: 'Initial'
  }
);

export default HomeStack;
