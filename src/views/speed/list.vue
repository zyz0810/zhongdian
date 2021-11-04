<template>
  <div class="app-container">
    <div class="p20 bg_white">
      <el-form :inline="true"
               :model="listQuery"
               class="">
        <el-form-item label="项目"
                      prop="items_name">
          <el-select v-model.trim="listQuery.items_name"
                     filterable
                     clearable
                     placeholder="请选择项目">
            <el-option v-for="item in projectOption"
                       :key="item.id"
                       :label="item.items_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任科室"
                      prop="offices">
          <el-select v-model.trim="listQuery.offices"
                     filterable
                     clearable
                     placeholder="请选择责任科室">
            <el-option v-for="item in officesOption"
                       :key="item.id"
                       :label="item.department_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves
                     class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="mb_10">
        <el-radio-group v-model="listQuery.status" class="fl" style="line-height: 32px;" @change="handleFilter">
          <el-radio :label="2">进度提前提交</el-radio>
          <el-radio :label="1">进度正常提交</el-radio>
          <el-radio :label="3">进度延迟提交</el-radio>
          <el-radio :label="0">未提交</el-radio>
        </el-radio-group>
<!--        <el-button type="primary" @click="handleView">添加项目</el-button>-->
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
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="重点工作项目" align="center" prop="items_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="责任科室" align="center" prop="offices_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划进度" align="center" prop="progressLine"></el-table-column>
        <el-table-column label="总体进度提交情况" align="center" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">
<!--         0：无，1：正常（蓝色），2：超前（绿色），3：延迟（红色）   -->

            <span v-for="item in scope.row.progresslist" :key="item.id" :class="['inlineBlock', 'step_tag', {'bg_gray':item.status==0,'bg_blue':item.status==1,'bg_green':item.status==2,'bg_red':item.status==3}]">{{item.month}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="name" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">更新进度</el-button>
          </template>
        </el-table-column>

      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @updateList="getList"></paraView>

  </div>
</template>

<script>
  import {itemProgressList,departmentList,projectList} from '@/api/project'
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
        projectOption:[{
          id:1,
          name:'项目1',
        },{
          id:2,
          name:'项目2',
        }],
        officesOption:[],
        showViewDialog:false,
        paraData:{
          id:''
        },
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          items_name: '',
          offices: '',
          status:0,
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
      this.getProject();
      this.getOffices();
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
      getProject(){
        projectList({page:1,pageSize:99999}).then(res => {
          this.projectOption = res.data.data
        });
      },
      getOffices(){
        departmentList({typelist:'all'}).then(res => {
          this.officesOption = res.data
        });
      },
      resetList() {
        this.listQuery = {
          items_name: '',
          offices: '',
          status:0,
          page: 1,
          pageSize: 10
        }
        this.getList();
      },

      handleView(row){
        this.showViewDialog = true
        this.paraData = {
          id:row.id
        }
      },

    }
  }
</script>

