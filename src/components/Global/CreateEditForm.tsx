import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  title: String;
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, title} = props;
  return (
    <Modal
      destroyOnClose
      maskClosable = {false}
      title = {title}
      width = {500}
      visible = {modalVisible}
      onCancel = {() => onCancel()}
      footer = {null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
