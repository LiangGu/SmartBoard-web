import React,{ useEffect } from 'react';
import { useModel,} from 'umi';
import { PageContainer} from '@ant-design/pro-layout';
import { Card, Row, Col } from 'antd';

const Home: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');

  /**
   * 第2个参数传 [] 相当于 componentDidMount 钩子
   */
  useEffect(() =>{
      // console.log(initialState,initialState?.currentBranch?.BranchID)
  },[]);

  return (
    <PageContainer>
        <Card>
          <Row>
            <Col span={24}>col</Col>
          </Row>
        </Card>

        <Card>
          <Row>
            <Col span={12}>col-12</Col>
            <Col span={12}>col-12</Col>
          </Row>
        </Card>

        <Card>
          <Row>
            <Col span={8}>col-8</Col>
            <Col span={8}>col-8</Col>
            <Col span={8}>col-8</Col>
          </Row>
        </Card>

        <Card>
          <Row>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
          </Row>
        </Card>
    </PageContainer>
  )
};

export default Home;