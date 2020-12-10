/**
 * 月份图表数据类型
 * By:Iverson.Tian
 * Date:2020-12-08
 */
export interface MonthChartData {
    year: string;
    value: number;
}

/**
 * 港口数据类型
 * By:Iverson.Tian
 * Date:2020-12-09
 */
export interface PortTableData {
    id: number;
    portName: string;
    region: string;
    fcl: number;
    lcl: number;
    bulk: number;
    income: number;
}