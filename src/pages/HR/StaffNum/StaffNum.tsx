import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Select, } from 'antd';
import Month from './components/Month';
import YearOverYear from './components/YearOverYear';
import MonthOverMonth from './components/MonthOverMonth';
import Proportion from './components/Proportion';

const { TabPane } = Tabs;
const { Option } = Select;

const ICProfit: React.FC<{}> = () => {
    const [currentT, setCurrentT] = useState<string>('1');
    const [parentType, setParentType] = useState<number>(0);

    const onTabChange = (key: string) => {
        setCurrentT(key);
    };

    return (
        <PageContainer>
            <Tabs
                defaultActiveKey={currentT}
                onChange={onTabChange} tabBarGutter={20}
                tabBarExtraContent={
                    <Select defaultValue={'0'} style={{ width: 120 }} onChange={(e) => { setParentType(Number(e)) }}>
                        <Option value="0">全部</Option>
                        <Option value="1">职能线</Option>
                        <Option value="2">业务线</Option>
                    </Select>
                }
            >
                <TabPane tab="每月人数" key="1">
                    <Month
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
                <TabPane tab="每月人数环比" key="2">
                    <MonthOverMonth
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
                <TabPane tab="每月人数同比" key="3">
                    <YearOverYear
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
                <TabPane tab="职能/业务线人数占比" key="4">
                    <Proportion
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
            </Tabs>
        </PageContainer>
    );
};

export default ICProfit;