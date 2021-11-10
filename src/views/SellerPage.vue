<!--
 * @Author: jhl
 * @Date: 2021-11-09 21:18:20
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-09 21:47:01
 * @Description: 
-->
<!-- 
  针对于 /sellerpage 这条路径而显示出来的
  在这个组件中，通过子组件注册的方式，要显示出 Seller.vue 这个组件
 -->
<template>
  <div class="com-page">
    <Seller />
  </div>
</template>

<script>
import Seller from "@/components/Seller.vue";
export default {
  data() {
    return {};
  },
  components: {
    Seller,
  },
};
</script>
<style lang="scss" scoped></style>
