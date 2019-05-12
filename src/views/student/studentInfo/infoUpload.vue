<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center;margin-bottom: 20px">
      <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        请先下载学生信息上传模板
      </el-button>
    </div>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <div v-if="allItemCount" style="margin-top: 15px" >
      <span style="color: #4ab7bd">上传总记录条数：{{ allItemCount }}</span>
      <span style="color: #67c23a;margin-left: 30px">成功总记录条数：{{ successItemCount }}</span>
      <span style="color: #FF0000;margin-left: 30px">失败总记录条数：{{ failItemCount }}</span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // Waves directive
import { reqInsertStudentInfoList } from '@/api/student'
export default {
  name: 'InfoUpload',
  components: { UploadExcelComponent },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      tableData: [],
      tableHeader: [],
      allItemCount: 0,
      successItemCount: 0,
      failItemCount: 0
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '(必填)学号(12位数字)',
          '(必填)姓名',
          '(必填)性别(填男或者女)'
        ]
        excel.export_json_to_excel({
          header: tHeader,
          data: [],
          filename: '学生信息上传模板'
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
      const studentList = []
      results.forEach((item, index) => {
        const student = {}
        Object.keys(item).forEach((key) => {
          if (key === '(必填)学号(12位数字)') {
            student.sno = (String)(item[key])
          }
          if (key === '(必填)姓名') {
            student.stuName = item[key]
          }
          if (key === '(必填)性别(填男或者女)') {
            student.stuSex = item[key]
          }
        })
        studentList.push(student)
      })
      this.insertStudentInfoList(studentList)
    },
    // 插入数据库学生信息表
    async insertStudentInfoList(studentList) {
      const result = await reqInsertStudentInfoList(studentList)
      if (result.statu === 0) {
        this.tableHeader = ['学号', '姓名', '性别', '上传状态']
        this.tableData = result.data.responseList
        this.allItemCount = result.data.allItemCount
        this.successItemCount = result.data.successItemCount
        this.failItemCount = result.data.failItemCount
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
