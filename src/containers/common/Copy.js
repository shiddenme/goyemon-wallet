'use strict';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Clipboard, View } from 'react-native';
import styled from 'styled-components/native';
import { CopyIcon } from '../../components/common';
import I18n from '../../i18n/I18n';

class Copy extends Component {
  constructor(props) {
    super();
    this.state = {
      clipboardContent: null
    };
  }

  fadeOutUp = () =>
    this.view
      .fadeOutUp(800)
      .then((endState) =>
        console.log(
          endState.finished ? 'fadeOutUp finished' : 'fadeOutUp cancelled'
        )
      );

  async writeToClipboard(clipboardContent) {
    await Clipboard.setString(clipboardContent);
    this.setState({ clipboardContent });
  }

  renderAnimation() {
    const handleViewRef = (ref) => (this.view = ref);
    if (this.props.animation) {
      return <CopyAnimation ref={handleViewRef}>❤️</CopyAnimation>;
    } else {
      return <CopyAnimation ref={handleViewRef}></CopyAnimation>;
    }
  }

  renderCopyText(text) {
    if (this.state.clipboardContent === text) {
      return (
        <CopyAddressContainer>
          {this.renderAnimation()}
          <CopyAddress
            onPress={async () => {
              await this.writeToClipboard(text);
              this.fadeOutUp();
            }}
          >
            {this.props.icon ? <CopyIcon /> : null}
            <CopyAddressText>Copied</CopyAddressText>
          </CopyAddress>
        </CopyAddressContainer>
      );
    } else if (this.state.clipboardContent === null) {
      return (
        <CopiedAddressContainer marginTop={this.props.marginTop}>
          <CopyAddress
            onPress={async () => {
              await this.writeToClipboard(text);
              this.fadeOutUp();
            }}
          >
            {this.props.icon ? <CopyIcon /> : null}
            <CopyAddressText>{I18n.t('copy')}</CopyAddressText>
          </CopyAddress>
        </CopiedAddressContainer>
      );
    }
  }

  render() {
    return <View>{this.renderCopyText(this.props.text)}</View>;
  }
}

const CopyAddressContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const CopiedAddressContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: ${(props) => props.marginTop};
`;

const CopyAnimation = Animatable.createAnimatableComponent(styled.Text``);

const CopyAddress = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
`;

const CopyAddressText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 14;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default connect(mapStateToProps)(Copy);
