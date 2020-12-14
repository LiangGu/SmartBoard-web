import { request } from 'umi';

/**
 * 获取现金流图表数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getCashFlowChartData() {
  return request('/api/getCashFlowChartData', {
    method: 'GET',
  });
}