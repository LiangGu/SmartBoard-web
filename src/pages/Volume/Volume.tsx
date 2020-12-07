import React, { useState, useRef } from 'react';
// import { render } from 'react-dom';
import { message, Button, Divider} from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined} from '@ant-design/icons';
import { PageContainer} from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {TableListItem, } from './Volume.d';
// import UpdateForm, { FormValueType } from '@/types/project';
import {addProject, editProject, removeProject, searchProject} from '@/services/project';
// import styles from '@/assets/Base.less';
import CreateEditForm from '@/components/Global/CreateEditForm';
import { values } from 'lodash';

/**
 * 添加
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addProject({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 修改
 * @param fields
 */
const handleEdit = async (fields: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    await editProject({ ...fields });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (pID: number) => {
  const hide = message.loading('正在删除');
  try {
    await removeProject({ ID: pID });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const Volume: React.FC<{}> = () => {
  const [createModalVisible, handleCMVisible] = useState<boolean>(false);
  const [editModalVisible, handleEMVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '项目编号',
      dataIndex: 'pCode',
      formItemProps: {
        initialValue: row?.pCode,
        rules: [
          {
            required: true,
            message: '项目编号为必填项',
          },
        ],
      },
    },
    {
      title: '项目名称',
      dataIndex: 'pName',
      formItemProps: {
        initialValue: row?.pName,
        rules: [
          {
            required: true,
            message: '项目名称为必填项',
          },
        ],
      },
    },
    {
      title: '客户',
      dataIndex: 'customer',
      formItemProps: {
        initialValue: row?.customer,
        rules: [
          {
            required: true,
            message: '客户为必填项',
          },
        ],
      },
    },
    {
      title: '原始货量',
      dataIndex: 'initVolume',
      formItemProps: {
        initialValue: row?.initVolume,
        rules: [
          {
            required: true,
            message: '原始货量为必填项',
          },
        ],
      },
    },
    {
      title: '项目经理',
      dataIndex: 'pManeger',
      formItemProps: {
        initialValue: row?.pManeger,
        rules: [
          {
            required: true,
            message: '项目经理为必填项',
          },
        ],
      },
    },
    {
      title: '起始日期',
      dataIndex: 'startDate',
      valueType: 'date',
      formItemProps: {
        initialValue: row?.startDate,
        rules: [
          {
            required: true,
            message: '起始日期为必填项',
          },
        ],
      },
      fieldProps:{
        valueType: 'dateRange',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setRow(record);
              handleEMVisible(true);
            }}
          >
            <FormOutlined />
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleRemove(record.ID);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            <DeleteOutlined />
          </a>
        </>
      ),
    },
  ];

  return (
  <PageContainer>
      <ProTable<TableListItem>
        headerTitle={<h1>项目列表</h1>}
        actionRef={actionRef}
        rowKey="ID"
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
        }}
        // ListToolBarProps={
        //   {
        //     setting: '',
        //   }
        // },
        toolBarRender={() => [
          <Button key={'addBtn'} type="primary" onClick={() => handleCMVisible(true)}>
            <PlusOutlined /> 添加
          </Button>,
        ]}
        request={(params, sorter, filter) => searchProject({ ...params, sorter, filter })}
        columns={columns}
      />
      <CreateEditForm 
        onCancel={() => {
          handleCMVisible(false);
          setRow(undefined);
        }} 
        modalVisible={createModalVisible} 
        title={"添加"}
      >
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleCMVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="ID"
          type="form"
          columns={columns}
        />
      </CreateEditForm>
      <CreateEditForm 
        onCancel={() => {
          handleEMVisible(false);
          setRow(undefined);
        }} 
        modalVisible={editModalVisible} 
        title={"修改"}
      >
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            let v : TableListItem = {...value}
            if(row != undefined && row){
              v.ID = row.ID;
            }
            const success = await handleEdit(v);
            if (success) {
              handleEMVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="ID"
          type="form"
          columns={columns}
        />
      </CreateEditForm>
  </PageContainer>
  )
};

export default Volume;