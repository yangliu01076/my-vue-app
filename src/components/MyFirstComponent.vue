<template>
  <div class="my-first-component">
    <h1>🎉 哪里不喜欢就改哪里 </h1>
    <p>比如，改改主题色</p>

    <div class="demo">
      <p>计数器: {{ count }}</p>
      <button @click="increment">点击 +1</button>
      <button @click="reset">重置</button>
    </div>

    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: 'MyFirstComponent',
  data() {
    return {
      count: 0,
      currentTime: ''
    }
  },
  mounted() {
    this.updateTime()
    setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  methods: {
    increment() {
      this.count++
    },
    reset() {
      this.count = 0
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.my-first-component {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>