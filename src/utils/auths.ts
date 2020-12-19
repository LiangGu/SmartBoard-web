import global from '../global.d';

export function setSystemMes(sysMes:global.SessionSysSave|null|undefined) {
    //设置token到客户端，并且同时设置登录用户权限到客户端
    if(sysMes){
        sessionStorage.setItem("userName", sysMes.userName);
        sessionStorage.setItem("userID", sysMes.userID);
        sessionStorage.setItem("branchID", sysMes.branchID);
        sessionStorage.setItem("branchCode", sysMes.branchCode);
        sessionStorage.setItem("token", sysMes.token);
        sessionStorage.setItem("funcCurrency", sysMes.funcCurrency);
    }else{
        sessionStorage.setItem("userName", '');
        sessionStorage.setItem("userID", '');
        sessionStorage.setItem("branchID", '');
        sessionStorage.setItem("branchCode", '');
        sessionStorage.setItem("token", '');
        sessionStorage.setItem("FuncCurrency", '');
    }
}

export function getUserID() {
    return sessionStorage.getItem("userID");
}

export function getToken() {
    return sessionStorage.getItem("token");
}