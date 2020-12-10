import { Request, Response } from 'express';

/**
 * 月份图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getMonthChartData(req: Request, res: Response, u: string) {
  let ChartData = [
    { year: '1月', value: 3 },
    { year: '2月', value: 4 },
    { year: '3月', value: 3.5 },
    { year: '4月', value: 5 },
    { year: '5月', value: 4.9 },
    { year: '6月', value: 6 },
    { year: '7月', value: 7 },
    { year: '8月', value: 9 },
    { year: '9月', value: 13 },
    { year: '10月', value: 6 },
    { year: '11月', value: 7 },
    { year: '12月', value: 9 },
  ];
  const result = {
    data: ChartData,
    success: true,
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