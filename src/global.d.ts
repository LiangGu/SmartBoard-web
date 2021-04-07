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

export interface SessionSysSave {
    branchList: Array<{ BranchID: number, BranchName: string }>;
    userName: string;
    userID: string;
    branchID: string;
    branchCode: string;
    token: string;
    funcCurrency: string;
    //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
    selectBranchID: string;
    selectBranchName: string;
    selectYear: string;
    selectBusinessesLine: string;
    selectBizType1List_Radio: string;
    selectOceanTransportType: string;
}