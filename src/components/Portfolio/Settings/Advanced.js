"use strict";
import React, { Component } from "react";
import { TouchableWithoutFeedback } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { saveFcmToken } from "../../../actions/ActionDebugInfo";
import {
  RootContainer,
  Container,
  HeaderOne,
  HeaderThree,
  GoyemonText
} from "../../common";
import Copy from "../../Copy";
import GlobalConfig from "../../../config.json";
import I18n from "../../../i18n/I18n";
import { FcmMsgs } from "../../../lib/fcm";
import LogUtilities from "../../../utilities/LogUtilities";

class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSendToHttp: true
    };
    this.AnimationRef;
  }

  componentDidMount() {
    this.getFcmToken();
  }

  getFcmToken() {
    FcmMsgs.getFcmToken().then((fcmToken) => {
      if (fcmToken) {
        LogUtilities.logInfo("the current fcmToken ===>", fcmToken);
        this.props.saveFcmToken(fcmToken);
      } else {
        LogUtilities.logInfo("no fcmToken ");
      }
    });
  }

  async postLogToMagicalHttpEndpoint() {
    if (this.sendStateChangeTimer) return;

    const log =
      this.props.debugInfo.others instanceof Array
        ? this.props.debugInfo.others.join("\n")
        : JSON.stringify(this.props.debugInfo.others);
    const fcmtoken = this.props.debugInfo.fcmToken;
    try {
      await fetch("http://51.89.42.181:31330/logData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fcmToken: fcmtoken,
          logData: log,
          ctime: new Date().toString()
        })
      });

      if (this.sendStateChangeTimer) clearTimeout(this.sendStateChangeTimer);
      this.sendStateChangeTimer = setTimeout(() => {
        this.sendStateChangeTimer = null;
        this.setState({ canSendToHttp: true });
      }, 10000);
      this.setState({ canSendToHttp: false });
    } catch (e) {
      LogUtilities.logError(e, e.stack);
    }
  }

  componentWillUnmount() {
    if (this.sendStateChangeTimer) clearTimeout(this.sendStateChangeTimer);
  }

  renderPostLog() {
    if (this.state.canSendToHttp)
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            this.postLogToMagicalHttpEndpoint();
          }}
        >
          <CopyAddressText>Send log to magical http endpoint</CopyAddressText>
        </TouchableWithoutFeedback>
      );
    else
      return (
        <TouchableWithoutFeedback>
          <PostWaitText>(Please wait 10 seconds)</PostWaitText>
        </TouchableWithoutFeedback>
      );
  }

  render() {
    // const otherDebugInfo = JSON.stringify(this.props.debugInfo.others);
    const { debugInfo } = this.props;

    const otherDebugInfo =
      debugInfo.others instanceof Array
        ? debugInfo.others.join("\n")
        : JSON.stringify(debugInfo.others);

    return (
      <RootContainer>
        <HeaderOne marginTop="96">{I18n.t("advanced")}</HeaderOne>
        <Container
          alignItems="flex-start"
          flexDirection="column"
          justifyContent="center"
          marginTop={0}
          width="90%"
        >
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            {I18n.t("settings-advanced-network")}
          </HeaderThree>
          <GoyemonText fontSize="14">{GlobalConfig.network_name}</GoyemonText>
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            {I18n.t("settings-advanced-sync")}
          </HeaderThree>
          <Animatable.View ref={(ref) => (this.AnimationRef = ref)}>
            <Icon
              onPress={async () => {
                this.AnimationRef.rotate();
                FcmMsgs.resyncWallet(this.props.checksumAddress);
              }}
              name="sync"
              color="#5f5f5f"
              size={28}
            />
          </Animatable.View>
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            Copy Logs
          </HeaderThree>
          {/* {this.renderPostLog()} */}
          <Copy
            text={
              "address: " +
              this.props.checksumAddress +
              " fcm token: " +
              debugInfo.fcmToken +
              " logs: " +
              otherDebugInfo
            }
            icon={false}
          />
          {/* <TouchableWithoutFeedback
            onPress={async () => {
              setTimeout(() => {
                storage.debugDumpAllTxes();
              }, 5000);
            }}
          >
            <CopyAddressText>dump all txes (careful!)</CopyAddressText>
          </TouchableWithoutFeedback> */}
          <HeaderThree
            color="#000"
            marginBottom="0"
            marginLeft="0"
            marginTop="24"
          >
            {I18n.t("settings-advanced-credit")}
          </HeaderThree>
          <GoyemonText fontSize="14">
            &quot;Dino Loading&quot; by aan hamdani is licensed under CC BY 2.0
          </GoyemonText>
          <GoyemonText fontSize="14">
            &quot;Trophy Success&quot; by Brett Bertola is licensed under CC BY
            2.0
          </GoyemonText>
        </Container>
      </RootContainer>
    );
  }
}

const CopyAddressText = styled.Text`
  color: #00a3e2;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

const PostWaitText = styled.Text`
  color: #111111;
  font-family: "HKGrotesk-Regular";
  font-size: 16;
`;

function mapStateToProps(state) {
  return {
    checksumAddress: state.ReducerChecksumAddress.checksumAddress,
    debugInfo: state.ReducerDebugInfo.debugInfo
  };
}

const mapDispatchToProps = {
  saveFcmToken
};

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
