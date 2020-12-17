import { Request, Response } from 'express';

/**
 * 收支利润图表数据
 * @param req 
 * @param res 
 * @param u 
 */
function getICProfitChartData(req: Request, res: Response, u: string) {
    let BarDataAR = [
      16853.7,
      11988,
      15266.3,
      35273.5,
      34889.1,
      25618.5,
      19289.5,
      16236.8,
      16530.1,
      12642.8,
      14058.4,
      24067.4,
    ];
    let BarDataAP = [
      16317.3,
      11696.3,
      14448,
      34782.3,
      33958,
      24671.4,
      18110.3,
      15218.7,
      15711.7,
      11938.8,
      13122.3,
      23274.9,
    ];
    let ProfitData = [
      536.4,
      291.7,
      818.3,
      491.2,
      931.1,
      947.1,
      1179.2,
      1018.1,
      818.4,
      704,
      936.1,
      792.5,
    ];
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