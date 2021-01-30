import { request } from 'umi';
import { stringify } from 'qs';

export interface LoginParamsType {
  LoginName: string;
  Password: string;
  SystemID: number;
}

/**
 * 登录
 * @param params
 */
export async function login(params: LoginParamsType) {
  return request<API.ResponseType>(`/api/User/Login?${stringify(params)}`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

/**
 * 退出登录
 */
export async function outLogin() {
  return request('/api/login/outLogin');
}


/**
 * 获取公司List
 */
export async function getBranchList(params?: any) {
  return request(`/api/Board/GetStatisticBranchs?${stringify(params)}`);
}