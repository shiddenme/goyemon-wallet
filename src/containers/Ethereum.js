'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text } from 'react-native';
import Transactions from '../containers/Transactions';
import { Button } from '../components/common/';
import { getGasPrice } from "../actions/ActionGasPrice";
import { getExistingTransactions } from '../actions/ActionTransactions';
import styled from 'styled-components';

class Ethereum extends Component {
  constructor(props) {
    super();
    this.state = {
      balance: "0.0",
      usdBalance: "0.0"
    };
  }

  async componentDidMount() {
    const balanceInWei = await this.getBalance(this.props.checksumAddress);
    const balanceInEther = this.props.web3.utils.fromWei(balanceInWei);
    await this.props.getExistingTransactions("1b5e2011e26B3051E4ad1936299c417eEDaCBF50");
    this.setState({balance: balanceInEther});
    this.setState({usdBalance: this.getUsdBalance()});
  }

  async getBalance(address) {
    try {
      const balance = await this.props.web3.eth.getBalance(address);
      return balance;
    } catch(err) {
      console.error(err);
    }
  }

  getUsdBalance() {
    try {
      const usdPrice = this.props.wallets[0].price;
      const ethBalance = parseFloat(this.state.balance);
      const usdBalance = usdPrice * ethBalance;
      return usdBalance;
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const { transactions, navigation } = this.props;
    const { textStyle, TransactionListStyle, WalletStyleMiddleContainer } = styles;

    if(!this.props.web3.eth){
      return <Text>loading...</Text>;
    };

    return (
      <ScrollView>
        <CardContainerWithoutFeedback>
          <BalanceTitle>TOTAL BALANCE</BalanceTitle>
          <UsdBalance>{this.state.usdBalance} USD</UsdBalance>
          <EthBalance>{this.state.balance} ETH</EthBalance>
          <ButtonContainer>
            <Button text="Receive" textColor="white" backgroundColor="grey"
            onPress={() => navigation.navigate('Receive')} />
            <Button text="Send" textColor="white" backgroundColor="#01d1e5" onPress={async () => {
              await this.props.getGasPrice();
              navigation.navigate('Send');
            }} />
          </ButtonContainer>
        </CardContainerWithoutFeedback>
        <View>
          <Text>Transaction History</Text>
        </View>
        <Transactions />
      </ScrollView>
    );
  }
};

const styles = {
  textStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  WalletStyleMiddleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

const CardContainerWithoutFeedback = styled.View`
  background: #FFF;
  height: 240px;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
`;

const BalanceTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
`;

const UsdBalance = styled.Text`
  font-size: 32px;
`;

const EthBalance = styled.Text`
  font-size: 16px;
`;

const mapStateToProps = state => {
  return {
    transactions: state.ReducerTransactions.transactions,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    web3: state.ReducerWeb3.web3,
    wallets: state.ReducerWallets.wallets
  }
}

const mapDispatchToProps = {
    getGasPrice,
    getExistingTransactions
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Ethereum));
