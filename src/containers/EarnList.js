'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour,
  TouchableCardContainer
} from '../components/common';
import FcmUpstreamMessages from '../firebase/FcmUpstreamMessages.ts';
import PriceUtilities from '../utilities/PriceUtilities.js';

class EarnList extends Component {
  async componentDidMount() {
    await FcmUpstreamMessages.requestCDaiLendingInfo(this.props.checksumAddress);
  }

  getUsdValue(daiBalance) {
    let usdValue = parseFloat(PriceUtilities.convertDaiToUsd(daiBalance));
    usdValue = parseFloat(usdValue).toFixed(2);
    return usdValue;
  }

  render() {
    const { cDaiLendingInfo, navigation } = this.props;
    const currentRate = cDaiLendingInfo.currentRate / 10 ** 18;

    return (
      <RootContainer>
        <HeaderOne marginTop="64">Earn</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="left"
          width="90%"
        >
          <HeaderFour marginTop="24">total savings balance</HeaderFour>
          <BalanceText>${this.getUsdValue(cDaiLendingInfo.daiSavingsBalance)}</BalanceText>
          <InterestEarnedTextContainer>
            <InterestEarnedText>
              ${this.getUsdValue(cDaiLendingInfo.lifetimeEarned)}
            </InterestEarnedText>
            <Text> earned!</Text>
          </InterestEarnedTextContainer>
        </UntouchableCardContainer>
        <HeaderThree color="#000" marginBottom="16" marginLeft="16" marginTop="16">
          YOUR ACCOUNTS
        </HeaderThree>
        <TouchableCardContainer
          alignItems="center"
          flexDirection="row"
          height="160px"
          justifyContent="center"
          textAlign="center"
          width="85%"
          onPress={() => {
            navigation.navigate('EarnDai');
          }}
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <Text>Dai</Text>
          </CoinImageContainer>
          <TitleContainer>
            <TitleText>savings balance</TitleText>
            <TitleText>interest rate</TitleText>
            <TitleText>interest earned</TitleText>
          </TitleContainer>
          <ValueContainer>
            <ValueText>{cDaiLendingInfo.daiSavingsBalance} DAI</ValueText>
            <ValueText>{currentRate}%</ValueText>
            <DaiInterestEarnedText>{cDaiLendingInfo.lifetimeEarned} DAI</DaiInterestEarnedText>
          </ValueContainer>
        </TouchableCardContainer>
      </RootContainer>
    );
  }
}

const BalanceText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 32;
`;

const InterestEarnedTextContainer = styled.Text`
  font-family: 'HKGrotesk-Regular';
  margin-top: 16;
`;

const InterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
`;

const CoinImageContainer = styled.View`
  align-items: center;
  width: 16%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  margin-bottom: 8;
  width: 40px;
`;

const TitleContainer = styled.View`
  margin-left: 8;
  width: 42%;
`;

const TitleText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 8;
`;

const ValueContainer = styled.View`
  margin-left: 12;
  width: 42%;
`;

const ValueText = styled.Text`
  color: #000;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 4;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  font-weight: bold;
  margin-bottom: 4;
`;

function mapStateToProps(state) {
  return {
    cDaiLendingInfo: state.ReducerCDaiLendingInfo.cDaiLendingInfo,
    checksumAddress: state.ReducerChecksumAddress.checksumAddress
  };
}

export default withNavigation(connect(mapStateToProps)(EarnList));