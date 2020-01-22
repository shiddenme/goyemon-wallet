'use strict';
import React, { Component } from 'react';
import { Clipboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RootContainer, HeaderOne, HeaderThree, CrypterestText } from '../components/common';

class DeviceInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.fcmToken);
    this.setState({ clipboardContent: this.props.fcmToken });
  }

  renderCopyText() {
    if (this.state.clipboardContent === this.props.fcmToken) {
      return (
        <CopiedAddressContainer>
          <TouchableWithoutFeedback
            onPress={async () => {
              await this.writeToClipboard();
            }}
          >
            <CopiedAddressText>Copied</CopiedAddressText>
          </TouchableWithoutFeedback>
          <Icon name="check" size={24} color="#00A3E2" />
        </CopiedAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            await this.writeToClipboard();
          }}
        >
          <CopyAddressText>Copy</CopyAddressText>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    return (
      <RootContainer>
      <HeaderOne marginTop="96">Device Info</HeaderOne>
        <Container>
          <HeaderThree color="#000" marginBottom="0" marginLeft="0" marginTop="24">
            Fcm Token
          </HeaderThree>
          <CrypterestText fontSize="14">
            {this.props.fcmToken}
          </CrypterestText>
          {this.renderCopyText()}
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  align-items: flex-start;
  margin: 0 auto;
  flex-direction: column;
  justify-content: center;
  width: 90%;
`;
const CopiedAddressContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const CopiedAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-right: 4;
`;

const CopyAddressText = styled.Text`
  color: #00a3e2;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
`;

function mapStateToProps(state) {
  return {
    fcmToken: state.ReducerFcmToken.fcmToken
  };
}

export default connect(mapStateToProps)(DeviceInfo);