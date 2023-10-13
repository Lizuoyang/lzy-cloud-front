<template>
  <el-card :style="containerStyle">
    <!-- 卡片的头
    <div slot="header">
      <slot name="title"></slot>
    </div> -->
    <!-- 卡片的内容 -->
    <div style="margin: 20px 10px 50px 10px">
      <slot name="container"></slot>
    </div>
  </el-card>
</template>

<script>
  export default {
    created() {
      window.addEventListener("resize", this.getHeight);
      this.getHeight();
    },
    props: {
      conWidth: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        containerStyle: {
          height: "",
          width: ""
        },
      }
    },
    methods: {
      getHeight() {
        this.containerStyle.height = window.innerHeight - 140 + "px";
        this.containerStyle.width = this.conWidth + "%";

      },
    }
  }
</script>

<style scoped>
.el-card{
  overflow: auto;
}
</style>
