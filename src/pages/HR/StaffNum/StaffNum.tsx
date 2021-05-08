import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Select, } from 'antd';
import StaffNum from './components/StaffNum';
import YearOnYear from './components/YearOnYear';
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
                    currentT == '1' ? null :
                        <Select defaultValue={'0'} style={{ width: 120 }} onChange={(e) => { setParentType(Number(e)) }}>
                            <Option value="0">全部</Option>
                            <Option value="1">职能线</Option>
                            <Option value="2">业务线</Option>
                        </Select>
                }
            >
                <TabPane tab="人员数量" key="1">
                    <StaffNum
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
                <TabPane tab="人员变动" key="2">
                    <YearOnYear
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
                <TabPane tab="人员分类" key="3">
                    <Proportion
                        parentType={parentType}
                        currentT={currentT}
                    />
                </TabPane>
            </Tabs>
        </PageContainer >
    );
};

export default ICProfit;