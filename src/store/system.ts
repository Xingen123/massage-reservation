import { reactive, toRefs } from "vue";
import request from "@/api";
import { defineStore } from "pinia";
import useUserStore from "./user"; // 假设 user 模块导出了 UserInfo 类型
import useTabBarStore from "./tabbar";
import { Storage } from "@/utils";
// 假设的请求响应数据类型
interface DictionaryItem {
  dictType: string;
  details: any[];
}

interface GetDictTypeResponse {
  // 根据实际情况定义返回数据结构
  [key: string]: any;
}

const userStore = useUserStore();

const useSystemStore = defineStore(
  "system",
  () => {
    const state = reactive({
      dictionary: [] as DictionaryItem[], //
      canteenList: [] as any[], // 食堂列表
      busAllergyOptions: [] as any[], // 过敏源列表
    });

    const logIn = async (params: any) => {
      try {
        const { data } = await request.sendRequestByKey("LOGIN", params);
        console.log("登录成功：", data);
        Storage.set("USER_TOKEN", data.token);
        userStore.updateUserBaseInfo(data); // 更新用户信息
        uni.reLaunch({
          url: data.isTech ? "/pages/teacher/index" : "/pages/index/index",
        });
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
        return Promise.reject(err);
      }
    };

    const logOut = async (isLoginPage = false) => {
      console.log("ppppp");
      await useUserStore().clear();

      await clear();
      uni.clearStorageSync();
      // 可以在这里添加登出的逻辑，例如清除用户信息等
      if (!isLoginPage) {
        nextTick(() => {
          uni.reLaunch({
            url: "/pages/login/index",
          });
        });
      }
    };

    const getDictionary = async (
      dictType: string
    ): Promise<GetDictTypeResponse | undefined> => {
      try {
        const res = await request.sendRequestByKey("GET_DICT_TYPE", {
          dictType,
        });
        return res;
      } catch (err) {
        console.error("请求失败：", err);
      }
    };

    // 获取所有字典
    const getMultipleDictionary = async () => {
      try {
        const { data } = await request.sendRequestByKey("GET_DICT_ALL");
        state.dictionary = data;
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
      }
    };
    //GET_CANTEEN_LIST_ALL
    const getCanteenList = async () => {
      try {
        const { data } = await request.sendRequestByKey("GET_CANTEEN_LIST_ALL");
        state.canteenList = data.map((item) => ({
          name: item.name,
          id: item.id,
          value: item.id,
          text: item.name,
        }));
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
      }
    };

    const getDictionaryByKey = (key: string): any[] => {
      try {
        const dictionary = state.dictionary.find(
          (item) => item.dictType === key
        );
        console.log(dictionary, "dictionary");
        const transformedData = dictionary?.details.map((item) => {
          return {
            name: item.dictLabel,
            id: item.dictValue,
            text: item.dictLabel,
            value: item.dictValue,
          };
        });
        return transformedData ? transformedData : [];
      } catch (err) {
        console.error("字典查找失败", err);
        return [];
      }
    };
    const getDictionaryItemByKey = (key: string, id: string): any => {
      const dictionary = state.dictionary.find((item) => item.dictType === key);
      console.log(dictionary, "dictionary");
      const transformedData = dictionary?.details.map((item) => {
        return {
          name: item.dictLabel,
          id: item.dictValue,
          text: item.dictLabel,
          value: item.dictValue,
        };
      });
      console.log(transformedData, key, id, "0000000000");
      const item = transformedData?.find((item) => item.id === id);
      return item || { name: "--", id: "--" };
    };
    //获取过敏原列表
    const getAllergyList = async () => {
      try {
        const { data } = await request.sendRequestByKey("BUS_ALLERGEN_LIST");
        state.busAllergyOptions = data.map((item) => ({
          name: item.name,
          id: item.id,
          value: item.id,
          text: item.name,
        }));
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
      }
    };

    const clear = async () => {
      return new Promise((resolve) => {
        state.dictionary = [];
        state.canteenList = [];
        resolve(true);
      });
    };
    return {
      ...toRefs(state),
      logIn,
      logOut,
      getDictionary,
      getAllergyList,
      getMultipleDictionary,
      getDictionaryByKey,
      getCanteenList,
      getDictionaryItemByKey,
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

export default useSystemStore;
