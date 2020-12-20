import { request } from 'umi';
import { TableListParams } from '../global.d';

/**
 * 获取客户分析表格数据
 * By:Iverson.Tian
 * Date:2020-12-09
 */
export async function getTopCTTableData(params?: TableListParams) {
  return request('/api/getTopCTTableData', {
    method: 'GET',
  });
}