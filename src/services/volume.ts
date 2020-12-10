import { request } from 'umi';
import { TableListParams } from '../global.d';

/**
 * 获取月份图表数据
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export async function getMonthChartData() {
  return request('/api/getMonthChartData', {
    method: 'GET',
  });
}

/**
 * 获取港口表格数据
 * By:Iverson.Tian
 * Date:2020-12-09
 */
export async function getPortTableData(params?: TableListParams) {
  return request('/api/getPortTableData', {
    method: 'GET',
  });
}