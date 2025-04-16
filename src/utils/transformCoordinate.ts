// 定义一些常量
const x_PI: number = (3.14159265358979324 * 3000.0) / 180.0;
const PI: number = 3.1415926535897932384626;
const a: number = 6378245.0;
const ee: number = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon 百度经度
 * @param bd_lat 百度纬度
 * @returns [谷歌、高德经度, 谷歌、高德纬度]
 */
function bd09togcj02(bd_lon: number, bd_lat: number): [number, number] {
  const x = bd_lon - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng 谷歌、高德经度
 * @param lat 谷歌、高德纬度
 * @returns [百度经度, 百度纬度]
 */
function gcj02tobd09(lng: number, lat: number): [number, number] {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
}

/**
 * WGS84转GCj02
 * @param lng WGS84经度
 * @param lat WGS84纬度
 * @returns [GCJ02经度, GCJ02纬度]
 */
function wgs84togcj02(lng: number, lat: number): [number, number] {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    const dlat = transformlat(lng - 105.0, lat - 35.0);
    const dlng = transformlng(lng - 105.0, lat - 35.0);
    const radlat = (lat / 180.0) * PI;
    const magic = Math.sin(radlat);
    const magicSquared = 1 - ee * magic * magic;
    const sqrtmagic = Math.sqrt(magicSquared);
    const newDlat =
      (dlat * 180.0) / (((a * (1 - ee)) / (magicSquared * sqrtmagic)) * PI);
    const newDlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat = lat + newDlat;
    const mglng = lng + newDlng;
    return [mglng, mglat];
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng GCJ02经度
 * @param lat GCJ02纬度
 * @returns [WGS84经度, WGS84纬度]
 */
function gcj02towgs84(lng: number, lat: number): [number, number] {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    const dlat = transformlat(lng - 105.0, lat - 35.0);
    const dlng = transformlng(lng - 105.0, lat - 35.0);
    const radlat = (lat / 180.0) * PI;
    const magic = Math.sin(radlat);
    const magicSquared = 1 - ee * magic * magic;
    const sqrtmagic = Math.sqrt(magicSquared);
    const newDlat =
      (dlat * 180.0) / (((a * (1 - ee)) / (magicSquared * sqrtmagic)) * PI);
    const newDlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat = lat + newDlat;
    const mglng = lng + newDlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}

function transformlat(lng: number, lat: number): number {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

function transformlng(lng: number, lat: number): number {
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng 经度
 * @param lat 纬度
 * @returns 是否在国内
 */
function out_of_china(lng: number, lat: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

export default {
  bd09togcj02, // 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
  gcj02tobd09, // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
  wgs84togcj02, // WGS84转GCj02
  gcj02towgs84, // GCJ02 转换为 WGS84
};
