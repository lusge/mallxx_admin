<template> 
<div class="app-container">
  <product-detail :is-edit='true'></product-detail>
</div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'updateProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>
