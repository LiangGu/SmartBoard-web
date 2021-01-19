import { request } from 'umi';

/**
 * 获取公司图表数据
 * By:Iverson.Tian
 * Date:2020-01-19
 */
export async function getBranchChartData(params?: any) {
  return request(`/api/Board/GetVolumeByBranch`, {
    method: 'POST',
    data: params
  });
}

/**
 * 获取月份图表数据
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export async function getMonthChartData(params?: any) {
  return request(`/api/Board/GetVolumeByMonty`, {
    method: 'POST',
    data: params
  });
}

/**
 * 获取港口图表数据
 * By:Iverson.Tian
 * Date:2020-12-20
 */
export async function getPortChartData(params?: any) {
  return request(`/api/Board/GetVolumeByPort`, {
    method: 'POST',
    data: params,
  });
}