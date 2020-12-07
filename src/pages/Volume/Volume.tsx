import React, { useState, } from 'react';
// import { render } from 'react-dom';
import { Button, Modal} from 'antd';
import { PageContainer} from '@ant-design/pro-layout';
import Month from './components/Month';
import Port from './components/Port';

const Volume: React.FC<{}> = () => {
    const [modalV, setModalV] = useState<boolean>(false);
    const [currentT, setCurrentT] = useState<string>('month');

    const showModal = () => {
        setModalV(true);
    };

    const onTabChange = (key:string) => {
        setCurrentT(key);
    }

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
    onTabChange={onTabChange}
    tabActiveKey={currentT}
  >
    <Modal
        title="过滤条件"
        visible={modalV}
        footer={false}
      >
        <p>运输类型</p>

        <p>贸易类型</p>

        <p>货物类型</p>
    </Modal>
    {
        currentT == 'month'?
        <Month/>
        :
        <Port/>
    }
  </PageContainer>
  )
};

export default Volume;