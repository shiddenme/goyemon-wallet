'use strict';
import BigNumber from 'bignumber.js';
import ethTx from 'ethereumjs-tx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import Web3 from 'web3';
import { incrementTotalTransactions } from '../actions/ActionTotalTransactions';
import { addSentTransaction } from '../actions/ActionTransactionHistory';
const GlobalConfig = require('../config.json');
import { store } from '../store/store.js';
import LogUtilities from '../utilities/LogUtilities.js';
import PriceUtilities from '../utilities/PriceUtilities.js';
import WalletUtilities from './WalletUtilities.ts';

class TransactionUtilities {
  filterTransactions(transactions) {
    const filteredTransactions = Object.entries(transactions).filter(
      transaction => {
        if (transaction[0] != '_contracts') {
          return true;
        }
      }
    );
    return filteredTransactions;
  }

  sortTransactions(transactions) {
    const sortedTransactions = transactions.sort((a, b) => b[1][6] - a[1][6]);
    return sortedTransactions;
  }

  parseExistingTransactions(transactions) {
    transactions = this.filterTransactions(transactions);
    transactions = this.sortTransactions(transactions);

    let parsedTransactions;
    parsedTransactions = transactions.map(transaction => {
      const isContractTx = !(typeof transaction[1][8] === 'undefined');
      if (!isContractTx) {
        return {
          hash: transaction[0],
          from: transaction[1][0],
          to: transaction[1][1],
          gas: transaction[1][2],
          gasPrice: transaction[1][3],
          value: this.parseEthValue(transaction[1][4]),
          nonce: parseInt(transaction[1][5]),
          time: transaction[1][6],
          state: this.returnState(transaction[1][7])
        };
      } else if (isContractTx) {
        const tokenObject = transaction[1][8];
        const tokenName = Object.keys(tokenObject)[0];

        if (tokenName === 'ame_ropsten') {
          const isAmeTransferTx =
            Object.keys(tokenObject.ame_ropsten)[0] === 'tr';
          const isAmeApproveTx =
            Object.keys(tokenObject.ame_ropsten)[0] === 'appr';

          if (isAmeTransferTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              ame_ropsten_tr: {
                from: tokenObject.ame_ropsten.tr[0][0],
                to: tokenObject.ame_ropsten.tr[0][1],
                value: this.parseHexDaiValue(tokenObject.ame_ropsten.tr[0][2])
              }
            };
          } else if (isAmeApproveTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              ame_ropsten_appr: {
                owner: tokenObject.ame_ropsten.appr[0][0],
                spender: tokenObject.ame_ropsten.appr[0][1],
                amount: this.parseHexDaiValue(
                  tokenObject.ame_ropsten.appr[0][2]
                )
              }
            };
          }
          LogUtilities.logInfo('transaction ===>', transaction);
        } else if (tokenName === 'dai') {
          const isDaiTransferTx = Object.keys(tokenObject.dai)[0] === 'tr';
          const isDaiApproveTx = Object.keys(tokenObject.dai)[0] === 'appr';
          if (isDaiTransferTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              dai_tr: {
                from: tokenObject.dai.tr[0][0],
                to: tokenObject.dai.tr[0][1],
                value: this.parseHexDaiValue(tokenObject.dai.tr[0][2])
              }
            };
          } else if (isDaiApproveTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              dai_appr: {
                owner: tokenObject.dai.appr[0][0],
                spender: tokenObject.dai.appr[0][1],
                amount: tokenObject.dai.appr[0][2]
              }
            };
          }
          LogUtilities.logInfo('transaction ===>', transaction);
        } else if (tokenName === 'cdai') {
          const isCDaiMintTx =
            Object.keys(tokenObject.cdai)[0] === 'mint' ||
            Object.keys(tokenObject.cdai)[1] === 'mint';
          const isCDaiRedeemUnderlyingTx =
            Object.keys(tokenObject.cdai)[0] === 'redeem' ||
            Object.keys(tokenObject.cdai)[1] === 'redeem';
          const isCDaiFailedTx = Object.keys(tokenObject.cdai)[0] === 'failure';
          if (isCDaiMintTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              cdai_mint: {
                minter: tokenObject.cdai.mint[0][0],
                daiDeposited: this.parseHexDaiValue(
                  tokenObject.cdai.mint[0][1]
                ),
                cDaiMinted: this.parseHexCDaiValue(tokenObject.cdai.mint[0][2])
              }
            };
          } else if (isCDaiRedeemUnderlyingTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              cdai_redeem: {
                redeemer: tokenObject.cdai.redeem[0][0],
                daiWithdrawn: this.parseHexDaiValue(
                  tokenObject.cdai.redeem[0][1]
                ),
                cDaiRepayed: this.parseHexCDaiValue(
                  tokenObject.cdai.redeem[0][2]
                )
              }
            };
          } else if (isCDaiFailedTx) {
            return {
              hash: transaction[0],
              from: transaction[1][0],
              to: transaction[1][1],
              gas: transaction[1][2],
              gasPrice: transaction[1][3],
              value: this.parseEthValue(transaction[1][4]),
              nonce: parseInt(transaction[1][5]),
              time: transaction[1][6],
              state: this.returnState(transaction[1][7]),
              cdai_failed: {
                errorCodes: parseInt(tokenObject.cdai.failure[0][0], 16),
                failureInfo: parseInt(tokenObject.cdai.failure[0][1], 16),
                detail: parseInt(tokenObject.cdai.failure[0][2], 16)
              }
            };
          }
          return {
            hash: transaction[0],
            from: transaction[1][0],
            to: transaction[1][1],
            gas: transaction[1][2],
            gasPrice: transaction[1][3],
            value: this.parseEthValue(transaction[1][4]),
            nonce: parseInt(transaction[1][5]),
            time: transaction[1][6],
            state: this.returnState(transaction[1][7])
          };
        } else if (tokenName != ('dai' || 'cdai' || 'ame_ropsten')) {
          return {
            hash: transaction[0],
            from: transaction[1][0],
            to: transaction[1][1],
            gas: transaction[1][2],
            gasPrice: transaction[1][3],
            value: this.parseEthValue(transaction[1][4]),
            nonce: parseInt(transaction[1][5]),
            time: transaction[1][6],
            state: this.returnState(transaction[1][7])
          };
        }
      } else {
        LogUtilities.logInfo('transaction ===>', transaction);
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
      nonce: parseInt(transactionObject.nonce, 16),
      state: 'sent'
    };
    return parsedTransaction;
  }

  async parseSentDaiTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const outgoingDaiTransactionData =
      stateTree.ReducerOutgoingDaiTransactionData.outgoingDaiTransactionData;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: GlobalConfig.DAIcontract,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: '0x',
      time: Math.floor(Date.now() / 1000),
      nonce: parseInt(transactionObject.nonce, 16),
      state: 'sent',
      dai_tr: {
        from: checksumAddress,
        to: outgoingDaiTransactionData.toAddress,
        value: outgoingDaiTransactionData.amount
      }
    };
    return parsedTransaction;
  }

  async parseSentDaiApproveTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const outgoingDaiTransactionData =
      stateTree.ReducerOutgoingDaiTransactionData.outgoingDaiTransactionData;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: GlobalConfig.DAIcontract,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: '0x',
      time: Math.floor(Date.now() / 1000),
      nonce: parseInt(transactionObject.nonce, 16),
      state: 'sent',
      dai_appr: {
        owner: checksumAddress,
        spender: checksumAddress,
        amount: outgoingDaiTransactionData.approveAmount
      }
    };
    return parsedTransaction;
  }

  async parseSentCDaiMintTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const outgoingDaiTransactionData =
      stateTree.ReducerOutgoingDaiTransactionData.outgoingDaiTransactionData;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: GlobalConfig.cDAIcontract,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: '0x',
      time: Math.floor(Date.now() / 1000),
      nonce: parseInt(transactionObject.nonce, 16),
      state: 'sent',
      cdai_mint: {
        minter: checksumAddress,
        daiDeposited: outgoingDaiTransactionData.amount
      }
    };
    return parsedTransaction;
  }

  async parseSentCDaiRedeemUnderlyingTransaction(transactionObject) {
    const stateTree = store.getState();
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const outgoingDaiTransactionData =
      stateTree.ReducerOutgoingDaiTransactionData.outgoingDaiTransactionData;
    const parsedTransaction = {
      hash: uuidv4(),
      from: checksumAddress,
      to: GlobalConfig.cDAIcontract,
      gasLimit: transactionObject.gasLimit,
      gasPrice: transactionObject.gasPrice,
      value: '0x',
      time: Math.floor(Date.now() / 1000),
      nonce: parseInt(transactionObject.nonce, 16),
      state: 'sent',
      cdai_redeem: {
        redeemer: checksumAddress,
        daiWithdrawn: outgoingDaiTransactionData.amount
      }
    };
    return parsedTransaction;
  }

  parsePendingOrIncludedTransaction(transactionObject) {
    let parsedTransaction;
    const txHashKey = Object.keys(transactionObject)[0];
    const isContractTx = !(
      typeof transactionObject[txHashKey][8] === 'undefined'
    );

    if (!isContractTx) {
      parsedTransaction = {
        hash: txHashKey,
        from: transactionObject[txHashKey][0],
        to: transactionObject[txHashKey][1],
        gasLimit: transactionObject[txHashKey][2],
        gasPrice: transactionObject[txHashKey][3],
        value: this.parseEthValue(transactionObject[txHashKey][4]),
        nonce: parseInt(transactionObject[txHashKey][5], 16),
        time: transactionObject[txHashKey][6],
        state: this.returnState(transactionObject[txHashKey][7])
      };
    } else if (isContractTx) {
      const tokenObject = transactionObject[txHashKey][8];
      const tokenName = Object.keys(tokenObject)[0];

      if (tokenName === 'dai') {
        const isDaiTransferTx = Object.keys(tokenObject.dai)[0] === 'tr';
        const isDaiApproveTx = Object.keys(tokenObject.dai)[0] === 'appr';

        if (isDaiTransferTx) {
          parsedTransaction = {
            hash: txHashKey,
            from: transactionObject[txHashKey][0],
            to: transactionObject[txHashKey][1],
            gasLimit: transactionObject[txHashKey][2],
            gasPrice: transactionObject[txHashKey][3],
            value: this.parseEthValue(transactionObject[txHashKey][4]),
            nonce: parseInt(transactionObject[txHashKey][5], 16),
            time: transactionObject[txHashKey][6],
            state: this.returnState(transactionObject[txHashKey][7]),
            dai_tr: {
              from: tokenObject.dai.tr[0][0],
              to: tokenObject.dai.tr[0][1],
              value: this.parseHexDaiValue(tokenObject.dai.tr[0][2])
            }
          };
        } else if (isDaiApproveTx) {
          parsedTransaction = {
            hash: txHashKey,
            from: transactionObject[txHashKey][0],
            to: transactionObject[txHashKey][1],
            gasLimit: transactionObject[txHashKey][2],
            gasPrice: transactionObject[txHashKey][3],
            value: this.parseEthValue(transactionObject[txHashKey][4]),
            nonce: parseInt(transactionObject[txHashKey][5], 16),
            time: transactionObject[txHashKey][6],
            state: this.returnState(transactionObject[txHashKey][7]),
            dai_appr: {
              owner: tokenObject.dai.appr[0][0],
              spender: tokenObject.dai.appr[0][1],
              amount: tokenObject.dai.appr[0][2]
            }
          };
        }
      } else if (tokenName === 'cdai') {
        const isCDaiMintTx = Object.keys(tokenObject.cdai)[0] === 'mint';
        const isCDaiRedeemUnderlyingTx =
          Object.keys(tokenObject.cdai)[0] === 'redeem';
        const isCDaiFailedTx = Object.keys(tokenObject.cdai)[0] === 'failure';

        if (isCDaiMintTx) {
          parsedTransaction = {
            hash: txHashKey,
            from: transactionObject[txHashKey][0],
            to: transactionObject[txHashKey][1],
            gasLimit: transactionObject[txHashKey][2],
            gasPrice: transactionObject[txHashKey][3],
            value: this.parseEthValue(transactionObject[txHashKey][4]),
            nonce: parseInt(transactionObject[txHashKey][5], 16),
            time: transactionObject[txHashKey][6],
            state: this.returnState(transactionObject[txHashKey][7]),
            cdai_mint: {
              minter: tokenObject.cdai.mint[0][0],
              daiDeposited: this.parseHexDaiValue(tokenObject.cdai.mint[0][1]),
              cDaiMinted: this.parseHexCDaiValue(tokenObject.cdai.mint[0][2])
            }
          };
        } else if (isCDaiRedeemUnderlyingTx) {
          parsedTransaction = {
            hash: txHashKey,
            from: transactionObject[txHashKey][0],
            to: transactionObject[txHashKey][1],
            gasLimit: transactionObject[txHashKey][2],
            gasPrice: transactionObject[txHashKey][3],
            value: this.parseEthValue(transactionObject[txHashKey][4]),
            nonce: parseInt(transactionObject[txHashKey][5], 16),
            time: transactionObject[txHashKey][6],
            state: this.returnState(transactionObject[txHashKey][7]),
            cdai_redeem: {
              redeemer: tokenObject.cdai.redeem[0][0],
              daiWithdrawn: this.parseHexDaiValue(
                tokenObject.cdai.redeem[0][1]
              ),
              cDaiRepayed: this.parseHexCDaiValue(tokenObject.cdai.redeem[0][2])
            }
          };
        } else if (isCDaiFailedTx) {
          LogUtilities.logInfo('isCDaiFailedTx');
          parsedTransaction = {
            hash: txHashKey,
            from: transactionObject[txHashKey][0],
            to: transactionObject[txHashKey][1],
            gasLimit: transactionObject[txHashKey][2],
            gasPrice: transactionObject[txHashKey][3],
            value: this.parseEthValue(transactionObject[txHashKey][4]),
            nonce: parseInt(transactionObject[txHashKey][5], 16),
            time: transactionObject[txHashKey][6],
            state: this.returnState(transactionObject[txHashKey][7]),
            cdai_failed: {
              errorCodes: parseInt(tokenObject.cdai.failure[0][0], 16),
              failureInfo: parseInt(tokenObject.cdai.failure[0][1], 16),
              detail: parseInt(tokenObject.cdai.failure[0][2], 16)
            }
          };
        }
      } else if (tokenName != ('dai' || 'cdai')) {
        parsedTransaction = {
          hash: txHashKey,
          from: transactionObject[txHashKey][0],
          to: transactionObject[txHashKey][1],
          gasLimit: transactionObject[txHashKey][2],
          gasPrice: transactionObject[txHashKey][3],
          value: this.parseEthValue(transactionObject[txHashKey][4]),
          nonce: parseInt(transactionObject[txHashKey][5], 16),
          time: transactionObject[txHashKey][6],
          state: this.returnState(transactionObject[txHashKey][7])
        };
      }
    }
    return parsedTransaction;
  }

  parseConfirmedTransaction(transactionObject) {
    const txHashKey = Object.keys(transactionObject)[0];
    let parsedTransaction;
    parsedTransaction = {
      hash: txHashKey,
      time: transactionObject[txHashKey][6],
      state: this.returnState(transactionObject[txHashKey][7])
    };
    return parsedTransaction;
  }

  returnState(state) {
    if (state === 1) {
      return 'pending';
    } else if (state === 2) {
      return 'included';
    } else if (state === 3) {
      return 'confirmed';
    }
  }

  parseEthValue(value) {
    if (value != null) {
      const bigNumberValue = Web3.utils.toBN(value).toString();
      const parsedEtherValue = Web3.utils.fromWei(bigNumberValue);
      return parsedEtherValue;
    }
    return null;
  }

  parseHexDaiValue(value) {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });
    const parsedDaiValue = RoundDownBigNumber(parseInt(value, 16))
      .div(new BigNumber(10).pow(18))
      .toString();
    return parsedDaiValue;
  }

  parseHexCDaiValue(value) {
    const RoundDownBigNumber = BigNumber.clone({
      DECIMAL_PLACES: 4,
      ROUNDING_MODE: BigNumber.ROUND_DOWN
    });

    const parsedDaiValue = RoundDownBigNumber(parseInt(value, 16))
      .div(new BigNumber(10).pow(8))
      .toString();
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
    return (
      `${time.getDate().toString()} ${months[time.getMonth()]}, ` +
      `\n${time.getFullYear()}`
    );
  }

  isDaiApproved(transactions) {
    const daiApproveTxes = transactions.filter(transaction => {
      if (
        transaction.hasOwnProperty('dai_appr') &&
        (transaction.state === 'included' || transaction.state === 'confirmed')
      ) {
        return true;
      }
    });

    const isDaiApproved = daiApproveTxes.some(
      daiApproveTx =>
        daiApproveTx.dai_appr.amount ===
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    );

    return isDaiApproved;
  }

  getTransactionNonce() {
    const stateTree = store.getState();
    const transactions = stateTree.ReducerTransactionHistory.transactions;
    const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
    const outgoingTransactions = transactions.filter(transaction => {
      if (!transaction.from || transaction.state === 'error') return false;
      if (Web3.utils.toChecksumAddress(transaction.from) === checksumAddress) {
        return true;
      }
    });
    const transactionNonce = outgoingTransactions.length;

    return transactionNonce;
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
    const serverAddress = GlobalConfig.FCM_server_address;
    const signedTransaction = await this.constructSignedOutgoingTransactionObject(
      outgoingTransactionObject
    );
    const nonce = parseInt(outgoingTransactionObject.nonce, 16);

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        type: 'outgoing_tx',
        nonce: nonce.toString(),
        data: signedTransaction
      });
    firebase.messaging().sendMessage(upstreamMessage);

    store.dispatch(addSentTransaction(outgoingTransactionObject));
    store.dispatch(incrementTotalTransactions());
  }

  getTransactionFeeEstimateInEther(gasPriceWei, gasLimit) {
    const transactionFeeEstimateWei = parseFloat(gasPriceWei) * gasLimit;
    const transactionFeeEstimateInEther = Web3.utils.fromWei(
      transactionFeeEstimateWei.toString(),
      'Ether'
    );
    return transactionFeeEstimateInEther;
  }

  getTransactionFeeEstimateInUsd(gasPriceWei, gasLimit) {
    let transactionFeeEstimateInUsd = PriceUtilities.convertEthToUsd(
      this.getTransactionFeeEstimateInEther(gasPriceWei, gasLimit)
    );
    transactionFeeEstimateInUsd = transactionFeeEstimateInUsd.toFixed(3);
    return transactionFeeEstimateInUsd;
  }
}

export default new TransactionUtilities();
