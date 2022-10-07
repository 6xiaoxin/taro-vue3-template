<template>
  <nut-icon
    font-class-name="custom-icon"
    class-prefix="custom-icon"
    name="31saoma"
    size="40"
    @click="loginState ? scanCode() : toPage('')"
  />
  <nut-dialog
    title=""
    custom-class="dialog-empty vw90"
    v-model:visible="scanCodeFun.inputBox.visible"
    text-align="left"
    :cancel-text="scanCodeFun.inputBox.cancelCaption ?? '取消'"
    :before-close="() => false"
    @cancel="() => scanCodeFun.okCallback && scanCodeFun.okCallback('cancel')"
    @ok="() => scanCodeFun.okCallback && scanCodeFun.okCallback('ok')"
  >
    <div class="flex flex-between" style="margin-top: -20x">
      <div class="color-red font-xl py10 mb20">选择单据</div>
      <!-- eslint-disable-next-line prettier/prettier -->
      <nut-icon class="color-red" name="circle-close" size="24" @click="scanCodeFun.inputBox.visible = false" />
    </div>
    <div class="mb6 font-md color-red text-line15">
      <!-- eslint-disable-next-line prettier/prettier -->
      <nut-radiogroup v-model="scanCodeFun.inputBox.type" text-position="right" direction="horizontal">
        <nut-radio :label="13">发货单</nut-radio>
        <nut-radio :label="14">退货单</nut-radio>
        <nut-radio :label="15">调货单</nut-radio>
        <nut-radio :label="12">箱头码</nut-radio>
      </nut-radiogroup>
    </div>
    <nut-input
      type="text"
      v-model="scanCodeFun.inputBox.value"
      placeholder="请输入单据单号、ID"
      class="mb10"
      :right-icon="scanCodeFun.inputBox.type == 12 ? '' : 'horizontal'"
      @click-right-icon="scanCodeFun.selectBill({ 13: 1, 14: 6, 15: 8 }[scanCodeFun.inputBox.type])"
    />
  </nut-dialog>
</template>

<script lang="ts" setup>
import { useUser } from '@/stores'
import api from '@/api'
import scanCodeBiz from '@/utils/scancode'
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, getCurrentInstance, reactive } from 'vue'
const proxy = getCurrentInstance()?.proxy
const loginState = computed(() => {
  return useUser().loginState
})
const scanCodeFun = {
  inputBox: reactive({
    visible: false,
    cancelCaption: '关闭',
    title: '不知道',
    value: '',
    type: 13,
    billType: 0,
  }),
  okCallback(button) {
    switch (button) {
      case 'ok':
        if (this.inputBox.value.trim() === '') {
          Taro.showToast({ title: '不能为空' })
          return
        }
        api('cyhwork.consignment.qrcode.info', {
          code: scanCodeFun.inputBox.value,
          way: '',
          expected_type: this.inputBox.type,
        })
          .then((res: any) => {
            if (parseInt(res.type) !== this.inputBox.type)
              Taro.showToast({ title: '您录入的数据不对，' + this.inputBox.title, icon: 'error' })
            else {
              this.toPage(res.type, res[res.info_field], res.id)
            }
          })
          .catch((e) => {
            Taro.showToast({ title: e, icon: 'error' })
          })
        break
      default:
        scanCodeFun.inputBox.visible = false
        break
    }
  },
  selectBill(type) {
    proxy?.toPage(`/pages/tools/invoice-bill/select?type=${type}`)
  },
  toPage(type, codeInfo, codeId) {
    switch (type) {
      case 12: // 箱头码
        proxy?.toPage(`/pages/tools/box/scancode?id=${codeId}`)
        break
      case 13: // 寄售发货单
        // eslint-disable-next-line prettier/prettier
        proxy?.toPage(`/pages/consignment/invoice-detail/index?id=${codeInfo.id ?? codeInfo}`)
        break
      case 14: // 寄售退货单
        // eslint-disable-next-line prettier/prettier
        proxy?.toPage(`/pages/consignment/refund-bill/edit?id=${codeInfo.id ?? codeInfo}`, true, 'redirectTo')
        break
      case 15: // 寄售调货单
        // eslint-disable-next-line prettier/prettier
        proxy?.toPage(`/pages/consignment/pickingcargo-bill/edit?id=${codeInfo.id ?? codeInfo}`)
        break
    }
  },
  getCodeType(billType) {
    return { 1: 13, 6: 14, 8: 15 }[parseInt(billType)]
  },
}

const scanCode = () => {
  scanCodeBiz({
    way: '首页扫码',
    cbGoods(info, code) {
      let infoURL = encodeURIComponent(JSON.stringify(info))
      proxy?.toPage(`/pages/tools/goods/scancode?id=${code}&info=${infoURL}`)
    },
    cbBox(_info, code): void {
      proxy?.toPage(`/pages/tools/box/scancode?id=${code}`)
    },
    cbDeliveryBill(info) {
      proxy?.toPage(`/pages/consignment/invoice/index?id=${info.id}`)
    },
    cbExpress(info) {
      console.log(info)
    },
    cbCancel() {
      scanCodeFun.inputBox.visible = true
    },
  })
}

useDidShow(function() {
  proxy?.$utils.useDidShow((res) => {
    if (res.bill) {
      scanCodeFun.toPage(
        scanCodeFun.getCodeType(res.bill.type),
        { id: res.bill.id, type: res.bill.type },
        null
      )
    }
  })
})
</script>
