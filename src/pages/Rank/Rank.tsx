import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, } from 'antd';
import Income from './components/Income';
import Volume from './components/Volume';
const { TabPane } = Tabs;

const ICProfit: React.FC<{}> = () => {
    const [currentT, setCurrentT] = useState<string>('1');

    const onTabChange = (key: string) => {
        setCurrentT(key);
    };
    return (
        <PageContainer>
            <Tabs defaultActiveKey={currentT} onChange={onTabChange} tabBarGutter={20}>
                <TabPane tab="收入" key="1">
                    <Income />
                </TabPane>
                <TabPane tab="货量" key="2">
                    <Volume />
                </TabPane>
            </Tabs>
        </PageContainer>
    );
};

export default ICProfit;