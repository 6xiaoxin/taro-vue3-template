import Taro from '@tarojs/taro'
import { filterTime, getStartAndEndDate } from './common'
import { useUser } from '@/stores'

export default {
  data() {
    return {
      arrayTime: {
        day: getStartAndEndDate('day'),
        week: getStartAndEndDate('week'),
        month: getStartAndEndDate('month'),
        year: getStartAndEndDate('year'),
      },
    }
  },
  computed: {
    loginState() {
      return useUser().loginState
    },
  },
  methods: {
    toPage(url: string, needLogin: boolean = true, mode = 'navigateTo') {
      if (needLogin && !useUser().loginState) {
        Taro.navigateTo({
          url: '/pages/main/login/index',
        })
        return
      }
      if (url) {
        switch (mode) {
          case 'navigateTo':
            Taro.navigateTo({ url })
            break
          case 'redirectTo':
            Taro.redirectTo({ url })
            break
          case 'switchTab':
            Taro.switchTab({ url })
            break
          case 'reLaunch':
            Taro.reLaunch({ url })
            break
        }
      }
    },
    backToPreviousPage(
      timeout: number = 0,
      updatePage: boolean = false,
      toast?: string,
      data?: any
    ) {
      const pages = Taro.getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage !== undefined &&
        prevPage.setData({
          updatePage,
          ...data,
        })
      if (toast) {
        Taro.showToast({
          title: toast,
          duration: timeout,
        })
      }
      setTimeout(() => {
        Taro.navigateBack()
      }, timeout)
    },
    filterTime(time: any, formater?: string): string {
      return filterTime(time, formater)
    },
    callPhone(phoneNumber: string) {
      Taro.makePhoneCall({
        phoneNumber,
      })
    },
    copyText(data: string) {
      Taro.setClipboardData({
        data,
        success() {
          Taro.showToast({
            title: '已复制到剪切板',
            icon: 'success',
          })
        },
      })
    },
    formatNumber(num: string | number | null, toFix: number = 2): string {
      if (!num) {
        return (0).toFixed(toFix)
      } else {
        return Number(num).toFixed(toFix)
      }
    },
  },
}
