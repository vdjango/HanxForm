<template>
  <div class="hello">
    <amap-jsapi-load-vue
        @map-click="mapClick"
        @querySearch="querySearch"
    >
    </amap-jsapi-load-vue>
  </div>
</template>

<script>

import amapJsapiLoadVue from '../components/amap-jsapi-load-vue/amap-jsapi-load-vue.vue'
import {ElMessage} from "element-plus";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      AMapMarker: [],  // 地图点标记信息
    }
  },
  components: {
    'amap-jsapi-load-vue': amapJsapiLoadVue
  },
  methods: {
    onComplete(data) {
      /**
       * 解析定位结果
       * @type {string}
       */
      let str = ['定位成功'];
      str.push('定位结果：' + data.position);
      str.push('定位类别：' + data.location_type);
      if (data.accuracy) {
        /**
         * 如为IP精确定位结果则没有精度信息
         */
        str.push('精度：' + data.accuracy + ' 米');
      }
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
      ElMessage.success({
        message: str.join('<br>'),
        type: 'success'
      });
    },
    onError(data) {
      /**
       * 解析定位错误信息
       * @type {string}
       */
      let str = ['定位失败', '失败原因排查信息:' + data.message]
      ElMessage.success({
        message: str.join('<br>'),
        type: 'warning'
      });
    },

    mapClick(AMap, map, poi) {

      new AMap.Icon({
        /**
         * 起
         */
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-9, -3)
      });

      map.clearMap()

      this.AMapMarker.push({
        name: '',
        marker: new AMap.Marker({
          position: poi.lnglat,  // new AMap.LngLat(116.38,39.92)
          icon: new AMap.Icon({
            /**
             * 终
             */
            size: new AMap.Size(25, 34),
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new AMap.Size(135, 40),
            imageOffset: new AMap.Pixel(-98, -3)
          }),
          draggable: true, // 设置是否可以拖拽
          cursor: 'move',
        }).setMap(map)
      })
    },
    querySearch(AMap, map, keywords, city) {
      /**
       * 构造地点查询类
       * @type {AMap.AutoComplete}
       */
      let placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        map: map, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        city: city, // 兴趣点城市
        citylimit: true,  //是否强制限制在设置的城市内搜索
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      });

      // 搜索成功时，result即是对应的匹配数据
      placeSearch.search(keywords, (status, result) => {
        console.log(status, result)
      });
    },
  },
  mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
