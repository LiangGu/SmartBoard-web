import { request } from 'umi';
import { stringify } from 'qs';

/**
 * 获取应收账款图表数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getDebtChartData(params?: any) {
  return request<API.ResponseType>(`/api/Board/GetReceivable?${stringify(params)}`);
}
