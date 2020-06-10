'use strict';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { RootContainer } from '../../components/common';

class PopUpModal extends Component {
  render() {
    return (
      <RootContainer>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={this.props.modal.popUpModalVisibility}
        >
          <ModalContainer>
            <ModalBackground height={this.props.height}>
              <CloseButton onPress={this.props.onPress}>
                <Icon name="close" color="#5F5F5F" size={24} />
              </CloseButton>
              <MondalInner>{this.props.children}</MondalInner>
            </ModalBackground>
          </ModalContainer>
        </Modal>
      </RootContainer>
    );
  }
}

const ModalContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  height: 100%;
`;

const ModalBackground = styled.View`
  background-color: #f8f8f8;
  border-radius: 16px;
  margin-top: 40%;
  height: ${(props) => props.height};
  width: 90%;
`;

const MondalInner = styled.View`
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  align-items: flex-start;
  margin-left: 16;
  margin-top: 16;
`;

function mapStateToProps(state) {
  return {
    modal: state.ReducerModal.modal
  };
}

export default connect(mapStateToProps)(PopUpModal);
