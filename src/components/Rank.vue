<!--
 * @Author: jhl
 * @Date: 2021-11-11 15:43:40
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-11 20:53:29
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      startValue: 0,
      endValue: 9,
      timerId: null,
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
    clearInterval(this.timerId);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true, // 包含坐标轴上的文字
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // 绑定事件监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData() {
      const { data: resData } = await this.$http.get("rank");
      this.allData = resData;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      // 对 allData 进行赋值
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      // 处理数据
      // 颜色值，元素1是起始值，元素2是终止值
      const colorArr = [
        ["#08A82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      // 所有省份所形成的数组
      const provinceArr = this.allData.map(item => {
        return item.name;
      });
      // 所有省份对应的销售金额
      const valueArr = this.allData.map(item => {
        return item.value;
      });
      const updatOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false, // 隐藏起来
          startValue: this.startValue, // 区域缩放的起点值
          endValue: this.endValue, // 区域缩放的终点值
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              // color: "red",
              color: arg => {
                let targetColorArr = null;
                if (arg.data > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.data > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(updatOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
