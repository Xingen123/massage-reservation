<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">全部服务</text>
    </view>
    <view class="content-wrapper">
      <!-- 左侧菜单栏 -->
      <view class="sidebar">
        <view
          v-for="(item, index) in state.menuItems"
          :key="index"
          class="menu-item"
          :class="{ active: state.currentIndex === index }"
          @click="selectService(item, index)"
        >
          <text>{{ item.projectName }}</text>
        </view>
      </view>
      <!-- 右侧内容区 -->
      <view
        class="content-area h-full overflow-y-scroll"
        :style="gradientStyle"
      >
        <view>
          <OnlineServices
            v-if="state.currentType === 'appointment'"
            :projectList="state.projectList"
          />
          <PediatricConditioning
            v-if="['pediatricConditioning'].includes(state.currentType)"
            :projectId="pediatricConditioningConfig.projectId"
            :storeId="pediatricConditioningConfig.storeId"
            :techId="pediatricConditioningConfig.techId"
          />
          <LocationStoreList
            v-if="['location', 'consultation'].includes(state.currentType)"
            :type="state.currentType"
          />
        </view>
      </view>
    </view>
    <!-- 底部导航 -->
    <TabBar />
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import OnlineServices from "./components/OnlineServices/index.vue";
import PediatricConditioning from "./components/PediatricConditioning/index.vue";
import LocationStoreList from "./components/LocationStoreList/index.vue";
import request from "@/api";
const defaultMtniu = [
  { type: "appointment", projectName: "在线预约" },
  { type: "location", projectName: "定位导航" },
  { type: "consultation", projectName: "问诊咨询" },
  { type: "pediatricConditioning", projectName: "小儿理疗" },
];
// 菜单项数据

const state = reactive({
  menuItems: [],
  currentIndex: 0,
  currentType: "appointment",
  menuItemsMap: {},
  userInfo: {},
  projectList: [],
});
const pediatricConditioningConfig = reactive({
  projectId: "",
  storeId: "",
  techId: "",
});
// 当前选中的服务
const currentService = ref(1);

// 选择服务
const selectService = (item, i) => {
  state.currentIndex = i;
  console.log("itemitemitemitem", item, i);
  if (item?.type?.includes("store")) {
    state.currentType = "pediatricConditioning";
    pediatricConditioningConfig.projectId = "";
    pediatricConditioningConfig.storeId = item.storeId;
    pediatricConditioningConfig.techId = item.techId;
    return;
  }
  if (item.type === "pediatricConditioning") {
    pediatricConditioningConfig.projectId = 1;
    pediatricConditioningConfig.storeId = "";
    pediatricConditioningConfig.techId = "";
  }
  state.currentType = item.type;
};
// const getData = async () => {
//   try {
//     const { data = [] } = await request.sendRequestByKey("GET_PROJECT_LIST");
//     console.log("请求成功：", data);

//   } catch (err) {
//     console.error("请求失败：", err);
//   }
// };
const getProjectData = async () => {
  try {
    const [projectRes, storeRes] = await Promise.all([
      request.sendRequestByKey("GET_PROJECT_LIST"),
      request.sendRequestByKey("GET_STORE_LIST"),
    ]);
    const projectList = projectRes.data || [];
    state.projectList = projectList;
    const storeList = storeRes.data || [];
    const newStoreList = storeList.map((item) => {
      return {
        ...item,
        projectName: item.storeName,
        projectId: item.storeId,
        type: "store",
      };
    });
    console.log("请求成功：projectResprojectRes", projectRes, projectRes);
    state.menuItems = [...defaultMtniu, ...newStoreList];
    state.menuItemsMap = [...newStoreList].reduce((map, item) => {
      map[item.projectId] = item;
      return map;
    }, {});
    return Promise.resolve();
  } catch (err) {
    console.error("请求失败：", err);
    return Promise.reject();
  }
};

// const getStoreData = async () => {
//   try {
//     const { data = [] } = await ;
//     console.log("请求成功：", data);
//     state.menuItems = [...defaultMtniu, ...data];
//     state.storeList = data;
//   } catch (err) {
//     console.error("请求失败：", err);
//   }
// };

// 背景渐变样式
const gradientStyle = computed(() => {
  return {
    backgroundImage:
      "linear-gradient(to bottom, #a88bdb, #8ba5db, #b8d1e8, #f5d6e0)",
  };
});

onLoad(async (options) => {
  // 获取数据
  // getData();
  // getStoreData();
  await getProjectData();
  const activeIndex = options?.activeIndex;
  console.log(activeIndex, "activeIndex");
  activeIndex &&
    selectService(state.menuItems[activeIndex], Number(activeIndex));
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #fff;
}

/* 顶部标题样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  color: #333;
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

/* 内容区布局 */
.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100vh - 100rpx);
}

/* 左侧菜单栏样式 */
.sidebar {
  width: 200rpx;
  background-color: #f5f5f5;
}

.menu-item {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #e0e0e0;
  font-size: 24rpx;
  color: #a88bdb;
  text-align: center;
  padding: 0 10rpx;
}

.menu-item.active {
  background-image: linear-gradient(rgb(168, 139, 219), rgb(184, 209, 232));
  color: #812895;
}

/* 右侧内容区样式 */
.content-area {
  flex: 1;
  padding: 30rpx 30rpx 150rpx 30rpx;
}

.service-description {
  margin-bottom: 40rpx;
  line-height: 1.6;
  font-size: 28rpx;
  color: #333;
}

.service-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.service-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 20rpx;
}

.service-title {
  font-size: 32rpx;
  color: #a88bdb;
  font-weight: bold;
}

/* 底部导航样式 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #666;
}

.appointment {
  position: relative;
  top: -30rpx;
}

.appointment-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.appointment-btn text {
  color: #fff;
  font-size: 28rpx;
}
</style>
