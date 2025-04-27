<template>
  <view class="quotation-component bg-green-light px-24">
    <view
      class="flex flex-col pt-50 pb-160 gap-20 h-screen box-border"
      v-if="state.tabData && state.tabData.length"
    >
      <view
        class="bg-white py-20 px-30 rounded-20 text-18 box-border"
        v-for="(item, i) in state.tabData"
        :key="i"
        style="height: calc((100vh - 180px) / 5);" 
      >
        <!-- 你的内容不变 -->
        <view class="flex-th-td-item flex justify-between items-center text-24 border-b-info pb-6 ">
          <view class="text-left text-30 text-black-little font-bold">
            {{ item.projectName }}
          </view>
          <view class="text-center text-30 text-black-little">
            {{ item.workDate }}
          </view>
        </view>
<!-- 调整这里，重点！！！ -->
<view class="flex items-center justify-between text-black-little text-24  my-10 pb-6">
  <view class="w-1/2 flex flex-col justify-center text-28">
  <view class="flex justify-between items-center text-black text-25 py-10">
    <view class="flex-col-w-2 text-left">开始时间：</view>
    <view class="flex-col-w-2 text-right text-black-little">
      {{ item.startWorkTime }}
    </view>
  </view>
  <view class="flex justify-between items-center text-black text-25 py-10">
    <view class="flex-col-w-2 text-left">结束时间：</view>
    <view class="flex-col-w-2 text-right text-black-little">
      {{ item.endWorkTime }}
    </view>
  </view>
  <view class="flex justify-between items-center text-black text-25 py-10">
    <view class="flex-col-w-2 text-left">服务时长：</view>
    <view class="flex-col-w-2 text-right text-black-little">
      {{ item.projectTime - 1 }}分钟
    </view>
  </view>
</view>

  <view
    class="w-1/2 h-full px-40 py-40 rounded-10 bg-danger text-center text-28 text-white"
    @click="playAudio(item.outBytes, i,false)"
  >
    播放
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
          <view class="iconfont icon-kongshuju text-80 text-black-little">
          </view>
          <view class="text-black-little mt-20">暂无数据</view>
        </view>
      </view>
    </view>

    <!-- 分页按钮 -->
    <view class="pagination" v-if="state.tabData && state.tabData.length">
      <button
        @click="prevPage"
        :disabled="pagination.state.pageNum === 1"
        class="pagination-button"
      >
        上一页
      </button>
      <span class="page-info">
        当前页码: {{ pagination.state.pageNum }} /
        {{ Math.ceil(pagination.state.total / pagination.state.pageSize) }}
      </span>
      <button
        @click="nextPage"
        :disabled="
          pagination.state.pageNum ===
          Math.ceil(pagination.state.total / pagination.state.pageSize)
        "
        class="pagination-button"
      >
        下一页
      </button>
    </view>
  </view>

  <Dialog ref="DialogRef" />
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh } from "@dcloudio/uni-app";
import { ref, reactive, computed } from "vue";
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
    //1预约中,0已预约，1已取消，2已结束
    0: {
      text: "已预约",
      class: "text-success",
    },
    1: {
      text: "已取消",
      class: "text-black-little",
    },
    2: {
      text: "已结束",
      class: "text-black-little",
    },
  },
});

const formData = reactive({});
const currentAudio = ref<HTMLAudioElement | null>(null);
const currentPlayingIndex = ref(-1);

const contentViewHeight = computed(() => {
  return `calc(100vh - (${state.headerHieght}px + env(safe-area-inset-bottom)) )`;
});

const search = () => {
  state.tabData = [];
  pagination.init({ pageSize: 5 });
  getData();
};

const getData = async () => {
  setLoadMoreStatus("loading");
  const { pageNum: pageNo, pageSize } = pagination.state;
  const params = {
    pageNo,
    pageSize,
  };
  const {
    data: { beanList = [], ...arg },
  }: any = await request.sendRequestByKey("GET_TECH_RESRVATION_LIST", params);
  state.tabData = beanList;
  setLoadMoreStatus(state.tabData.length >= arg.tr ? "noMore" : "more");
  pagination.create({
    total: arg.tr,
    pageSize: 5,
  });

  // 当页数据加载完成后，默认从第一条开始播放录音
  if (state.tabData.length > 0) {
    playAudio(state.tabData[0].outBytes, 0, true);
  }
};

const playAudio = (base64Audio: string, index: number, autoPlayNext = false) => {
  // 停止当前正在播放的音频
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value = null;
  }

  if (base64Audio) {
    const base64Data = base64Audio.replace(/^data:audio\/wav;base64,/, "");
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    currentAudio.value = audio;
    currentPlayingIndex.value = index;

    audio.play();

    // 只有在 autoPlayNext 为 true 的情况下，才自动播放下一条
    if (autoPlayNext) {
      audio.addEventListener("ended", () => {
        if (index < state.tabData.length - 1) {
          playAudio(state.tabData[index + 1].outBytes, index + 1, true);
        } else {
          // 全部播放完成
          currentAudio.value = null;
          currentPlayingIndex.value = -1;
        }
      });
    } else {
      // 手动点击播放的，结束后重置状态
      audio.addEventListener("ended", () => {
        currentAudio.value = null;
        currentPlayingIndex.value = -1;
      });
    }
  }
};


const prevPage = () => {
  if (pagination.state.pageNum > 1) {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
      currentPlayingIndex.value = -1;
    }
    pagination.state.pageNum--;
    getData();
  }
};

const nextPage = () => {
  if (
    pagination.state.pageNum <
    Math.ceil(pagination.state.total / pagination.state.pageSize)
  ) {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
      currentPlayingIndex.value = -1;
    }
    pagination.state.pageNum++;
    getData();
  }
};

const init = async () => {
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

.pagination {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: #fff;
  padding: 20rpx;
  z-index: 100;
  padding-bottom: 20rpx;
}

.pagination-button {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 10rpx 30rpx;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 18px;
  font-weight: bold;
}
</style>
