import React from 'react';
import { Card, } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
//调用API
import { getTopCTTableData, } from '@/services/rank';
//定义数据类型
import { TopCTTableData, } from '../Rank/Rank.d'

const Rank: React.FC<{}> = () => {

    const columns: ProColumns<TopCTTableData>[] = [
        {
            dataIndex: 'companyName',
            title: '公司名称',
        },
        {
            dataIndex: 'type',
            title: '类型',
        },
        {
            dataIndex: 'income',
            title: '收入',
        },
        {
            dataIndex: 'fcl',
            title: 'FCL(TEU)',
        },
        {
            dataIndex: 'lcl',
            title: 'LCL(CBM)',
        },
        {
            dataIndex: 'bulk',
            title: 'BULK(TON)',
        },
    ]

    return <>
        <Card>
            <ProTable<TopCTTableData>
                columns={columns}
                request={(params: any, sorter: any, filter: any) => getTopCTTableData({ ...params, sorter, filter })}
                rowKey="id"
                // pagination={{
                //     showQuickJumper: true,
                // }}
                toolBarRender={false}
                search={false}
            />
        </Card>
    </>
};

export default Rank;