import React from 'react';
import { Modal } from 'antd';

const CustomModal = ({ visible, title, content, onOk, onCancel, ...props }) => (
  <Modal
    visible={visible}
    title={title}
    onOk={onOk}
    onCancel={onCancel}
    {...props}
  >
    {content}
  </Modal>
);

export default CustomModal;
