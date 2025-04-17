interface ApiConfigItem {
  url: string;
  methods: string;
  desc: string;
  key: string;
}

const API_CONFIG: ApiConfigItem[] = [
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
    desc: "根据项目查询技师",
    key: "GET_TECH_LIST_PROJECT",
  },
  ///app/work/tech/byStore
  {
    url: "/app/work/tech/byStore",
    methods: "POST",
    desc: "根据门店查询技师",
    key: "GET_TECH_LIST_STORE",
  },
  ///app/work/detail

  {
    url: "/app/work/detail",
    methods: "POST",
    desc: "查询技师排班信息",
    key: "GET_WORK_DETAIL",
  },
  {
    url: "/kt/app/custom/reservation",
    methods: "POST",
    desc: "预约",
    key: "RESERVATION",
  },
  {
    url: "/app/cust/loginV1",
    methods: "POST",
    desc: "登陆",
    key: "LOGIN",
  },
  {
    url: "/kt/app/custom/reservation/list",
    methods: "POST",
    desc: "我的预约列表",
    key: "GET_RESRVATION_LIST",
  },

  {
    url: "/kt/app/custom/reservation/cancel",
    methods: "POST",
    desc: "我的预约列表",
    key: "CANCEL_RESERVATION",
  },
  {
    url: "/app/cust/sendSms",
    methods: "GET",
    desc: "发送验证码",
    key: "SEND_SMS",
  },
];

export default API_CONFIG;
