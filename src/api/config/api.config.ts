interface ApiConfigItem {
  url: string;
  methods: string;
  desc: string;
  key: string;
}

const API_CONFIG: ApiConfigItem[] = [
  {
    url: "/vx/login",
    methods: "get",
    desc: "登录",
    key: "LOGIN",
  },
  {
    url: "/app/banner/list",
    methods: "get",
    desc: "获取轮播图",
    key: "GET_BANNER_LIST",
  },
  {
    url: "/app/project/list",
    methods: "get",
    desc: "项目列表",
    key: "GET_PROJECT_LIST",
  },
  {
    url: "/app/store/list",
    methods: "get",
    desc: "门店列表",
    key: "GET_STORE_LIST",
  },
  ///app/tech/list
  {
    url: "/app/work/tech/byProject",
    methods: "POST",
    desc: "技术列表",
    key: "GET_TECH_LIST",
  },
  ///app/work/detail
  {
    url: "/app/work/detail",
    methods: "POST",
    desc: "工作详情",
    key: "GET_WORK_DETAIL",
  },
];

export default API_CONFIG;
