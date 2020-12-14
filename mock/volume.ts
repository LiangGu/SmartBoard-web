import { Request, Response } from 'express';

/**
 * 月份图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getMonthChartData(req: Request, res: Response, u: string) {
  let ChartData = [4,5,7.8,15,11,14.3,5,18,18,17.3,20,10];
  const result = {
    Result: true,
    Content:{
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