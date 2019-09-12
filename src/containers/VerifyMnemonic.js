'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { RootContainer, ProgressBar, Button, HeaderOne } from '../components/common';
import { connect } from 'react-redux';
import WalletController from '../wallet-core/WalletController.ts';
import EthUtils from '../wallet-core/EthUtils.js';
import { createChecksumAddress } from '../actions/ActionChecksumAddress';
import { getEthPrice, getDaiPrice } from '../actions/ActionPrice';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class VerifyMnemonic extends Component {
  constructor() {
    super();
    this.state = {
      mnemonicWords: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      mnemonicWordsValidation: true
    };
  }

  async savePrivateKey() {
    const privateKey = await WalletController.createPrivateKey();
    await WalletController.setPrivateKey(privateKey);
  }

  async registerEthereumAddress() {
    const messageId = uuidv4();
    const serverAddress = '400937673843@gcm.googleapis.com';
    const checksumAddressWithoutPrefix = EthUtils.stripHexPrefix(this.props.checksumAddress);

    const upstreamMessage = new firebase.messaging.RemoteMessage()
      .setMessageId(messageId)
      .setTo(serverAddress)
      .setData({
        register: 'true',
        address: checksumAddressWithoutPrefix
      });
    firebase.messaging().sendMessage(upstreamMessage);
  }

  async validateForm() {
    const mnemonicWords = this.state.mnemonicWords.join(" ");

    if (WalletController.validateMnemonic(mnemonicWords) && (mnemonicWords === this.props.mnemonicWords)) {
      this.setState({mnemonicWordsValidation: true});
      await WalletController.setMnemonic(mnemonicWords);
      await WalletController.generateWallet(mnemonicWords);
      await this.savePrivateKey();
      await this.props.createChecksumAddress();
      await this.registerEthereumAddress();
      await this.props.getEthPrice();
      await this.props.getDaiPrice();
      this.props.navigation.navigate('NotificationPermissionTutorial');
    } else {
      this.setState({mnemonicWordsValidation: false});
      console.log('form validation failed!');
    }
  }

  handleTextChange = (text, id) => {
    const mnemonicWords = this.state.mnemonicWords;
    mnemonicWords[id] = text;

    this.setState({ mnemonicWords });
  };

  render() {
    const { mnemonicWords } = this.state;

    return (
      <RootContainer>
        <ProgressBar
          text="2"
          width="67%"
        />
        <Container>
          <Text>Please write down a list of words again.</Text>
          <MnemonicWordsContainer style={styles.table}>
            {this.state.mnemonicWords.map((word, id) => (
              <View style={styles.cell} key={id}>
                <MnemonicWordWrapper>
                  <TextInput
                    style={{ textAlign: 'center', padding: 4 }}
                    placeholder={(id + 1).toString()}
                    autoCapitalize="none"
                    maxLength={15}
                    onChangeText={text => {
                      this.handleTextChange(text, id);
                    }}
                  />
                </MnemonicWordWrapper>
              </View>
            ))}
          </MnemonicWordsContainer>
          <Button
            text="Verify"
            textColor="white"
            backgroundColor="#009DC4"
            margin="24px auto"
            opacity="1"
            onPress={async () => {
              await this.validateForm();
            }}
          />
        </Container>
      </RootContainer>
    );
  }
}

const styles = StyleSheet.create({
  table: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cell: {
    flexBasis: '25%',
    flex: 1,
    marginBottom: 8
  }
});

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
`;

const MnemonicWordsContainer = styled.View`
  margin-bottom: 24px;
  margin-top: 24px;
  width: 95%;
`;

const MnemonicWordWrapper = styled.View`
  background: #fff;
  border-color: #f8f8f8;
  border-radius: 16px;
  border-width: 4px;
  text-align: center;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    mnemonicWords: state.ReducerMnemonic.mnemonicWords
  };
}

const mapDispatchToProps = {
  createChecksumAddress,
  getEthPrice,
  getDaiPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonic);
