import { request } from 'umi';
import { stringify } from 'qs';
import { TableListParams } from '../global.d';

/**
 * 获取月份图表数据
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export async function getMonthChartData(params?: any) {
  // return request('/api/getMonthChartData', {
  //   method: 'GET',
  // });
  return request(`/api/Board/GetVolumeByMonty`, {
    method: 'POST',
    data: params
  });
}

/**
 * 获取港口表格数据
 * By:Iverson.Tian
 * Date:2020-12-09
 */
export async function getPortTableData(params?: TableListParams) {
  console.log("现在的接口参数是:", params)
  // return request('/api/getPortTableData', {
  //   method: 'GET',
  // });
  return request<API.ResponseType>(`/api/Board/GetVolumeByPort`, {
    method: 'POST',
    data: params,
  });
}