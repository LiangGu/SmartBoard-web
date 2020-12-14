import { Request, Response } from 'express';

/**
 * 收支利润图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getICProfitChartData(req: Request, res: Response, u: string) {
    let BarDataAR = [4.1,5.3,7,11.2,12.5,13.2,5,7,15,13,15,11];
    let BarDataAP = [4,5,7.8,15,11,14.3,5,18,18,17.3,20,10];
    let ProfitData = [4,5,7.8,18,1.9,14.3,7,11,12,15.3,15.9,15];
    const result = {
        Result: true,
        Content:{
          BarDataAR: BarDataAR,
          BarDataAP: BarDataAP,
          ProfitData: ProfitData,
        }
    };
    return res.json(result);
  }
  
  /**
   * 收支利润表格数据
   * @param req 
   * @param res 
   * @param u 
   */
  function getICProfitTableData(req: Request, res: Response, u: string) {
    let ICProfitTableData = [];
    for (let i = 0; i < 100; i += 1) {
        ICProfitTableData.push({

      });
    }
    const result = {
      data: ICProfitTableData,
      success: true,
    };
    return res.json(result);
  }

  export default {
    //获取收支利润图表数据
    'GET /api/getICProfitChartData': getICProfitChartData,
    //获取收支利润表格数据
    'GET /api/getICProfitTableData': getICProfitTableData,
  };