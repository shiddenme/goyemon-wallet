'use strict';
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Web3 from 'web3';
import {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType
} from '../actions/ActionModal';
import { saveOutgoingTransactionDataSend } from '../actions/ActionOutgoingTransactionData';
import { clearQRCodeData } from '../actions/ActionQRCodeData';
import {
  UntouchableCardContainer,
  Form,
  FormHeader,
  Loader,
  IsOnlineMessage,
  TxNextButton,
  UseMaxButton
} from '../components/common';
import { AdvancedContainer } from '../containers/common/AdvancedContainer';
import TxConfirmationModal from '../containers/common/TxConfirmationModal';
import I18n from '../i18n/I18n';
import SendStack from '../navigators/SendStack';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from '../utilities/BigNumberUtilities';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import StyleUtilities from '../utilities/StyleUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import TxStorage from '../lib/tx.js';
import GlobalConfig from '../config.json';

class SendEth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: Web3.utils.fromWei(props.balance.wei),
      toAddress: '',
      weiAmount: '0',
      ethAmount: '',
      toAddressValidation: undefined,
      weiAmountValidation: undefined,
      loading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.qrCodeData != prevProps.qrCodeData) {
      this.setState({ toAddress: this.props.qrCodeData });
      this.validateToAddress(this.props.qrCodeData);
    }
    if (this.props.gasChosen != prevProps.gasChosen) {
      this.updateWeiAmountValidation(
        TransactionUtilities.validateWeiAmount(
          this.state.weiAmount,
          GlobalConfig.ETHTxGasLimit
        )
      );
    }
    if (this.props.balance.wei != prevProps.balance.wei) {
      this.setState({ ethBalance: Web3.utils.fromWei(this.props.balance.wei) });
    }
  }

  async constructTransactionObject() {
    const transactionObject = (await TxStorage.storage.newTx())
      .setTo(this.state.toAddress)
      .setValue(
        new RoundDownBigNumberPlacesEighteen(this.state.weiAmount).toString(16)
      )
      .setGasPrice(
        TransactionUtilities.returnTransactionSpeed(
          this.props.gasChosen
        ).toString(16)
      )
      .setGas(GlobalConfig.ETHTxGasLimit.toString(16));

    return transactionObject;
  }

  validateToAddress(toAddress) {
    if (Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('address validated!');
      this.setState({ toAddressValidation: true });
      return true;
    } else if (!Web3.utils.isAddress(toAddress)) {
      LogUtilities.logInfo('invalid address');
      this.setState({ toAddressValidation: false });
      return false;
    }
  }

  updateWeiAmountValidation(weiAmountValidation) {
    if (weiAmountValidation) {
      this.setState({
        weiAmountValidation: true
      });
    } else if (!weiAmountValidation) {
      this.setState({
        weiAmountValidation: false
      });
    }
  }

  validateForm = async (toAddress, weiAmount) => {
    const toAddressValidation = this.validateToAddress(toAddress);
    const weiAmountValidation = TransactionUtilities.validateWeiAmount(
      weiAmount,
      GlobalConfig.ETHTxGasLimit
    );
    const isOnline = this.props.isOnline;

    if (toAddressValidation && weiAmountValidation && isOnline) {
      this.setState({ loading: true });
      LogUtilities.logInfo('validation successful');
      const transactionObject = await this.constructTransactionObject();
      this.props.saveOutgoingTransactionDataSend({
        toaddress: toAddress,
        amount: Web3.utils.fromWei(weiAmount.toString(16)),
        gasLimit: GlobalConfig.ETHTxGasLimit,
        transactionObject: transactionObject
      });
      this.props.saveTxConfirmationModalVisibility(true);
      this.props.updateTxConfirmationModalVisibleType('send-eth');
    } else {
      LogUtilities.logInfo('form validation failed!');
    }
  };

  render() {
    const isOnline = this.props.isOnline;
    const ethBalance = RoundDownBigNumberPlacesFour(
      this.state.ethBalance
    ).toFixed(4);

    let weiFullAmount;
    const weiBalance = new RoundDownBigNumberPlacesEighteen(
      this.props.balance.wei
    );
    const networkFeeLimit = new RoundDownBigNumberPlacesEighteen(
      TransactionUtilities.returnTransactionSpeed(this.props.gasChosen)
    ).times(GlobalConfig.ETHTxGasLimit);

    if (weiBalance.isLessThanOrEqualTo(networkFeeLimit)) {
      weiFullAmount = '0';
    } else if (weiBalance.isGreaterThan(networkFeeLimit)) {
      weiFullAmount = weiBalance.minus(networkFeeLimit).toString();
    }

    return (
      <View>
        <TxConfirmationModal />
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8px"
          flexDirection="column"
          height="160px"
          justifyContent="flex-start"
          marginTop="40"
          textAlign="left"
          width="90%"
        >
          <CoinImage source={require('../../assets/ether_icon.png')} />
          <Title>{I18n.t('eth-wallet-balance')}</Title>
          <BalanceContainer>
            <Value>{ethBalance} ETH</Value>
            <Value>
              ${PriceUtilities.getEthUsdBalance(this.state.ethBalance)}
            </Value>
          </BalanceContainer>
        </UntouchableCardContainer>
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('to')}
          </FormHeader>
        </FormHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.toAddressValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder={I18n.t('send-address')}
              clearButtonMode="while-editing"
              onChangeText={(toAddress) => {
                this.validateToAddress(toAddress);
                this.setState({ toAddress });
              }}
              value={this.state.toAddress}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.clearQRCodeData();
                SendStack.navigationOptions = () => {
                  const tabBarVisible = false;
                  return {
                    tabBarVisible
                  };
                };
                this.props.navigation.navigate('QRCodeScan');
              }}
            >
              <Icon name="qrcode-scan" size={20} color="#5f5f5f" />
            </TouchableOpacity>
          </SendTextInputContainer>
        </Form>
        <FormHeaderContainer>
          <FormHeader marginBottom="0" marginTop="0">
            {I18n.t('amount')}
          </FormHeader>
          <UseMaxButton
            text={I18n.t('use-max')}
            textColor="#00A3E2"
            onPress={() => {
              this.setState({
                weiAmount: weiFullAmount,
                ethAmount: Web3.utils.fromWei(weiFullAmount)
              });
              this.updateWeiAmountValidation(
                TransactionUtilities.validateWeiAmount(
                  weiFullAmount,
                  GlobalConfig.ETHTxGasLimit
                )
              );
            }}
          />
        </FormHeaderContainer>
        <Form
          borderColor={StyleUtilities.getBorderColor(
            this.state.weiAmountValidation
          )}
          borderWidth={1}
          height="56px"
        >
          <SendTextInputContainer>
            <SendTextInput
              placeholder="0"
              keyboardType="numeric"
              clearButtonMode="while-editing"
              onChangeText={(ethAmount) => {
                const isNumber = /^[0-9]\d*(\.\d+)?$/.test(ethAmount);
                this.setState({ ethAmount });
                if (isNumber) {
                  this.updateWeiAmountValidation(
                    TransactionUtilities.validateWeiAmount(
                      Web3.utils.toWei(ethAmount),
                      GlobalConfig.ETHTxGasLimit
                    )
                  );
                  this.setState({
                    weiAmount: Web3.utils.toWei(ethAmount)
                  });
                } else {
                  this.updateWeiAmountValidation(false);
                }
              }}
              returnKeyType="done"
              value={this.state.ethAmount}
            />
            <CurrencySymbolText>ETH</CurrencySymbolText>
          </SendTextInputContainer>
        </Form>
        <AdvancedContainer gasLimit={GlobalConfig.ETHTxGasLimit} />
        <ButtonWrapper>
          <TxNextButton
            disabled={
              !(
                this.state.weiAmountValidation &&
                this.state.toAddressValidation &&
                isOnline
              ) || this.state.loading
                ? true
                : false
            }
            opacity={
              this.state.weiAmountValidation &&
              this.state.toAddressValidation &&
              isOnline
                ? 1
                : 0.5
            }
            onPress={async () => {
              await this.validateForm(
                this.state.toAddress,
                this.state.weiAmount
              );
              this.setState({ loading: false });
            }}
          />
          <Loader animating={this.state.loading} size="small" />
        </ButtonWrapper>
        <IsOnlineMessage isOnline={this.props.isOnline} />
      </View>
    );
  }
}

const SendTextInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 95%;
`;

const SendTextInput = styled.TextInput`
  font-size: 14;
  height: 56px;
  width: 95%;
  text-align: left;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-top: 16;
  width: 40px;
`;

const Title = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 16;
  text-transform: uppercase;
`;

const BalanceContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 8;
`;

const Value = styled.Text`
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-right: 4;
`;

const CurrencySymbolText = styled.Text`
  font-family: 'HKGrotesk-Regular';
`;

const ButtonWrapper = styled.View`
  align-items: center;
`;

const FormHeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 16px;
  width: 90%;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen,
    balance: state.ReducerBalance.balance,
    isOnline: state.ReducerNetInfo.isOnline,
    qrCodeData: state.ReducerQRCodeData.qrCodeData
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateTxConfirmationModalVisibleType,
  saveOutgoingTransactionDataSend,
  clearQRCodeData
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(SendEth)
);
