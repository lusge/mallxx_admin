<template>
<div class="app-container">
    <category-detail :is-edit='false'> </category-detail>
</div>
</template>

<script>
import CategoryDetail from './components/detail.vue'
export default {
    name:"BrandDetail",
    components: {CategoryDetail},
}
</script>