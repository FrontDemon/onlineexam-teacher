<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.content" placeholder="搜索题目内容" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.langId" placeholder="搜索科目下的问题" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.composeFlag" placeholder="搜索是否被组成试卷" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in composeFlagOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加题目
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'id', order: 'ascending'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="">
              <span>{{ scope.row.content }}</span>
            </el-form-item>
            <el-form-item label="题目答案：">
              <span>{{ scope.row.judgeAnswer === 'T' ? '正确' : '错误' }}</span>
            </el-form-item>
            <el-form-item label="答案解析：">
              <span>{{ scope.row.answerExplain || '暂无解析' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="composeFlag" sortable label="是否被组成试卷" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.composeFlag === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="langId" sortable label="所属科目" align="center">
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.langImgSrc" style="width: 40px;height: 40px;border-radius: 20px;">
          </viewer>
          <div>{{ scope.row.langName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="240">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑题目
          </el-button>
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteQue(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="题目内容" prop="content">
          <el-input v-model="temp.content" :rows="5" type="textarea" />
        </el-form-item>
        <el-form-item label="题目答案" prop="judgeAnswer">
          <el-radio v-model="temp.judgeAnswer" label="T">正确</el-radio>
          <el-radio v-model="temp.judgeAnswer" label="F">错误</el-radio>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="temp.answerExplain" :rows="5" type="textarea" />
        </el-form-item>
        <el-form-item label="所属科目" prop="langId">
          <el-select v-model="temp.langId" placeholder="请选择科目" clearable style="width: 200px;margin-right: 15px;" class="filter-item" >
            <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='添加题目'?createData():updateData()">
          {{ dialogStatus==='添加题目'?'确认添加':'确认编辑' }}
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
import { reqGetJudgeList, reqSearchJudgeList, reqDeleteJudge, reqInsertJudgeInfo, reqUpdateJudgeInfo } from '@/api/bankManage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

export default {
  name: 'JudgeInfo',
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
        limit: 10,
        content: undefined,
        langId: undefined,
        composeFlag: undefined
      },
      composeFlagOptions: [{ label: '是', key: '1' }, { label: '否', key: '0' }],
      langOptions: [],
      temp: {
        content: '',
        judgeAnswer: '',
        answerExplain: '',
        langId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        content: [{ required: true, message: '题目内容为必填项', trigger: 'change' }],
        judgeAnswer: [{ required: true, message: '题目答案为必填项', trigger: 'change' }],
        langId: [{ required: true, message: '所属科目为必填项', trigger: 'change' }]
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
      const result = await reqGetJudgeList()
      if (result.statu === 0) {
        this.langOptions = result.data.langOptions
        this.total = result.data.judgeList.length
        this.list = result.data.judgeList.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      this.listLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogStatus = '编辑题目'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.handleUpdateJudge()
        }
      })
    },
    async handleUpdateJudge() {
      const result = await reqUpdateJudgeInfo(this.temp)
      if (result.statu === 0) {
        this.dialogFormVisible = false
        this.$message({
          message: result.msg,
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
    async handleFilter() {
      this.listQuery.page = 1
      this.listLoading = true
      let langId = this.listQuery.langId
      if (this.listQuery.langId === null || this.listQuery.langId === undefined) {
        langId = 0
      }
      let composeFlag = this.listQuery.composeFlag
      if (this.listQuery.composeFlag === null || this.listQuery.composeFlag === undefined) {
        composeFlag = undefined
      }
      const result = await reqSearchJudgeList(this.listQuery.content, langId, composeFlag)
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        content: '',
        judgeAnswer: '',
        answerExplain: '',
        langId: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加题目'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.insertJudgeInfo()
        }
      })
    },
    async insertJudgeInfo() {
      const result = await reqInsertJudgeInfo(this.temp)
      if (result.statu === 0) {
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
    confirmDeleteQue(row) {
      this.$confirm('确定删除该题目吗?若题目已被组成试卷则无法删除', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.composeFlag === '1') {
          this.$message({
            message: '该题目已被组成试卷，无法删除',
            type: 'error'
          })
        } else {
          this.handleDeleteQue(row)
        }
      }).catch(() => {
      })
    },
    async handleDeleteQue(row) {
      const judgeId = row.judgeId
      const result = await reqDeleteJudge(judgeId)
      if (result.statu === 0) {
        this.$message({
          message: result.msg,
          type: 'success'
        })
        this.getList()
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
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .demo-table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 280px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 280px;
    height: 80px;
    display: block;
  }
</style>
