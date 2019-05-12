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
            <el-form-item label="">
              <viewer v-if="scope.row.pictureSrc">
                <img :src="scope.row.pictureSrc">
              </viewer>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceA" label="">
              <span>{{ scope.row.choiceA }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceB" label="">
              <span>{{ scope.row.choiceB }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceC" label="">
              <span>{{ scope.row.choiceC }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceD" label="">
              <span>{{ scope.row.choiceD }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceE" label="">
              <span>{{ scope.row.choiceE }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceF" label="">
              <span>{{ scope.row.choiceF }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choiceG" label="">
              <span>{{ scope.row.choiceG }}</span>
            </el-form-item>
            <el-form-item label="题目答案：">
              <span>{{ scope.row.singleAnswer }}</span>
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
      <el-table-column label="题目配图" align="center">
        <template slot-scope="scope">
          <viewer v-if="scope.row.pictureSrc">
            <img :src="scope.row.pictureSrc" style="width: 120px;height: 60px">
          </viewer>
          <span v-else>暂无</span>
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
        <el-form-item label="题目配图">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="/api/admin/uploadPicture">
            <img v-if="temp.pictureSrc" :src="temp.pictureSrc" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <el-button v-waves :disabled="!temp.pictureSrc" type="danger" icon="el-icon-delete" size="mini" @click="deletePictureSrc">
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="选项A" prop="choiceA">
          <el-input v-model="temp.choiceA" placeholder="内容必须以字符A加:开头" />
        </el-form-item>
        <el-form-item label="选项B" prop="choiceB">
          <el-input v-model="temp.choiceB" placeholder="内容必须以字符B加:开头" />
        </el-form-item>
        <el-form-item label="选项C" prop="choiceC">
          <el-input v-model="temp.choiceC" placeholder="内容必须以字符C加:开头" />
        </el-form-item>
        <el-form-item label="选项D" prop="choiceD">
          <el-input v-model="temp.choiceD" placeholder="内容必须以字符D加:开头" />
        </el-form-item>
        <el-form-item label="选项E">
          <el-input v-model="temp.choiceE" placeholder="内容必须以字符E加:开头" />
        </el-form-item>
        <el-form-item label="选项F">
          <el-input v-model="temp.choiceF" placeholder="内容必须以字符F加:开头" />
        </el-form-item>
        <el-form-item label="选项G">
          <el-input v-model="temp.choiceG" placeholder="内容必须以字符G加:开头" />
        </el-form-item>
        <el-form-item label="题目答案" prop="singleAnswer">
          <el-radio v-model="temp.singleAnswer" label="A">A</el-radio>
          <el-radio v-model="temp.singleAnswer" label="B">B</el-radio>
          <el-radio v-model="temp.singleAnswer" label="C">C</el-radio>
          <el-radio v-model="temp.singleAnswer" label="D">D</el-radio>
          <el-radio v-if="temp.choiceE" v-model="temp.singleAnswer" label="E" >E</el-radio>
          <el-radio v-if="temp.choiceF" v-model="temp.singleAnswer" label="F" >F</el-radio>
          <el-radio v-if="temp.choiceG" v-model="temp.singleAnswer" label="G" >G</el-radio>
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
import { reqGetSingleList, reqSearchSingleList, reqDeleteSingle, reqInsertSingleInfo, reqUpdateSingleInfo } from '@/api/bankManage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

export default {
  name: 'SingleInfo',
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
        pictureSrc: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: '',
        choiceG: '',
        singleAnswer: '',
        answerExplain: '',
        langId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        content: [{ required: true, message: '题目内容为必填项', trigger: 'change' }],
        choiceA: [{ required: true, message: '选项A为必填项', trigger: 'change' }],
        choiceB: [{ required: true, message: '选项B为必填项', trigger: 'change' }],
        choiceC: [{ required: true, message: '选项C为必填项', trigger: 'change' }],
        choiceD: [{ required: true, message: '选项D为必填项', trigger: 'change' }],
        singleAnswer: [{ required: true, message: '题目答案为必填项', trigger: 'change' }],
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
      const result = await reqGetSingleList()
      if (result.statu === 0) {
        this.langOptions = result.data.langOptions
        this.total = result.data.singleList.length
        this.list = result.data.singleList.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
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
          this.handleUpdateSingle()
        }
      })
    },
    async handleUpdateSingle() {
      const result = await reqUpdateSingleInfo(this.temp)
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
      const result = await reqSearchSingleList(this.listQuery.content, langId, composeFlag)
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        content: '',
        pictureSrc: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: '',
        choiceG: '',
        singleAnswer: '',
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
          this.insertSingleInfo()
        }
      })
    },
    async insertSingleInfo() {
      const result = await reqInsertSingleInfo(this.temp)
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
      const singleId = row.singleId
      const result = await reqDeleteSingle(singleId)
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
    },
    handleAvatarSuccess(res, file) {
      // this.temp.pictureSrc = URL.createObjectURL(file.raw)
      this.temp.pictureSrc = res.data
    },
    beforeAvatarUpload(file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isType && isLt4M
    },
    deletePictureSrc() {
      this.temp.pictureSrc = ''
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
