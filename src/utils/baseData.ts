/**
 * MonthList
 */
export const MonthList = [
    { Key: 1, Value: "1月" },
    { Key: 2, Value: "2月" },
    { Key: 3, Value: "3月" },
    { Key: 4, Value: "4月" },
    { Key: 5, Value: "5月" },
    { Key: 6, Value: "6月" },
    { Key: 7, Value: "7月" },
    { Key: 8, Value: "8月" },
    { Key: 9, Value: "9月" },
    { Key: 10, Value: "10月" },
    { Key: 11, Value: "11月" },
    { Key: 12, Value: "12月" },
]

/**
 * BizType1List
 */
export const BizType1List = [
    { Key: 1, Value: "水运" },
    { Key: 2, Value: "空运" },
    { Key: 3, Value: "陆运" },
    { Key: 4, Value: "铁路" },
    { Key: 5, Value: "多式联运" },
    { Key: 6, Value: "仓储" },
    { Key: 10, Value: "散货船" },
    { Key: 11, Value: "总代" },
    { Key: 12, Value: "空海跨境" },
    { Key: 13, Value: "增值服务" },
    { Key: 14, Value: "货运站" },
]

/**
 * BizType2List
 */
export const BizType2List = [
    { Key: 1, Value: "出口" },
    { Key: 2, Value: "进口" },
    { Key: 3, Value: "内贸" },
    { Key: 4, Value: "第三国" },
    { Key: 5, Value: "转口" },
    { Key: 6, Value: "过境" },
]

/**
 * OceanTransportTypeList
 */
export const OceanTransportTypeList = [
    { Key: 1, Value: "整箱" },
    { Key: 2, Value: "拼箱" },
    { Key: 3, Value: "散货" },
    { Key: 6, Value: "整车" },
    { Key: 7, Value: "零担" },
]

/**
 * BranchList
 */
export const BranchList = [
    { Key: 0, Value: "香港外运(总部)" },             //香港总部传 0 

    { Key: 2, Value: "香港船务" },
    { Key: 5, Value: "上海伟运货代" },
    { Key: 6, Value: "泰国外运" },
    { Key: 7, Value: "马来西亚外运" },
    { Key: 8, Value: "印尼外运" },
    { Key: 9, Value: "柬埔寨外运" },
    { Key: 10, Value: "缅甸外运" },
    { Key: 11, Value: "中越外运" },
    { Key: 13, Value: "上海伟运工程" },
    { Key: 17, Value: "香港供应链事业部" },
    { Key: 19, Value: "上海空运事业部" },
    { Key: 20, Value: "上海电商事业部" },
    { Key: 21, Value: "香港电商事业部" },
    { Key: 22, Value: "越南外运" },
    { Key: 23, Value: "香港空运事业部" },
]

/**
 * 将用户选择的搜索条件转化成 Tag 的形式
 * @param list 
 * @param T 
 */
export const transfromToTag = (T: Number, list: Array<Number>, baseList: Array<API.Tag>) => {
    let TagList: Array<API.Tag> = [];
    if (list && list.length > 0) {
        if (T == 1) {
            list.map(x => {
                baseList.map(y => {
                    if (parseInt(y.Value) == x) {
                        TagList.push(y);
                    }
                });
            });
        } else {
            list.map(x => {
                baseList.map(y => {
                    if (y.Key == x) {
                        TagList.push(y);
                    }
                });
            });
        }
    }
    return TagList;
}