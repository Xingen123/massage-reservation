import request from "./config/request";
import { Storage } from "@/utils";
const businessCodes = [409, 4031, 4032, 4033];
// 设置请求拦截器
request.setRequestInterceptor((config) => {
  console.log(
    "%c -------API请求拦截-------- ",
    "background: rgba(67, 207, 124, 1);color: #ffffff;font-weight:700;padding:4px;"
  );
  console.log(config);
  console.log(
    "%c -------E---N---D--------- ",
    "background: rgba(67, 207, 124, 1);color: #ffffff;font-weight:700;padding:4px;"
  );
  const token = Storage.get("USER_TOKEN");
  if (token) {
    config.header.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 设置响应拦截器
request.setResponseInterceptor((res) => {
  console.log(
    "%c -------API响应拦截-------- ",
    "background: rgba(78, 154, 242, 1);color: #ffffff;font-weight:700;padding:4px;"
  );
  console.log(res);
  console.log(
    "%c -------E---N---D--------- ",
    "background: rgba(78, 154, 242, 1);color: #ffffff;font-weight:700;padding:4px;"
  );
  if (res.statusCode !== 200) {
    uni.showToast({
      title: `HTTP:${res.statusCode}:网络错误稍后再试`,
      icon: "none",
    });
    return Promise.reject(`HTTP:${res.statusCode}:网络错误稍后再试`);
  }

  if (res.data.state === 200 || businessCodes.includes(res.data.state)) {
    return res.data;
  }
  if (res.data.state === 401) {
    uni.showToast({
      title: `登录已过期，请重新登录`,
      icon: "none",
    });
    uni.reLaunch({
      url: "/pages/login/index",
    });
  } else {
    uni.showToast({
      title: `${res.data.state}: ${res.data.msg}`,
      icon: "none",
    });
    return Promise.reject(`${res.data.state}: ${res.data.msg}`);
  }
});

export default request;
