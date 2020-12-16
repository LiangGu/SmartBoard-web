import { request } from 'umi';

export async function query() {
  return request<LoginUserInfo.CurrentUser[]>('/api/users');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: LoginUserInfo.NoticeIconData[] }>('/api/notices');
}