<!--
 * @Author: jhl
 * @Date: 2021-11-11 11:24:17
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-11 11:32:56
 * @Description: 
-->
<template>
  <div class="com-page">
    <single-map />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
export default {
  components: {
    "single-map": Map,
  },
};
</script>

<style lang="scss" scoped></style>
