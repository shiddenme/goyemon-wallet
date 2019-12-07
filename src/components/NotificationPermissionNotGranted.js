'use strict';
import React, { Component } from 'react';
import { RootContainer, Button, HeaderTwo, Description } from '../components/common';
import { Linking } from 'react-native';
import styled from 'styled-components/native';

export default class NotificationPermissionNotGranted extends Component {
  render() {
    return (
      <RootContainer>
        <Container>
          <NoPermissionContainer>
            <HeaderTwo marginBottom="0" marginLeft="0" marginTop="0">
              oops!
            </HeaderTwo>
            <Description marginBottom="8" marginLeft="8" marginTop="16">
              please go to the notification settings and enable them
            </Description>
            <NotificationPermissionDeniedImage
              source={require('../../assets/notification_not_granted.png')}
            />
            <Description marginBottom="0" marginLeft="0" marginTop="16">
              - We use a notification system to update your transactions.
            </Description>
            <Description marginBottom="0" marginLeft="0" marginTop="0">
              - Don't worry. We will never annoy you with a pop-up notification.
            </Description>
            <Description marginBottom="8" marginLeft="0" marginTop="0">
              - Everything happens in the background.
            </Description>
            <Button
              text="Go To Device Settings"
              textColor="#5F5F5F"
              backgroundColor="#EEEEEE"
              borderColor="#EEEEEE"
              margin="16px auto"
              opacity="1"
              onPress={() => Linking.openURL('app-settings://notification/DeBank')}
            />
          </NoPermissionContainer>
        </Container>
      </RootContainer>
    );
  }
}

const Container = styled.View`
  alignItems: center;
  flexDirection: column;
  margin-top: 120px;
  width: 95%;
`;

const NoPermissionContainer = styled.View`
  alignItems: center;
  flexDirection: column;
`;

const NotificationPermissionDeniedImage = styled.Image`
  height: 320px;
  width: 320px;
`;
