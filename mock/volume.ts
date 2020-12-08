//# sourceURL=dynamicScript.js
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

function getMonthChartData(req: Request, res: Response, u: string) {
  const ChartData = [
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
  console.log(result)
  return res.json(result);
}

export default {
  'GET /api/getMonthChartData': getMonthChartData,
};