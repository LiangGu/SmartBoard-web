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
        //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
        sessionStorage.setItem("selectBranchID", sysMes.selectBranchID);
        sessionStorage.setItem("selectBranchName", sysMes.selectBranchName);
        sessionStorage.setItem("selectYear", sysMes.selectYear);
        sessionStorage.setItem("selectOceanTransportType", sysMes.selectOceanTransportType);
    }else{
        sessionStorage.setItem("userName", '');
        sessionStorage.setItem("userID", '');
        sessionStorage.setItem("branchID", '');
        sessionStorage.setItem("branchCode", '');
        sessionStorage.setItem("token", '');
        sessionStorage.setItem("FuncCurrency", '');
        //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
        sessionStorage.setItem("selectBranchID", '');
        sessionStorage.setItem("selectBranchName", '');
        sessionStorage.setItem("selectYear", '');
        sessionStorage.setItem("selectOceanTransportType", '');
    }
}

export function getUserName() {
    return sessionStorage.getItem("userName");
}
export function getUserID() {
    return sessionStorage.getItem("userID");
}
export function getBranchID() {
    return sessionStorage.getItem("branchID");
}
export function getBranchCode() {
    return sessionStorage.getItem("branchCode");
}
export function getToken() {
    return sessionStorage.getItem("token");
}
export function getFuncCurr() {
    return sessionStorage.getItem("FuncCurrency");
}

//将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
export function getselectBranchID() {
    return sessionStorage.getItem("selectBranchID");
}

export function getselectBranchName() {
    return sessionStorage.getItem("selectBranchName");
}

export function getselectYear() {
    return sessionStorage.getItem("selectYear");
}

export function getselectOceanTransportType() {
    return sessionStorage.getItem("selectOceanTransportType");
}