'use strict';
import { createStackNavigator } from 'react-navigation';
import History from '../components/History';

const HistoryStack = createStackNavigator(
  {
    History: {
      screen: History,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: 'History'
  }
);

export default HistoryStack;
