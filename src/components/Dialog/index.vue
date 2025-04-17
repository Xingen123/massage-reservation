<template>
  <view v-if="state.visible" class="dialog-mask" @click="handleMaskClick">
    <view class="dialog-container">
      <view class="dialog-title" v-if="state.title">{{ state.title }}</view>
      <view
        class="dialog-message"
        v-if="state.message"
        v-html="state.message"
      ></view>

      <slot class="dialog-message"></slot>
      <view class="dialog-buttons">
        <view
          size="mini"
          :style="{ color: state.cancelButtonColor }"
          @click="onCancel"
          v-if="state.showCancelButton"
        >
          {{ state?.cancelButtonText }}
        </view>
        <view
          size="mini"
          :style="{ color: state.confirmButtonColor }"
          @click="onConfirm"
        >
          {{ state.confirmButtonText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 定义对话框状态
const state = reactive({
  visible: false,
  maskClick: false,
  title: "",
  message: "",
  cancelButtonText: "取消",
  confirmButtonText: "确定",
  cancelButtonColor: "#cccccc",
  confirmButtonColor: "#1296db",
  showCancelButton: true,
  onConfirm: () => {},
  onCancel: () => {},
});
const onConfirm = async () => {
  state.onConfirm();
  state.visible = false;
};
const onCancel = () => {
  state.onCancel();
  state.visible = false;
};
const handleMaskClick = () => {
  if (state.maskClick) {
    state.visible = false;
  }
};
// 完善 showDialog 方法
const showDialog = (config: {
  title?: string;
  message?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  showCancelButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  return new Promise((resolve, reject) => {
    const { onConfirm, onCancel, ...rest } = config;
    Object.assign(state, rest);
    state.onConfirm = () => {
      onConfirm && onConfirm();
      resolve(true);
    };
    state.onCancel = () => {
      onCancel && onCancel();
      reject(false);
    };
    state.visible = true;
  });
};
defineExpose({ showDialog });
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-container {
  position: relative;
  z-index: 99999;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 300px;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.dialog-message {
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
  color: #999;
}

.dialog-buttons {
  display: flex;
  justify-content: space-around;
}

.dialog-buttons button {
  border: none;
  background-color: transparent;
  font-size: 16px;
  padding: 10px 20px;
}
</style>
