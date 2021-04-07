import { Request, Response } from 'express';

/**
 * 月份图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getMonthChartData(req: Request, res: Response, u: string) {
    let ChartData = [
        58639.266,
        50794.625,
        397787.6883,
        271367.4039,
        256104.7644,
        520772.5497,
        237113.1118,
        328793.9875,
        102643.0584,
        248747.5173,
        185132.9263,
        236616.8782,
    ];
    const result = {
        Result: true,
        Content: {
            ChartData: ChartData,
        }
    };
    return res.json(result);
}

/**
 * 港口表格数据
 * @param req 
 * @param res 
 * @param u 
 */
function getPortTableData(req: Request, res: Response, u: string) {
    let PortTableData = [];
    for (let i = 0; i < 100; i += 1) {
        PortTableData.push({
            id: `${i}`,
            portName: `港口 - ${i}`,
            region: `区域 - ${i}`,
            fcl: `${Math.floor(Math.random() * 1000)}`,
            lcl: `${Math.floor(Math.random() * 1000)}`,
            bulk: `${Math.floor(Math.random() * 1000)}`,
            income: `${Math.floor(Math.random() * 1000)}`,
        });
    }
    const result = {
        data: PortTableData,
        success: true,
    };
    return res.json(result);
}

export default {
    //获取月份图表数据
    'GET /api/getMonthChartData': getMonthChartData,
    //获取港口表格数据
    'GET /api/getPortTableData': getPortTableData,
};