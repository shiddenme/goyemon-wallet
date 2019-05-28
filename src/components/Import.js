'use strict';
import React, { Component } from 'react';
import { Header } from './common';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { saveWeb3 } from '../actions/ActionWeb3';
import { getChecksumAddress } from '../actions/ActionChecksumAddress';

class Import extends Component {
  render() {
    return (
      <Container>
        <Title>Choose your wallet</Title>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  font-size: 40px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 40px;
`;

const mapDispatchToProps = {
  getChecksumAddress,
  saveWeb3
};

export default connect(
  null,
  mapDispatchToProps
)(Import);
