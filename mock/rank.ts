import { Request, Response } from 'express';

/**
 * 客户分析表格数据
 * @param req 
 * @param res 
 * @param u 
 */
function getTopCTTableData(req: Request, res: Response, u: string) {
    let TopCTTableData = [];
    for (let i = 0; i < 100; i += 1) {
        TopCTTableData.push({
        id: `${i}`,
        companyName: `公司 - ${i}`,
        type: `类型 - ${i}`,
        income: `${Math.floor(Math.random() * 1000)}`,
        fcl: `${Math.floor(Math.random() * 1000)}`,
        lcl: `${Math.floor(Math.random() * 1000)}`,
        bulk: `${Math.floor(Math.random() * 1000)}`,
      });
    }
    const result = {
      data: TopCTTableData,
      success: true,
    };
    return res.json(result);
  }
  
  export default {
    //获取客户分析表格数据
    'GET /api/getTopCTTableData': getTopCTTableData,
  };