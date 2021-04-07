import { request } from 'umi';

/**
 * 获取收支毛利图表公司数据
 * By:Iverson.Tian
 * Date:2020-12-31
 */
export async function getICProfitBranchData(params?: any) {
    return request(`/api/Board/GetFeeByBranch`, {
        method: 'POST',
        data: params,
    });
}

/**
 * 获取收支毛利图表月份数据
 * By:Iverson.Tian
 * Date:2020-12-10
 */
export async function getICProfitMonthData(params?: any) {
    return request(`/api/Board/GetFeeByMonth`, {
        method: 'POST',
        data: params,
    });
}