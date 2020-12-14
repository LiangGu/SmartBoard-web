import { Request, Response } from 'express';

/**
 * 获取现金流图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getCashFlowChartData(req: Request, res: Response, u: string) {
    let CashFlowChartData = [],CashFlowChartKey = [];
    for (let i = 0; i < 349; i += 1) {
        CashFlowChartData.push(i + Math.floor(Math.random() * 1000));
    }
    for (let i = 0; i < 349; i += 1) {
        CashFlowChartKey.push(i);
    }
    const result = {
        Result: true,
        Content:{
            CashFlowChartData: CashFlowChartData,
            CashFlowChartKey: CashFlowChartKey,
        }
    };
    return res.json(result);
  }
  
  export default {
    //获取现金流图表数据
    'GET /api/getCashFlowChartData': getCashFlowChartData,
  };