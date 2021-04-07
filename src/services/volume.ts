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
 * 获取月份货量图表数据
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export async function getVolumeChartData(params?: any) {
    return request(`/api/Board/GetVolumeByMonth`, {
        method: 'POST',
        data: params
    });
}

/**
 * 获取月份利润图表数据
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export async function getProfitChartData(params?: any) {
    return request(`/api/Board/GetFeeByMonth`, {
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
    return request(`/api/Board/GetVolByPort`, {
        method: 'POST',
        data: params,
    });
}