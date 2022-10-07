import Taro from '@tarojs/taro'

type rules = Record<string, rulesItem[]>
interface rulesItem {
  message: string
  required: boolean
  minLength: number
  maxLength: number
  pattern: RegExp
  validator: Function
}

export default {
  setLocal(name: string, data) {
    Taro.setStorageSync(name, data)
  },
  getLocal(name: string) {
    return Taro.getStorageSync(name)
  },
  deleteLocal(name: string) {
    Taro.removeStorageSync(name)
  },
  hasLocal(name: string) {
    const res = Taro.getStorageInfoSync()
    return res.keys.includes(name)
  },
  clearLocal() {
    Taro.clearStorageSync()
  },
  guid() {
    return 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  randomNumber(len: number) {
    const chars = '0123456789'
    const maxPos = chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return Number(str)
  },
  typeOf(obj: any): any {
    const toString: any = Object.prototype.toString
    const map: any = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
    }
    return map[toString.call(obj)]
  },
  deepClone(data: any): any {
    // 获取传⼊拷贝函数的数据类型
    const type = this.typeOf(data)
    // 定义⼀个返回any类型的数据
    let reData: any
    // 递归遍历⼀个array类型数据，
    if (type === 'array') {
      reData = []
      for (let i = 0; i < data.length; i++) {
        reData.push(this.deepClone(data[i]))
      }
    } else if (type === 'object') {
      //递归遍历⼀个object类型数据
      reData = {}
      for (const i in data) {
        reData[i] = this.deepClone(data[i])
      }
    } else {
      // 返回基本数据类型
      return data
    }
    // 将any类型的数据return出去，作为deepClone的结果
    return reData
  },
  valid(rules: rules, form: Record<string, any>) {
    //表单验证
    for (const key in rules) {
      for (let i = 0; i < rules[key].length; i++) {
        if (rules[key][i].required) {
          if (form[key] === '') {
            Taro.showToast({
              icon: 'none',
              title: rules[key][i].message,
            })
            return false
          }
          if (form[key] instanceof Array && !form[key].length) {
            Taro.showToast({
              icon: 'none',
              title: rules[key][i].message,
            })
            return false
          }
        } else if (rules[key][i].pattern) {
          if (!rules[key][i].pattern.test(form[key])) {
            Taro.showToast({
              icon: 'none',
              title: rules[key][i].message,
            })
            return false
          }
        } else if (rules[key][i].minLength) {
          if (form[key].length < rules[key][i].minLength) {
            Taro.showToast({
              icon: 'none',
              title: rules[key][i].message,
            })
            return false
          }
        } else if (rules[key][i].maxLength) {
          if (form[key].length > rules[key][i].maxLength) {
            Taro.showToast({
              icon: 'none',
              title: rules[key][i].message,
            })
            return false
          }
        } else if (rules[key][i].validator) {
          if (typeof rules[key][i].validator === 'function') {
            if (!rules[key][i].validator()) {
              return false
            }
          }
        }
      }
    }
    return true
  },
  // 页面返回更新数据方法
  useDidShow(callback: (...args: any) => void): void {
    const pages = Taro.getCurrentPages()
    const currPage = pages[pages.length - 1]
    if (currPage.data.updatePage) {
      callback(currPage.data)
      currPage.data.updatePage = false
    }
  },
}
