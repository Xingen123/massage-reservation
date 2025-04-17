<template>
  <view class="container">
    <!-- 预约选择区域 -->
    <view class="selection-area">
      <!-- 推拿师选择 -->
      <view class="selection-item">
        <text class="label">预约推拿师</text>
        <view class="select-box">
          <text>{{ state.userInfo.techName }}</text>
        </view>
      </view>

      <!-- 日期选择 -->
      <view class="selection-item">
        <text class="label">日期</text>
        <view class="select-box" @click="openCalendarPopup">
          <text>{{ formatDate(formData.workDate) }}</text>
        </view>
      </view>

      <!-- 项目选择 -->
      <view class="selection-item">
        <text class="label">预约的项目</text>
        <view class="select-box" @click="openServicePopup">
          <text>{{ state.projectName }}</text>
        </view>
      </view>

      <!-- 查询按钮 -->
      <view class="selection-item">
        <text class="label">查询按键</text>
        <view class="query-btn" @click="search">
          <text>查询</text>
        </view>
      </view>
    </view>

    <!-- 预约时间格子 -->
    <view>
      <view
        class="appointment-grid"
        v-if="state.appointmentList && state.appointmentList.length"
      >
        <view
          v-for="(item, index) in state.appointmentList"
          :key="index"
          class="grid-item"
          :class="{
            available: item.workStatus === 0,
            booked: item.workStatus === 1,
            pending: item.workStatus === -3,
          }"
          @click="handleAppointmentClick(item)"
        >
          <text class="number">{{ item.projectNum }}号</text>
          <text class="time">({{ item.startWorkTime }})</text>
        </view>
      </view>
      <view class="bg-white w-full rounded-20 py-200" v-else>
        <view class="h-full flex flex-col justify-center items-center">
          <view class="iconfont icon-kongshuju text-80 text-info"> </view>
          <view class="text-info mt-20">暂无排班数据</view>
        </view>
      </view>
    </view>

    <!-- 状态说明 -->
    <view class="status-legend fixed bottom-10 w-full">
      <view class="legend-item">
        <view class="color-box available"></view>
        <text>空闲</text>
      </view>
      <view class="legend-item">
        <view class="color-box booked"></view>
        <text>已预约</text>
      </view>
      <view class="legend-item">
        <view class="color-box pending"></view>
        <text>待确认</text>
      </view>
      <view
        class="legend-item my-appointment text-white px-14 py-6 text-24 rounded-10"
        @click="goPage('reserveList')"
      >
        <text>我的预约</text>
      </view>
    </view>

    <!-- 日历弹窗 -->
    <uni-popup ref="calendarPopup" type="bottom">
      <view class="popup-content calendar-popup">
        <view class="popup-header">
          <text @click="closeCalendarPopup">取消</text>
          <text @click="changeDate">确定</text>
        </view>
        <uni-calendar
          :insert="true"
          :start-date="getToday()"
          :end-date="getEndDate()"
          :date="formData.workDate"
          @change="onCalendarConfirm"
        />
      </view>
    </uni-popup>

    <!-- 推拿师选择弹窗 -->
    <uni-popup ref="therapistPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text>选择推拿师</text>
          <text @click="closeTherapistPopup">关闭</text>
        </view>
        <view class="popup-body">
          <view
            v-for="(item, index) in therapistList"
            :key="index"
            class="popup-item"
            @click="selectTherapist(item)"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 服务项目选择弹窗 -->
    <uni-popup ref="servicePopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text>选择服务项目</text>
          <text @click="closeServicePopup">关闭</text>
        </view>
        <view class="popup-body">
          <view
            v-for="(item, index) in state.projectList"
            :key="index"
            class="popup-item"
            @click="selectService(item)"
          >
            <text>{{ item.projectName }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
  <Dialog ref="DialogRef">
    <view class="text-info text-28 py-24 lin">
      <view>预约时间：{{ formData.workDate }}</view>
      <view>开始时间：{{ state.selectTeacherInfo.startWorkTime }}</view>
      <view>结束时间：{{ state.selectTeacherInfo.endWorkTime }}</view>
      <view>预约项目：{{ state.projectName }}</view>
      <view>推拿师：{{ state.userInfo.techName }}</view>
    </view>
  </Dialog>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { Native, JUMP_TYPE } from "@/utils";
import request from "@/api";
const state = reactive({
  userInfo: {},
  projectList: [],
  workDate: "",
  showAppointmentGrid: false,
  appointmentList: [],
  selectTeacherInfo: {},
});
const DialogRef = ref();
const formData = reactive({
  projectId: "",
  storeId: "",
  techId: "",
  workDate: "",
});
// 获取今天的日期字符串
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// 获取今天+30天的日期字符串
const getEndDate = () => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 31);
  return endDate.toISOString().split("T")[0];
};

// 格式化日期显示
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 选择的推拿师

const therapistPopup = ref(null);

// 选择的日期
const selectedDate = ref(getToday());
const calendarPopup = ref(null);

const servicePopup = ref(null);

// 打开日历弹窗
const openCalendarPopup = () => {
  calendarPopup.value.open("bottom");
};

// 关闭日历弹窗
const closeCalendarPopup = () => {
  calendarPopup.value.close();
};

// 日历确认回调
const onCalendarConfirm = (e) => {
  console.log("选中的日期:", e);
  state.workDate = e.fulldate;
  //closeCalendarPopup();
};

// 打开推拿师选择弹窗
const openTherapistPopup = () => {
  therapistPopup.value.open("bottom");
};

// 关闭推拿师选择弹窗
const closeTherapistPopup = () => {
  therapistPopup.value.close();
};

// 选择推拿师
const selectTherapist = (therapist) => {
  selectedTherapist.value = therapist;
  closeTherapistPopup();
};

// 打开服务选择弹窗
const openServicePopup = () => {
  servicePopup.value.open("bottom");
};

// 关闭服务选择弹窗
const closeServicePopup = () => {
  servicePopup.value.close();
};

// 选择服务
const selectService = (item) => {
  formData.projectId = item.projectId;
  state.projectName = item.projectName;
  closeServicePopup();
};
const changeDate = () => {
  // 这里可以添加日期选择逻辑
  formData.workDate = state.workDate;
  closeCalendarPopup();
  search();
};
// 查询预约时间
const search = async () => {
  uni.showLoading();
  try {
    const { data = [] } = await request.sendRequestByKey("GET_WORK_DETAIL", {
      ...formData,
    });
    console.log("请求成功：", data);
    state.appointmentList = data;
    //state.projectList = data;
    uni.hideLoading();
  } catch (err) {
    uni.hideLoading();
    console.error("请求失败：", err);
  }

  state.showAppointmentGrid = true;
};

// 处理预约格子点击
const handleAppointmentClick = (item) => {
  if (item.workStatus) {
    // 不可预约，显示提示
    uni.showToast({
      title: "该号码不可预约",
      icon: "error",
      duration: 2000,
    });
    return;
  }
  state.selectTeacherInfo = item;
  reservation(item);
};

const goPage = (key: string) => {
  const pageMap = {
    reserveList: "/pages/user/reserveList",
    login: "/pages/login/index",
  };
  Native.push(JUMP_TYPE.SELF, { url: pageMap[key as keyof typeof pageMap] });
};
const getProjectData = async () => {
  try {
    const { data = [] } = await request.sendRequestByKey("GET_PROJECT_LIST");
    console.log("请求成功：", data);
    state.projectList = data;
  } catch (err) {
    console.error("请求失败：", err);
  }
};
const reservation = async (item) => {
  console.log(item);
  const params = {
    workId: item.workId,
  };
  try {
    await DialogRef.value.showDialog({
      title: "提示",
      message: "",
      cancelButtonText: "取消",
      confirmButtonText: "确认",
    });
    await request.sendRequestByKey("RESERVATION", params);
    search();
    uni.showToast({
      title: `您已预约成功`,
      icon: "none",
    });
    console.log("请求成功：", data);
  } catch (err) {
    console.error("请求失败：", err);
  }
};
onLoad((options) => {
  if (options.userInfo) {
    const userInfo = JSON.parse(options.userInfo);
    state.userInfo = userInfo;
    state.projectName = userInfo.projectName;
    formData.projectId = userInfo.projectId;
    formData.storeId = userInfo.storeId;
    formData.workDate = getToday();
    formData.techId = userInfo.techId;
    console.log("onLoad options:", userInfo);
  }
  getProjectData();
  search();
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

/* 顶部标题栏样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: relative;
}

.back-icon {
  font-size: 40rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36rpx;
  font-weight: bold;
}

.header-icons {
  display: flex;
  align-items: center;
}

.dots {
  margin-right: 20rpx;
  font-size: 24rpx;
}

.circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #333;
}

/* 选择区域样式 */
.selection-area {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.selection-item {
  width: 50%;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: #ffd700;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.select-box {
  width: 100%;
  height: 80rpx;
  background-color: #5ecfde;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.query-btn {
  width: 100%;
  height: 80rpx;
  background-color: #ff6b6b;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 预约时间格子样式 */
.appointment-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10rpx;
}

.grid-item {
  width: calc(100% / 7);
  height: 120rpx;
  border: 1rpx solid #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.grid-item.available {
  background-color: #4caf50;
}
.grid-item.booked {
  background-color: #ff0000;
}
.grid-item.pending {
  background-color: #ffa500;
}

.number {
  font-size: 24rpx;
}

.time {
  font-size: 20rpx;
}

/* 状态说明样式 */
.status-legend {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  margin-top: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
}

.color-box {
  width: 30rpx;
  height: 30rpx;
  margin-right: 10rpx;
}

.color-box.available {
  background-color: #4caf50;
}

.color-box.booked {
  background-color: #ff0000;
}

.color-box.pending {
  background-color: #ffa500;
}

.legend-item.my-appointment {
  background-color: #5ecfde;
}

/* 弹窗样式 */
.popup-content {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 20rpx;
}

.popup-body {
  padding: 20rpx 0;
}

.popup-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

/* 日历弹窗样式 */
.calendar-popup {
  padding: 30rpx 30rpx 0 30rpx;
}

/* 字体图标 */
@font-face {
  font-family: "iconfont";
  src: url("data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAKAAAsAAAAABlAAAAI0AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACCcApwfAE2AiQDCAsGAAQgBYRnBzYbmQXIHpIkBQQCIhFRyQjP/f6N3fd8MROtJrXTSZ5EQ0QoFEI0QiGRGJ5Ivv+1aZ8fQgZlYVbCrCzMyvqj3H7LUzxKevL/uekrA8fPtVzWHPbm9CbQgeR6UICOtUGKrEAC98xeBHAEl4lADZrFRnTvGJ/CqAmsk5C1a9eAowqlMsNCjQrNkjVifIGKutMX4HP0fvw3GY6iVBnrxoMbXQPKf8LPQcb/QVcEBNB6OoNtFDIOyMS1xuQlBgzGMKjTZAcVVVD8hP//uHdVraCf5xGlS9+qhdCJZE9tYrHqluIIPlZRqMGHN6vVW/fi3UtxSWVtY/dg72jna7VavHu3+O3bpW/eLLx1a+Ht2wvfvVt8+/bC9+8X3r27cGlZUbMQlXfu9N+61Xf7dt/t2/03b/bfvTtw587A7dv9t271X7vWf/Vq/5Ur/Zcu9V+40H/+fP+5c/1nzvSfPt1/6lTf8eN9x471HTnSd/hw3/79fXv39u3e3bdnT9/OnX3bt/dt29a3ZUvfpk19Gzb0rV3bt3p138qVfcuX9y1d2rdkSd/ixX0LF/bNnds3e3bfrFl9M2f2TZ/eN21a39SpfVOm9E2e3DdxYt+ECX3jx/eNG9c3dmzfmDF9o0f3jRrVN3Jk34gRfcOH9w0b1jd0aN+QIX2DB/cNGtQ3cGDfgAF9/fv39evX17dvX58+fb179/bq1dunR4/u7t27u7q6Ojs7Ozo62tvb29ra2lpaWpqbm5uampqaGhvr6+vr6upqa2tramoqKyurqqoqKyvLy8vLysqKi4uLioqKCgsL8/Pz8/Ly8vJyc3NzcnKys7OzsrIyMzMzMjLSMzLS0tLS0tJSU1NTUlKSk5OTkpISExMTEhLi4+Pj4uJiY2NjYmKio6OjoqIiIyMjIiLCw8PDwsJCQ0NDQkKCg4ODgoICAwMDAgL8/f39/Px8fX19fHy8vb29vLw8PT09PDzc3d3d3Nxc/wPYZ23p")
    format("woff2");
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
