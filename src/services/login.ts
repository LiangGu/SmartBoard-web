import { request } from 'umi';
import { stringify } from 'qs';

export interface LoginParamsType {
  LoginName: string;
  Password: string;
  SystemID: number;
}

export async function login(params: LoginParamsType) {
  return request<API.ResponseType>(`/api/User/Login?${stringify(params)}`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}