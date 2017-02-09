import React, { Component, PropTypes } from 'react';
import { Alert, Modal } from 'antd';
import { RekitSteps } from './';

export default class DemoAlert extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose() {},
  };

  render() {
    return (
      <Modal
        visible
        maskClosable
        title=""
        footer=""
        width="700px"
        onClose={this.props.onClose}
      >
        <div className="home-demo-alert">
          <Alert
            message="The demo is readonly!"
            description="This site is only for demo purpose. So Rekit portal is running on readonly mode. You can't perform any action that alters the project data."
            type="warning"
            showIcon
          />
          <RekitSteps />
        </div>
      </Modal>
    );
  }
}
