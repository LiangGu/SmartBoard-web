import React from 'react';
import { MailTwoTone, MobileTwoTone, } from '@ant-design/icons';
import { Input, } from 'antd';
import styles from './index.less';

export default {
  Username: {
    component: Input,
    props: {
      size: 'large',
      prefix: <img src={require('@/assets/loginPage/user.svg')} alt="" className={styles.prefixIcon} />,
      type:'text',
      id: 'username',
      autoComplete:"off"
    },
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <img src={require('@/assets/loginPage/password.svg')} alt="" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      autoComplete:"off"
    },
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <MobileTwoTone className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <MailTwoTone className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
