import { defineStore } from "pinia";
import request from "@/api";

// 定义 UserInfo 类型
type UserInfo = {
  isTech: "";
  nickName: "";
  token: "";
};

const useUserStore = defineStore(
  "userStore",
  () => {
    // 初始化用户信息，使用 ref 创建响应式对象
    const userInfo = reactive<UserInfo>({
      isTech: "",
      nickName: "",
      token: "",
    });

    // 更新用户基础信息的方法
    const updateUserBaseInfo = (user: UserInfo) => {
      Object.assign(userInfo, user);
    };

    // 更新用户信息的方法
    const updateUserInfo = (user: Partial<UserInfo>) => {
      Object.assign(userInfo, user);
    };

    // 清空用户信息的方法
    const clearUserInfo = () => {
      return new Promise((resolve) => {
        Object.keys(userInfo).forEach((key) => {
          (userInfo as any)[key] = null;
        });
        resolve(true);
      });
    };
    const clear = async () => {
      await clearUserInfo();
      return Promise.resolve(true);
    };
    // 获取用户信息的异步方法
    const getUserInfo = async () => {
      try {
        const { data } = await request.sendRequestByKey("GET_USER_INFO", {
          // openid: userBaseInfo.openid,
        });
        const rolesGroup = ["base"];
        if (data.canteens.length) {
          rolesGroup.push("canteen");
        }
        if (data.suppliers.length) {
          rolesGroup.push("supplier");
        }
        await checkUserPermissions(rolesGroup);
        await updateUserInfo({ ...data, rolesGroup });
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
        return Promise.reject(err);
      }
    };
    const checkUserPermissions = async (rolesGroup: UserInfo["rolesGroup"]) => {
      const preUserRolesGroup = [...userInfo.rolesGroup];
      const curUserRolesGroup = rolesGroup;
      console.log(
        "checkUserPermissions",
        preUserRolesGroup,
        "-----------",
        curUserRolesGroup
      );
      if (!preUserRolesGroup.length) {
        if (curUserRolesGroup.length === 1) {
          uni.switchTab({ url: "/pages/orderFood/index" });
        }
        if (curUserRolesGroup.length > 1) {
          uni.redirectTo({ url: "/pages/systemSelection/index" });
        }
      }
      //小程序只有一个权限角色（默认点餐）
      if (curUserRolesGroup.length === 1) {
        //首次进入 或者 清空缓存进入 时
        if (!preUserRolesGroup.length) {
          console.log("首次进入 或者 清空缓存进入 时");
          uni.switchTab({ url: "/pages/orderFood/index" });
          return Promise.resolve();
        }
        // 权限降级为单一普通角色
        if (preUserRolesGroup.length > 1) {
          console.log("权限降级为单一普通角色");
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，即将重新进入业务系统",
            showCancel: false,
          });
          uni.switchTab({ url: "/pages/orderFood/index" });
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      //多个角色时
      if (curUserRolesGroup.length > 1) {
        //首次进入 或者 清空缓存进入 时 （必须）需要重新选择系统
        if (!preUserRolesGroup.length) {
          console.log("首次进入 或者 清空缓存进入 时 （必须）需要重新选择系统");
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
        // 权限增加了 可以重新选择系统（用户决定）
        if (preUserRolesGroup.length === 1) {
          try {
            await uni.showModal({
              title: "温馨提示",
              content: "检测到您的系统权限发生变化，是否需要新选择业务系统？",
              showCancel: true,
            });
            uni.redirectTo({ url: "/pages/systemSelection/index" });
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        }
        // 用户角色组 长度都都>1 并且长度一样，但是权限不一样时，需要重新选择系统
        if (
          preUserRolesGroup.length === curUserRolesGroup.length &&
          preUserRolesGroup.join(",").trim() !==
            curUserRolesGroup.join(",").trim()
        ) {
          console.log(
            "用户角色组 长度都都>1 并且长度一样，但是权限不一样时，需要重新选择系统"
          );
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，请重新选择业务系统",
            showCancel: false,
          });
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
        // 权限增加了，需要重新选择系统（用户决定）
        if (curUserRolesGroup.length > preUserRolesGroup.length) {
          try {
            await uni.showModal({
              title: "温馨提示",
              content: "检测到您的系统权限发生变化，是否需要新选择业务系统？",
              showCancel: true,
            });
            uni.redirectTo({ url: "/pages/systemSelection/index" });
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        }
        //权限减少了，必须重新选择系统
        if (curUserRolesGroup.length < preUserRolesGroup.length) {
          console.log("权限减少了，必须重新选择系统");
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，请重新选择业务系统",
            showCancel: false,
          });
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
      }
    };

    return {
      userInfo,
      updateUserBaseInfo,
      updateUserInfo,
      clearUserInfo,
      getUserInfo,
      clear,
    };
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          return uni.setStorageSync(key, value);
        },
      },
    },
  }
);

export default useUserStore;
