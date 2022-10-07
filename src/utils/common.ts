import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import toObject from 'dayjs/plugin/toObject'
dayjs.extend(toObject)
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Taro from '@tarojs/taro'
import util from './util'

/**
 *
 * @param time
 * @param formater
 * @returns date
 */
export const filterTime = (time?: string | number | dayjs.Dayjs | Date, formater?: string) => {
  if (time) {
    return dayjs(time).format(formater || 'YYYY-MM-DD HH:mm:ss')
  } else {
    return ''
  }
}

export type chooseImageCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export class chooseImage {
  private count: chooseImageCount = 9
  private tempFilePaths: string[] = []
  private base64ImgArr: string[] = []
  constructor(count: chooseImageCount = 9) {
    this.count = count
  }
  public chooseImage(): Promise<string[]> {
    this.tempFilePaths = []
    this.base64ImgArr = []
    return new Promise((resolve, reject) => {
      Taro.chooseImage({
        count: this.count,
        sizeType: ['compressed'],
        success: (res) => {
          this.tempFilePaths = res.tempFilePaths
          resolve(res.tempFilePaths)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  }
  public toBase64(): Promise<string[]> {
    const _this = this
    return new Promise((resolve, reject) => {
      this.tempFilePaths.forEach((item) => {
        Taro.getImageInfo({
          src: item,
          success(imageInfo) {
            Taro.getFileSystemManager().readFile({
              filePath: item,
              encoding: 'base64',
              success: (res) => {
                _this.base64ImgArr.push(`data:image/${imageInfo.type};base64,${res.data}`)
                if (_this.base64ImgArr.length === _this.tempFilePaths.length) {
                  resolve(_this.base64ImgArr)
                }
              },
              fail: (err) => {
                reject(err)
              },
            })
          },
        })
      })
    })
  }
  public chooseImageToBase64(count: chooseImageCount = 9): Promise<string[]> {
    this.count = count
    return new Promise((resolve, reject) => {
      this.chooseImage()
        .then(() => {
          Taro.showLoading({
            title: '图片处理中',
          })
          this.toBase64().then((res) => {
            resolve(res)
            Taro.hideLoading()
          })
        })
        .catch(() => {
          reject()
          Taro.showToast({
            title: '请重试',
            icon: 'error',
          })
        })
    })
  }
}

export function ifEmpty(...values: any[]) {
  return values.find(
    (value) =>
      value !== undefined && value !== null && value !== '' && value !== 0 && value !== false
  )
}

export function isEmpty(value) {
  return value === undefined || value === null || value === '' || value === 0 || value === false
}

export class paramsOperation<T> {
  private params: T
  constructor(params: T) {
    this.params = util.deepClone(params)
  }
  public set(form, params) {
    const item = form
    for (const i in params) {
      item[i] = params[i]
    }
    return item
  }
  public reset(): typeof this.params {
    return util.deepClone(this.params)
  }
}

/**
 * 获取年/月/周/日的开始和结束时间
 * @param type
 * @returns [startDate,endDate]
 */
export function getStartAndEndDate(type: 'day' | 'week' | 'month' | 'year'): string[] {
  if (type === 'day') {
    const date = dayjs().format('YYYY-MM-DD')
    return [date, date]
  } else {
    return [
      dayjs()
        .startOf(type)
        .format('YYYY-MM-DD'),
      dayjs()
        .endOf(type)
        .format('YYYY-MM-DD'),
    ]
  }
}

/**
 * 获取距离当前日期n周的开始日期和结束日期
 * @param count
 * @param day
 * @returns [startDate,endDate]
 */
export function weekGetDate(count: number = 0, day: number = 7): string[] {
  return [
    dayjs()
      .weekday(count * day)
      .format('YYYY-MM-DD'),
    dayjs()
      .weekday(count * day + 6)
      .format('YYYY-MM-DD'),
  ]
}

/**
 * 获取日期是当年的第几周
 * @param now
 * @returns number
 */
export function getYearWeek(now: Date | string | number): number {
  const { years, months, date } = dayjs(now).toObject()
  const date1 = new Date(years, months, date),
    date2 = new Date(years, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
  return Math.ceil((d + (date2.getDay() + 1)) / 7)
}

/**
 * 获取日期月的最后一天
 * @param date
 * @returns string
 */
export function getMonthLastDay(date: string | Date): string {
  return dayjs(date)
    .endOf('month')
    .format('YYYY-MM-DD')
}

/**
 * 日期加减
 * @param type
 * @param date
 * @param num
 * @returns day
 */
export function addOrReduceDate(type: 'D' | 'M' | 'Y' | 'A', date: string, num: number) {
  const nowDate = new Date(date)
  if (type === 'Y') {
    nowDate.setFullYear(nowDate.getFullYear() + num)
  }
  if (type === 'M') {
    nowDate.setMonth(nowDate.getMonth() + num)
  }
  if (type === 'D') {
    nowDate.setDate(nowDate.getDate() + num)
  }
  if (type === 'A') {
    nowDate.setFullYear(nowDate.getFullYear() + num)
    nowDate.setMonth(nowDate.getMonth() + num)
    nowDate.setDate(nowDate.getDate() + num)
  }
  const year = nowDate.getFullYear() // 年
  let month: string | number = nowDate.getMonth() + 1 // 月
  let strDate: string | number = nowDate.getDate() //日
  if (month >= 1 && month <= 9) {
    month = `0${month}`
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`
  }
  return `${year}-${month}-${strDate}`
}

/**
 *
 * @param time 时间字符串
 * @param friendly 显示xxx时间前 (显示为几分钟前 几小时前 几天前 几个月前 )
 * @returns
 */
export function getTimeFromNow(time: string) {
  return dayjs(time)
    .fromNow()
    .replace(' ', '')
}
