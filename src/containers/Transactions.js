'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import { addNewTransaction } from '../actions/ActionTransactionHistory';

class Transactions extends Component {
  render() {
  renderTransactions(){
    const { transactions } = this.props;
    if(transactions) {
      return (
        <View>
          {transactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </View>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderTransactions()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
    transactions: state.ReducerTransactions.transactions
  });
  transactions: state.ReducerTransactionHistory.transactions

export default connect(mapStateToProps)(Transactions);
