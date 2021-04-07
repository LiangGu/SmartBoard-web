import { request } from 'umi';

/**
 * 获取客户分析收入数据
 * By:Iverson.Tian
 * Date:2020-12-14
 */
export async function getRankIncomeData(params?: any) {
    return request(`/api/Board/GetCustomerTopByAR`, {
        method: 'POST',
        data: params,
    });
}

/**
 * 获取客户分析货量数据
 * By:Iverson.Tian
 * Date:2020-12-31
 */
export async function getRankVolumeData(params?: any) {
    return request(`/api/Board/GetCustomerTopByVol`, {
        method: 'POST',
        data: params,
    });
}