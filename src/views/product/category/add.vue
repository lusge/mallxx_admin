<template>
<div class="app-container">
    <category-detail :is-edit='false'> </category-detail>
</div>
</template>

<script>
import CategoryDetail from './components/categoryDetail.vue'
export default {
    name:"addCategory",
    components: {CategoryDetail},
}
</script>