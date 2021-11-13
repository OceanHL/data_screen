<!--
 * @Author: jhl
 * @Date: 2021-11-13 11:41:19
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-13 11:45:28
 * @Description: 
-->
<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" alt="" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
          <!-- 销量趋势图表 -->
        </div>
        <div id="left-bottom">
          <!-- 商家销售金额图表 -->
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top">
          <!-- 商家分布图表 -->
        </div>
        <div id="middle-bottom">
          <!-- 地区销售排行图表 -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
