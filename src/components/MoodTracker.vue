<template>
  <div class="mood-tracker">
    <!-- 头部 -->
    <div class="header">
      <h2>📝 每日心情记录</h2>
      <div class="date-info">
        <span class="current-date">{{ currentDate }}</span>
        <span class="weekday">{{ weekday }}</span>
      </div>
    </div>

    <!-- 心情选择 -->
    <div class="mood-selector">
      <h3>今天感觉如何？</h3>
      <div class="mood-options">
        <div
            v-for="mood in moodOptions"
            :key="mood.id"
            :class="['mood-option', { selected: selectedMood.id === mood.id }]"
            @click="selectMood(mood)"
        >
          <span class="emoji">{{ mood.emoji }}</span>
          <span class="label">{{ mood.label }}</span>
        </div>
      </div>
    </div>

    <!-- 心情描述 -->
    <div class="mood-details">
      <h3>分享你的感受（可选）</h3>
      <textarea
          v-model="description"
          placeholder="今天发生了什么事？有什么想说的？..."
          rows="4"
          maxlength="500"
          class="description-input"
      ></textarea>
      <div class="char-count">{{ description.length }}/500</div>

      <!-- 标签选择 -->
      <div class="tags-section">
        <h4>选择标签（可选）</h4>
        <div class="tags">
          <span
              v-for="tag in tagOptions"
              :key="tag"
              :class="['tag', { selected: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 天气 -->
      <div class="weather-section">
        <h4>天气情况（可选）</h4>
        <select v-model="selectedWeather" class="weather-select">
          <option value="">选择天气</option>
          <option value="sunny">☀️ 晴天</option>
          <option value="cloudy">☁️ 多云</option>
          <option value="rainy">🌧️ 雨天</option>
          <option value="snowy">❄️ 雪天</option>
          <option value="windy">💨 大风</option>
        </select>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="actions">
      <button
          @click="saveMood"
          :disabled="!selectedMood.id || isSubmitting"
          class="save-btn"
      >
        {{ isSubmitting ? '保存中...' : '保存今日心情' }}
      </button>
    </div>

    <!-- 历史记录 -->
    <div class="history" v-if="moodHistory.length > 0">
      <h3>📅 近期心情记录</h3>
      <div class="history-list">
        <div
            v-for="record in moodHistory"
            :key="record.id"
            class="history-item"
        >
          <div class="history-date">{{ formatDate(record.recordDate) }}</div>
          <div class="history-mood">
            <span class="history-emoji">{{ getMoodEmoji(record.moodLevel) }}</span>
            <span class="history-level">{{ getMoodLabel(record.moodLevel) }}</span>
          </div>
          <div class="history-desc" v-if="record.description">
            {{ record.description }}
          </div>
          <div class="history-tags" v-if="record.tags">
            <span
                v-for="tag in record.tags.split(',')"
                :key="tag"
                class="history-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="history-weather" v-if="record.weather">
            {{ getWeatherEmoji(record.weather) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats" v-if="moodStats">
      <h3>📊 本月心情统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ moodStats.totalDays || 0 }}</div>
          <div class="stat-label">记录天数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ moodStats.averageMood?.toFixed(1) || '0.0' }}</div>
          <div class="stat-label">平均心情</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getMostCommonMood(moodStats.moodDistribution) }}</div>
          <div class="stat-label">最常见心情</div>
        </div>
      </div>

      <!-- 心情趋势图 -->
      <div class="trend-chart" v-if="moodHistory.length > 0">
        <h4>心情趋势</h4>
        <div class="chart-container">
          <div class="chart-bars">
            <div
                v-for="(record, index) in recentHistory"
                :key="index"
                class="chart-bar-container"
            >
              <div class="chart-date">{{ formatChartDate(record.recordDate) }}</div>
              <div class="chart-bar-wrapper">
                <div
                    class="chart-bar"
                    :style="{ height: getMoodHeight(record.moodLevel) + 'px' }"
                    :class="'mood-' + record.moodLevel"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      加载中...
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="success-message">
      ✅ 心情记录保存成功！
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      ❌ {{ errorMessage }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'MoodTracker',
  data() {
    return {
      // 当前选择
      selectedMood: {},
      description: '',
      selectedTags: [],
      selectedWeather: '',

      // 选项
      moodOptions: [
        { id: 1, emoji: '😊', label: '开心', level: 5 },
        { id: 2, emoji: '😄', label: '兴奋', level: 4 },
        { id: 3, emoji: '😌', label: '平静', level: 3 },
        { id: 4, emoji: '😕', label: '一般', level: 2 },
        { id: 5, emoji: '😔', label: '低落', level: 1 },
        { id: 6, emoji: '😢', label: '难过', level: 0 }
      ],
      tagOptions: ['工作', '学习', '家庭', '朋友', '健康', '运动', '娱乐', '美食', '旅行'],

      // 数据
      moodHistory: [],
      moodStats: null,

      // 状态
      isSubmitting: false,
      loading: false,
      showSuccess: false,
      errorMessage: '',
      axios: this.$http
    }
  },
  computed: {
    currentDate() {
      const now = new Date()
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    weekday() {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekdays[new Date().getDay()]
    },
    recentHistory() {
      return this.moodHistory.slice(0, 7) // 最近7天
    }
  },
  mounted() {
    this.loadMoodData()
  },
  methods: {
    // 选择心情
    selectMood(mood) {
      this.selectedMood = mood
    },

    // 切换标签
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
    },

    // 保存心情记录
    async saveMood() {
      if (!this.selectedMood.id) {
        this.errorMessage = '请选择一个心情'
        return
      }

      this.isSubmitting = true
      this.errorMessage = ''

      try {
        const moodData = {
          moodLevel: this.selectedMood.level,
          description: this.description.trim(),
          tags: this.selectedTags.join(','),
          weather: this.selectedWeather
        }

        const response = await axios.post('/api/mood/save', moodData)

        if (response.data.success) {
          this.showSuccess = true
          this.resetForm()
          this.loadMoodData()

          // 3秒后隐藏成功提示
          setTimeout(() => {
            this.showSuccess = false
          }, 3000)
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.errorMessage = error.response?.data?.message || '保存失败，请重试'
      } finally {
        this.isSubmitting = false
      }
    },

    // 重置表单
    resetForm() {
      this.selectedMood = {}
      this.description = ''
      this.selectedTags = []
      this.selectedWeather = ''
    },

    // 加载数据
    async loadMoodData() {
      this.loading = true
      try {
        const [historyRes, statsRes] = await Promise.all([
          axios.get('/api/mood/history'),
          axios.get('/api/mood/stats')
        ])

        this.moodHistory = historyRes.data.data || []
        this.moodStats = statsRes.data.data || null
      } catch (error) {
        console.error('加载数据失败:', error)
        this.errorMessage = '加载数据失败'
      } finally {
        this.loading = false
      }
    },

    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      })
    },

    formatChartDate(dateString) {
      const date = new Date(dateString)
      return date.getDate() + '日'
    },

    // 获取心情表情
    getMoodEmoji(level) {
      const mood = this.moodOptions.find(m => m.level === level)
      return mood ? mood.emoji : '❓'
    },

    getMoodLabel(level) {
      const mood = this.moodOptions.find(m => m.level === level)
      return mood ? mood.label : '未知'
    },

    // 获取天气表情
    getWeatherEmoji(weather) {
      const weatherMap = {
        sunny: '☀️',
        cloudy: '☁️',
        rainy: '🌧️',
        snowy: '❄️',
        windy: '💨'
      }
      return weatherMap[weather] || ''
    },

    // 图表相关
    getMoodHeight(level) {
      return (level + 1) * 10 // 根据心情等级计算高度
    },

    // 统计数据
    getMostCommonMood(distribution) {
      if (!distribution) return '-'
      const entries = Object.entries(distribution)
      if (entries.length === 0) return '-'
      const mostCommon = entries.reduce((a, b) => a[1] > b[1] ? a : b)
      const mood = this.moodOptions.find(m => m.level == mostCommon[0])
      return mood ? mood.label : '-'
    }
  }
}
</script>

<style scoped>
.mood-tracker {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部 */
.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.date-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #7f8c8d;
}

.current-date {
  font-size: 18px;
  font-weight: 500;
}

.weekday {
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

/* 心情选择 */
.mood-selector {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
}

.mood-selector h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

@media (max-width: 600px) {
  .mood-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.mood-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.mood-option.selected {
  border-color: #42b983;
  background: #f8fff9;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.2);
}

.emoji {
  font-size: 32px;
  margin-bottom: 10px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

/* 心情详情 */
.mood-details {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
}

.mood-details h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.description-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.description-input:focus {
  outline: none;
  border-color: #42b983;
}

.char-count {
  text-align: right;
  color: #95a5a6;
  font-size: 14px;
  margin-top: 5px;
}

.tags-section, .weather-section {
  margin-top: 25px;
}

.tags-section h4, .weather-section h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.tag:hover {
  background: #e9ecef;
}

.tag.selected {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.weather-select {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  width: 200px;
  background: white;
}

/* 按钮 */
.actions {
  text-align: center;
  margin: 30px 0;
}

.save-btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #42b983, #3498db);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(66, 185, 131, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 历史记录 */
.history, .stats {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
}

.history h3, .stats h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 80px 100px 1fr auto;
  gap: 15px;
  align-items: center;
}

@media (max-width: 768px) {
  .history-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.history-date {
  font-weight: 600;
  color: #2c3e50;
}

.history-mood {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-emoji {
  font-size: 24px;
}

.history-level {
  font-size: 14px;
  color: #7f8c8d;
}

.history-desc {
  color: #5a6c7d;
  font-size: 14px;
}

.history-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.history-tag {
  padding: 4px 8px;
  background: #f1f8ff;
  color: #0366d6;
  border-radius: 12px;
  font-size: 12px;
}

.history-weather {
  font-size: 20px;
}

/* 统计数据 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #42b983;
  margin-bottom: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
}

/* 趋势图 */
.trend-chart {
  margin-top: 30px;
}

.trend-chart h4 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.chart-date {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.chart-bar-wrapper {
  height: 150px;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.chart-bar {
  width: 30px;
  border-radius: 6px 6px 0 0;
  background: #42b983;
  transition: height 0.5s ease;
}

.chart-bar.mood-5 { background: #2ecc71; }
.chart-bar.mood-4 { background: #3498db; }
.chart-bar.mood-3 { background: #f1c40f; }
.chart-bar.mood-2 { background: #e67e22; }
.chart-bar.mood-1 { background: #e74c3c; }
.chart-bar.mood-0 { background: #c0392b; }

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 消息提示 */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #2ecc71;
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(46, 204, 113, 0.3);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.error-message {
  background: #e74c3c;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>