import React, { useState, } from 'react';
// import { render } from 'react-dom';
import { Button, Modal} from 'antd';
import { PageContainer} from '@ant-design/pro-layout';

const Volume: React.FC<{}> = () => {
    const [modalV, setModalV] = useState<boolean>(false);

    const showModal = () => {
        setModalV(true);
    };

    const handleOk = () => {
        setModalV(false);
    };

    const handleCancel = () => {
        setModalV(false);
    };

  return (
  <PageContainer
    content={''}    //用来放置Header内容
    tabList={[
        {
            tab: '月份',
            key: 'month',
        },
        {
            tab: '港口',
            key: 'port',
        },
    ]}
    extra={[]}
    tabBarExtraContent={
        [
            <Button type={"primary"} key="button" onClick={showModal}>过滤条件</Button>,
        ]
    }
  >
    <Modal
        title="过滤条件"
        visible={modalV}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <p>运输类型</p>

        <p>贸易类型</p>

        <p>货物类型</p>
    </Modal>
    
  </PageContainer>
  )
};

export default Volume;