<template> 
<div class="app-container">
  <ad-detail :is-edit='false'></ad-detail>
</div>
</template>
<script>
  import adDetail from './components/adDetail'
  export default {
    name: 'addAd',
    components: { adDetail }
  }
</script>
<style>
</style>
