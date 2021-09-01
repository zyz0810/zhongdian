<template>
  <div class="app-container">

    <div class="p20 bg_white">
      <div class="mb_10 flex">
        <div class="mr_30" style="line-height: 20px;">
          <span class="inlineBlock step_tag bg_blue text-center mr_10 fl"></span>进度正常
        </div>
        <div class="mr_30" style="line-height: 20px;">
          <span class="inlineBlock step_tag bg_green text-center mr_10 fl"></span>进度超前
        </div>
        <div class="mr_30" style="line-height: 20px;">
          <span class="inlineBlock step_tag bg_red text-center mr_10 fl"></span>进度迟缓
        </div>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(244,244,252)',}"
                element-loading-text="拼命加载中" fit ref="tableList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="重点工作项目" align="center" prop="items_name"></el-table-column>
        <el-table-column label="任务类别" align="center" prop="type_name"></el-table-column>
        <el-table-column label="完成目标" align="center" prop="target"></el-table-column>
        <el-table-column label="完成时间" align="center" prop="end_time"></el-table-column>
        <el-table-column label="责任科室" align="center" prop="offices_name"></el-table-column>
        <el-table-column label="分管领导" align="center" prop="leader_name"></el-table-column>
        <el-table-column label="进度完成情况" align="center" prop="source" width="530">
          <template slot-scope="scope">
            <p>{{scope.row.remark}}</p>
            <span v-for="item in scope.row.progresslist" :key="item.id" :class="['inlineBlock', 'step_tag', {'bg_gray':item.status==0,'bg_blue':item.status==1,'bg_green':item.status==2,'bg_red':item.status==3}]">{{item.month}}</span>
<!--            <span class="inlineBlock step_tag bg_blue">1月</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">2月</span>-->
<!--            <span class="inlineBlock step_tag bg_green">3月</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">4月</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">5月</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">6月</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">7月</span>-->
<!--            <span class="inlineBlock step_tag bg_red">8月</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">9月</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">10月</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">11月</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">12月</span>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
  </div>
</template>

<script>
  import {itemProgressList} from '@/api/project'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'displayList',
    directives: {waves},
    components: {
      Pagination,
    },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 190;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      this.getList();
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        itemProgressList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
    }
  }
</script>
