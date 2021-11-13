<!--
 * @Author: jhl
 * @Date: 2021-11-09 21:18:31
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-13 16:03:55
 * @Description: 
-->
<!-- 商家销售统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 总页数
      timerId: null, // 定时器的标识
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    // 自适应
    window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候，主动进行屏幕的适配
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timerId);
    // 在组件销毁的时候，需要将监听器取消掉
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 初始化 echartInstance 对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme);
      // 对图标初始化配置的控制
      const initOption = {
        title: {
          text: "▎商家销售统计",
          // 控制标题位置
          left: 20,
          top: 20,
        },
        grid: /*直角坐标轴通用配置，控制坐标轴的位置*/ {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          // 默认不包含坐标轴上的文字
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis", // 什么时候触发
          axisPointer: {
            // 显示的样式
            type: "line",
            z: 0, // 控制工具箱的层级
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true, // 显示数字
              position: "right", // 数字显示在右侧
              color: "#fff", // 数字颜色
            },
            // 控制每一个柱子的样式
            itemStyle: {
              // 指定颜色渐变的方向
              /*
                指明不同百分比之下颜色的值(x1, y1, x2, y2, [])
                x1, y1 是一个点   x2, y2 是一个点
                两个点确定一条直线
              */
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0的颜色值
                { offset: 0, color: "#5052EE" },
                // 百分之100的颜色值
                { offset: 1, color: "#AB6EE5" },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);

      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        // 鼠标移入
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        // 鼠标移出
        this.startInterval();
      });
    },
    // 获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("seller");
      this.allData = res;
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : Math.floor(this.allData.length / 5 + 1);
      this.updateChart(); // 第一次更新图表
      // 启动定时器，每隔 3 秒更新一次图表
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5; // 0
      const end = this.currentPage * 5; // 5
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map(item => item.name);
      const sellerValue = showData.map(item => item.value);
      sellerValue.sort((a, b) => a - b); // 升序
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    // 开启间隔定时器
    startInterval() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 当浏览器的大小发生变化的时候，会调用的方法，来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          // 控制标题样式
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize, // 控制柱宽度
            // 控制每一个柱子的样式
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0], // 左上角，右上角，右下角，左下角
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图标对象的 resize 才能产生效果
      this.chartInstance.resize();
    },
  },
  computed: {
    ...mapState(["theme"]), // 将 theme 映射为 计算属性
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题初始化图表对象
      this.screenAdapter(); // 更新图表的展示
      this.updateChart(); // 重新设置数据
    },
  },
};
</script>

<style lang="scss" scoped></style>
