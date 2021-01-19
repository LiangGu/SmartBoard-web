import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Branch from './components/Branch';
import Month from './components/Month';
import { getselectBranchID, } from '@/utils/auths';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';
const { TabPane } = Tabs;

const ICProfit: React.FC<{}> = () => {
  const [currentT, setCurrentT] = useState<string>('1');

  const onTabChange = (key: string) => {
    setCurrentT(key);
  };

  const SelectBranchID: string | null = getselectBranchID();

  return (
    <PageContainer>
      <Tabs defaultActiveKey={currentT} onChange={onTabChange} tabBarGutter={20}>
        {/* {
          SelectBranchID == '0' ?
            <TabPane tab="公司" key="1">
              <ContextProps.Provider value={Number(currentT)}>
                <Branch />
              </ContextProps.Provider>
            </TabPane> : null
        } */}

        <TabPane tab="月份" key="2">
          <ContextProps.Provider value={Number(currentT)}>
            <Month />
          </ContextProps.Provider>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default ICProfit;