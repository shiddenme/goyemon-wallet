'use strict';
import React, { Component } from 'react';
import { Text } from 'react-native';
import {
  RootContainer,
  Button,
  UntouchableCardContainer,
  HeaderOne,
  FormHeader
} from '../components/common/';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ethTx from 'ethereumjs-tx';
import WalletUtilities from '../utilities/WalletUtilities.ts';
import PriceUtilities from '../utilities/PriceUtilities.js';
import EtherUtilities from '../utilities/EtherUtilities.js';
import GasUtilities from '../utilities/GasUtilities.js';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class ConfirmationDai extends Component {
  async constructSignedOutgoingTransactionObject() {
    let outgoingTransactionObject = this.props.outgoingTransactionObjects[
      this.props.outgoingTransactionObjects.length - 1
    ];
    outgoingTransactionObject = new ethTx(outgoingTransactionObject);
    let privateKey = await WalletUtilities.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    outgoingTransactionObject.sign(privateKey);
    let signedTransaction = outgoingTransactionObject.serialize();
    signedTransaction = `0x${signedTransaction.toString('hex')}`;
    return signedTransaction;
  }

  async sendSignedTx() {
    await this.sendOutgoingTransactionToServer();
  }

  async sendOutgoingTransactionToServer() {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const signedTransaction = await this.constructSignedOutgoingTransactionObject();

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        signedTransaction
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  render() {
    const { outgoingTransactionObjects, web3, daiAmount, daiToAddress } = this.props;

    const gasPriceInEther = web3.utils.fromWei(
      outgoingTransactionObjects[outgoingTransactionObjects.length - 1].gasPrice,
      'Ether'
    );
    const total = (
      parseFloat(PriceUtilities.convertDaiToUsd(daiAmount)) +
      parseFloat(PriceUtilities.convertEthToUsd(gasPriceInEther))
    ).toFixed(2);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">Confirmation</HeaderOne>
        <TotalContainer>
          <CoinImage source={require('../../assets/dai_icon.png')} />
          <Text>You are sending</Text>
          <TotalValueText>{daiAmount} DAI</TotalValueText>
          <Text>{total} USD</Text>
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
          <ToText>{daiToAddress}</ToText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Amount
          </FormHeader>
          <AmountText>{daiAmount} DAI</AmountText>
          <FormHeader marginBottom="8" marginLeft="8" marginTop="16">
            Network Fee
          </FormHeader>
          <NetworkFeeText>{gasPriceInEther} ETH</NetworkFeeText>
        </UntouchableCardContainer>
        <ButtonContainer>
          <Button
            text="Send"
            textColor="white"
            backgroundColor="#009DC4"
            borderColor="#009DC4"
            margin="8px"
            opacity="1"
            onPress={async () => {
              this.props.navigation.navigate('Dai');
              await this.sendSignedTx();
            }}
          />
        </ButtonContainer>
      </RootContainer>
    );
  }
}

const TotalContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-bottom: 56px;
  margin-top: 56px;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const ToText = styled.Text`
  margin-left: 8px;
`;

const AmountText = styled.Text`
  margin-left: 8px;
`;

const NetworkFeeText = styled.Text`
  margin-left: 8px;
`;

const TotalValueText = styled.Text`
  font-size: 24px;
`;

const ButtonContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
`;

function mapStateToProps(state) {
  return {
    web3: state.ReducerWeb3.web3,
    outgoingTransactionObjects: state.ReducerOutgoingTransactionObjects.outgoingTransactionObjects,
    daiAmount: state.ReducerDaiAmount.daiAmount,
    daiToAddress: state.ReducerDaiToAddress.daiToAddress
  };
}

export default connect(mapStateToProps)(ConfirmationDai);