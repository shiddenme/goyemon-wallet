'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components';
import { RootContainer, Container, HeaderOne } from '../components/common';
import SendToken from '../components/Send/SendToken';
import I18n from '../i18n/I18n';
import Web3 from 'web3';
import LogUtilities from '../utilities/LogUtilities.js';
import {
  RoundDownBigNumberPlacesFour,
  RoundDownBigNumberPlacesEighteen
} from '../utilities/BigNumberUtilities';

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'eth'
    };
  }

  returnBalance = (amount, round, pow, fix) => RoundDownBigNumberPlacesFour(amount)
  .div(new RoundDownBigNumberPlacesFour(round).pow(pow))
  .toFixed(fix);

  renderCurrency() {
    const { balance } = this.props;

    const
    ethBalance = RoundDownBigNumberPlacesFour(Web3.utils.fromWei(balance.wei)).toFixed(4),
    daiBalance = this.returnBalance(balance.dai, 10, 18, 2),
    cdaiBalance = this.returnBalance(balance.cDai, 10, 8, 2),
    pooltogetherDaiBalance = RoundDownBigNumberPlacesFour(
      balance.pooltogetherDai.open
    )
    .plus(balance.pooltogetherDai.committed)
    .plus(balance.pooltogetherDai.sponsored)
    .div(new RoundDownBigNumberPlacesFour(10).pow(18))
    .toFixed(2)
    const ethProps = {
      icon: require('../../assets/ether_icon.png'),
      token: 'ETH',
      title: I18n.t('eth-wallet-balance'),
      balance: ethBalance
    }

    const daiProps = {
      icon: require('../../assets/dai_icon.png'),
      token: 'DAI',
      title: I18n.t('dai-wallet-balance'),
      balance: daiBalance
    }

    const cdaiProps = {
      icon: require('../../assets/cdai_icon.png'),
      token: 'cDAI',
      title: I18n.t('cdai-wallet-balance'),
      balance: cdaiBalance
    }

    const pldaiProps = {
      icon: require('../../assets/pldai_icon.png'),
      token: 'plDAI',
      title: I18n.t('pldai-wallet-balance'),
      balance: pooltogetherDaiBalance
    }

    switch(this.state.currency) {
      case 'eth':
        return <SendToken info={ethProps}/>
      case 'dai':
        return <SendToken info={daiProps}/>
      case 'cdai':
        return <SendToken info={cdaiProps}/>
      case 'pldai':
        return <SendToken info={pldaiProps}/>
      default:
        LogUtilities.logInfo('no currency matches');
        break
    }
  }

  render() {
    const tabs = [
      {
        event: () => this.setState({ currency: 'eth' }),
        opacity: this.state.currency === 'eth' ? 1 : 0.4,
        path: require('../../assets/ether_icon.png')
      },
      {
        event: () => this.setState({ currency: 'dai' }),
        opacity: this.state.currency === 'dai' ? 1 : 0.4,
        path: require('../../assets/dai_icon.png')
      },
      {
        event: () => this.setState({ currency: 'cdai' }),
        opacity: this.state.currency === 'cdai' ? 1 : 0.4,
        path: require('../../assets/cdai_icon.png')
      },
      {
        event: () => this.setState({ currency: 'pldai' }),
        opacity: this.state.currency === 'pldai' ? 1 : 0.4,
        path: require('../../assets/pldai_icon.png')
      },
    ]

    return (
      <RootContainer>
        <HeaderOne marginTop="64">{I18n.t('send')}</HeaderOne>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Container
            alignItems="flex-end"
            flexDirection="row"
            justifyContent="center"
            marginTop={16}
            width="100%"
          >
            {tabs.map(tab =>
              <TouchableOpacity
                onPress={tab.event}
              >
                <CoinImage
                  opacity={tab.opacity}
                  source={tab.path}
                />
              </TouchableOpacity>
            )}
          </Container>
        </ScrollView>
        {this.renderCurrency()}
      </RootContainer>
    );
  }
}

const CoinImage = styled.Image`
  border-radius: 20px;
  margin-left: 16;
  height: 40px;
  opacity: ${(props) => props.opacity};
  width: 40px;
`;

function mapStateToProps(state) {
  return {
    balance: state.ReducerBalance.balance
  };
}

export default connect(mapStateToProps)(Send)
