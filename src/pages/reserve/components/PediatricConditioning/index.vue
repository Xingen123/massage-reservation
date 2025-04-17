<template>
  <view class="service-description">
    <text class="service-desc">
      {{ state.desc }}
    </text>
  </view>

  <view v-if="(state.pagetype = 1)">
    <view
      class="flex flex-col gap-20"
      v-if="state.techList && state.techList.length"
    >
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
import { useLoadMore, usePopupShow, usePagination } from "@/hooks";
import request from "@/api";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
const { status, setLoadMoreStatus } = useLoadMore();
const pagination = usePagination();

const props = defineProps({
  projectId: {
    type: String,
    default: "",
  },
  storeId: {
    type: String,
    default: "",
  },
  techId: {
    type: String,
    default: "",
  },
});
const state = reactive({
  desc: "康特推拿是任田院长于2004年创办的一家专门做中医推拿的推拿馆。我们的服务项目包括伤科推拿、内科推拿、小儿推拿等。我们的宗旨是解除您疼痛，还您一个健康生活。",
  pagetype: 0,
  projectName: "小儿调理",
  techList: [],
});

const getData = async (type = 0) => {
  uni.showLoading();
  state.techList = [];
  try {
    const params = {
      projectId: props.projectId,
      storeId: props.storeId,
      techId: props.techId,
    };
    const { data } = await request.sendRequestByKey(
      type ? "GET_TECH_LIST_STORE" : "GET_TECH_LIST_PROJECT",
      params
    );
    state.techList = data;
    state.pagetype = 1;
    uni.hideLoading();
  } catch (err) {
    uni.hideLoading();
    console.error("请求失败：", err);
  }
};

const gotoPage = (item) => {
  const userInfo = JSON.stringify(item);
  uni.navigateTo({
    url: `/pages/reserve/reserve?userInfo=${userInfo}`,
  });
};
// watch(
//   [props.projectId, props.storeId, props.techId],
//   () => {

//   },
//   {
//     immediate: true,
//   }
// );

watchEffect(() => {
  getData(props.storeId);
});
onMounted(() => {
  // 获取数据
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
