import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Month from './components/Month';
import YearOverYear from './components/YearOverYear';
import Ratio from './components/Ratio';
import Proportion from './components/Proportion';
const { TabPane } = Tabs;

const ICProfit: React.FC<{}> = () => {
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
                <TabPane tab="月份同比" key="2">
                    <YearOverYear />
                </TabPane>
                <TabPane tab="人员人数比例" key="3">
                    <Ratio />
                </TabPane>
                <TabPane tab="人员人数占比" key="4">
                    <Proportion />
                </TabPane>
            </Tabs>
        </PageContainer>
    );
};

export default ICProfit;