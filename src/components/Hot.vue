<!--
 * @Author: jhl
 * @Date: 2021-11-11 21:02:33
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-13 16:16:52
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      currentIndex: 0, //
      titleFontSize: 0, //
    };
  },
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
    ...mapState(["theme"]),
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
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          left: 20,
          top: 20,
        },
        legend: {
          top: "1 5%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children;
            const total = arg.data.children.reduce((pre, cur) => pre + cur.value, 0);
            let retStr = "";
            thirdCategory.forEach(item => {
              retStr += `
                ${item.name}: ${((item.value / total) * 100).toFixed(2) + "%"}
                <br />
              `;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false, // 将文字隐藏起来
            },
            emphasis: {
              label: {
                show: true, // 鼠标移动到区域时，显示文字
              },
              labelLine: {
                show: false, // 隐藏文本与区域之间的连线
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: resData } = await this.$http.get("hotproduct");
      this.allData = resData;
      // 对 allData 进行赋值
      this.updateChart();
    },
    updateChart() {
      // 处理数据
      // 处理图表需要的数据
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        };
      });
      const updatOption = {
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(updatOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
          top: "15%",
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "50%"], // 饼图圆心的位置，元素1代表 x 轴，元素2代表 y 轴
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); // 销毁当前实例对象
      this.initChart(); // 重新以最新的主题初始化图表对象
      this.screenAdapter(); // 更新图表的展示
      this.updateChart(); // 重新设置数据，因为不需要重新获取数据，之前的数据在 allData 中保存着
    },
  },
};
</script>

<style lang="scss" scoped>
.arr-left {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20%;
  color: white;
}
</style>
