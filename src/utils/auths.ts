import global from '../global.d';

export function setSystemMes(sysMes:global.SessionSysSave|null|undefined) {
    //设置token到客户端，并且同时设置登录用户权限到客户端
    if(sysMes){
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
        sessionStorage.setItem("SELECT_OCEAN_TRANSPORT_TYPE", sysMes.selectOceanTransportType);
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
        sessionStorage.setItem("SELECT_OCEAN_TRANSPORT_TYPE", '');
    }
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

export function getselectOceanTransportType() {
    return sessionStorage.getItem("SELECT_OCEAN_TRANSPORT_TYPE");
}