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
            // element.forEach((x: any) => {
            //     if (!(x === undefined || x === '')) {
            //         if (max < x) {
            //             max = x;
            //         }
            //     }
            // })
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
            // element.forEach((x: any) => {
            //     if (!(x === undefined || x === '')) {
            //         if (min > x) {
            //             min = x;
            //         }
            //     }
            // })
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
export const transIntofArraay = (list: Array<Number>) => {
    let IntList: number[] = [];
    if(list && list.length > 0){
        list.map((x:any) => {
            IntList.push(Math.round(x));
        });
    }
    return IntList;
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