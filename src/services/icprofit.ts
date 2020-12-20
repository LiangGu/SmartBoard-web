import { request } from 'umi';

/**
 * 获取收支利润图表数据
 * By:Iverson.Tian
 * Date:2020-12-10
 */
export async function getICProfitChartData(params?: any) {
  return request<API.ResponseType>(`/api/Board/GetMonthFee`, {
    method: 'POST',
    data: params,
  });
}