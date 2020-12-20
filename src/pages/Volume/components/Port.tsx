import React from 'react';
import { Card } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
//调用API
import { getPortTableData, } from '@/services/volume';
//定义数据类型
import { PortTableData, } from '../Volume.d'

const Port: React.FC<{}> = () => {

    const columns: ProColumns<PortTableData>[] = [
        {
            dataIndex: 'portName',
            title: '港口名称',
        },
        {
            dataIndex: 'region',
            title: '区域',
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
        {
            dataIndex: 'income',
            title: '收入',
        },
    ]

    return <>
        <Card>
            <ProTable<PortTableData>
                columns={columns}
                request={(params: any, sorter: any, filter: any) => getPortTableData({ ...params, sorter, filter })}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={false}
            />
        </Card>
    </>
}

export default Port;