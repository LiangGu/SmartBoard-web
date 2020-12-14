import { Request, Response } from 'express';

/**
 * 应收账款图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getDebtChartData(req: Request, res: Response, u: string) {
    let DebtChartData = [3481,3098,4521,1522,16234,195];
    const result = {
      Result: true,
      Content:{
        DebtChartData: DebtChartData,
      }
    };
    return res.json(result);
  }

  export default {
    //获取应收账款图表数据
    'GET /api/getDebtChartData': getDebtChartData,
  };