import { request } from 'umi';

export async function getMonthChartData() {
  return request('/api/getMonthChartData', {
    method: 'GET',
  });
}