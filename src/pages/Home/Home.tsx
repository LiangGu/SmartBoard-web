import React from 'react';
import { PageContainer} from '@ant-design/pro-layout';
import { Card, Row, Col } from 'antd';

const Home: React.FC<{}> = () => {

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