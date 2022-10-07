import axios, { AxiosRequestConfig, AxiosResponse } from 'taro-axios'
import Taro from '@tarojs/taro'
import { baseUrl, platform } from '@/config/url'
import api from '@/api/index'
import { _API_RefreshToken } from '@/api/user'

const instance = axios.create({
  baseURL: baseUrl,
  headers: { platform },
  timeout: 30 * 1000,
})

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
})

const showToast = (title: string) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 3000,
  })
}

const showMessage = (title: unknown) => {
  const message = JSON.stringify(title).replace(/"/g, '')
  if (message.indexOf('Network') > -1) {
    showToast('请求失败，请联系客服')
  } else if (message.indexOf('timeout') > -1) {
    showToast('请求超时')
  } else {
    showToast(message)
  }
}

interface ApiResult<T> {
  error: number
  message: string
  data: T
}

// 是否正在刷新
let isRefresh: boolean = false
// 重试队列，每一项将是一个待执行的函数形式
let reqList: Function[] = []

export default function request<T>(options: AxiosRequestConfig = {}) {
  return new Promise<T>((resolve, reject) => {
    instance(options)
      .then((response: AxiosResponse<ApiResult<T>>) => {
        const { error, message, data } = response.data
        switch (error) {
          case 0:
            return resolve(data)
          case 400:
            let { data: d } = response.config
            d = JSON.parse(d)
            if (message === '令牌无效') {
              if (!isRefresh) {
                isRefresh = true
                if (d.method !== 'cyhwork.lander.refresh') {
                  return _API_RefreshToken().then(() => {
                    api<T>(d.method, d.biz, d.headers)
                      .then(async (res) => {
                        resolve(res)
                        // 执行重试队列
                        await reqList.forEach((fn: Function) => fn())
                        // 执行完成后需要清空重试队列
                        await (() => {
                          reqList = []
                        })()
                      })
                      .catch(() => {
                        reject()
                      })
                      .finally(() => {
                        isRefresh = false
                      })
                  })
                } else {
                  return reject()
                }
              } else {
                // 正在刷新token，把后面的请求存在队列中
                return new Promise(() => {
                  reqList.push(() => {
                    api<T>(d.method, d.biz, d.headers)
                      .then((res) => {
                        resolve(res)
                      })
                      .catch(() => {
                        reject()
                      })
                  })
                })
              }
            } else {
              showMessage(message)
              return reject()
            }
          default:
            showMessage(message)
            return reject()
        }
      })
      .catch((result) => {
        showMessage(result?.data?.message ?? result?.message)
        reject(result)
      })
  })
}
