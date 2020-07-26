'use strict';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { HeaderFive, ConfirmationText, ToggleCurrencySymbol } from './common';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class NetworkFeeContainerConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'USD'
    };
  }

  toggleCurrency(gasPriceWEI, gasLimit) {
    if (this.state.currency === 'ETH') {
      const USDValue = TransactionUtilities.getMaxNetworkFeeInUSD(
        gasPriceWEI,
        gasLimit
      );
      return <ConfirmationText>${USDValue}</ConfirmationText>;
    } else if (this.state.currency === 'USD') {
      let ETHValue = TransactionUtilities.getMaxNetworkFeeInETH(
        gasPriceWEI,
        gasLimit
      );
      LogUtilities.logInfo('ETHValue ==>', ETHValue);
      ETHValue = parseFloat(ETHValue).toFixed(5);
      return <ConfirmationText>{ETHValue}ETH</ConfirmationText>;
    }
  }

  render() {
    return (
      <View>
        <NetworkFeeHeaderContainer>
          <HeaderFive width="80%">{I18n.t('max-network-fee')}</HeaderFive>
          <TouchableOpacity
            onPress={() => {
              if (this.state.currency === 'ETH') {
                this.setState({ currency: 'USD' });
              } else if (this.state.currency === 'USD') {
                this.setState({ currency: 'ETH' });
              }
            }}
          >
            <ToggleCurrencySymbol currency={this.state.currency} />
          </TouchableOpacity>
        </NetworkFeeHeaderContainer>
        <ConfirmationText>
          {this.toggleCurrency(
            TransactionUtilities.returnTransactionSpeed(this.props.gasChosen),
            this.props.gasLimit
          )}
        </ConfirmationText>
      </View>
    );
  }
}

const NetworkFeeHeaderContainer = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;

function mapStateToProps(state) {
  return {
    gasPrice: state.ReducerGasPrice.gasPrice,
    gasChosen: state.ReducerGasPrice.gasChosen
  };
}

export default connect(mapStateToProps)(NetworkFeeContainerConfirmation);