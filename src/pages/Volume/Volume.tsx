import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Month from './components/Month';
import Port from './components/Port';

const { TabPane } = Tabs;

const Volume: React.FC<{}> = () => {
  const [currentT, setCurrentT] = useState<string>('1');

  const onTabChange = (key: string) => {
    setCurrentT(key);
  };

  return (
    <PageContainer>
      <Tabs defaultActiveKey={currentT} onChange={onTabChange} tabBarGutter={20}>
        <TabPane tab="月份" key="1">
          <Month />
        </TabPane>
        <TabPane tab="港口" key="2">
          <Port />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Volume;