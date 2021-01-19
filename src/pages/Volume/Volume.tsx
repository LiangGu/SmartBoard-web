import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Branch from './components/Branch';
import BusinessLine from './components/BusinessLine';
import Month from './components/Month';
import Port from './components/Port';
import { getselectBranchID, } from '@/utils/auths';
const { TabPane } = Tabs;

const Volume: React.FC<{}> = () => {
  const [currentT, setCurrentT] = useState<string>('1');

  const onTabChange = (key: string) => {
    setCurrentT(key);
  };

  const SelectBranchID: string | null = getselectBranchID();

  return (
    <PageContainer>
      <Tabs defaultActiveKey={currentT} onChange={onTabChange} tabBarGutter={20}>
        {
          SelectBranchID == '0' ?
            <TabPane tab="公司" key="1">
                <Branch />
            </TabPane> : null
        }
        {
          SelectBranchID == '0' ?
            <TabPane tab="业务线" key="2">
                <BusinessLine />
            </TabPane> : null
        }
        <TabPane tab="月份" key="3">
            <Month />
        </TabPane>
        <TabPane tab="港口" key="4">
            <Port />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Volume;