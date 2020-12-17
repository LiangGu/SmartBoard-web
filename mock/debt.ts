import { Request, Response } from 'express';

/**
 * 应收账款图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getDebtChartData(req: Request, res: Response, u: string) {
    let DebtChartData = [
      31760650.98,
      11526319.04,
      2995573.09,
      14937082.5,
      17268845.48,
      36670673.41,
      154428263.6,
      127715058.3,
      0,
      0,
    ];
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