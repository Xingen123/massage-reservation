<template>
  <view class="page">
    <view class="formbox">
      <view class="section">
        <!-- 添加登录/注册切换tab -->
        <view class="tab-box">
          <view
            class="tab-item"
            :class="{ active: activeTab === 'login' }"
            @click="switchTab('login')"
            >用户登录</view
          >
          <!-- <view
            class="tab-item"
            :class="{ active: activeTab === 'register' }"
            @click="switchTab('register')"
            >用户注册</view
          > -->
        </view>

        <view class="group_4">
          <!-- 手机号输入框 -->
          <input
            class="input-box"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            v-model="phone"
          />
          <!-- 验证码输入框和获取验证码按钮 -->
          <view class="verify-code-box">
            <input
              class="code-input"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              v-model="verifyCode"
            />
            <text
              class="get-code-btn"
              :class="{ disabled: counting }"
              @click="getVerifyCode"
              >{{ codeText }}</text
            >
          </view>
          <!-- 注册时显示密码输入框 -->
          <template v-if="activeTab === 'register'">
            <input
              class="password-input"
              type="password"
              placeholder="请输入密码"
              v-model="password"
            />
            <input
              class="password-input"
              type="password"
              placeholder="请确认密码"
              v-model="confirmPassword"
            />
          </template>
        </view>
        <view class="group_5">
          <!-- 登录/注册按钮 -->
          <button class="login-btn" @click="handleSubmit">
            {{ activeTab === "login" ? "登录" : "注册" }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import request from "@/api";
import { useSystemStore } from "@/store";
const systemStore = useSystemStore();
// 定义响应式数据
const activeTab = ref("login");
const phone = ref("");
const verifyCode = ref("");
const counting = ref(false);
const timer = ref(null);
const countdown = ref(60);
const codeText = ref("获取验证码");
const password = ref("");
const confirmPassword = ref("");

// 切换tab
const switchTab = (tab) => {
  activeTab.value = tab;
  // 切换时清空表单
  phone.value = "";
  verifyCode.value = "";
  password.value = "";
  confirmPassword.value = "";
};

// 获取验证码
const getVerifyCode = async () => {
  if (counting.value) return;
  // 验证手机号
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
    return;
  }

  try {
    const params = {
      mobile: phone.value,
    };
    await request.sendRequestByKey("SEND_SMS", params);
    // 开始倒计时
    counting.value = true;
    countdown.value = 60;
    codeText.value = `${countdown.value}s`;
    timer.value = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
        codeText.value = `${countdown.value}s`;
      } else {
        counting.value = false;
        codeText.value = "获取验证码";
        clearInterval(timer.value);
      }
    }, 1000);
  } catch (error) {
    console.log(error);
  }

  // TODO: 调用验证码接口
};

// 处理提交
const handleSubmit = () => {
  if (activeTab.value === "login") {
    handleLogin();
  } else {
    handleRegister();
  }
};

// 登录处理
const handleLogin = async () => {
  // TODO: 调用登录接口
  if (!phone.value || !verifyCode.value) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none",
    });
    return;
  }
  await systemStore.logIn({ mobile: phone.value, code: verifyCode.value });
};

// 注册处理
const handleRegister = () => {
  if (
    !phone.value ||
    !verifyCode.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none",
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    uni.showToast({
      title: "两次密码输入不一致",
      icon: "none",
    });
    return;
  }

  // TODO: 调用注册接口
};

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped lang="css">
.mt-27 {
  margin-top: 54rpx;
}
.ml-13 {
  margin-left: 26rpx;
}
.mt-13 {
  margin-top: 26rpx;
}
.page {
  padding-top: 24rpx;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background-image: linear-gradient(
    to bottom,
    #a88bdb,
    #8ba5db,
    #b8d1e8,
    #f5d6e0
  );
}
.group_2 {
  overflow-x: hidden;
  height: 1512rpx;
}
.group_3 {
  margin-top: -16rpx;
  overflow-x: hidden;
}
.image_5 {
  margin-left: 256rpx;
  width: 118.1333vw;
  height: 124.5333vw;
}
.image_6 {
  width: 372rpx;
  height: 372rpx;
}
.pos {
  position: absolute;
  left: 0;
  top: 25.46rpx;
}
.image_7 {
  margin-left: -224rpx;
  margin-top: -524rpx;
  width: 608rpx;
  height: 640rpx;
}
.formbox {
}
.section {
  padding: 142rpx 60rpx 92rpx;

  border-radius: 48rpx;
}
.section_2 {
  background-color: #1296db;
  border-radius: 6rpx;
  width: 72rpx;
  height: 8rpx;
}
.group_4 {
  margin-top: 72rpx;
}
.group_5 {
  margin-top: 48rpx;
}

/* 输入框相关样式 */
.input-box {
  background-color: #f5f8ff;
  border-radius: 12rpx;
  height: 98rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
}

.verify-code-box {
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  background-color: #f5f8ff;
  border-radius: 12rpx;
  padding: 0 32rpx;
  height: 98rpx;
}

.code-input {
  flex: 1;
  font-size: 28rpx;
}

.get-code-btn {
  color: #1296db;
  font-size: 28rpx;
  padding-left: 26rpx;
  position: relative;
}

.get-code-btn::before {
  content: "";
  position: absolute;
  left: 13rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 2rpx;
  height: 26rpx;
  background-color: #0000003d;
}

.get-code-btn.disabled {
  color: #999;
}

.login-btn {
  background-color: #1296db;
  color: #ffffff;
  border-radius: 24rpx;
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  font-size: 32rpx;
  border: none;
}

.login-btn::after {
  border: none;
}

/* Tab切换相关样式 */
.tab-box {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.tab-item {
  font-size: 32rpx;
  color: #666;
  padding: 0 30rpx;
  position: relative;
}

.tab-item.active {
  color: #1296db;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

/* 注册表单额外的样式 */
.password-input {
  margin-top: 24rpx;
  background-color: #f5f8ff;
  border-radius: 12rpx;
  height: 98rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
}
</style>
