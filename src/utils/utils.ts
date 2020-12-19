/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

/**
 * 获取类型
 * @param a 
 */
export const getType = (a:any):string => {
    let t:string;
    return ((t = typeof(a)) == "object" ? a == null && "null" || Object.prototype.toString.call(a).slice(8,-1) : t).toLowerCase();
}

/**
 * 深赋值数组
 * @param dest 
 * @param source 
 */
export const extend = (dest: any[], source: any[]) : void => {
    for(let p in source)
    {
        if(getType(source[p]) == "array" || getType(source[p]) == "object"){
            dest[p] = getType(source[p]) == "array"? [] : {};
            extend(dest[p],source[p]);
        }else{
            dest[p] = Object.assign(source[p]);
        }
    }
}

/**
 * 动态获取今天是今年中的第几天
 */
export const getCurDay = () => {
    const divisor:number = 24 * 60 * 60 * 1000;
    const initDate:Date = new Date(new Date().getFullYear().toString());
    const curDate:Date = new Date();
    const dateGap:number = Math.ceil((Number(curDate) - Number(initDate))/divisor);
    return dateGap;
}

/**
 * 动态获取系统上线到今年的年份List
 */
export const getYearList = () => {
    const date = new Date();
    const year = date.getFullYear();
    const YearList = [];
    for (let i=2018;i<=year;i++){
        YearList.push({
            Key: i,
            Value: `${i}年`,
        });
    }
    return YearList;
}