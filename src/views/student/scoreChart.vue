<template>
  <div v-loading="listLoading" class="chart-container">
    <div class="chart-select">
      <el-select v-model="paperId" class="filter-item">
        <el-option v-for="item in paperNameOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
    </div>
    <chart height="98%" width="100%"/>
  </div>
</template>

<script>
import Chart from '@/components/Charts/mixChart'
import { reqGetPapersList } from '@/api/student'
import { setStore } from '@/utils/mUtils'
export default {
  name: 'ScoreChart',
  components: { Chart },
  data() {
    return {
      listLoading: true,
      paperId: this.$store.state.teacher.paperId,
      paperNameOptions: []
    }
  },
  watch: {
    paperId(newValue) {
      if (newValue) {
        this.$store.dispatch('recordPaperId', newValue)
        setStore('paperId', newValue)
      }
    }
  },
  created() {
    this.getList()
  },
  beforeDestroy() {
    this.$store.dispatch('resetPaperId')
    setStore('paperId', 1)
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await reqGetPapersList()
      if (result.statu === 0) {
        this.paperNameOptions = result.data.papersList
      }
      // 延迟0秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 0)
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss" scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
    .chart-select {
      display: flex;
      justify-content: center;
      padding: 10px
    }
  }
</style>

