<template>
  <div class="home">
    <!-- 原有的内容保留 -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <!-- 添加你的组件 -->
    <MyFirstComponent/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import MyFirstComponent from '@/components/MyFirstComponent.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    MyFirstComponent
  }
}
</script>