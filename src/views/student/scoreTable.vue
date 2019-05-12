<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sno" placeholder="搜索学号" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.paperId" placeholder="搜索试卷" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in paperNameOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <BookTypeOption v-model="bookType" />
      <el-button v-waves :loading="downloadLoading" style="margin-left: 0;margin-right: 10px;" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出当前页学生成绩
      </el-button>
      <el-button v-waves :loading="downloadLoading" style="margin-left: 0;" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadAll">
        导出全部学生成绩
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'sno', order: 'ascending'}"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="学号" prop="sno" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.stuImgSrc || require('@/assets/images/profile.jpg')" style="width: 40px;height: 40px;border-radius: 5px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="试卷名称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.paperName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="考试分数" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.score">{{ scope.row.score }}分</span>
          <span v-else style="color: #FF0000">0分</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" sortable label="开始考试时间" align="center" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | date-format }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" sortable label="提交考卷时间" align="center" width="170">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime">{{ scope.row.endTime | date-format }}</span>
          <span v-else style="color: #FF0000">强制关闭考试页面无提交试卷时间记录</span>
        </template>
      </el-table-column>
      <el-table-column prop="timeUsed" label="花费时间" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.timeUsed">{{ scope.row.timeUsed | timeUsed-format }}</span>
          <span v-else style="color: #FF0000">00:00:00</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="120">
        <template slot-scope="{row}">
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteScore(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
/* eslint-disable */
import { reqGetScoresList, reqDeleteScore, reqSearchScoresList } from '@/api/student'
import waves from '@/directive/waves' // Waves directive
import { parseTime, timeUsedFormat } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'
import BookTypeOption from './components/BookTypeOption'

  export default {
    name: 'ScoreTable',
    components: { Pagination, BackToTop, BookTypeOption },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          sno: undefined,
          paperId: undefined
        },
        paperNameOptions: [],
        downloadLoading: false,
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        },
        bookType: 'xlsx'
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        let result = await reqGetScoresList()
        if (result.statu === 0){
          this.paperNameOptions = result.data.papersList
          this.total = result.data.scoresList.length
          this.list = result.data.scoresList.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
        }
        // 延迟0.5秒等待请求数据
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      confirmDeleteScore(row) {
        this.$confirm('确定删除该考生成绩吗?删除后该考生可以重新作答该试卷', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDeleteScore(row)
        }).catch(() => {
        })
      },
      async handleDeleteScore(row) {
        let result = await reqDeleteScore(row)
        if (result.statu === 0){
          this.$message({
            message: '删除成功，该考生可重新进行该试卷的考试',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          })
        }
      },
      async handleFilter(){
        this.listQuery.page = 1
        this.listLoading = true
        let paperId = this.listQuery.paperId
        if (this.listQuery.paperId == null || this.listQuery.paperId == undefined){
          paperId = 0
        }
        let result = await reqSearchScoresList(this.listQuery.sno, paperId)
        if (result.statu === 0){
          this.total = result.data.length
          this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
        }
        // 延迟一秒等待请求数据
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      handleDownload(){
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['学号', '姓名', '试卷名称', '考试分数', '开始考试时间', '提交考卷时间', '花费时间']
          const filterVal = ['sno', 'stuName', 'paperName', 'score', 'startTime', 'endTime', 'timeUsed']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '当前页成绩信息表',
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      async handleDownloadAll(){
        this.downloadLoading = true
        let result = await reqGetScoresList()
        let list = result.data.scoresList
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['学号', '姓名', '试卷名称', '考试分数', '开始考试时间', '提交考卷时间', '花费时间']
          const filterVal = ['sno', 'stuName', 'paperName', 'score', 'startTime', 'endTime', 'timeUsed']
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '全部成绩信息表',
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'startTime' || j === 'endTime') {
            if (v[j] !== null) {
              return parseTime(v[j])
            } else {
              return '强制关闭考试页面无提交试卷时间记录'
            }
          } else if (j === 'score') {
            if (v[j] !== null) {
              return v[j] + '分'
            } else {
              return '0分'
            }
          } else if (j === 'timeUsed') {
            return timeUsedFormat(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
