/**
 * 表格分页数据类型
 * By:Iverson.Tian
 * Date:2020-12-09
 */
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

/**
 * 表格搜索数据类型
 * By:Iverson.Tian
 * Date:2020-12-09
 */

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}