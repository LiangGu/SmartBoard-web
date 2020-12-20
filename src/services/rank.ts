import { request } from 'umi';

/**
 * 获取客户分析图表数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getRankChartData(params?: any) {
  return request<API.ResponseType>(`/api/Board/GetCustomerTop`, {
    method: 'POST',
    data: params,
  });
}