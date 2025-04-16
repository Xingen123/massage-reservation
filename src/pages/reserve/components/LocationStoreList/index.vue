<template>
  <view class="service-description">
    <text class="service-desc">
      {{ state.desc }}
    </text>
  </view>
  <view>
    <view class="flex flex-col gap-20" v-if="state.storeList">
      <view
        class="p-30 bg-white rounded-20 flex"
        @click="gotoPage(item, i)"
        v-for="(item, i) in state.storeList"
        :key="item.id"
      >
        <view class="mr-20 text-center">
          <image
            :src="`${CDN_BASE_URL}${item.storeImg}`"
            mode="aspectFill"
            class="store-image rounded-20"
          />
          <text class="text-20 text-orange">{{ item.storeName }}</text>
        </view>
        <view class="text-24 text-blue flex flex-col justify-center">
          <view class="mb-60"> {{ item.storeAddress }}</view>
          <view>电话：{{ item.storeMobile }}</view>
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
import { Map } from "@/utils";
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
  desc: "康特推拿是任田院长于2004年创办的一家专门做中医推拿的推拿馆。我们的服务项目包括伤科推拿、内科推拿、小儿推拿等。我们的宗旨是解除您疼痛，还您一个健康生活。",
  storeList: [],
  locationMap: {
    0: {
      latitude: 31.005669,
      longitude: 112.2014,
    },
    1: {
      latitude: 31.04958,
      longitude: 112.214595,
    },
  },
});

const getData = async () => {
  try {
    const { data = [] } = await request.sendRequestByKey("GET_STORE_LIST");
    console.log("请求成功：", data);
    state.storeList = data;
  } catch (err) {
    console.error("请求失败：", err);
  }
};

const gotoPage = (item, i) => {
  Map.openMap(
    state.locationMap[i].latitude,
    state.locationMap[i].longitude,
    item.storeName,
    "GCJ-02"
  );
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
.store-image {
  width: 150rpx;
  height: 150rpx;
}
.store-name {
  color: #0c5882;
}
.service-desc {
  color: #0c5882;
}
</style>
