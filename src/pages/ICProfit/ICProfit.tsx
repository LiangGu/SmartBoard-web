import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Branch from './components/Branch';
import Month from './components/Month';
import { getselectBranchID, } from '@/utils/auths';
const { TabPane } = Tabs;

const ICProfit: React.FC<{}> = () => {
  const [currentT, setCurrentT] = useState<string>('1');

  const onTabChange = (key: string) => {
    setCurrentT(key);
  };

  const SelectBranchID: string | null = getselectBranchID();

  return (
    <PageContainer>
      {
        SelectBranchID == '0' ?
          <Tabs defaultActiveKey={currentT} onChange={onTabChange} tabBarGutter={20}>
            <TabPane tab="公司" key="1">
              <Branch />
            </TabPane>
            <TabPane tab="月份" key="2">
              <Month />
            </TabPane>
          </Tabs> : <Month />
      }
    </PageContainer>
  );
};

export default ICProfit;