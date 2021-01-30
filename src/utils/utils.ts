import e from "express";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

/**
 * 获取类型
 * @param a 
 */
export const getType = (a: any): string => {
    let t: string;
    return ((t = typeof (a)) == "object" ? a == null && "null" || Object.prototype.toString.call(a).slice(8, -1) : t).toLowerCase();
}

/**
 * 深赋值数组
 * @param dest 
 * @param source 
 */
export const extend = (dest: any[], source: any[]): void => {
    for (let p in source) {
        if (getType(source[p]) == "array" || getType(source[p]) == "object") {
            dest[p] = getType(source[p]) == "array" ? [] : {};
            extend(dest[p], source[p]);
        } else {
            dest[p] = Object.assign(source[p]);
        }
    }
}

/**
 * 柱状图动态获取最大值
 * @param list 
 */
export const getMaxValue = (list: Array<any>) => {
    let max = 0;
    let maxint = 0;
    let maxval = 0;
    if (list && list.length > 0) {
        list.forEach((element) => {
            if (!(element === undefined || element === '')) {
                if (max < element) {
                    max = element;
                }
            }
        })
        maxint = Math.ceil(max / 9.5);      //不让最高的值超过最上面的刻度
        maxval = maxint * 10;               //让显示的刻度是整数
    }
    return maxval;
}

/**
 * 柱状图动态获取最小值
 * @param list 
 */
export const getMinValue = (list: Array<any>) => {
    let min = 0;
    let minint = 0;
    let minval = 0;
    if (list && list.length > 0) {
        list.forEach((element) => {
            if (!(element === undefined || element === '')) {
                if (min > element) {
                    min = element;
                }
            }
        })
        minint = Math.floor(min / 10);
        minval = minint * 10;               //让显示的刻度是整数
    }
    return minval;
}

/**
 * 动态相加数组中的值
 * 如 [1,2,3,5]
 * 返回 11
 */
export const getTotalValue = (list: Array<Number>) => {
    return eval(list.join('+'));
}

/**
 * 数组数据全部保留整数
 * @param prop
 * @param T 
 */
export const transIntOfArraay = (list: Array<Number>) => {
    let IntList: number[] = [];
    if (list && list.length > 0) {
        list.map((x: any) => {
            IntList.push(Math.round(x));
        });
    }
    return IntList;
}

/**
 * 数组中的数据进行加减乘除
 * @param list
 * @param type
 * @param value
 */
export const calculateOfArraay = (list: Array<Number>, type: string, value: number) => {
    let List: number[] = [];
    if (list && list.length > 0) {
        list.map((x: any) => {
            if (type == '+') {
                List.push(x + value);
            } else if (type == '-') {
                List.push(x - value);
            } else if (type == '*') {
                List.push(x * value);
            } else if (type == '/') {
                List.push(x / value);
            }
        });
    }
    return List;
}

/**
 * 过滤数组中的的数据
 */
export const FilterZeroOfArraay = (list: any, value: Number, prop: any) => {
    return list.filter((item: any) => item[prop] > value);
}

/**
 * 对象数组排序
 * T <1、从小到大 2、从大到小>
 */
export const sortObjectArr = (prop: any, T: Number) => {
    return function (obj1: any, obj2: any) {
        const val1 = obj1[prop];
        const val2 = obj2[prop];
        if (T == 1) {
            return val1 - val2;
        } else {
            return val2 - val1;
        }
    }
}

/**
 * 动态获取今天是今年中的第几天
 */
export const getCurDay = () => {
    const divisor: number = 24 * 60 * 60 * 1000;
    const initDate: Date = new Date(new Date().getFullYear().toString());
    const curDate: Date = new Date();
    const dateGap: number = Math.ceil((Number(curDate) - Number(initDate)) / divisor);
    return dateGap;
}

/**
 * 数组中的值相加
 * @param arr 
 */
export const sumArray = (arr: Array<number>) => {
    var s = 0;
    for (let i = 0; i < arr.length; i++) {
        s += Number(arr[i]);
    }
    return s;
};

/**
 * 动态获取系统上线到今年的年份List
 */
export const getYearList = () => {
    const date = new Date();
    const year = date.getFullYear();
    const YearList = [];
    for (let i = 2019; i <= year; i++) {
        YearList.push({
            Key: i,
            Value: `${i}年`,
        });
    }
    return YearList;
}

/**
 * 根据业务线动态获取运输类型数据
 */
export function GetBizType1List_RadioList(BusinessesLine: any) {
    let BizType1List_RadioList: Array<{ Key: number, Value: string }> = [];
    switch (parseInt(BusinessesLine)) {
        case 1:
            BizType1List_RadioList = [
                { Key: 1, Value: "水运" },
                { Key: 2, Value: "空运" },
                { Key: 3, Value: "陆运" },
                { Key: 4, Value: "铁路" },
            ];
            break;
        case 2:
            BizType1List_RadioList = [
                { Key: 12, Value: "空海跨境" },
                { Key: 3, Value: "陆运" },
                { Key: 6, Value: "仓储" },
                { Key: 13, Value: "增值服务" },
                { Key: 14, Value: "货运站" },
            ];
            break;
        case 3:
            BizType1List_RadioList = [
                { Key: 12, Value: "空海跨境" },
            ];
            break;
        case 4:
            BizType1List_RadioList = [
                { Key: 10, Value: "散货船" },
                { Key: 11, Value: "总代" },
            ];
            break;
        case 5:
            BizType1List_RadioList = [
                { Key: 1, Value: "水运" },
                { Key: 2, Value: "空运" },
                { Key: 3, Value: "陆运" },
                { Key: 4, Value: "铁路" },
                { Key: 5, Value: "多式联运" },
            ];
            break;
        default: break;
    }
    return BizType1List_RadioList;
}

/**
 * 根据业务线和运输类型动态获取获取类型
 * 注:货物类型不会根据贸易类型有所不同,通过传参数获取到不同的货物类型数据
 * BusinessesLine:1.工程 2.合同 3.电商 4.船代 5.货代
 * BizType1:1.水运 2.空运 3.陆运 4.铁路 5.多式联运 6.仓储 10.散货船 11.总代 12.空海跨境 13.增值服务 14.货运站 (传0取全部)
 */
export function GetOceanTransportTypeList(BusinessesLine: any, BizType1: any,) {
    let OceanTransportTypeList: Array<{ Key: number, Value: string }> = [];
    if (parseInt(BizType1) == 0) {
        OceanTransportTypeList = [
            { Key: 0, Value: "不限" },                      //传 0 取全部
            { Key: 1, Value: "整箱" },
            { Key: 2, Value: "拼箱" },
            { Key: 3, Value: "散货" },
            { Key: 6, Value: "整车" },
            { Key: 7, Value: "零担" },
        ];
    } else {
        if (parseInt(BusinessesLine) == 1) {
            if (parseInt(BizType1) == 1) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                    { Key: 3, Value: "散货" },
                ];
            } else if (parseInt(BizType1) == 2) {
                OceanTransportTypeList = [
                    { Key: 3, Value: "散货" },
                ];
            } else if (parseInt(BizType1) == 3) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 6, Value: "整车" },
                    { Key: 7, Value: "零担" },
                ];
            } else {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                ];
            }
        } else if (parseInt(BusinessesLine) == 2) {
            if (parseInt(BizType1) == 12) {
                OceanTransportTypeList = [
                    
                ];
            } else if (parseInt(BizType1) == 3) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 6, Value: "整车" },
                    { Key: 7, Value: "零担" },
                ];
            } else if (parseInt(BizType1) == 6) {
                OceanTransportTypeList = [];
            } else if (parseInt(BizType1) == 13) {
                OceanTransportTypeList = [];
            } else {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                ];
            }
        } else if (parseInt(BusinessesLine) == 3) {
            if (parseInt(BizType1) == 12) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                    { Key: 3, Value: "散货" },
                ];
            }
        } else if (parseInt(BusinessesLine) == 4) {
            if (parseInt(BizType1) == 10) {
                OceanTransportTypeList = [
                    { Key: 3, Value: "散货" },
                ];
            } else {
                OceanTransportTypeList = [];
            }
        } else {
            if (parseInt(BizType1) == 1) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                    { Key: 3, Value: "散货" },
                ];
            } else if (parseInt(BizType1) == 2) {
                OceanTransportTypeList = [
                    { Key: 3, Value: "散货" },
                ];
            } else if (parseInt(BizType1) == 3) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 6, Value: "整车" },
                    { Key: 7, Value: "零担" },
                ];
            } else if (parseInt(BizType1) == 4) {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                ];
            } else {
                OceanTransportTypeList = [
                    { Key: 1, Value: "整箱" },
                    { Key: 2, Value: "拼箱" },
                    { Key: 3, Value: "散货" },
                ];
            }
        }
    }
    return OceanTransportTypeList;
}