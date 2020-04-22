'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Modal, Alert, View } from 'react-native';
import styled from 'styled-components';
import {
  saveTxConfirmationModalVisibility,
  updateVisibleType
} from '../actions/ActionTxConfirmationModal';
import {
  ConfirmationHeader,
  ConfirmationText,
  IsOnlineMessage,
  Loader,
  HeaderTwo,
  TxConfirmationButton
} from '../components/common/';
import NetworkFeeContainerConfirmation from '../containers/NetworkFeeContainerConfirmation';
import I18n from '../i18n/I18n';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';

class TxConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      buttonDisabled: false
    };
  }

  returnHeaderType() {
    if (
      this.props.txConfirmationModal.type === 'compound-deposit' ||
      this.props.txConfirmationModal.type === 'pool-together-deposit' ||
      this.props.txConfirmationModal.type === 'compound-approve' ||
      this.props.txConfirmationModal.type === 'pool-together-approve'
    ) {
      return (
        <ConfirmationHeader>{I18n.t('deposit-amount')}</ConfirmationHeader>
      );
    } else if (
      this.props.txConfirmationModal.type === 'compound-withdraw' ||
      this.props.txConfirmationModal.type === 'pool-together-withdraw'
    ) {
      return (
        <ConfirmationHeader>{I18n.t('withdraw-amount')}</ConfirmationHeader>
      );
    }
  }

  returnCurrency() {
    if (this.props.txConfirmationModal.type === 'send-eth') {
      return 'ETH';
    } else if (this.props.txConfirmationModal.type === 'send-dai') {
      return 'DAI';
    }
  }

  returnButtonType() {
    if (
      this.props.txConfirmationModal.type === 'compound-deposit' ||
      this.props.txConfirmationModal.type === 'pool-together-deposit' ||
      this.props.txConfirmationModal.type === 'compound-approve' ||
      this.props.txConfirmationModal.type === 'pool-together-approve'
    ) {
      return I18n.t('deposit');
    } else if (
      this.props.txConfirmationModal.type === 'compound-withdraw' ||
      this.props.txConfirmationModal.type === 'pool-together-withdraw'
    ) {
      return I18n.t('withdraw');
    }
  }

  renderModalContent() {
    const {
      txConfirmationModal,
      outgoingTransactionData,
      netInfo,
      navigation
    } = this.props;

    if (
      txConfirmationModal.type === 'send-eth' ||
      txConfirmationModal.type === 'send-dai'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            <ConfirmationHeader>{I18n.t('to')}</ConfirmationHeader>
            <ConfirmationText>
              {outgoingTransactionData.send.toaddress}
            </ConfirmationText>
            <ConfirmationHeader>{I18n.t('amount')}</ConfirmationHeader>
            <ConfirmationText>
              {outgoingTransactionData.send.amount} {this.returnCurrency()}
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.send.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={I18n.t('button-send')}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.send.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'Send' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else if (txConfirmationModal.type === 'compound-approve') {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.compound.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.compound.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.approveTransactionObject
                  );
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'EarnHome' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else if (
      txConfirmationModal.type === 'compound-deposit' ||
      txConfirmationModal.type === 'compound-withdraw'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.compound.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.compound.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.compound.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'EarnHome' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else if (txConfirmationModal.type === 'pool-together-approve') {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.poolTogether.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.poolTogether.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether
                      .approveTransactionObject
                  );
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'EarnHome' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else if (
      txConfirmationModal.type === 'pool-together-deposit' ||
      txConfirmationModal.type === 'pool-together-withdraw'
    ) {
      return (
        <View>
          <ConfirmationContainer>
            {this.returnHeaderType()}
            <ConfirmationText>
              {outgoingTransactionData.poolTogether.amount} DAI
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.poolTogether.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={this.returnButtonType()}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.poolTogether.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'EarnHome' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else if (txConfirmationModal.type === 'swap') {
      return (
        <View>
          <ConfirmationContainer>
            <ConfirmationHeader>You Pay</ConfirmationHeader>
            <ConfirmationText>
              {outgoingTransactionData.swap.sold} ETH
            </ConfirmationText>
            <ConfirmationHeader>You Get at Least</ConfirmationHeader>
            <ConfirmationText>
              {outgoingTransactionData.swap.minBought.toFixed(4)} DAI
              <SlippageText>
                *slippage {outgoingTransactionData.swap.slippage} %
              </SlippageText>
            </ConfirmationText>
            <NetworkFeeContainerConfirmation
              gasLimit={outgoingTransactionData.swap.gasLimit}
            />
          </ConfirmationContainer>
          <ButtonContainer>
            <TxConfirmationButton
              text={I18n.t('button-swap')}
              disabled={this.state.buttonDisabled}
              onPress={async () => {
                if (netInfo) {
                  this.setState({ loading: true, buttonDisabled: true });
                  await TransactionUtilities.sendOutgoingTransactionToServer(
                    outgoingTransactionData.swap.transactionObject
                  );
                  navigation.reset(
                    [NavigationActions.navigate({ routeName: 'Swap' })],
                    0
                  );
                  navigation.navigate('History');
                  this.setState({ loading: false, buttonDisabled: false });
                  this.props.saveTxConfirmationModalVisibility(false);
                }
              }}
            />
          </ButtonContainer>
          <Loader animating={this.state.loading} size="small" />
          <IsOnlineMessage netInfo={netInfo} />
        </View>
      );
    } else {
      LogUtilities.logInfo('no type matches ');
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.props.txConfirmationModal.visibility}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <ModalContainer>
          <ModalBackground>
            <CloseButton
              onPress={() => {
                this.props.saveTxConfirmationModalVisibility(false);
                this.props.updateVisibleType(null);
              }}
            >
              <Icon name="chevron-down" color="#5F5F5F" size={24} />
            </CloseButton>
            <HeaderContainer>
              <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
                Confirm Your Transaction
              </HeaderTwo>
            </HeaderContainer>
            <MondalInner>{this.renderModalContent()}</MondalInner>
          </ModalBackground>
        </ModalContainer>
      </Modal>
    );
  }
}

const ConfirmationContainer = styled.View`
  align-items: flex-start;
  background: #fff;
  flex-direction: column;
  justify-content: flex-start;
  padding: 8px 24px;
  text-align: left;
  width: 100%;
`;

const ModalContainer = styled.View`
  align-items: flex-end;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #fff;
  border-radius: 16px;
  height: 50%;
  min-height: 200px;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  margin-left: 16;
  margin-top: 16;
`;

const HeaderContainer = styled.View`
  align-items: center;
`;

const MondalInner = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const SlippageText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

const ButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

function mapStateToProps(state) {
  return {
    netInfo: state.ReducerNetInfo.netInfo,
    outgoingTransactionData:
      state.ReducerOutgoingTransactionData.outgoingTransactionData,
    txConfirmationModal: state.ReducerTxConfirmationModal.txConfirmationModal
  };
}

const mapDispatchToProps = {
  saveTxConfirmationModalVisibility,
  updateVisibleType
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(TxConfirmationModal)
);
