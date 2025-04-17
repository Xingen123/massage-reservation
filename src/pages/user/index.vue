<template>
  <view class="user-component bg-green-light p-20">
    <uni-nav-bar
      backgroundColor="rgba(255, 255, 255, 0)"
      statusBar
      :border="false"
    />

    <view class="user-info_wrap flex flex-col gap-20 p-20">
      <view class="flex justify-between items-center" @click="avatarClick">
        <view class="flex items-center gap-20">
          <image
            class="user-info__avatar"
            :src="'/static/images/user-avatar-default.webp'"
            mode="scaleToFill"
          />

          <view class="gap-10 text-info"
            ><view class="text-42 mb-8">{{
              userInfo.nickName || "未登陆"
            }}</view>
            <view>
              <!-- <text class="iconfont icon-phone">{{
                userInfo.user.mobile?.replace(
                  /^(\d{3})\d{4}(\d{4})$/,
                  "$1****$2"
                ) || "未绑定手机号"
              }}</text> -->
            </view>
          </view>
        </view>
        <view>
          <text class="iconfont icon-bianji1 text-40 text-primary"></text
        ></view>
      </view>
      <view>
        <view class="user-meniu-content p-30 bg-white rounded-10 mt-30">
          <view
            class="flex justify-between items-center border-b-grey-light-4 py-14"
            @click="goPage('reserveList')"
          >
            <text class="iconfont icon-fankuijianyi text-34 text-primary">
              <text class="text-black-little ml-20"> 预约列表 </text>
            </text>
            <text class="iconfont icon-xiangqing text-38 text-info"></text>
          </view>
          <view
            class="flex justify-between items-center border-b-grey-light-4 py-14"
            @click="goPage('login')"
          >
            <text class="iconfont icon-fankuijianyi text-34 text-primary">
              <text class="text-black-little ml-20"> 切换帐号 </text>
            </text>
            <text class="iconfont icon-xiangqing text-38 text-info"></text>
          </view>
          <view
            class="flex justify-between items-center border-b-grey-light-4 py-14"
            @click="systemStore.logOut(false)"
          >
            <text class="iconfont icon-fankuijianyi text-34 text-primary">
              <text class="text-black-little ml-20"> 退出登录 </text>
            </text>
            <text class="iconfont icon-xiangqing text-38 text-info"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <TabBar path="/pages/user/index" />
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import request from "@/api";
import { useSystemStore, useUserStore } from "@/store";
import { Native, JUMP_TYPE } from "@/utils";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
const userStore = useUserStore();
const systemStore = useSystemStore();
//getUserInfo
const { userInfo } = storeToRefs(userStore);
const state = reactive({ menuName: "", placeholder: "" });

const avatarClick = () => {
  if (userInfo.value.token) return;
  goPage("login");
};
const goPage = (key: string) => {
  const pageMap = {
    reserveList: "/pages/user/reserveList",
    login: "/pages/login/index",
  };
  Native.push(JUMP_TYPE.SELF, { url: pageMap[key as keyof typeof pageMap] });
};
</script>
<style lang="scss" scoped>
.user {
  &-component {
    min-height: 100vh;
    background-image: linear-gradient(
      to bottom,
      #a88bdb,
      #8ba5db,
      #b8d1e8,
      #f5d6e0
    );
  }
  &-info {
    &__avatar {
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      margin: 0;
      padding: 0;
    }
    &__name {
      font-size: 40rpx;
    }
  }

  &-meniu-content {
    width: 100%;
    height: 568.75rpx;
    box-sizing: border-box;
  }
}
</style>
