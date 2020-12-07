import { request } from 'umi';
import { TableListItem } from '@/pages/Volume/Volume.d';
import { TableListParams } from '../global.d';

export async function addProject(params: TableListItem) {
  return request('/api/setProject', {
    method: 'POST',
    data: {
      ...params,
      method: 'add',
    },
  });
}

export async function editProject(params: TableListItem) {
  return request('/api/setProject', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function removeProject(params: { ID: number }) {
  return request('/api/setProject', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function searchProject(params?: TableListParams) {
  return request('/api/getProjectList', {
    params,
  });
}