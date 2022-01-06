<template> 
<div class="app-container">
  <ad-detail :is-edit='true'></ad-detail>
</div>
</template>
<script>
  import adDetail from './components/adDetail'
  export default {
    name: 'addProduct',
    components: { adDetail }
  }
</script>
<style>
</style>
