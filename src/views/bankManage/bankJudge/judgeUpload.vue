<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center;margin-bottom: 20px">
      <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        请先下载判断题上传模板
      </el-button>
    </div>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // Waves directive
import { reqInsertJudgeList } from '@/api/bankManage'
export default {
  name: 'JudgeUpload',
  components: { UploadExcelComponent },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '(必填)题目内容',
          '(必填)题目答案(正确填写T,错误填写F)',
          '(选填)答案解析',
          '(必填)所属科目(Java填1,C++填2,Android填3,IOS填4,php填5,Python填6,Ruby填7,Go填8,JavaScript填9)'
        ]
        excel.export_json_to_excel({
          header: tHeader,
          data: [],
          filename: '判断题上传模板'
        })
        this.downloadLoading = false
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请上传小于1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      const judgeList = []
      results.forEach((item, index) => {
        const judge = {}
        Object.keys(item).forEach((key) => {
          if (key === '(必填)题目内容') {
            judge.judgeContent = item[key]
          }
          if (key === '(必填)题目答案(正确填写T,错误填写F)') {
            judge.judgeAnswer = item[key]
          }
          if (key === '(选填)答案解析') {
            judge.answerExplain = item[key]
          }
          if (key === '(必填)所属科目(Java填1,C++填2,Android填3,IOS填4,php填5,Python填6,Ruby填7,Go填8,JavaScript填9)') {
            judge.langId = item[key]
          }
        })
        judgeList.push(judge)
      })
      this.insertJudgeList(judgeList)
      this.tableData = results
      this.tableHeader = header
    },
    // 插入数据库判断题表
    async insertJudgeList(judgeList) {
      const result = await reqInsertJudgeList(judgeList)
      if (result.statu === 0) {
        this.$message({
          message: result.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>

</style>
