'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

class OfflineNotice extends Component {
  constructor(props) {
    super();
    this.state = {
      isConnected: true,
    };
  }

  componentDidMount() {
    this.setState({ isConnected: this.props.isOnline });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOnline != prevProps.isOnline) {
      this.setState({ isConnected: this.props.isOnline });
    }
  }

  renderOfflineBanner() {
    if (!this.state.isConnected) {
      return (
        <OfflineContainer>
          <OfflineText>Whoops. You're Offline </OfflineText>
          <Icon name="cloud-off-outline" size={18} color="#FFF" />
        </OfflineContainer>
      );
    }
    return null;
  }

  render() {
    return <View>{this.renderOfflineBanner()}</View>;
  }
}

const OfflineContainer = styled.View`
  align-items: center;
  background-color: #fdc800;
  height: 28;
  flex-direction: row;
  justify-content: center;
  top: 36;
  width: 100%;
`;

const OfflineText = styled.Text`
  color: #fff;
  font-family: 'HKGrotesk-Bold';
`;

function mapStateToProps(state) {
  return {
    isOnline: state.ReducerNetInfo.isOnline,
  };
}

export default connect(mapStateToProps)(OfflineNotice);
