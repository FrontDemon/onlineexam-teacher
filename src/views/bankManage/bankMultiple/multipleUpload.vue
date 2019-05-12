<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center;margin-bottom: 20px">
      <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        请先下载多选题上传模板
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
import { reqInsertMultipleList } from '@/api/bankManage'
export default {
  name: 'MultipleUpload',
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
          '(必填)选项A内容(内容必须以字符A加:开头)',
          '(必填)选项B内容(内容必须以字符B加:开头)',
          '(必填)选项C内容(内容必须以字符C加:开头)',
          '(必填)选项D内容(内容必须以字符D加:开头)',
          '(选填)选项E内容(内容必须以字符E加:开头)',
          '(选填)选项F内容(内容必须以字符F加:开头)',
          '(选填)选项G内容(内容必须以字符G加:开头)',
          '(必填)题目答案(填写对应答案字符)',
          '(选填)答案解析',
          '(必填)所属科目(Java填1,C++填2,Android填3,IOS填4,php填5,Python填6,Ruby填7,Go填8,JavaScript填9)'
        ]
        excel.export_json_to_excel({
          header: tHeader,
          data: [],
          filename: '多选题上传模板'
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
      const multipleList = []
      results.forEach((item, index) => {
        const multiple = {}
        Object.keys(item).forEach((key) => {
          if (key === '(必填)题目内容') {
            multiple.multipleContent = item[key]
          }
          if (key === '(必填)选项A内容(内容必须以字符A加:开头)') {
            multiple.choiceA = item[key]
          }
          if (key === '(必填)选项B内容(内容必须以字符B加:开头)') {
            multiple.choiceB = item[key]
          }
          if (key === '(必填)选项C内容(内容必须以字符C加:开头)') {
            multiple.choiceC = item[key]
          }
          if (key === '(必填)选项D内容(内容必须以字符D加:开头)') {
            multiple.choiceD = item[key]
          }
          if (key === '(选填)选项E内容(内容必须以字符E加:开头)') {
            multiple.choiceE = item[key]
          }
          if (key === '(选填)选项F内容(内容必须以字符F加:开头)') {
            multiple.choiceF = item[key]
          }
          if (key === '(选填)选项G内容(内容必须以字符G加:开头)') {
            multiple.choiceG = item[key]
          }
          if (key === '(必填)题目答案(填写对应答案字符)') {
            multiple.multipleAnswer = item[key]
          }
          if (key === '(选填)答案解析') {
            multiple.answerExplain = item[key]
          }
          if (key === '(必填)所属科目(Java填1,C++填2,Android填3,IOS填4,php填5,Python填6,Ruby填7,Go填8,JavaScript填9)') {
            multiple.langId = item[key]
          }
        })
        multipleList.push(multiple)
      })
      this.insertMultipleList(multipleList)
      this.tableData = results
      this.tableHeader = header
    },
    // 插入数据库多选题表
    async insertMultipleList(multipleList) {
      const result = await reqInsertMultipleList(multipleList)
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
