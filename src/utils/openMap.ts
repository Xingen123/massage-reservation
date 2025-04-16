import TransformCoordinate from "./transformCoordinate";

// 定义 uni 和 plus 全局对象类型，这里使用 any 作为占位，实际使用时需要根据具体类型定义
declare const uni: any;
declare const plus: any;

function openMapByDefault(
  latitude: number,
  longitude: number,
  name: string
): void {
  uni.openLocation({
    latitude,
    longitude,
    name,
    fail: () => {
      uni.showModal({
        content: "打开地图失败,请重",
      });
    },
  });
}

function openMapByAndroid(
  latitude: number,
  longitude: number,
  name: string
): void {
  let url = ""; // 回调地址
  let identity = ""; // 程序名称
  if (plus.runtime.isApplicationExist({ pname: "com.baidu.BaiduMap" })) {
    // baidumap
    url = `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`;
    identity = "com.baidu.BaiduMap";
    openURL(url, identity);
  } else if (
    plus.runtime.isApplicationExist({ pname: "com.autonavi.minimap" })
  ) {
    // 高德
    url = `androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
    identity = "com.autonavi.minimap";
    openURL(url, identity);
  } else {
    openMapByDefault(latitude, longitude, name);
  }
}

function openMapByIos(latitude: number, longitude: number, name: string): void {
  let url = ""; // 回调地址
  let identity = ""; // 程序名称

  if (plus.runtime.isApplicationExist({ action: "baidumap://" })) {
    // baidumap
    url = `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
    openURL(url, identity);
  } else if (plus.runtime.isApplicationExist({ action: "iosamap://" })) {
    // 高德
    url = `iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
    openURL(url, identity);
  } else {
    openMapByDefault(latitude, longitude, name);
  }
}

function openURL(url: string, identity: string): void {
  const newurl = encodeURI(url);
  plus.runtime.openURL(
    newurl,
    function (res: any) {
      uni.showModal({
        content: res.message,
      });
    },
    identity
  );
}

function getCoordByType(
  longitude: number,
  latitude: number,
  coord_type: "gcj02" | "bd09" | "wgs84"
): [number, number] {
  switch (coord_type) {
    case "gcj02":
      return [longitude, latitude];
    case "bd09":
      return TransformCoordinate.bd09togcj02(longitude, latitude);
    case "wgs84":
      return TransformCoordinate.wgs84togcj02(longitude, latitude);
    default:
      return [longitude, latitude];
  }
}

export default {
  /* 打开地图 */
  openMap(
    latitude: number,
    longitude: number,
    name: string,
    coord_type: "gcj02" | "bd09" | "wgs84" = "gcj02"
  ): void {
    const arr = getCoordByType(longitude, latitude, coord_type);
    // #ifdef APP-PLUS
    switch (uni.getSystemInfoSync().platform) {
      case "android":
        console.log("运行Android上");
        openMapByAndroid(arr[1], arr[0], name);
        break;
      case "ios":
        console.log("运行iOS上");
        openMapByIos(arr[1], arr[0], name);
        break;
      default:
        openMapByDefault(arr[1], arr[0], name);
        console.log("运行在开发者工具上");
        break;
    }
    // #endif
    // #ifndef APP-PLUS
    openMapByDefault(arr[1], arr[0], name);
    // #endif
  },
};
