<template>
  <div id="app">
    <header>
      <img alt="Vue logo" src="./assets/logo.png">
      <h1>🎯 Vue 2 学习项目</h1>
    </header>

    <main>
      <!-- 原有的 HelloWorld 组件 -->
      <HelloWorld msg="Vue.js App 启动成功！"/>

      <!-- 分隔线 -->
      <hr style="margin: 40px 0; border: 1px solid #eee;">

      <!-- 你的自定义组件 -->
      <MyFirstComponent/>

      <!-- 新增导航区域 -->
      <div class="nav-links">
        <router-link to="/">首页</router-link> |
        <router-link to="/about">关于</router-link> |
        <a href="#" @click="showMessage">弹出消息</a>
      </div>
    </main>

    <footer>
      <p>🚀 使用 IntelliJ IDEA 开发</p>
      <p>当前时间：{{ currentDate }}</p>
    </footer>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import MyFirstComponent from './components/MyFirstComponent.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    MyFirstComponent
  },
  data() {
    return {
      currentDate: new Date().toLocaleDateString()
    }
  },
  methods: {
    showMessage() {
      alert('Vue 方法调用成功！')
    }
  },
  mounted() {
    console.log('🎉 App.vue 已挂载！')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 20px;
}

header {
  margin-bottom: 40px;
}

header h1 {
  color: #42b983;
  margin-top: 10px;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-links {
  margin: 30px 0;
}

.nav-links a {
  color: #42b983;
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 10px;
}

.nav-links a:hover {
  text-decoration: underline;
}

footer {
  margin-top: 40px;
  padding: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

footer p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  main {
    padding: 10px;
  }

  .nav-links a {
    display: block;
    margin: 10px 0;
  }
}
</style>