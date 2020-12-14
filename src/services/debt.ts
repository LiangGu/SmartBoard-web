import { request } from 'umi';

/**
 * 获取应收账款图表数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getDebtChartData() {
    return request('/api/getDebtChartData', {
      method: 'GET',
    });
  }
