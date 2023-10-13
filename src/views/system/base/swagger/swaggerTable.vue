<template>
  <i-frame :src="url" />
</template>

<script>
  import iFrame from "@/components/iFrame/index";
  export default {
    name: 'SwaggerTable',
    components: { iFrame },
    data() {
      return {
        url: process.env.VUE_APP_API_BASE_URL + "/doc.html"
      }
    }
  }
</script>

<style scoped>

</style>
