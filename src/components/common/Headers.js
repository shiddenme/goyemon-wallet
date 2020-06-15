'use strict';
import React from 'react';
import styled from 'styled-components/native';

const HeaderOne = (props) => (
  <HeaderOneText marginTop={props.marginTop}>{props.children}</HeaderOneText>
);

const HeaderOneText = styled.Text`
  font-size: 32;
  font-family: 'HKGrotesk-Bold';
  margin-left: 16;
  margin-top: ${(props) => `${props.marginTop}`};
`;

const HeaderTwo = (props) => (
  <HeaderTwoText
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderTwoText>
);

const HeaderTwoText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Bold';
  font-size: 24;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-left: ${(props) => `${props.marginLeft}`};
  margin-top: ${(props) => `${props.marginTop}`};
  text-align: center;
  width: 95%;
`;

const HeaderThree = (props) => (
  <HeaderThreeText
    color={props.color}
    marginBottom={props.marginBottom}
    marginLeft={props.marginLeft}
    marginTop={props.marginTop}
  >
    {props.children}
  </HeaderThreeText>
);

const HeaderThreeText = styled.Text`
  color: ${(props) => props.color};
  font-family: 'HKGrotesk-Bold';
  font-size: 16;
  margin-bottom: ${(props) => `${props.marginBottom}`};
  margin-left: ${(props) => `${props.marginLeft}`};
  margin-top: ${(props) => `${props.marginTop}`};
  text-transform: uppercase;
`;

const HeaderFour = (props) => (
  <HeaderFourText marginTop={props.marginTop}>{props.children}</HeaderFourText>
);

const HeaderFourText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  font-size: 20;
  margin-bottom: 16;
  margin-top: ${(props) => `${props.marginTop}`};
  text-transform: uppercase;
`;

const HeaderFive = (props) => (
  <Header width={props.width}>
    <HeaderText>{props.children}</HeaderText>
  </Header>
);

const Header = styled.View`
  flex-direction: row;
  width: ${(props) => `${props.width}`};
`;

const HeaderText = styled.Text`
  color: #5f5f5f;
  font-family: 'HKGrotesk-Regular';
  text-transform: uppercase;
`;

export { HeaderOne, HeaderTwo, HeaderThree, HeaderFour, HeaderFive };