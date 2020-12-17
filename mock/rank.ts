import { Request, Response } from 'express';

/**
 * 客户分析表格数据
 * @param req 
 * @param res 
 * @param u 
 */
function getTopCTTableData(req: Request, res: Response, u: string) {
    let TopCTTableData = [
      {
        id:1,
        companyName:"美国晶澳",
        type:"直客",
        income:6676992.6 * 4,
        fcl:858 * 4,
        lcl:0,
        bulk:0,
      },
      {
        id:2,
        companyName:"中粮集团有限公司",
        type:"直客",
        income:4197120 * 4,
        fcl:136 * 4,
        lcl:0,
        bulk:0,
      },
      {
        id:3,
        companyName:"靖江中外运船务代理有限公司",
        type:"中外运公司",
        income:3841100.8 * 4,
        fcl:240 * 4,
        lcl:70686 * 4,
        bulk:15.58 * 4,
      },
      {
        id:4,
        companyName:"QUAN YI LIMITED",
        type:"直客",
        income:1830105.17 * 4,
        fcl:363 * 4,
        lcl:0,
        bulk:0,
      },

      {
        id:5,
        companyName:"上海晶澳太阳能科技有限公司",
        type:"直客",
        income:1830105.17 * 4,
        fcl:417 * 4,
        lcl:0,
        bulk:0,
      },
      {
        id:6,
        companyName:"青岛中外运储运有限公司",
        type:"中外运公司",
        income:1435522.11 * 4,
        fcl:198 * 4,
        lcl:0,
        bulk:9.7 * 4,
      },
      {
        id:7,
        companyName:"光达国际（亚洲）有限公司",
        type:"直客",
        income:1426436.8 * 4,
        fcl:1446 * 4,
        lcl:0,
        bulk:0,
      },
      {
        id:8,
        companyName:"中国外运物流发展有限公司上海分公司",
        type:"中外运公司",
        income:1098349.81 * 4,
        fcl:453 * 4,
        lcl:29470.5,
        bulk:0,
      },
      {
        id:9,
        companyName:"上海津浩国际物流有限公司",
        type:"直客",
        income:991767.82 * 4,
        fcl:989 * 4,
        lcl:0,
        bulk:0,
      },
      {
        id:10,
        companyName:"施家商贸（上海）有限公司",
        type:"同行",
        income:991767.82 * 4,
        fcl:49 * 4,
        lcl:0,
        bulk:11.19 *4,
      },
    ];
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