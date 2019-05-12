<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sno" placeholder="搜索学号" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.stuName" placeholder="搜索姓名" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.stuSex" placeholder="搜索性别" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in stuSexOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" style="margin-left: 0;margin-right: 10px;" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出当前页学生信息
      </el-button>
      <el-button v-waves :loading="downloadLoading" style="margin-left: 0;" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadAll">
        导出全部学生信息
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
      <el-table-column label="学号" prop="sno" sortable align="center" width="140">
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
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.stuEmail || '暂无绑定邮箱' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.stuPhone || '暂无绑定手机号' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stuCreateTime" sortable label="注册时间" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.stuCreateTime | date-format }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stuLastLoginTime" sortable label="最近登录时间" align="center" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.stuLastLoginTime">{{ scope.row.stuLastLoginTime | date-format }}</span>
          <span v-else>暂无最近登录记录</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="120">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-setting" size="mini" @click="confirmUpdatePsw(row)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="登录权限" align="center" class-name="small-padding" width="120">
        <template slot-scope="{row}">
          <!--<el-switch
            v-if="row.stuStatus == '1'"
            value="row.stuStatus == '1'"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
          <span :style="{ color: row.stuStatus === '1' ? 'green' : 'red', fontWeight:'bold' }">{{ row.stuStatus === '1'?'已启用':'已禁用' }}</span>-->
          <el-button v-waves v-if="row.stuStatus=='1'" size="mini" icon="el-icon-success" type="success" @click="handleModifyStatus(row,'0')">
            启用状态
          </el-button>
          <el-button v-waves v-if="row.stuStatus=='0'" size="mini" icon="el-icon-error" type="danger" @click="handleModifyStatus(row,'1')">
            禁用状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="添加">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号" prop="sno">
          <el-input v-model="temp.sno" />
        </el-form-item>
        <el-form-item label="密码" prop="stuPsw">
          <el-input v-model="temp.stuPsw" />
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="temp.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-select v-model="temp.stuSex" class="filter-item">
            <el-option v-for="item in stuSexOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          确认添加
        </el-button>
      </div>
    </el-dialog>

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
/* eslint-disable */
import { reqGetStudentsList, reqUpdateStudentInfo, reqSearchStudentsList, reqInsertStudentInfo } from '@/api/student'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

export default {
  name: 'InfoTable',
  components: { Pagination, BackToTop },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sno: undefined,
        stuName: undefined,
        stuSex: undefined
      },
      stuSexOptions: [{ label: '男', key: '男' }, { label: '女', key: '女' }],
      temp: {
        sno: '',
        stuPsw: '123456',
        stuName: '',
        stuSex:'男'
      },
      dialogFormVisible: false,
      rules: {
        sno: [{ required: true, message: '学号为必填项', trigger: 'blur' },{ min: 12, max: 12, message: '学号必须为12位数字', trigger: 'blur' }],
        stuPsw: [{ required: true, message: '密码为必填项，默认设置密码为123456', trigger: 'blur' }],
        stuName: [{ required: true, message: '姓名为必填项', trigger: 'blur' }],
        stuSex: [{ required: true, message: '性别为必填项，默认选择男', trigger: 'blur' }]
      },
      downloadLoading: false,
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      let result = await reqGetStudentsList()
      if (result.statu === 0){
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟0.5秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    async handleModifyStatus(row, status) {
      row.stuStatus = status
      let result = await reqUpdateStudentInfo(row)
      if (result.statu === 0){
        if (status === '1'){
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '禁用成功',
            type: 'error'
          })
        }
      }
      else {
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    },
    confirmUpdatePsw(row) {
      this.$confirm('确定重置密码吗?重置后默认密码为123456', '提示', {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleUpdatePsw(row)
      }).catch(() => {
      })
    },
    async handleUpdatePsw(row) {
      row.stuPsw = '123456'
      let result = await reqUpdateStudentInfo(row)
      if (result.statu === 0){
        this.$message({
          message: '重置密码成功，默认密码为123456',
          type: 'success'
        })
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
      let result = await reqSearchStudentsList(this.listQuery.sno, this.listQuery.stuName, this.listQuery.stuSex)
      if (result.statu === 0){
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      // 延迟一秒等待请求数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    resetTemp(){
      this.temp = {
        sno: '',
        stuPsw: '123456',
        stuName: '',
        stuSex:'男'
      }
    },
    handleCreate(){
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.insertStudentInfo()
        }
      })
    },
    async insertStudentInfo(){
      let result = await reqInsertStudentInfo(this.temp)
      if (result.statu === 0){
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      } else {
        this.$notify({
          title: '失败',
          message: result.msg,
          type: 'error',
          duration: 2000
        })
      }
    },
    handleDownload(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学号', '姓名', '性别', '邮箱', '手机号', '注册时间', '最近登录时间', '登录权限']
        const filterVal = ['sno', 'stuName', 'stuSex', 'stuEmail', 'stuPhone', 'stuCreateTime', 'stuLastLoginTime', 'stuStatus']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '当前页学生信息表'
        })
        this.downloadLoading = false
      })
    },
    async handleDownloadAll(){
      this.downloadLoading = true
      let result = await reqGetStudentsList()
      let list = result.data
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学号', '姓名', '性别', '邮箱', '手机号', '注册时间', '最近登录时间', '登录权限']
        const filterVal = ['sno', 'stuName', 'stuSex', 'stuEmail', 'stuPhone', 'stuCreateTime', 'stuLastLoginTime', 'stuStatus']
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '全部学生信息表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'stuCreateTime' || j === 'stuLastLoginTime') {
          if (v[j] !== null) {
            return parseTime(v[j])
          }
          else {
            return '暂无最近登录记录'
          }
        } else if (j === 'stuStatus') {
          return v[j] === '1' ? '启用状态' : '禁用状态'
        } else if (j === 'stuEmail') {
          return v[j] || '暂无绑定邮箱'
        } else if (j === 'stuPhone') {
          return v[j] || '暂无绑定手机号'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
