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
    return  Math.ceil((<any>new Date() - <any>new Date(new Date().getFullYear().toString())) / (24 * 60 * 60 * 1000));
}

/**
 * 获得当前浏览器语言
 */
export function GetCurrentLang(){
    //检测浏览器语言
    let currentLang = navigator.language;
    if(!currentLang){
        //判断IE浏览器使用语言
        currentLang = navigator.browserLanguage;
    }
    currentLang = currentLang === 'zh-CN' ? 'zh-CN' : 'en-US';
    return currentLang;
}

/**
 * 解析 "错误消息提示" 编号 "|" 后面的信息
 * @param str
 * @returns {{}}
 */
export function getCode(str:string){
    let num = null, textSubstr = "", msgParam: any = {};
    if(!!str){
        if(str.indexOf("|")>-1){
            // 取得 "|" 所在的位置
            num = str.indexOf("|");
            // 截取 "|" 前面的字符
            msgParam.SerialNum =  str.substr(0, Number(num));
            // 截取 "|" 后面的字符
            textSubstr =  str.substr(Number(num)+1,str.length);
        } else {
            msgParam.SerialNum = str;
        }
    }
    // 替换所有的 "|"
    msgParam.Code = textSubstr.replace(/\|/g, ',');
    return msgParam;
}

/**
 * 错误消息提示
 * @param msgParam
 * @param ID
 * @returns {string}
 */
export function msgError(msgParam:any,){
    const Lang = GetCurrentLang() === 'zh-CN';
    let msg = "", SerialNum = msgParam.SerialNum;
    if(SerialNum){
        let IsNum = SerialNum.substr(1, Number(4));
        if(!isNaN(IsNum)){
            switch (SerialNum) {
                //   region用户登录模块
                case "U001": Lang ? msg = "密码错误" : msg = "Invalid Password"; break;
                case "U002": Lang ? msg = "您没有权限访问该系统,请联系管理员" : msg = "You are not Authorized to get access the module. Please contact System Administrator"; break;
                case "U003": Lang ? msg = "你的账号已被冻结" : msg = "User is currently disabled"; break;
                case "U004": Lang ? msg = "用户名不存在" : msg = "Invalid User ID"; break;
                case "U005": Lang ? msg = "您输入的原始密码有误" : msg = "Invalid Password"; break;
                case "U006": Lang ? msg = "用户信息异常" : msg = "Invalid User Details"; break;
                //   endregion
                default:break;
            }
        }else{
            msg = SerialNum;
        }
    }
    return msg;
}