<template>
  <view class="quotation-component bg-green-light px-24">
    <view class="flex flex-col gap-20 mt-20">
      <view
        class="bg-white py-24 px-30 rounded-20 text-24 box-border mt-50"
        v-for="(item, i) in state.tabData"
        :key="i"
      >
        <view
          class="flex-th-td-item flex justify-between items-center text-info text-24 border-b-info pb-14"
        >
          <view class="text-left text-30 text-black-little font-bold">
            {{ item.projectName }}
          </view>
          <view class="text-center text-30"> 编号：{{ item.workNums }} </view>
        </view>

        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 创建时间：</view>
          <view class="flex-col-w-3 text-right">{{
            dayjs(item.createTime).format("YYYY-mm-DD")
          }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 预约时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.workDate }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 开始时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.startWorkTime }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">结束时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.endWorkTime }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">技师名称：</view>
          <view class="flex-col-w-3 text-right">{{ item.techName }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">门店名称：</view>
          <view class="flex-col-w-3 text-right">{{ item.storeName }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">预约状态：</view>
          <view class="flex-col-w-3 text-right">{{
            item.reservationStatus ? "已取消" : "已预约"
          }}</view>
        </view>

        <view
          class="flex-th-td-item flex justify-end items-center text-info text-24 border-t-info my-14 pt-14"
        >
          <view
            class="px-16 py-6 rounded-10 bg-danger text-left text-28 text-white"
            @click="cancel(item)"
          >
            取消预约
          </view>
        </view>
      </view>
    </view>
    <view v-if="!state.tabData.length && status !== 'loading'">
      <view
        class="bg-white rounded-10 px-26 my-50 text-24 flex flex-col gap-20"
        :style="`height:${contentViewHeight}`"
      >
        <view class="h-full flex flex-col justify-center items-center">
          <view class="iconfont icon-kongshuju text-80 text-info"> </view>
          <view class="text-info mt-20">暂无数据</view>
        </view>
      </view>
    </view>

    <LoadMore v-if="state.tabData.length" :status="status" />
  </view>

  <Dialog ref="DialogRef" />
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";

import { useUserStore, useSystemStore } from "@/store";
import { useLoadMore, usePagination, useQuerySelect } from "@/hooks";
import request from "@/api";
import dayjs from "dayjs";

const userStore = useUserStore();
const systemStore = useSystemStore();
const instance = getCurrentInstance(); // 获取组件实例
const { status, setLoadMoreStatus } = useLoadMore();
const pagination = usePagination();
const DialogRef = ref<any>(null);
const state = reactive({
  tabData: [],
  headerHieght: 120,
  statusColorMap: {
    0: "#999999",
    1: "#333333",
    2: "#43CF7C",
    3: "#FF5733",
    4: "#FF5733",
    5: "#169C4B",
    6: "#D43030",
  },
});

const formData = reactive({});

const contentViewHeight = computed(() => {
  return `calc(100vh - (${state.headerHieght}px + env(safe-area-inset-bottom)) )`;
});

onReachBottom(() => {
  console.log("触底", state.tabData.length);
  if (status.value !== "more") return;
  pagination.state.pageNum++;
  getData();
});

const search = () => {
  console.log("search");
  state.tabData = [];
  pagination.init();
  getData();
};
const getData = async () => {
  //ORDER_LIST
  setLoadMoreStatus("loading");
  const { pageNum, pageSize } = pagination.state;
  const params = {
    ...formData,
    pageNum: 100000000,
    pageSize,
  };
  const { data = [], ...arg }: any = await request.sendRequestByKey(
    "GET_RESRVATION_LIST",
    params
  );

  state.tabData.push(...data);
  setLoadMoreStatus("noMore");
  pagination.create(arg);
};

const cancel = async (item) => {
  try {
    const params = {
      workId: item.workId,
    };
    await DialogRef.value.showDialog({
      title: "提示",
      message: "确定要取消当前预约项目吗？",
      cancelButtonText: "取消",
      confirmButtonText: "确认",
    });
    const { data = [], ...arg }: any = await request.sendRequestByKey(
      "CANCEL_RESERVATION",
      params
    );
    search();
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  // const data = await useQuerySelect({
  //   instance,
  //   className: ".quotation__header",
  // });
  // console.log(data, "state.headerHieght");
  // state.headerHieght = data.height;
  search();
};

onPullDownRefresh(() => {
  init();
  uni.stopPullDownRefresh();
});
onShow(() => {
  init();
});
</script>

<style lang="scss">
.quotation-component {
  min-height: 100vh;
  background-image: linear-gradient(
    to bottom,
    #a88bdb,
    #8ba5db,
    #b8d1e8,
    #f5d6e0
  );
  .flex-col-w-1 {
    width: 50%;
  }

  .flex-col-w-3 {
    width: 40%;
  }

  .date-select-wrap {
    height: 45.83rpx;
  }
  .date-select-item {
    &:last-child {
      border-right: none;
    }
    &--active {
      color: #fff;
    }
  }
  .next-week-button {
    left: 20rpx;
    width: 158.33rpx;
    height: 81.25rpx;
    border-radius: 81.25rpx;

    bottom: 40rpx;
  }
  .audit-button {
    right: 20rpx;
    width: 158.33rpx;
    height: 81.25rpx;
    margin: 0;
    padding: 0;
    border-radius: 81.25rpx;

    bottom: 40rpx;
  }
}
</style>
