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