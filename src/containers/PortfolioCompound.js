'use strict';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import {
  RootContainer,
  UntouchableCardContainer,
  HeaderOne,
  HeaderThree,
  HeaderFour
} from '../components/common';
import I18n from '../i18n/I18n';
import { FCMMsgs } from '../lib/fcm.js';
import { RoundDownBigNumber } from '../utilities/BigNumberUtilities';
import PriceUtilities from '../utilities/PriceUtilities.js';

class PortfolioCompound extends Component {
  componentDidMount() {
    FCMMsgs.requestCompoundDaiInfo(this.props.checksumAddress);
  }

  render() {
    const { balance, compound } = this.props;
    const currentInterestRate = new BigNumber(compound.dai.currentInterestRate)
      .div(new BigNumber(10).pow(24))
      .toFixed(2);

    const compoundDaiBalance = RoundDownBigNumber(balance.compoundDai)
      .div(new RoundDownBigNumber(10).pow(36))
      .toFixed(2);

    const lifetimeEarnedInDai = RoundDownBigNumber(compound.dai.lifetimeEarned)
      .div(new RoundDownBigNumber(10).pow(36))
      .toString();

    return (
      <RootContainer>
        <HeaderOne marginTop="112">Compound</HeaderOne>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="column"
          height="176px"
          justifyContent="center"
          marginTop="24px"
          textAlign="center"
          width="90%"
        >
          <HeaderFour marginTop="24">
            {I18n.t('portfolio-compound-totalsavings')}
          </HeaderFour>
          <BalanceText>
            $
            {parseFloat(
              PriceUtilities.convertDaiToUsd(compoundDaiBalance)
            ).toFixed(2)}
          </BalanceText>
          <InterestEarnedTextContainer>
            <InterestEarnedText>
              $
              {parseFloat(
                PriceUtilities.convertDaiToUsd(lifetimeEarnedInDai)
              ).toFixed(4)}
            </InterestEarnedText>
            <Text> earned! </Text>
          </InterestEarnedTextContainer>
        </UntouchableCardContainer>
        <HeaderThree
          color="#000"
          marginBottom="0"
          marginLeft="24"
          marginTop="0"
        >
          {I18n.t('portfolio-compound-coins')}
        </HeaderThree>
        <UntouchableCardContainer
          alignItems="center"
          borderRadius="8"
          flexDirection="row"
          height="144px"
          justifyContent="space-between"
          marginTop={8}
          textAlign="left"
          width="90%"
        >
          <CoinImageContainer>
            <CoinImage source={require('../../assets/dai_icon.png')} />
            <CoinText>DAI</CoinText>
          </CoinImageContainer>
          <TitleContainer>
            <TitleText>{I18n.t('portfolio-compound-dai-savings')}</TitleText>
            <TitleText>{I18n.t('portfolio-compound-yearly-rate')}</TitleText>
            <TitleText>
              {I18n.t('portfolio-compound-interest-earned')}
            </TitleText>
          </TitleContainer>
          <ValueContainer>
            <ValueText>{compoundDaiBalance} DAI</ValueText>
            <ValueText>{currentInterestRate}%</ValueText>
            <DaiInterestEarnedText>
              {lifetimeEarnedInDai} DAI
            </DaiInterestEarnedText>
          </ValueContainer>
        </UntouchableCardContainer>
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
  width: 15%;
`;

const CoinImage = styled.Image`
  border-radius: 20px;
  height: 40px;
  width: 40px;
`;

const CoinText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 16;
  margin-top: 4;
`;

const TitleContainer = styled.View`
  margin-left: 16;
  width: 42.5%;
`;

const TitleText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-bottom: 8;
`;

const ValueContainer = styled.View`
  margin-left: 12;
  width: 42.5%;
`;

const ValueText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 18;
  margin-bottom: 8;
`;

const DaiInterestEarnedText = styled.Text`
  color: #1ba548;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  font-weight: bold;
  margin-bottom: 4;
`;

const mapStateToProps = (state) => ({
  balance: state.ReducerBalance.balance,
  compound: state.ReducerCompound.compound,
  checksumAddress: state.ReducerChecksumAddress.checksumAddress,
  price: state.ReducerPrice.price
});

export default withNavigation(connect(mapStateToProps)(PortfolioCompound));