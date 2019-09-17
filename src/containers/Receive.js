'use strict';
import React, { Component } from 'react';
import { Clipboard } from 'react-native';
import { RootContainer, HeaderOne, Button } from '../components/common';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Receive extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  async writeToClipboard() {
    await Clipboard.setString(this.props.checksumAddress);
    this.setState({clipboardContent: this.props.checksumAddress});
  }

  renderCheckmark() {
    if(this.state.clipboardContent === null){
      return ;
    } else if (this.state.clipboardContent === this.props.checksumAddress){
      return <Icon name="check" size={24} color="#12BB4F" />;
    }
  }

  render() {
    const { checksumAddress } = this.props;
    return (
      <RootContainer>
        <HeaderOne marginTop="96">Receive</HeaderOne>
        <CardContainer>
          <QrCodeContainer>
            <QRCode value={checksumAddress} size={120} bgColor="#000" fgColor="#FFF" />
          </QrCodeContainer>
          <AddressText>{checksumAddress}</AddressText>
          <CopyAddressContainer>
            <Button
              text="Copy Wallet Address"
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              margin="16px auto"
              opacity="1"
              onPress={async () => {
                await this.writeToClipboard();
                }
              }
            />
            {this.renderCheckmark()}
          </CopyAddressContainer>
        </CardContainer>
      </RootContainer>
    );
  }
}

const CardContainer = styled.View`
  background: #fff;
  border-radius: 8px;
  margin: 16px auto;
  padding: 16px;
  width: 95%;
`;

const QrCodeContainer = styled.View`
  alignItems: center;
  flexDirection: column;
  justifyContent: center;
  margin-bottom: 32px;
`;

const AddressText = styled.Text`
  color: #5F5F5F;
`;

const CopyAddressContainer = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: center;
  margin-top: 16px;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Receive);
