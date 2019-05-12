<template>
  <div :class="['dashboard-container',{'dashboard-padding' : device !=='mobile'}]">
    <div class="teacher_info">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 7}" :xl="{span: 7}">
        <box-card />
      </el-col>
      <!--<pan-thumb :image="teaImg" style="float: left">
        <span class="pan-info-roles">教师端</span>
      </pan-thumb>-->
    </div>

    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import BoxCard from './components/BoxCard'

export default {
  name: 'Dashboard',
  components: {
    PanThumb,
    BoxCard
  },
  data() {
    return {
      teaImg: require('@/assets/images/teacher.jpg'),
      emptyGif: require('@/assets/images/home_img.png')
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ])
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }
  .dashboard {
    &-container {
      background-color: #e3e3e3;
      min-height: 93vh;
    }
    &-padding {
      padding: 50px 60px 0px;
    }
  }
</style>
