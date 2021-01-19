import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Branch from './components/Branch';
import BusinessLine from './components/BusinessLine';
import Month from './components/Month';
import Port from './components/Port';
import { getselectBranchID, } from '@/utils/auths';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';
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
              <ContextProps.Provider value={Number(currentT)}>
                <Branch />
              </ContextProps.Provider>
            </TabPane> : null
        }
        {
          SelectBranchID == '0' ?
            <TabPane tab="业务线" key="2">
              <ContextProps.Provider value={Number(currentT)}>
                <BusinessLine />
              </ContextProps.Provider>
            </TabPane> : null
        }
        <TabPane tab="月份" key="3">
          <ContextProps.Provider value={Number(currentT)}>
            <Month />
          </ContextProps.Provider>
        </TabPane>
        <TabPane tab="港口" key="4">
          <ContextProps.Provider value={Number(currentT)}>
            <Port />
          </ContextProps.Provider>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Volume;