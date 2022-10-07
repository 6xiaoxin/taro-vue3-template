import request from '@/utils/request'
import { path, version as v } from '@/config/url'
import { useUser } from '@/stores'

/**
 *
 * @param method
 * @param biz
 * @param headers
 * @returns
 */
export default async function api<T>(method: string, biz?: Object, headers: any = {}) {
  const token = useUser().token.access_token
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }
  return await request<T>({
    method: 'post',
    url: `${path}?method=${method}`,
    headers,
    data: { v, biz, method },
  })
}
