<template>
  <view class="service-description">
    <text class="service-desc">
      {{ info.projectDesc }}
    </text>
  </view>

  <view>
    <view class="flex flex-col gap-20" v-if="state.techList">
      <view
        class="p-30 bg-white rounded-20 flex"
        @click="gotoPage(item)"
        v-for="item in state.techList"
        :key="item.id"
      >
        <view class="mr-20 text-center">
          <image
            :src="`${CDN_BASE_URL}${item.techImg}`"
            mode="aspectFill"
            class="user-image"
          />
          <text class="user-name text-yellow-dark">{{ item.techName }}</text>
        </view>
        <view class="user-desc text-24 text-yellow-dark overflow-scroll">
          {{ item.techDesc }}
        </view>
      </view>
    </view>
    <view class="bg-white rounded-20 py-100" v-else>
      <view class="h-full flex flex-col justify-center items-center">
        <view class="iconfont icon-kongshuju text-80 text-info"> </view>
        <view class="text-info mt-20">暂无按摩师数据</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import request from "@/api";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
defineProps({
  info: {
    type: Object,
    default: () => ({
      projectName: "",
      projectDesc: "",
    }),
  },
});
const state = reactive({
  pagetype: 0,
  techList: [],
});

const getData = async () => {
  try {
    const { data } = await request.sendRequestByKey("GET_TECH_LIST");
    state.techList = data;
  } catch (err) {
    console.error("请求失败：", err);
  }
};
const gotoPage = (item) => {
  const userInfo = JSON.stringify(item);
  uni.navigateTo({
    url: `/pages/reserve/reserve?userInfo=${userInfo}`,
  });
};

onMounted(() => {
  // 获取数据
  getData();
});
</script>

<style>
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
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.service-title {
  font-size: 32rpx;
  color: #a88bdb;
  font-weight: bold;
}
.user-image {
  width: 150rpx;
  height: 250rpx;
}
.user-desc {
  height: 300rpx;
}
.service-desc {
  color: #0c5882;
}
</style>
