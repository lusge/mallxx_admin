<template>
<div class="app-container">
    <category-detail :is-edit='true'> </category-detail>
</div>
</template>

<script>
import CategoryDetail from './components/categoryDetail.vue'
export default {
    name:"updateCategory",
    components: {CategoryDetail},
}
</script>