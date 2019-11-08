'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootContainer, Button, Loader, HeaderTwo, Description } from '../components/common';
import { Text, View, Linking, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import HomeStack from '../navigators/HomeStack';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import { saveNotificationPermission } from '../actions/ActionNotificationPermission';

class NotificationPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
 
  async componentDidMount() {
    await this.checkFcmPermissions();
  }

  async checkFcmPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('user has permissions');
      this.props.saveNotificationPermission(true);
    } else {
      console.log("user doesn't have permission");
      try {
        await firebase.messaging().requestPermission();
        this.props.saveNotificationPermission(true);
        console.log('User has authorised');
      } catch (error) {
        console.log('User has rejected permissions');
        this.props.saveNotificationPermission(false);
      }
    }
  }

  hasBalanceAndTransactions() {
    return (
      this.props.balance.ethBalance >= 0 &&
      this.props.balance.ethBalance.length != 0 &&
      this.props.balance.daiBalance >= 0 &&
      this.props.balance.daiBalance.length != 0 &&
      this.props.transactions
    );
  }

  toggleLoadingState() {
    const hasLoaded = this.hasBalanceAndTransactions();

    this.setState({
      loading: !hasLoaded
    });
  }

  navigateToHome() {
    HomeStack.navigationOptions = ({ navigation }) => {
      const tabBarVisible = true;
      return tabBarVisible;
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Wallets' })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  renderPermission() {
    if (this.hasBalanceAndTransactions()) {
      this.navigateToHome();
      return <View />;
    }

    if (this.props.notificationPermission === null) {
      return (<Text>Smash that “OK” button  so we can process your transactions!</Text>);
    } else if (this.props.notificationPermission === true) {
      return (
        <View>
          <Loader loading={this.state.loading}>
            <HeaderTwo marginBottom="0" marginLeft="0" marginTop="40">
              Setting up your wallet...
            </HeaderTwo>
            <Description
              marginBottom="8"
              marginLeft="8"
              marginTop="16"
            >
              this shouldn't take long
            </Description>
            <CreatingWalletImage source={require('../../assets/creating_wallet.png')} />
          </Loader>
          <Text>great!</Text>
          <Button
            text="Next"
            textColor="white"
            backgroundColor="#009DC4"
            borderColor="#009DC4"
            margin="16px auto"
            opacity="1"
            onPress={() => {
              this.toggleLoadingState();
            }}
          />
        </View>
      );
    } else if (this.props.notificationPermission === false) {
      return (
        <View>
          <HeaderTwo marginBottom="0" marginLeft="0" marginTop="40">
            oops!
          </HeaderTwo>
          <Description
            marginBottom="8"
            marginLeft="8"
            marginTop="16"
          >
          please go to the setting and change your permission. relaunch your app.</Description>
          <NotificationPermissionDeniedImage source={require('../../assets/notification_not_granted.png')} />
          <Button
            text="Go To Device Settings"
            textColor="#5F5F5F"
            backgroundColor="#EEEEEE"
            margin="16px auto"
            opacity="1"
            onPress={() => Linking.openURL('app-settings://notification/DeBank')}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <RootContainer>
        <Container>
          <View>{this.renderPermission()}</View>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 240px;
  text-align: center;
`;

const CreatingWalletImage = styled.Image`
  height: 320px;
  width: 320px;
`;

const NotificationPermissionDeniedImage = styled.Image`
  height: 320px;
  width: 320px;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance,
    notificationPermission: state.ReducerNotificationPermission.notificationPermission,
    transactions: state.ReducerTransactionHistory.transactions
  };
}

const mapDispatchToProps = {
  saveNotificationPermission
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationPermission);
