import global from '../global.d';

export function setSystemMes(sysMes:global.SessionSysSave|null|undefined) {
    //设置token到客户端,并且同时设置登录用户权限到客户端
    if(sysMes){
        let BRANCHLIST = JSON.stringify(sysMes.branchList);            //用于 session 存 JSON 数组写在  setSystemMes  中
        sessionStorage.setItem("USER_NAME", sysMes.userName);
        sessionStorage.setItem("USER_ID", sysMes.userID);
        sessionStorage.setItem("BRANCH_ID", sysMes.branchID);
        sessionStorage.setItem("BRANCH_CODE", sysMes.branchCode);
        sessionStorage.setItem("TOKEN", sysMes.token);
        sessionStorage.setItem("FUNC_CURRENCY", sysMes.funcCurrency);
        //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
        sessionStorage.setItem("SELECT_BRANCH_ID", sysMes.selectBranchID);
        sessionStorage.setItem("SELECT_BRANCH_NAME", sysMes.selectBranchName);
        sessionStorage.setItem("SELECT_YEAR", sysMes.selectYear);
        sessionStorage.setItem("SELECT_BUSINESSESLINE", sysMes.selectBusinessesLine);
        sessionStorage.setItem("SELECT_BIZTYPE1LIST_RADIO", sysMes.selectBizType1List_Radio);
        sessionStorage.setItem("SELECT_OCEAN_TRANSPORT_TYPE", sysMes.selectOceanTransportType);
        sessionStorage.setItem("BRANCHLIST", BRANCHLIST);
    }else{
        sessionStorage.setItem("USER_NAME", '');
        sessionStorage.setItem("USER_ID", '');
        sessionStorage.setItem("BRANCH_ID", '');
        sessionStorage.setItem("BRANCH_CODE", '');
        sessionStorage.setItem("TOKEN", '');
        sessionStorage.setItem("FUNC_CURRENCY", '');
        //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
        sessionStorage.setItem("SELECT_BRANCH_ID", '');
        sessionStorage.setItem("SELECT_BRANCH_NAME", '');
        sessionStorage.setItem("SELECT_YEAR", '');
        sessionStorage.setItem("SELECT_BUSINESSESLINE", '');
        sessionStorage.setItem("SELECT_BIZTYPE1LIST_RADIO", '');
        sessionStorage.setItem("SELECT_OCEAN_TRANSPORT_TYPE", '');
        sessionStorage.setItem("BRANCHLIST", '');
    }
}

//用于 session 存 JSON 数组
function getList(sessionStorage: any, str: string){
    let string = sessionStorage.getItem(str), list = [];
    sessionStorage[str] = string;           //存入
    string = sessionStorage[str];           //读取
    list = JSON.parse(string);              //重新转换为对象
    return list;
}

export function getBranchList() {
    return getList(sessionStorage, "BRANCHLIST");
}

export function getCurrentUser(){
    return sessionStorage.getItem("");
}

export function getUserName() {
    return sessionStorage.getItem("USER_NAME");
}
export function getUserID() {
    return sessionStorage.getItem("USER_ID");
}
export function getBranchID() {
    return sessionStorage.getItem("BRANCH_ID");
}
export function getBranchCode() {
    return sessionStorage.getItem("BRANCH_CODE");
}
export function getToken() {
    return sessionStorage.getItem("TOKEN");
}
export function getFuncCurr() {
    return sessionStorage.getItem("FUNC_CURRENCY");
}

//将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
export function getselectBranchID() {
    return sessionStorage.getItem("SELECT_BRANCH_ID");
}

export function getselectBranchName() {
    return sessionStorage.getItem("SELECT_BRANCH_NAME");
}

export function getselectYear() {
    return sessionStorage.getItem("SELECT_YEAR");
}

export function getselectBusinessesLine() {
    return sessionStorage.getItem("SELECT_BUSINESSESLINE");
}

export function getselectBizType1List_Radio() {
    return sessionStorage.getItem("SELECT_BIZTYPE1LIST_RADIO");
}

export function getselectOceanTransportType() {
    return sessionStorage.getItem("SELECT_OCEAN_TRANSPORT_TYPE");
}