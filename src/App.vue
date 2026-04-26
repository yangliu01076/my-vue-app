<template>
  <div id="app">
    <header>
<!--      <img alt="Vue logo" src="./assets/logo.png">-->
      <h1 class="cute-header" @click="toggleViewMode">🎯 可爱的网页</h1>
      <p class="subtitle">点击标题切换视图模式</p>
    </header>

    <main>
      <!-- 模式选择器 -->
      <div class="mode-selector">

        <button
            :class="{ active: currentMode === 'mood' }"
            @click="switchMode('mood')"
        >
          🎉 心情记录
        </button>
<!--        <button-->
<!--            :class="{ active: currentMode === 'welcome' }"-->
<!--            @click="switchMode('welcome')"-->
<!--        >-->
<!--          🏠 欢迎页面-->
<!--        </button>-->
        <button
            :class="{ active: currentMode === 'demo' }"
            @click="switchMode('demo')"
        >
          🎮 小互动
        </button>
        <button
            :class="{ active: currentMode === 'info' }"
            @click="switchMode('info')"
        >
          ℹ️ 项目信息
        </button>
      </div>

      <!-- 根据当前模式显示不同内容 -->
      <div class="content-area">
        <!-- 欢迎模式 -->
        <div v-if="currentMode === 'welcome'" class="mode-content welcome-mode">
          <HelloWorld msg="Vue.js App 启动成功！"/>

          <div class="features">
            <h3>✨ 项目特性</h3>
            <ul>
              <li>✅ Vue 2 + Vue Router + Vuex</li>
              <li>✅ 组件化开发</li>
              <li>✅ 响应式设计</li>
              <li>✅ 热重载开发体验</li>
            </ul>
          </div>
        </div>

        <!-- 演示模式 -->
        <div v-else-if="currentMode === 'demo'" class="mode-content demo-mode">
          <MyFirstComponent/>

          <!-- 颜色选择器示例 -->
          <div class="demo-card">
            <h4>颜色选择器</h4>
            <div class="color-picker">
              <div
                  v-for="color in colors"
                  :key="color"
                  :class="['color-option', { selected: selectedColor === color }]"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
              ></div>
            </div>
            <p>当前颜色: <span :style="{ color: selectedColor }">{{ selectedColor }}</span></p>
          </div>

          <div class="extra-demos">
            <h3>🎯 更多示例</h3>

            <!-- 计数器示例 -->
            <div class="demo-card">
              <h4>简单计数器</h4>
              <div class="counter">
                <button @click="decrement">-</button>
                <span class="count">{{ counter }}</span>
                <button @click="increment">+</button>
              </div>
              <button @click="resetCounter" class="reset-btn">重置</button>
            </div>
          </div>
        </div>

        <!-- 心情记录 -->
        <div v-else-if="currentMode === 'mood'" class="mode-content mood-mode">
          <MoodTracker/>
        </div>

        <!-- 信息模式 -->
        <div v-else-if="currentMode === 'info'" class="mode-content info-mode">
          <div class="info-card">
            <h3>📊 项目信息</h3>
            <table class="info-table">
              <tr>
                <td>项目名称:</td>
                <td><strong>Vue 2 学习项目</strong></td>
              </tr>
              <tr>
                <td>开发环境:</td>
                <td>IntelliJ IDEA</td>
              </tr>
              <tr>
                <td>Vue 版本:</td>
                <td>2.6.14</td>
              </tr>
              <tr>
                <td>创建时间:</td>
                <td>{{ createdDate }}</td>
              </tr>
              <tr>
                <td>当前模式:</td>
                <td><span class="mode-badge">{{ currentMode }}</span></td>
              </tr>
            </table>
          </div>

          <div class="quick-links">
            <h3>🔗 快速链接</h3>
            <div class="links">
              <button
                  :class="{ active: currentMode === 'mood' }"
                  @click="switchMode('mood')"
                  class="link-btn"
              >
                🎉 心情记录
              </button>
<!--              <router-link to="/" class="link-btn">🏠 首页</router-link>-->
<!--              <router-link to="/about" class="link-btn">📖 关于</router-link>-->
              <a href="#" @click.prevent="showMessage" class="link-btn">💬 弹出消息</a>
              <button @click="showTime" class="link-btn">🕐 显示时间</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="footer-info">
        <p>🚀 使用 IntelliJ IDEA 开发 | 当前视图: <span class="mode-indicator">{{ modeNames[currentMode] }}</span></p>
        <p>当前时间：{{ currentTime }} | 页面已加载 {{ loadCount }} 次</p>
        <p class="hint">💡 提示: 点击标题可以循环切换视图模式</p>
      </div>
    </footer>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import MyFirstComponent from './components/MyFirstComponent.vue'
import MoodTracker from './components/MoodTracker.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    MyFirstComponent,
    MoodTracker
  },
  data() {
    return {
      currentMode: 'mood', // welcome, demo, info
      counter: 0,
      colors: ['#42b983', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'],
      selectedColor: '#42b983',
      currentTime: '',
      loadCount: 0,
      createdDate: new Date().toLocaleDateString(),
      modeNames: {
        welcome: '欢迎模式',
        demo: '小互动',
        info: '项目信息',
        mood: '心情记录'
      }
    }
  },
  mounted() {
    console.log('🎉 App.vue 已挂载！')

    // 更新时间
    this.updateTime()
    this.timeInterval = setInterval(() => {
      this.updateTime()
    }, 1000)

    // 增加加载次数
    this.loadCount = parseInt(localStorage.getItem('vue_load_count') || 0) + 1
    localStorage.setItem('vue_load_count', this.loadCount.toString())
  },
  beforeDestroy() {
    // 清理定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    // 切换视图模式
    switchMode(mode) {
      this.currentMode = mode
      console.log(`切换到 ${this.modeNames[mode]} 模式`)
    },

    // 点击标题循环切换模式
    toggleViewMode() {
      const modes = ['mood', 'demo', 'info']
      const currentIndex = modes.indexOf(this.currentMode)
      const nextIndex = (currentIndex + 1) % modes.length
      this.currentMode = modes[nextIndex]

      // 显示切换动画提示
      this.showToast(`切换到 ${this.modeNames[this.currentMode]}`)
    },

    // 计数器方法
    increment() {
      this.counter++
    },
    decrement() {
      this.counter--
    },
    resetCounter() {
      this.counter = 0
      this.showToast('计数器已重置')
    },

    // 颜色选择
    selectColor(color) {
      this.selectedColor = color
      document.documentElement.style.setProperty('--primary-color', color)
    },

    // 显示消息
    showMessage() {
      alert(`🎉 恭喜你，点击了标题！\n当前模式: ${this.modeNames[this.currentMode]}`)
    },

    showTime() {
      alert(`当前时间: ${this.currentTime}`)
    },

    // 更新时间
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString()
    },

    // 简单的 toast 提示
    showToast(message) {
      // 创建临时提示元素
      const toast = document.createElement('div')
      toast.className = 'toast-message'
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #42b983;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 2s;
      `

      // 添加动画样式
      const style = document.createElement('style')
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `

      document.head.appendChild(style)
      document.body.appendChild(toast)

      // 2秒后移除
      setTimeout(() => {
        toast.remove()
        style.remove()
      }, 2000)
    }
  }
}
</script>

<style>
/* CSS 变量，用于动态主题色 */
:root {
  /* 可爱风格的主色调 */
  --primary-color: #42b983;        /* Vue绿色主色调 */
  --primary-light: #85d1ab;        /* 浅绿色 */
  --primary-dark: #2a7a58;         /* 深绿色 */

  /* 辅助颜色 */
  --secondary-color: #e7c23e;      /* 温暖黄色 */
  --accent-color: #6b46c1;         /* 紫色点缀 */
  --success-color: #66cc99;        /* 绿色 */
  --warning-color: #ff9966;        /* 橙色 */

  /* 背景和文字 */
  --background-color: #fff9fc;     /* 浅粉色背景 */
  --text-color: #333333;           /* 主要文字颜色 */
  --text-light: #666666;           /* 次要文字颜色 */

  /* 边框和阴影 */
  --border-color: #a8d5bb;         /* 浅绿色边框 */
  --shadow-color: rgba(66, 185, 131, 0.15);  /* 绿色阴影 */
  --shadow-hover: rgba(66, 185, 131, 0.25);  /* 悬停阴影 */

  /* 动画效果 */
  --transition-speed: 0.3s;
  --border-radius: 12px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 头部样式 */
header {
  text-align: center;
  margin-bottom: 40px;
  cursor: pointer;
  transition: transform 0.3s;
}

header:hover {
  transform: translateY(-5px);
}

header h1 {
  color: var(--primary-color);
  margin-top: 10px;
  font-size: 2.5em;
  transition: color 0.3s;
}

.cute-header {
  /* 使用CSS变量 */
  color: var(--primary-color);
  font-family: 'Quicksand', 'Segoe UI', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;

  /* 背景和边框 */
  background-color: var(--background-color);
  border: 3px solid var(--border-color);
  border-radius: calc(var(--border-radius) * 2);

  /* 阴影效果 */
  box-shadow:
      0 8px 16px var(--shadow-color),
      inset 0 2px 4px rgba(255, 255, 255, 0.8);

  /* 布局和间距 */
  display: inline-block;
  padding: 15px 30px;
  margin: 20px 0;

  /* 交互效果 */
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  position: relative;
  overflow: hidden;

  /* 文字装饰 */
  text-shadow: 2px 2px 0 var(--primary-light);
}

/* 鼠标悬停效果 */
.cute-header:hover {
  transform: translateY(-5px);
  box-shadow:
      0 12px 24px var(--shadow-hover),
      inset 0 2px 4px rgba(255, 255, 255, 0.9);
  background-color: var(--primary-light, 0.1);
  border-color: var(--primary-dark);
}

/* 点击效果 */
.cute-header:active {
  transform: translateY(-2px) scale(0.98);
  transition: all 0.1s ease;
}

/* 添加可爱的装饰元素 */
.cute-header::before,
.cute-header::after {
  content: '✨';
  position: absolute;
  color: var(--secondary-color);
  font-size: 1.5rem;
  opacity: 0.7;
  animation: sparkle 2s infinite alternate;
}

.cute-header::before {
  top: -15px;
  left: 15px;
}

.cute-header::after {
  bottom: -15px;
  right: 15px;
}

@keyframes sparkle {
  0% {
    transform: scale(0.9) rotate(0deg);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1) rotate(10deg);
    opacity: 1;
  }
}

/* 点击涟漪效果 */
.cute-header::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: width 0.6s, height 0.6s, opacity 0.6s;
  pointer-events: none;
}

.cute-header:active::before {
  width: 200px;
  height: 200px;
  opacity: 0.3;
}

header .subtitle {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-top: 5px;
}

/* 模式选择器 */
.mode-selector {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.mode-selector button {
  padding: 12px 24px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  outline: none;
}

.mode-selector button:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.mode-selector button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

/* 内容区域 */
.content-area {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  min-height: 400px;
}

/* 不同模式的内容样式 */
.mode-content {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 欢迎模式 */
.welcome-mode {
  text-align: center;
}

.features {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.features ul {
  list-style: none;
  padding: 0;
  display: inline-block;
  text-align: left;
}

.features li {
  padding: 8px 0;
  font-size: 16px;
}

/* 演示模式 */
.demo-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid var(--primary-color);
}

.counter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 15px 0;
}

.counter button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--primary-color);
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.count {
  font-size: 24px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
}

.reset-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.color-picker {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 15px 0;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.3s;
}

.color-option:hover {
  transform: scale(1.2);
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

/* 信息模式 */
.info-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table tr {
  border-bottom: 1px solid #eee;
}

.info-table td {
  padding: 12px 0;
}

.info-table td:first-child {
  width: 120px;
  color: #7f8c8d;
}

.mode-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

.quick-links {
  text-align: center;
}

.links {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.link-btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.link-btn:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.3);
}

/* 页脚 */
footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #7f8c8d;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.mode-indicator {
  font-weight: bold;
  color: var(--primary-color);
}

.hint {
  font-size: 0.9em;
  margin-top: 10px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  header h1 {
    font-size: 1.8em;
  }

  .mode-selector {
    flex-direction: column;
    align-items: center;
  }

  .mode-selector button {
    width: 100%;
    max-width: 300px;
  }

  .content-area {
    padding: 15px;
  }

  .links {
    flex-direction: column;
    align-items: center;
  }

  .link-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>