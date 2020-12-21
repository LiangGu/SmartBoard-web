import { request } from 'umi';
import { stringify } from 'qs';

/**
 * 获取现金流图表数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getCashFlowChartData(params?: any) {
  return request(`/api/Board/GetCash?${stringify(params)}`);
}