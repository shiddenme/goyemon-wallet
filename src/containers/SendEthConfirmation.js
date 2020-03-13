'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import Web3 from 'web3';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader,
  CrypterestText,
  Loader,
  ToggleCurrencySymbol,
  IsOnlineMessage
} from '../components/common/';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class SendEthConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'USD',
      loading: false,
      buttonDisabled: false
    };
  }

  async sendSignedTx() {
    const outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];
    await TransactionUtilities.sendOutgoingTransactionToServer(outgoingTransactionObject);
  }

  toggleCurrency() {
    if (this.state.currency === 'ETH') {
      const usdTransactionFeeEstimateValue = this.props.transactionFeeEstimate.usd.toFixed(3);
      return <NetworkFee fontSize="16">${usdTransactionFeeEstimateValue}</NetworkFee>;
    } else if (this.state.currency === 'USD') {
      return <NetworkFee fontSize="16">{this.props.transactionFeeEstimate.eth}ETH</NetworkFee>;
    }
  }

  render() {
    const { outgoingTransactionObjects } = this.props;

    const toAddress = `0x${Buffer.from(outgoingTransactionObjects[outgoingTransactionObjects.length - 1].to_addr).toString("hex")}`;
    const toChecksumAddress = Web3.utils.toChecksumAddress(toAddress);
    const valueInEther = parseFloat(
      Web3.utils.fromWei(
        outgoingTransactionObjects[outgoingTransactionObjects.length - 1].getValue(),
        'Ether'
      )
    );
    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/ether_icon.png')} />
          <CrypterestText fontSize="16">You are about to send</CrypterestText>
          <TotalValue>{valueInEther} ETH</TotalValue>
          <CrypterestText fontSize="16">+ network fee</CrypterestText>
        </TotalContainer>
        <UntouchableCardContainer
          alignItems="flex-start"
          borderRadius="0"
          flexDirection="column"
          height="280px"
          justifyContent="flex-start"
          marginTop="0"
          textAlign="left"
          width="100%"
        >
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            To
          </FormHeader>
          <ToText>{toChecksumAddress}</ToText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Amount
          </FormHeader>
          <AmountText>{valueInEther} ETH</AmountText>
          <NetworkFeeContainer>
            <FormHeader marginBottom="0" marginLeft="8" marginTop="0">
              Max Network Fee
            </FormHeader>
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.state.currency === 'ETH') {
                  this.setState({ currency: 'USD' });
                } else if (this.state.currency === 'USD') {
                  this.setState({ currency: 'ETH' });
                }
              }}
            >
              <View>
                <ToggleCurrencySymbol currency={this.state.currency} />
              </View>
            </TouchableWithoutFeedback>
          </NetworkFeeContainer>
          <NetworkFee>{this.toggleCurrency()}</NetworkFee>
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Send"
            textColor="white"
            backgroundColor="#00A3E2"
            borderColor="#00A3E2"
            disabled={this.state.buttonDisabled}
            margin="8px"
            marginBottom="12px"
            opacity="1"
            onPress={async () => {
              if (this.props.netInfo) {
                this.setState({ loading: true, buttonDisabled: true });
                await this.sendSignedTx();
                this.props.navigation.reset(
                  [NavigationActions.navigate({ routeName: 'WalletList' })],
                  0
                );
                this.props.navigation.navigate('History');
                this.setState({ loading: false, buttonDisabled: false });
              }
            }}
          />
        </ButtonContainer>
        <Loader animating={this.state.loading} size="small"/>
        <IsOnlineMessage netInfo={this.props.netInfo} />
      </RootContainer>
    );
  }
}

const TotalContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 56;
  margin-top: 56;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const ToText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const AmountText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const NetworkFeeContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 16;
  margin-bottom: 8;
`;

const NetworkFee = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  margin-left: 8;
`;

const TotalValue = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 24;
`;

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

function mapStateToProps(state) {
  return {
    netInfo: state.ReducerNetInfo.netInfo,
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    transactionFeeEstimate: state.ReducerTransactionFeeEstimate.transactionFeeEstimate
  };
}

export default connect(mapStateToProps)(SendEthConfirmation);
