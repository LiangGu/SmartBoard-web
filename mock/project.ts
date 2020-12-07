//# sourceURL=dynamicScript.js
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem } from '@/../../src/pages/BaseData/Project/projectT';
import { TableListParams } from '@/../../src/globalT';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];
  for (let i:number = 1; i < pageSize; i++ ) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
        ID: index,
        pCode: `ProCode${index}`,
        pName: '拆包运项目',
        customer: '中国外运物流有限公司',
        initVolume: `${Math.floor(Math.random() * 1000)}`,
        pManeger: 'Bryan',
        startDate: '2005-05-15',
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};
var tableListDataSource: TableListItem[] = genList(1,100);

function getProjectList(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as TableListParams;

  //搜索我就不写了，后台来吧
  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

/**
 * Project的 “增删改” 接口
 * @param req 
 * @param res 
 * @param u 
 * @param b 
 */
function setProject(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const body = (b && b.body) || req.body;
  switch (body.method) {
    /* eslint no-case-declarations:0 */
    case 'add':
      (() => {
        const index : number = tableListDataSource.length + 1;
        const newProject : TableListItem = {
          ID: index,
          pCode: body.pCode,
          pName: body.pName,
          customer: body.customer,
          initVolume: body.initVolume,
          pManeger: body.pManeger,
          startDate: body.startDate,
        };
        tableListDataSource.unshift(newProject);
        return res.json(newProject);
      })();
      return;
    case 'delete':
      const id : number = body.ID;
      tableListDataSource = tableListDataSource.filter((item) => id != item.ID);
      break;
    case 'update':
      (() => {
        let newRule : TableListItem = {...body};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.ID === newRule.ID) {
            item = {...newRule};
          }
          return item;
        });
      })();
      break;
    default:
      break;
  }
  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/getProjectList': getProjectList,
  'POST /api/setProject': setProject,
};
