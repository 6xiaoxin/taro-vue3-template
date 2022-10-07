<template>
  <div class="p15 bg-white mt15">
    <div class="flex-y-center">
      <div class="flex-1 popover2">
        <nut-popover
          :visible="modelValue"
          :list="popoverList"
          @choose="selectPopover"
          @open="open"
          @close="close"
        >
          <template #reference>
            <div class="flex-y-center">
              <span>{{ text }}</span>
              <nut-icon
                font-class-name="custom-icon"
                class-prefix="custom-icon"
                name="arrow_down"
                color="#777777"
                size="20"
              />
            </div>
          </template>
        </nut-popover>
      </div>
      <div class="flex-y-center">
        <span @click="more">共{{ total }}家</span>
        <nut-icon
          font-class-name="custom-icon"
          class-prefix="custom-icon"
          name="arrow_right"
          color="#777777"
          size="20"
        />
      </div>
    </div>
    <nut-divider :style="{ color: '#d6d7d9' }" />
    <slot :scope="data"></slot>
    <nut-empty v-if="!data.length" description="暂无数据">
      <template #image>
        <image src="http://cdn.uviewui.com/uview/empty/data.png" />
      </template>
    </nut-empty>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean
  popoverList: Array<any>
  text: string
  total: string | number
  data: Array<any>
}
withDefaults(defineProps<Props>(), {
  modelValue: false,
  popoverList: () => [],
  text: '',
  total: '',
  data: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'selectPopover', _e: any): void
  (e: 'more'): void
}>()
const selectPopover = (e) => {
  emit('selectPopover', e)
}
const open = () => {
  emit('update:modelValue', true)
}
const close = () => {
  emit('update:modelValue', false)
}
const more = () => {
  emit('more')
}
</script>
