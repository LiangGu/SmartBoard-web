import React, { useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import Month from './components/Month';
import Port from './components/Port';

const Volume: React.FC<{}> = () => {
  const [currentT, setCurrentT] = useState<string>('month');

  const onTabChange = (key: string) => {
    setCurrentT(key);
  };

  return (
    <PageContainer
      content={''}
      tabList={[
        {
          tab: '月份',
          key: 'month',
        },
        {
          tab: '港口',
          key: 'port',
        },
      ]}
      extra={[]}
      onTabChange={onTabChange}
      tabActiveKey={currentT}
    >
      {currentT == 'month' ? <Month /> : <Port />}
    </PageContainer>
  );
};

export default Volume;