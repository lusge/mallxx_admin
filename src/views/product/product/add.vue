<template> 
<div class="app-container">
  <product-detail :is-edit='false'></product-detail>
</div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'addProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>
