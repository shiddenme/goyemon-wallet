import React, { Component } from "react";
import styled from "styled-components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GoyemonText, TransactionStatus } from "../common";

export default class TransactionDetailHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: props.icon,
      timestamp: props.timestamp,
      status: props.status,
      method: props.method
    };
  }

  render() {
    const { timestamp, status, method } = this.props;
    const { name, size, color } = this.props.icon;
    return (
      <>
        <TxDetailHeader>
          <TxIcon>
            <Icon name={name} size={size + 8} color={color} />
          </TxIcon>
          <TypeAndTime>
            <GoyemonText fontSize={18}>{method}</GoyemonText>
            <GoyemonText fontSize={15}>{timestamp}</GoyemonText>
          </TypeAndTime>
          <HeaderStatus>
            <TransactionStatus
              width="100%"
              txState={method === "Failed" ? null : status}
            />
          </HeaderStatus>
        </TxDetailHeader>
      </>
    );
  }
}

const TxDetailHeader = styled.View`
  align-items: center;
  background-color: #f8f8f8;
  flex-direction: row;
  justify-content: center;
  font-family: "HKGrotesk-Regular";
  padding-bottom: 24px;
  width: 100%;
`;

const TxIcon = styled.View`
  align-items: center;
  width: 20%;
`;

const TypeAndTime = styled.View`
  align-items: flex-start;
  font-family: "HKGrotesk-Regular";
  flex-direction: column;
  width: 40%;
`;

const HeaderStatus = styled.View`
  align-items: center;
  font-family: "HKGrotesk-Regular";
  width: 40%;
`;
