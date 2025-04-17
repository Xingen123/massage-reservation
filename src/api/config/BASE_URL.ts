// 定义环境枚举
enum Env {
  DEV = "dev",
  UAT = "uat",
  PRE = "pre",
  PRO = "pro",
}

// 定义基础 URL 映射的类型
type BaseUrlMap = {
  [key in Env]: string;
};

// 定义基础 URL 映射对象
const BASE_URL_MAP: BaseUrlMap = {
  [Env.DEV]: "/api",
  //[Env.DEV]: "http://192.168.3.94:4000",
  //[Env.DEV]: "http://192.168.3.171:8080",
  [Env.UAT]: "https://ktapp.kangtetuina.com",
  //[Env.UAT]: "http://47.104.228.224",
  [Env.PRE]: "https://ktapp.kangtetuina.com",
  [Env.PRO]: "https://ktapp.kangtetuina.com",
};

// 定义获取基础 URL 的函数，并指定参数和返回值的类型
const getBaseUrl = (env: Env): string => {
  return BASE_URL_MAP[env];
};

// 获取当前环境变量，并进行类型断言
const currentEnv = import.meta.env.VITE_APP_ENV as Env;

// 获取当前环境对应的基础 URL
const BASE_URL = getBaseUrl(currentEnv);

console.log(
  `%c 当前运行环境: ${currentEnv.toLocaleUpperCase()}`,
  "background: rgba(0,0,0,0.6);color: red;font-weight:700;padding:4px"
);
console.log(
  `%c 当前BASE_URL: ${BASE_URL}`,
  "background: rgba(0,0,0,0.6);color: red;font-weight:700;padding:4px"
);
const CDN_BASE_URL = "https://ktapp.kangtetuina.com/";
// 导出基础 URL 和环境枚举
export { BASE_URL, BASE_URL_MAP, CDN_BASE_URL, Env };
