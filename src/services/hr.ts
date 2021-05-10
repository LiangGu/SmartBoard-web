import { request } from 'umi';
import { stringify } from 'qs';

/**
 * 获取人力业务线或人力职能月份数据
 * By:Iverson.Tian
 * Date:2020-04-16
 */
export async function getMonthChartData(params?: any) {
    return request(`/api/Board/getTotal`, {
        method: 'POST',
        data: params
    });
}

/**
 * 获取人力业务线或人力职能月度同比数据
 * By:Iverson.Tian
 * Date:2020-04-16
 */
export async function getMonthChartDataOfYearOverYear(params?: any) {
    return request(`/api/Board/getTotalYOY?${stringify(params)}`);
}

/**
 * 获取柱状图点击后的数据
 * By:Iverson.Tian
 * Date:2020-05-09
 */
export async function getBarChartModalData(params?: any) {
    return request(`/api/Board/getDetails?${stringify(params)}`);
}