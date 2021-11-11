<!--
 * @Author: jhl
 * @Date: 2021-11-11 11:24:24
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-11 15:37:11
 * @Description: 
-->
<template>
  <!-- @dblclick 双击事件 -->
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      mapData: {}, // 缓存地图数据
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      // 获取中国地图的矢量数据
      // http://localhost:8999/static/map/china.json
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台，所以砸门不能使用 this.$http
      const { data: chinaMapData } = await axios.get("http://localhost:8999/static/map/china.json");
      this.$echarts.registerMap("china", chinaMapData);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical", // 垂直排列
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2e72bf",
            borderColor: "#333",
          },
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", this.handleClick);
    },
    async getData() {
      const { data: resData } = await this.$http.get("map");
      this.allData = resData;
      // 对 allData 进行赋值
      this.updateChart();
    },
    updateChart() {
      // 处理数据
      // 图例的数据
      const legendArr = this.allData.map(item => {
        return item.name; // 一个名字对应 serires 中的一个类别
      });
      const seriesArr = this.allData.map(item => {
        // return 的对象代表的是一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据，所以我们需要给散点的图表增加一个配置, coordinateSystem
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5, // 半径范围
            brushType: "stroke", // 空心涟漪动画
          },
          name: item.name, // 类别的名称
          data: item.children, // 这个类别的散点数据
          coordinateSystem: "geo", // 指定坐标系是 geo 系统
        };
      });
      const updatOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(updatOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    async handleClick(e) {
      // e.name 得到所点击的省份，这个省份是中文
      const provinceInfo = getProvinceMapInfo(e.name);
      // 没有缓存地图数据
      if (!this.mapData[provinceInfo.key]) {
        const { data: mapData } = await axios.get("http://localhost:8999" + provinceInfo.path);
        this.mapData[provinceInfo.key] = mapData;
        // 重新注册
        this.$echarts.registerMap(provinceInfo.key, mapData);
      }
      const changeOption = {
        geo: {
          map: provinceInfo.key,
        },
      };
      this.chartInstance.setOption(changeOption);
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>

<style lang="scss" scoped></style>
