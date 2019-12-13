'use strict';
import FirebaseRegister from '../firebase/FirebaseRegister.ts';
import { store } from '../store/store.js';
import { addSentTransaction } from '../actions/ActionTransactionHistory';
import daiToken from '../contracts/DaiToken';
import WalletUtilities from './WalletUtilities.ts';
import Web3 from 'web3';
import ethTx from 'ethereumjs-tx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class TransactionUtilities {
  parseExistingTransactions(transactions) {
    let parsedTransactions;
    parsedTransactions = transactions.map(transaction => {
      if (transaction.hasOwnProperty('ame_ropsten')) {
        return {
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          gas: transaction.gas,
          gasPrice: transaction.gasPrice,
          value: this.parseEthValue(transaction.value),
          time: transaction.time,
          nonce: parseInt(transaction.nonce),
          state: 'confirmed',
          ame_ropsten: {
            from: transaction.from,
            to: transaction.ame_ropsten.to,
            value: parseInt(transaction.ame_ropsten.value, 16)
          }
        };
      } else if (!transaction.hasOwnProperty('ame_ropsten')) {
        return {
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          gas: transaction.gas,
          gasPrice: transaction.gasPrice,
          value: this.parseEthValue(transaction.value),
          time: transaction.time,
          nonce: parseInt(transaction.nonce),
          state: 'confirmed'
        };
      }
    });

    return parsedTransactions;
  }

  parseSentEthTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: transactionObject.to,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: this.parseEthValue(transactionObject.value),
      time: Math.floor(Date.now() / 1000),
      nonce: transactionObject.nonce,
      state: 'sent'
    };
    return parsedTransaction;
  }

  async parseSentDaiTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: daiToken.daiTokenAddress,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: '0x',
      time: Math.floor(Date.now() / 1000),
      nonce: transactionObject.nonce,
      state: 'sent',
      ame_ropsten: {
        from: checksumAddress,
        to: (await this.decodeTransactionData(transactionObject.data)).to,
        value: (await this.decodeTransactionData(transactionObject.data)).value
      }
    };
    return parsedTransaction;
  }

  parsePendingTransaction(transactionObject) {
    let parsedTransaction;
    if (!transactionObject.hasOwnProperty('ame_ropsten')) {
      parsedTransaction = {
        hash: transactionObject.txhash,
        from: transactionObject.txfrom,
        to: transactionObject.txto,
        gasLimit: transactionObject.gas,
        gasPrice: transactionObject.gasPrice,
        value: this.parseEthValue(transactionObject.value),
        time: transactionObject.timestamp,
        nonce: transactionObject.nonce,
        state: transactionObject.state
      };
    } else if (transactionObject.hasOwnProperty('ame_ropsten')) {
      parsedTransaction = {
        hash: transactionObject.txhash,
        from: transactionObject.txfrom,
        to: transactionObject.txto,
        gasLimit: transactionObject.gas,
        gasPrice: transactionObject.gasPrice,
        value: this.parseEthValue(transactionObject.value),
        time: transactionObject.timestamp,
        nonce: transactionObject.nonce,
        state: transactionObject.state,
        ame_ropsten: {
          from: (JSON.parse(transactionObject.ame_ropsten)).from,
          to: (JSON.parse(transactionObject.ame_ropsten)).to,
          value: parseInt((JSON.parse(transactionObject.ame_ropsten)).value, 16)
        }
      };
    }
    return parsedTransaction;
  }

  parseEthValue(value) {
    const bigNumberValue = Web3.utils.toBN(value).toString();
    const parsedEtherValue = Web3.utils.fromWei(bigNumberValue);
    return parsedEtherValue;
  }

  parseDaiValue(value) {
    const parsedDaiValue = parseInt(value, 16) / 10 ** 18;
    return parsedDaiValue;
  }

  parseTransactionTime(timestamp) {
    const time = new Date(timestamp * 1000);
    const seconds = Math.floor((new Date() - time) / 1000);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    if (seconds < 5) {
      return 'just now';
    } else if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      if (minutes > 1) return `${minutes} minutes ago`;
      return '1 minute ago';
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      if (hours > 1) return `${hours} hours ago`;
      return '1 hour ago';
    }
    //2 days and no more
    else if (seconds < 172800) {
      const days = Math.floor(seconds / 86400);
      if (days > 1) return `${days} days ago`;
      return '1 day ago';
    }
    return `${time.getDate().toString()} ${months[time.getMonth()]}, ` + `\n${time.getFullYear()}`;
  }

  async decodeTransactionData(transactionData) {
    const infuraId = '884958b4538343aaa814e3a32718ce91';
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${this.infuraId}`)
    );

    const decodedAbi = await web3.eth.abi.decodeParameters(
      ['address', 'uint256'],
      transactionData.substring(10, transactionData.length)
    );
    const to = decodedAbi[0];
    const value = decodedAbi[1].toString(16);
    return { to, value };
  }

  getBiggestNonce() {
    const stateTree = store.getState();
    const transactions = stateTree.ReducerTransactionHistory.transactions;
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;

    const array = [];
    transactions.map(transaction => {
      if (Web3.utils.toChecksumAddress(transaction.from) === checksumAddress) {
        array.push(transaction.nonce);
      }
    });
    let biggestNonce = 0;
    for (let i = 0; i <= biggestNonce; i++) {
      if (array[i] > biggestNonce) {
        biggestNonce = array[i];
      }
    }

    return biggestNonce;
  }

  async constructSignedOutgoingTransactionObject(outgoingTransactionObject) {
    outgoingTransactionObject = new ethTx(outgoingTransactionObject);
    let privateKey = await WalletUtilities.retrievePrivateKey();
    privateKey = Buffer.from(privateKey, 'hex');
    outgoingTransactionObject.sign(privateKey);
    let signedTransaction = outgoingTransactionObject.serialize();
    signedTransaction = `0x${signedTransaction.toString('hex')}`;
    return signedTransaction;
  }

  async sendOutgoingTransactionToServer(outgoingTransactionObject) {
    const messageId = uuidv4();
    const serverAddress = '255097673919@gcm.googleapis.com';
    const signedTransaction = await this.constructSignedOutgoingTransactionObject(
      outgoingTransactionObject
    );

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        signedTransaction
      });
    firebase.messaging().sendMessage(upstreamMessage);

    store.dispatch(addSentTransaction(outgoingTransactionObject));
  }
}

export default new TransactionUtilities();
