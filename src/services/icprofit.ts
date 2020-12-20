import { request } from 'umi';
import { TableListParams } from '../global.d';

/**
 * 获取收支利润图表数据
 * By:Iverson.Tian
 * Date:2020-12-10
 */
export async function getICProfitChartData(params?: any) {
  console.log("现在的接口参数是:", params)
  // return request('/api/getICProfitChartData', {
  //   method: 'GET',
  // });
  return request<API.ResponseType>(`/api/Board/GetMonthFee`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取收支利润表格数据
 * By:Iverson.Tian
 * Date:2020-12-10
 */
export async function getICProfitTableData(params?: TableListParams) {
  return request('/api/getICProfitTableData', {
    method: 'GET',
  });
}
