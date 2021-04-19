import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Switch, } from 'antd';
import Month from './components/Month';
import YearOverYear from './components/YearOverYear';
import Ratio from './components/Ratio';
import Proportion from './components/Proportion';
const { TabPane } = Tabs;

const ICProfit: React.FC<{}> = () => {
    const [currentT, setCurrentT] = useState<string>('1');
    const [isStaff, setIsStaff] = useState<boolean>(true);
    const [parentType, setParentType] = useState<number>(2);


    const onTabChange = (key: string) => {
        setCurrentT(key);
    };

    return (
        <PageContainer>
            <Tabs
                defaultActiveKey={currentT}
                onChange={onTabChange} tabBarGutter={20}
                tabBarExtraContent={
                    <Switch
                        checkedChildren='业务线'
                        unCheckedChildren='职能线'
                        onChange={(e) => {
                            setIsStaff(e);
                            setParentType(e == true ? 2 : 1)
                        }}
                        defaultChecked={isStaff}
                    />
                }
            >
                <TabPane tab="月份" key="1">
                    <Month
                        isStaff={isStaff}
                        parentType={parentType}
                    />
                </TabPane>
                <TabPane tab="月份同比" key="2">
                    <YearOverYear
                        isStaff={isStaff}
                        parentType={parentType}
                    />
                </TabPane>
                <TabPane tab="人数比例" key="3">
                    <Ratio
                        isStaff={isStaff}
                        parentType={parentType}
                    />
                </TabPane>
                <TabPane tab="人数占比" key="4">
                    <Proportion
                        isStaff={isStaff}
                        parentType={parentType}
                    />
                </TabPane>
            </Tabs>
        </PageContainer>
    );
};

export default ICProfit;