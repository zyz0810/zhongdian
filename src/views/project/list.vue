<template>
  <div class="app-container">
    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button type="primary" @click="handleView">添加项目</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
<!--          <el-form-item label="">-->
<!--            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(244,244,252)',}"
                element-loading-text="拼命加载中" fit ref="tableList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="重点工作项目" align="center" prop="items_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务类别" align="center" prop="type" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划进度" align="center" prop="progressLine"></el-table-column>
        <el-table-column label="完成目标" align="center" prop="target" show-overflow-tooltip></el-table-column>
        <el-table-column label="完成时间" align="center" prop="end_time"></el-table-column>
        <el-table-column label="责任科室" align="center" prop="offices_name"></el-table-column>
        <el-table-column label="分管领导" align="center" prop="leader_name"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @updateList="getList"></paraView>

  </div>
</template>

<script>
  import {projectList} from '@/api/project'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        showViewDialog:false,
        paraData:{
          id:''
        },
        total: 16,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
      filtersSource: function (value) {
        let StatusArr = {0: '其它', 1: '滨康二区',}
        return StatusArr[value]
      },
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
        projectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      resetList() {
        this.listQuery = {
          page: 1,
          pageSize: 10
        }
        this.getList();
      },


      handleView(row){
        this.showViewDialog = true
        this.paraData = {
          // id:row.id
        }
      },


    }
  }
</script>
